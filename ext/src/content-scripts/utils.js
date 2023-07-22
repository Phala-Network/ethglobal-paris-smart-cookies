export function createMutationObserver(el, callback, options) {
  options = options || {}
  if (!options.hasOwnProperty('subtree')) {
    options.subtree = true
  }
  if (!options.hasOwnProperty('childList')) {
    options.childList = true
  }
  const observer = new MutationObserver(() => {
    setTimeout(() => callback(el), 500)
  })
  observer.observe(el, options)
}


export function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, resolve)
  })
}


export async function waitForElement(selector, tickMs = 500) {
  let hostAppRoot = document.querySelector(selector)
  while (!hostAppRoot) {
    await new Promise((resolve) => setTimeout(resolve, tickMs))
    hostAppRoot = document.querySelector(selector)
  }
  return hostAppRoot
}


export function listenEventTargetMatched(eventName, matcher, callback) {
  document.addEventListener(eventName, (ev) => {
    if (matcher(ev.target)) {
      callback(ev)
    }
  }, false)
}
