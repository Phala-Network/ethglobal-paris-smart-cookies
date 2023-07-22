import { html, css, LitElement } from 'lit'
import { sendMessage } from '../content-scripts/utils'

export class LikeButton extends LitElement {
  static get styles() {
    return css`
      :host button {
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
      }
    `
  }

  static get properties() {
    return {
      /**
       * The name to say "Hello" to.
       */
      // name: { type: String },

      /**
       * The number of times the button has been clicked.
       */
      // count: { type: Number }
    }
  }

  constructor() {
    super()
    // this.name = 'World'
    // this.count = 0
  }

  render() {
    return html`
      <button @click=${this._onClick} part='button'>
        <img src="${chrome.runtime.getURL("src/assets/btn-icon.png")}" height="12" width="12" />
        <span>Like</span>
      </button>
    `
  }

  async _onClick() {
    console.log('like button clicked:', this.dataset)
  }
}


export class RecommendedPopup extends LitElement {
  static get styles() {
    return css`
      :host .popup-btn {
        border: 1px solid #e1e5ea;
        border-radius: 4px;
        padding: 4px;
        background-color: #f8f9fa;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #1e2022;
        cursor: pointer;
        padding: 8px 12px;
      }

      :host .top {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
      }

      :host .close-btn {
        position: relative;
        top: -2px;
        border: 1px solid #e1e5ea;
        border-radius: 100%;
        width: 32px;
        height: 32px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      :host .popup {
        padding: 10px 20px;
        border-radius: 28px;
        border: 5px solid #000;
        min-width: 640px;
      }

      :host .popup-header {
        display: flex;
        flex-direction: row;
        gap: 12px;
        align-items: center;
      }

      :host .popup-header h4 {
        font-size: 14px;
        font-weight: bold;
      }

      :host .sr-only {
        display: none;
      }
    `
  }

  static get properties() {
    return {}
  }

  constructor() {
    super()
  }

  render() {
    return html`
    <button class='popup-btn' popovertarget="my-popover">
      <img src="${chrome.runtime.getURL("src/assets/btn-icon.png")}" height="32" width="32" />
      Feeling lucky
    </button>
    <div id="my-popover" popover class="popup">
      <div class="top">
        <header class='popup-header'>
          <img src="${chrome.runtime.getURL("src/assets/icon.png")}" height="45" width="45" />
          <h4>Smart Cookie think you might like this</h4>
        </header>
        <button class='close-btn' popovertarget="my-popover" popovertargetaction="hide">
          <span aria-hidden=”true”>❌</span>
          <span class="sr-only">Close</span>
        </button>
      </div>
      <main>
        <slot></slot>
      </main>
    </div>
    `
  }
}


window.customElements.define('sc-like-button', LikeButton)
window.customElements.define('sc-recommended-popup', RecommendedPopup)
console.log('all customElements registered')
