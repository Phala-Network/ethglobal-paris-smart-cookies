import { LitElement, css, html } from 'lit'

import { createPublicClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
import { signCertificate, options } from '@phala/sdk'
import { ApiPromise, WsProvider } from '@polkadot/api'

const client = createPublicClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

export class SmartCookiesConnect extends LitElement {
  static get properties() {
    return {
      extensionConnected: {
        type: Boolean,
      },
    }
  }

  constructor() {
    super()
    this.extensionConnected = false
    this.ethAddress = null
    this.cert = null
  }

  render() {
    if (!this.extensionConnected) {
      return html`
        <div class="loading">
          <svg fill="#000000" width="32px" height="32px" viewBox="0 0 24 24">
            <path id="secondary" d="M16,18v3H8V18a6,6,0,0,1,2.4-4.8L12,12l1.6,1.2A6,6,0,0,1,16,18ZM16,6V3H8V6a6,6,0,0,0,2.4,4.8L12,12l1.6-1.2A6,6,0,0,0,16,6Z" style="fill: #E6A027; stroke-width: 2;"></path><path id="primary" d="M16,18v3H8V18a6,6,0,0,1,2.4-4.8L12,12l1.6,1.2A6,6,0,0,1,16,18ZM16,6V3H8V6a6,6,0,0,0,2.4,4.8L12,12l1.6-1.2A6,6,0,0,0,16,6ZM6,21H18M6,3H18" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 2;" />
          </svg>
          <span>Waiting for extension...</span>
        </div>
      `
    }
    return html`
      <div class="flex flex-col gap-4">
        ${this.ethAddress === null
          ? html`
            <button @click=${this.connectEip1102wallet}>
              Connect ${window.ethereum.isMetaMask ? 'MetaMask' : 'Wallet'}
            </button>
          `
          : html`
            <button disabled>Connected</button>
          `
        }
        ${this.cert === null
          ? html`
            <button @click=${this.signCertificate}>
              Sign for Phat Contract
            </button>
          `
          : html`
            <button disabled>Signed</button>
          `
        }
      </div>
    `
  }

  async connectEip1102wallet() {
    const [address] = await client.request({ method: 'eth_requestAccounts' })
    this.ethAddress = address
    this.requestUpdate()
    this.dispatchEvent(new CustomEvent('EIP1102walletConnected', {
      detail: { address },
    }))
  }

  async signCertificate() {
    const api = await ApiPromise.create(options({
      provider: new WsProvider('wss://poc5.phala.network/ws'),
      noInitWarn: true,
    }))
    const provider = 'polkadot-js';
    const injector = window.injectedWeb3[provider];
    const extension = await injector.enable('Smart Cookies');
    const accounts = await extension.accounts.get(true);
    const account = accounts[0]; // assume you choice the first visible account.
    const signer = extension.signer;
    this.cert = await signCertificate({ api, signer, account })
    this.requestUpdate()
    this.dispatchEvent(new CustomEvent('CertificateSigned', {
      detail: this.cert
    }))
  }

  static get styles() {
    return css`
      :host {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }

      .loading {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        justify-content: center;
      }

      .loading svg {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      button {
        background-color: #E6A027;
        border-radius: 28px;
        border: 1px solid transparent;
        self-align: center;
        font-family: inherit;
        font-size: 12px;
        font-weight: semibold;
        color: rgb(38 38 38);
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        cursor: pointer;
        padding: 8px 16px;
      }
      button:hover {
        transform: translateX(0.125rem) translateY(0.125rem);
        border-color: #1f2937;
      }
      button:focus,
      button:focus-visible {
        outline: 4px auto #000;
      }
      button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `
  }
}

window.customElements.define('sc-connect', SmartCookiesConnect)
