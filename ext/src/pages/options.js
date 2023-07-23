function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve)
  })
}

(async function main() {
  const main = document.querySelector('main')

  const result = await sendMessage({ action: 'GetCurrentEvmAddress' })
  if (result.address) {
    document.querySelector('#btn-connect').style.display = 'none'
    document.querySelector('#eth-addr').innerText = result.address.substring(0, 8) + '...' + result.address.substring(result.address.length - 8)
  } else {
    document.querySelector('#btn-connect').style.display = 'block'
  }

  let data;
  async function update() {
    // get data
    data = await sendMessage({ action: 'GetProfile' })
    // data = {"likes":[{"source":"coinmarketcap","medium":"detail_page","tokenSymbol":"GHO","contractName":"Ethereum","contractAddress":"0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f","ts":1690061504},{"source":"coinmarketcap","medium":"detail_page","tokenSymbol":"AAVE","contractName":"Ethereum","contractAddress":"0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9","ts":1690061522},{"source":"coinmarketcap","medium":"home_page","tokenSymbol":"MATIC","ts":1690062217}]}
    console.log({data})
    
    let frag = []
    for (let i = 0; i < data.likes.length; i++) {
      frag.push(`
        <tr>
          <td>${data.likes[i].source}</td>
          <td>${data.likes[i].medium}</td>
          <td>${data.likes[i].tokenSymbol}</td>
          <td><button data-idx="${i}" class="unfav">remove</button></td>
        </tr>
      `)
    }
    main.innerHTML = '<table>' + frag.join('') + '</table>'
  }

  await update();
  document.addEventListener('click', async evt => {
    if (evt.target.classList.contains('unfav')) {
      evt.preventDefault()
      console.log(evt.target.dataset)

      const i = parseInt(evt.target.dataset.idx)
      data.likes.splice(i, 1);
      await sendMessage({ action: 'UpdateProfile', profile: data })
      await update()
    }
  }, false)

})();
