import { waitForElement } from './utils'

import '../ui/index'

(async function () {
  const element = document.createElement('sc-recommended-popup')

  document.body.appendChild(element)
  element.style.position = 'fixed'
  element.style.right = '80px'
  element.style.bottom = '80px'
  element.style.zIndex = '1000'
  // document.querySelector('.container > .grid > div:nth-child(2) footer')?.appendChild(element)

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
  element.innerHTML = '<div style="display:flex; flex-direction: column; gap: 8px">' + frag.join('') + '</div>'
})();
