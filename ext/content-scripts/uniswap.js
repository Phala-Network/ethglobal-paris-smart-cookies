import * as R from 'ramda'
import { createMutationObserver, sendMessage, waitForElement, listenEventTargetMatched } from "./utils"

function attachButtonToPoolInfo() {
  const matched = document.querySelectorAll('[href^="https://etherscan.io/address/"]')
  const target = R.find(i => i.innerHTML.indexOf('svg') !== -1, matched)
  const attachContainer = target.parentNode

  if (attachContainer?.querySelectorAll('.sc-btn').length) {
    return
  }

  const button = document.createElement('button')
  button.className = 'sc-btn'
  button.innerHTML = `
    <img src="${chrome.runtime.getURL("src/assets/icon.png")}" height="12" width="12" style="margin-inline-end:0" />
    <span>Like</span>
  `
  button.dataset.source = 'uniswap'
  button.dataset.medium = 'pool'
  const tradingPair = attachContainer?.parentNode?.nextSibling?.querySelector('[alt="token logo"]')?.parentNode?.nextSibling?.innerText?.trim()
  if (tradingPair) {
    button.dataset.tradingPair = tradingPair
  }

  attachContainer.appendChild(button)

  button.style = `
    min-width: 60px;
    margin-left:16px;
    border: 1px solid #e1e5ea;
    border-radius: 4px;
    padding: 4px;
    background-color: #f8f9fa;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #1e2022;
    cursor: pointer;
  `
}

(async function () {
  const hostAppRoot = await waitForElement('#root')
  const { hash, host } = window.location

  //
  // Attach like button to info.uniswap.org
  //
  if (host === 'info.uniswap.org' && hash.indexOf('/pools/') !== -1) {
    createMutationObserver(hostAppRoot, attachButtonToPoolInfo)
  }

  // Delegate click event for custom button.
  listenEventTargetMatched(
    'click',
    target => (target?.classList?.contains('sc-btn') || target?.closest('button')?.classList?.contains('sc-btn')),
    async (ev) => {
      ev.preventDefault()
      const el = ev.target.tagName === 'BUTTON' ? ev.target : ev.target.closest('button')
      console.log(`Liked`, el.dataset)
    }
  )
})();
