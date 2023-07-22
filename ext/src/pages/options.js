import { createPublicClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

(async function main() {
  console.log('say hi main')
})();
