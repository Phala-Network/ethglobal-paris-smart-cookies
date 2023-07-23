function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve)
  })
}

(async function main() {
  const btnManage = document.querySelector('#btn-manage')
  const btnConnect = document.querySelector('#btn-connect')

  btnManage?.addEventListener('click', () => {
    chrome.runtime.openOptionsPage()
  }, false)

  btnConnect?.addEventListener('click', () => {
    // chrome.runtime.openOptionsPage()
    chrome.tabs.create({ url: 'https://browser-extension-with-phat-contract.vercel.app/' })
  }, false)

  const { address } = await sendMessage({ action: 'GetCurrentEvmAddress' })
  if (address) {
    btnConnect.style.display = 'none'
    btnManage.disabled = false
  } else {
    btnManage.style.display = 'none'
    btnConnect.disabled = false
  }
})();
