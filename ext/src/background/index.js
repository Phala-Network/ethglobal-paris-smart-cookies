import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import { options, OnChainRegistry, signCertificate, PinkContractPromise } from '@phala/sdk'

import * as abi from './abis/fat_badges.json'

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

  const contractId = '0x9c7a829c4eb76259f94425df9325e823082ab4e97fd6bf09ee13017b32ed3c6a'
  const contractKey = await phatRegistry.getContractKeyOrFail(contractId)
  contractPromise = new PinkContractPromise(apiPromise, phatRegistry, abi, contractId, contractKey)
})();

chrome.runtime.onMessage.addListener(async (payload, sender, sendResponse) => {
  console.log('background:', payload)
  if (contractPromise) {
    const { output } = await contractPromise.query.getTotalBadges(pair.address, { cert })
    console.log('result', output.toJSON())
  }
})

