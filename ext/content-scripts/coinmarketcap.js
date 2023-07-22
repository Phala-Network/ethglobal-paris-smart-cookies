import * as R from 'ramda'
import { createMutationObserver, sendMessage, waitForElement, listenEventTargetMatched } from "./utils"


function attachButtonToCoinMarketCapHomePage() {
  const matched = document.querySelectorAll('[data-btnname="watchlistStarIcon"]')
  matched.forEach(el => {
    const attachContainer = el.closest('td')
    if (attachContainer?.querySelectorAll('.sc-btn').length) {
      return
    }
    const cell = attachContainer?.closest('tr')

    const button = document.createElement('button')
    button.innerHTML = `
      <img src="${chrome.runtime.getURL("src/assets/icon.png")}" height="12" width="12" />
      <span>Like</span>
    `
    button.className = 'sc-btn'
    button.dataset.source = 'coinmarketcap'
    button.dataset.medium = 'home_page'
    button.dataset.tokenSymbol = cell?.querySelector('.coin-item-symbol').innerText

    attachContainer.prepend(button)

    button.style = `
      margin-right: 4px;
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
  })
}


function attachButtonToCoinMarketCapCurrencyDetailPage() {
  const matched = document.querySelector('[data-btnname="watchlistStarIcon"]')
  const attachContainer = matched?.parentNode?.parentNode

  if (attachContainer?.querySelectorAll('.sc-btn').length) {
    return
  }

  const button = document.createElement('button')
  button.innerHTML = `
    <img src="${chrome.runtime.getURL("src/assets/icon.png")}" height="12" width="12" style="margin-inline-end:0" />
    <span>Like</span>
  `
  button.className = 'sc-btn'
  button.dataset.source = 'coinmarketcap'
  button.dataset.medium = 'detail_page'
  button.dataset.tokenSymbol = document.querySelector('.top-summary-container .nameSymbol')?.innerText?.trim() || ''
  const inner = document.querySelector('.nameSection > .linksSection .contractsRow .cmc-link')
  if (inner) {
    button.dataset.contractName = inner.querySelector('.mainChainTitle').innerText.trim()
    button.dataset.contractAddress = R.last(R.split('/', inner.getAttribute('href')))
  }

  attachContainer.prepend(button)

  button.style = `
    min-width: 60px;
    margin-right: 4px;
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
  const hostAppRoot = await waitForElement('#__next')
  const { pathname } = window.location

  if (pathname === '/') {
    createMutationObserver(hostAppRoot, attachButtonToCoinMarketCapHomePage)
  }

  if (pathname.indexOf('/currencies/') === 0) {
    createMutationObserver(hostAppRoot, attachButtonToCoinMarketCapCurrencyDetailPage)
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
