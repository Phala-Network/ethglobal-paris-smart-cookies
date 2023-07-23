# ethglobal-paris-smart-cookies

![Media Kit](https://github.com/Phala-Network/ethglobal-paris-smart-cookies/assets/57211675/02e6f4a3-7fe6-477e-b4aa-a7841239c768)

## Introduction

Smart Cookie is your decentralized autonomous agent. It provides a tailored recommendation system with web3 cookies while preserving your data ownership. Our Chrome extension seamlessly integrates into your browsing experience, allowing you to "Bite" on Uniswap DeFi pools, CMC coins, and OpenSea NFTs that pique your interest.

Smart Cookie elevates your online journey by delivering Web3 social posts (Lens) curated to match your unique web3 preferences. With cookie data securely stored as web3 data and an AI agent governed by smart contracts, both users and advertisers benefit from a transparent, trustless system that respects individual privacy. Experience the perfect blend of Web3 and AI with Smart Cookie, and savor every moment of your personalized digital adventure.

## Major Features

- With Chrome extension integrated into the browser, you can "Bite a cookie" on Uniswap DeFi pools, or OpenSea NFTs to mark your interest with a single signature. No more email requires.
- Intelligence also comes. LLM modules with Smart Cookie can match your web3 preferences and make the best suggestion. We build 2 powerful showcases during the hackathon:
    - If you bite a cookie for your favorite coins on CoinMarketCap or Opensea, the agent will push fine-tuned Lens content as a personalized recommendation algorithm.
    - If you like some posts or follow some community members on Lens, the agent will pop up and suggest you top-interest trading pairs on Uniswap.
- Cookie Manager
    - Visit a cookie manager page from the Chrome extension. In there, you can manage both cookies and AI agents:
        - You can choose close cookies or AI recommendation push
        - You can crash cookies if you want! With that, all historic cookies will be deleted.
        - You can switch AI models, like from OpenAI to Llama (only OpenAI in the demo)

## Code structure

- ext: Chrome extension to collect likes and inject suggestions
- phat: Phat Contract to build the "glue" layer between the decentralized services
- recommend: A Flask app to serve the recommendataion requests. Will be fully migrated to Phat Contract in the future.
- lens-algo-playground-patch: The patch code to integrate the recommendation service to Lens Algo Playground
- scripts: Pre-processing scripts to build the vectorized database
- website: The simple frontend to connect to Metamask

