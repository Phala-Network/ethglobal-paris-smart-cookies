import { waitForElement } from './utils'

import '../ui/index'

(async function () {
  await waitForElement('#__next')
  const element = document.createElement('sc-recommended-popup')
  document.querySelector('.container > .grid > div:nth-child(2) footer')?.appendChild(element)

  // TODO 模拟加载内容
  await new Promise((resolve) => setTimeout(resolve, 1000))
  element.innerHTML = 'blah blah'
})();
