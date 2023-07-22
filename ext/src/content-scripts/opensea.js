import * as R from 'ramda'
import { createMutationObserver, waitForElement } from "./utils"

import '../ui/index'


function attachButtonToOpenSeaToken() {
  const matched = document.querySelector('[aria-label="Favorite"]')
  const attachContainer = matched?.closest('header')

  if (attachContainer?.querySelectorAll('sc-like-button').length) {
    return
  }

  const button = document.createElement('sc-like-button')

  button.dataset.source = 'opensea'
  button.dataset.medium = 'token'
  // @FIXME
  const url = document.querySelector('.Panel--content-container span > a')?.getAttribute('href')
  button.dataset.contractAddress = R.last(R.split('/', url))

  attachContainer.appendChild(button)

  button.style.marginLeft = '16px'
}


function attachButtonToOpenSeaColection() {
  const matched = document.querySelector('[aria-label="Add to watchlist"]')
  const attachContainer = matched?.parentNode?.parentNode?.parentNode

  if (attachContainer?.querySelectorAll('sc-like-button').length) {
    return
  }

  const button = document.createElement('sc-like-button')

  button.dataset.source = 'opensea'
  button.dataset.medium = 'collection'
  // @FIXME
  button.dataset.contractAddress = R.last(R.split('/', attachContainer?.parentNode?.previousSibling?.querySelector('a').getAttribute('href')))

  attachContainer.prepend(button)

  button.style.marginLeft = '16px'
}


(async function () {
  const hostAppRoot = await waitForElement('#__next')
  const { pathname } = window.location

  if (pathname.indexOf('/assets/') === 0) {
    createMutationObserver(hostAppRoot, attachButtonToOpenSeaToken)
  }

  if (pathname.indexOf('/collection/') === 0) {
    createMutationObserver(hostAppRoot, attachButtonToOpenSeaColection)
  }
})();
