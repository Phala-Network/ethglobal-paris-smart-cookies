import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import { options, OnChainRegistry, signCertificate, PinkContractPromise } from '@phala/sdk'

import * as abi from './abis/smart_cookies.json'

const RPC_URL = 'wss://poc5.phala.network/ws'

let apiPromise, phatRegistry, keyring, pair, cert, contractPromise

(async function boot() {
  apiPromise = await ApiPromise.create(options({
    provider: new WsProvider(RPC_URL),
    noInitWarn: true,
  }))
  phatRegistry = await OnChainRegistry.create(apiPromise)
  keyring = new Keyring({ type: 'sr25519' })
  pair = keyring.addFromUri('//Alice')
  cert = await signCertificate({ pair, api: apiPromise })

  const contractId = '0xf14f4523b783675d5cf484dc6261716b67419b147e43fa84e1690b8b407d8a2a'
  const contractKey = await phatRegistry.getContractKeyOrFail(contractId)
  contractPromise = new PinkContractPromise(apiPromise, phatRegistry, abi, contractId, contractKey)
  console.log('boot finished:', contractPromise.address.toHuman());
})();

// TODO: get propoer address from Metamask
let userAddress = 'test-addr-0xAddress'

async function handlePayload(payload) {
  console.log('handlePayload()');
  // fetch old profile
  const r = await contractPromise.query.getProfile(cert.address, { cert }, userAddress)
  let profile;
  if (!r.output || !r.output.isOk) {
    console.log('error', r)
    profile = {}
  } else {
    const data = r.output.asOk.asOk
    profile = JSON.parse(data)
  }

  /*
  CMC:
  {source: 'coinmarketcap', medium: 'home_page', tokenSymbol: 'BTC'}
  {source: 'coinmarketcap', medium: 'detail_page', tokenSymbol: 'COMP', contractName: 'Ethereum', contractAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888'}
  Uniswap
  */

  // update profile

  if (!profile.likes) {
    profile.likes = []
  }

  // remove redundancy
  const match = profile.likes.filter(entry => {
    for (let [k, v] of Object.entries(payload)) {
      if (entry[k] != v) {
        return false;
      }
    }
    return true;
  })
  if (match.length == 0) {
    const ts = (Date.now() / 1000) | 0
    profile.likes.push({
      ...payload,
      ts,
    });
  }

  // commit
  const newProfile = JSON.stringify(profile)
  console.log('newProfile:', newProfile)
  const r2 = await contractPromise.query.updateProfile(cert.address, { cert }, userAddress, newProfile);
  if (!r2.output || !r2.output.isOk) {
    console.log('error2', r)
  } else {
    console.log('setProfile()', r2.output.toJSON())
  }
}

chrome.runtime.onMessage.addListener(async (payload, sender, sendResponse) => {
  if (payload.action === 'EIP1102walletConnected') {
    userAddress = payload.data.address
    return sendResponse('ok')
  }
  if (payload.action === 'CertificateSigned') {
    // @FIXME wasm issue need to address, skip for demo
    // cert = payload.data
    return sendResponse('ok')
  }
  if (contractPromise) {
    try {
      await handlePayload(payload)
    } catch (err) {
      console.log('handlePayload() failed:', err.message)
      console.log(err)
    }
  }
  sendResponse('ok')
})

