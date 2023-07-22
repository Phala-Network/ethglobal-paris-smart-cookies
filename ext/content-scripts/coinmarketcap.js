import * as R from 'ramda'
import { createMutationObserver, waitForElement } from "./utils"

import '../ui/index'


function attachButtonToCoinMarketCapHomePage() {
  const matched = document.querySelectorAll('[data-btnname="watchlistStarIcon"]')
  matched.forEach(el => {
    const attachContainer = el.closest('td')
    if (attachContainer?.querySelectorAll('sc-like-button').length) {
      return
    }
    const cell = attachContainer?.closest('tr')

    const button = document.createElement('sc-like-button')

    button.dataset.source = 'coinmarketcap'
    button.dataset.medium = 'home_page'
    button.dataset.tokenSymbol = cell?.querySelector('.coin-item-symbol').innerText

    attachContainer.prepend(button)

  // Extra styles for the page
    button.style.marginRight = '4px'
  })
}


function attachButtonToCoinMarketCapCurrencyDetailPage() {
  const matched = document.querySelector('[data-btnname="watchlistStarIcon"]')
  const attachContainer = matched?.parentNode?.parentNode

  if (attachContainer?.querySelectorAll('sc-like-button').length) {
    return
  }
  const button = document.createElement('sc-like-button')

  button.dataset.source = 'coinmarketcap'
  button.dataset.medium = 'detail_page'
  button.dataset.tokenSymbol = document.querySelector('.top-summary-container .nameSymbol')?.innerText?.trim() || ''
  const inner = document.querySelector('.nameSection > .linksSection .contractsRow .cmc-link')
  if (inner) {
    button.dataset.contractName = inner.querySelector('.mainChainTitle').innerText.trim()
    button.dataset.contractAddress = R.last(R.split('/', inner.getAttribute('href')))
  }

  attachContainer.prepend(button)

  // Extra styles for the page
  button.style.marginRight = '8px'
  attachContainer.style.alignItems = 'center'
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
})();
