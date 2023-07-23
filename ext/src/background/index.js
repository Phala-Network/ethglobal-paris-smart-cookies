import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import { stringToHex } from '@polkadot/util'
import { options, OnChainRegistry, signCertificate, PinkContractPromise } from '@phala/sdk'

import * as abi from './abis/smart_cookies.json'

const RPC_URL = 'wss://poc5.phala.network/ws'

let isReady = false

let apiPromise, phatRegistry, keyring, pair, cert, contractPromise, userAddress

async function boot() {
  chrome.storage.local.get(["evmAddress"]).then((data) => {
    userAddress = data.evmAddress || ''
  })

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

  isReady = true
}

async function getProfile() {
  console.log('getProfile()');
  if (!contractPromise || !userAddress) {
    console.log('not ready')
    return {}
  }
  const r = await contractPromise.query.getProfile(cert.address, { cert }, stringToHex(userAddress))
  let profile;
  if (!r.output || !r.output.isOk) {
    console.log('error', r)
    profile = {likes:[]}
  } else {
    const data = r.output.asOk.asOk
    profile = JSON.parse(data)
  }
  console.log('returning', profile)
  return profile
}

async function updateProfile(profile) {
  const newProfile = JSON.stringify(profile)
  console.log('newProfile:', newProfile)
  const r2 = await contractPromise.query.updateProfile(cert.address, { cert }, stringToHex(userAddress), newProfile);
  if (!r2.output || !r2.output.isOk) {
    console.log('error2', r2)
  } else {
    console.log('setProfile()', r2.output.toJSON())
  }
}

async function handlePayload(payload) {
  console.log('handlePayload()', payload);
  // fetch old profile
  let profile = await getProfile()

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
  await updateProfile(profile)
}

chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
  (async () => {
    while (!isReady) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    if (payload.action === 'EIP1102walletConnected') {
      userAddress = payload.data.address
      await chrome.storage.local.set({ evmAddress: userAddress })
      sendResponse('ok')
    }
    else if (payload.action === 'CertificateSigned') {
      // @FIXME wasm issue need to address, skip for demo
      // cert = payload.data
      sendResponse('ok')
    }
    else if (payload.action === 'GetCurrentEvmAddress') {
      sendResponse({ address: userAddress || '' })
    }
    else if (payload.action == 'GetProfile') {
      const p = await getProfile()
      console.log('GetProfile() returns', p)
      sendResponse(p)
    }
    else if (payload.action == 'UpdateProfile') {
      await updateProfile(payload.profile)
      sendResponse('ok')
    }
    else if (contractPromise) {
      try {
        await handlePayload(payload)
      } catch (err) {
        console.log('handlePayload() failed:', err.message)
        console.log(err)
      }
      sendResponse('ok')
    }
  })();
  return true
})


try {
  boot()
} catch (err) {
  console.log('boot failed:', err)
}
