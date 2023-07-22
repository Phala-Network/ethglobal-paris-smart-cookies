import * as R from 'ramda'
import { createMutationObserver, sendMessage, waitForElement, listenEventTargetMatched } from "./utils"


function attachButtonToOpenSeaToken() {
  const matched = document.querySelector('[aria-label="Favorite"]')
  const attachContainer = matched?.closest('header')

  if (attachContainer?.querySelectorAll('.sc-btn').length) {
    return
  }

  const button = document.createElement('button')
  button.className = 'sc-btn'
  button.innerHTML = `
    <img src="${chrome.runtime.getURL("src/assets/icon.png")}" height="12" width="12" style="margin-inline-end:0" />
    <span>Like</span>
  `
  button.dataset.source = 'opensea'
  button.dataset.medium = 'token'
  const url = document.querySelector('.Panel--content-container span > a')?.getAttribute('href')
  button.dataset.contractAddress = R.last(R.split('/', url))

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


function attachButtonToOpenSeaColection() {
  const matched = document.querySelector('[aria-label="Add to watchlist"]')
  const attachContainer = matched?.parentNode?.parentNode?.parentNode

  if (attachContainer?.querySelectorAll('.sc-btn').length) {
    return
  }

  const button = document.createElement('button')
  button.className = 'sc-btn'
  button.innerHTML = `
    <img src="${chrome.runtime.getURL("src/assets/icon.png")}" height="12" width="12" style="margin-inline-end:0" />
    <span>Like</span>
  `
  button.dataset.source = 'opensea'
  button.dataset.medium = 'collection'
  button.dataset.contractAddress = R.last(R.split('/', attachContainer?.parentNode?.previousSibling?.querySelector('a').getAttribute('href')))

  attachContainer.prepend(button)
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
  const hostAppRoot = await waitForElement('#__next')
  const { pathname } = window.location

  //
  // Attach like button to OpenSea Token detail page
  //
  if (pathname.indexOf('/assets/') === 0) {
    createMutationObserver(hostAppRoot, attachButtonToOpenSeaToken)
  }

  if (pathname.indexOf('/collection/') === 0) {
    createMutationObserver(hostAppRoot, attachButtonToOpenSeaColection)
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
