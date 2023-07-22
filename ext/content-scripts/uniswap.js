import * as R from 'ramda'
import { createMutationObserver, waitForElement } from "./utils"

import '../ui/index'

function attachButtonToPoolInfo() {
  const matched = document.querySelectorAll('[href^="https://etherscan.io/address/"]')
  const target = R.find(i => i.innerHTML.indexOf('svg') !== -1, matched)
  const attachContainer = target.parentNode

  if (attachContainer?.querySelectorAll('sc-like-button').length) {
    return
  }

  const button = document.createElement('sc-like-button')

  button.dataset.source = 'uniswap'
  button.dataset.medium = 'pool'
  const tradingPair = attachContainer?.parentNode?.nextSibling?.querySelector('[alt="token logo"]')?.parentNode?.nextSibling?.innerText?.trim()
  if (tradingPair) {
    button.dataset.tradingPair = tradingPair
  }

  attachContainer.appendChild(button)

  button.style.marginLeft = '16px'
}

function attachButtonToTokenInfo() {
  const matched = document.querySelectorAll('[href^="https://etherscan.io/address/"]')
  const target = R.find(i => i.innerHTML.indexOf('svg') !== -1, matched)
  const attachContainer = target.parentNode

  if (attachContainer?.querySelectorAll('sc-like-button').length) {
    return
  }

  const button = document.createElement('sc-like-button')

  button.dataset.source = 'uniswap'
  button.dataset.medium = 'token'
  const tokenSymbol = attachContainer?.parentNode?.querySelector('[href="#/tokens"]')?.nextSibling?.nextSibling?.innerText
  if (tokenSymbol) {
    button.dataset.tokenSymbol = tokenSymbol
  }

  attachContainer.appendChild(button)

  button.style.marginLeft = '16px'

}

(async function () {
  const hostAppRoot = await waitForElement('#root')
  const { hash, host } = window.location

  if (host === 'info.uniswap.org' && hash.indexOf('/pools/') !== -1) {
    createMutationObserver(hostAppRoot, attachButtonToPoolInfo)
  }

  if (host === 'info.uniswap.org' && hash.indexOf('/tokens/') !== -1) {
    createMutationObserver(hostAppRoot, attachButtonToTokenInfo)
  }

  if (host === 'app.uniswap.org') {
    const popupEl = document.createElement('sc-recommended-popup')
    document.body.appendChild(popupEl)
    popupEl.style.position = 'fixed'
    popupEl.style.right = '80px'
    popupEl.style.bottom = '80px'
    popupEl.style.zIndex = '1000'

    // TODO 模拟加载内容
    await new Promise((resolve) => setTimeout(resolve, 1000))
    popupEl.innerHTML = 'uniswap sc-recommended-popup'
  }
})();
