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
    // get data
    // const data = await sendMessage({ action: 'getProfile' })
    let data = [
      {
        "createdAt": "2023-07-22T07:26:29.000Z",
        "name": "Jesus Crypto Plaza",
        "pic": "https://ik.imagekit.io/lens/media-snapshot/4b7c9702d5fcfb4133c44556a3421b234b792f29ded92a7e8ac084339024c466.png",
        "pubId": "0x0c48-0x0106-DA-9f87a802",
        "score": 0.7733843931885542,
        "stats": {
          "totalAmountOfCollects": 0,
          "totalAmountOfComments": 0,
          "totalAmountOfMirrors": 0
        },
        "text": "#TokenEngineeringBarcamp in Paris",
        "textId": 10
      },
      {
        "createdAt": "2023-07-22T07:26:29.000Z",
        "name": "Jesus Crypto Plaza",
        "pic": "https://ik.imagekit.io/lens/media-snapshot/4b7c9702d5fcfb4133c44556a3421b234b792f29ded92a7e8ac084339024c466.png",
        "pubId": "0x0c48-0x0106-DA-9f87a802",
        "score": 0.7733843931885542,
        "stats": {
          "totalAmountOfCollects": 0,
          "totalAmountOfComments": 0,
          "totalAmountOfMirrors": 0
        },
        "text": "#TokenEngineeringBarcamp in Paris",
        "textId": 10
      }
    ]
    let frag = []
    for (let i = 0; i < data.length; i++) {
      frag.push(`
        <div>
          <sc-recommend-card 
            pic="${data[i].pic}"
            name="${data[i].name}"
            text="${data[i].text}"
            createdAt="${data[i].createdAt}"
            totalAmountOfCollects="${data[i].stats.totalAmountOfCollects}"
            totalAmountOfMirrors="${data[i].stats.totalAmountOfMirrors}"
            totalAmountOfComments="${data[i].stats.totalAmountOfComments}"
          >
          </sc-recommend-card>
        </div>
      `)
    }
    popupEl.innerHTML = '<div style="display:flex; flex-direction: column; gap: 8px">' + frag.join('') + '</div>'
  }
})();
