from dotenv import load_dotenv
load_dotenv()
import os
import requests
import json

def airstack_assets(identity):
    tpl = '''
    query MyQuery {
    Wallet(input: {identity: "{{identity}}", blockchain: ethereum}) {
        tokenBalances {
            amount
            blockchain
            formattedAmount
            tokenAddress
            tokenId
            tokenNfts {
                id
                address
                tokenId
                blockchain
                chainId
                type
                totalSupply
                tokenURI
                contentType
                contentValue {
                    image {
                        original
                    }
                }
                metaData {
                name
                description
                image
                    attributes {
                        trait_type
                        value
                        displayType
                        maxValue
                    }
                }
                rawMetaData
                lastTransferHash
                lastTransferBlock
                lastTransferTimestamp
            }
        }
    }
    Wallet(input: {identity: "{identity}", blockchain: polygon}) {
        tokenBalances {
            amount
            blockchain
            formattedAmount
            tokenAddress
            tokenId
            tokenNfts {
                id
                address
                tokenId
                blockchain
                chainId
                type
                totalSupply
                tokenURI
                contentType
                contentValue {
                    image {
                        original
                    }
                }
                metaData {
                    name
                    description
                    image
                    attributes {
                        trait_type
                        value
                        displayType
                        maxValue
                    }
                }
                rawMetaData
                lastTransferHash
                lastTransferBlock
                lastTransferTimestamp
            }
        }
    }
    }
    '''
    query = tpl.replace('{{identity}}', identity)

    resp = requests.post("https://api.airstack.xyz/gql", headers={
            "accept": "application/json, multipart/mixed",
            "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
            "authorization": os['AIRSTACK_KEY'],
            "content-type": "application/json",
            "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        data=json.dumps({"query": query}))
    return resp.json()
