import { waitForElement, sendMessage } from './utils'

(async function main() {
  const el = await waitForElement('sc-connect')

  el.setAttribute('extensionConnected', true)

  el.addEventListener('EIP1102walletConnected', evt => {
    sendMessage({ action: 'EIP1102walletConnected', data: evt.detail })
  }, false)
  el.addEventListener('CertificateSigned', evt => {
    sendMessage({ action: 'CertificateSigned', data: evt.detail })
  })
})();
