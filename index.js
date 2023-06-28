require('dotenv').config()
let liminalContracts= require("./liminal.contracts")

let liminal= require ("@lmnl/liminaljs")

let liminalConfig={
    clientId:process.env.LIMINALCONFIG_CLIENTID,
    clientSecret: process.env.LIMINALCONFIG_CLIENTSECRET
}
let liminalJs = null;
var liminalAuthenticate = false;

// walletId should be number
var walletId=778

let token="XLM"

let parentChain="XLM"

async function helper(){
    // console.log(liminalConfig)
    if (!liminalAuthenticate) {
        liminalJs = new liminal.LiminalJs(liminal.LiminalEnvironment.prod);
        await liminalJs.Authenticate({ clientId: liminalConfig.clientId, clientSecret: liminalConfig.clientSecret }).AuthenticateWithAccessToken();
        liminalAuthenticate = true;
        console.log("Liminal client authenticated")
    }
    let walletData
    if(parentChain === token){
        walletInstance = await liminalJs.Coin(liminal.CoinsEnum[token.toLowerCase()]).Wallets().Get({ walletId })
         walletData = await walletInstance.GetWallet();
    }else{
        let tokenContractAddress = liminalContracts.hasOwnProperty(parentChain.toUpperCase())&& liminalContracts[parentChain.toUpperCase()].hasOwnProperty(token.toUpperCase())? liminalContracts[parentChain.toUpperCase()][token.toUpperCase()].address: null
        if(tokenContractAddress == undefined || tokenContractAddress == null||tokenContractAddress.length==0){
            throw new Error(`${token} contract address not found for chain ${parentChain}`)
        }
        walletInstance=await liminalJs.Coin(liminal.CoinsEnum[parentChain]).Token({tokenAddress:tokenContractAddress,tokenName:token}).Wallets().Get({walletId});
         walletData = await walletInstance.GetWallet();
    }
    console.log(walletData.Data)
}
// function helper2(){
//     console.log(liminalContracts.BNB)
//         console.log(liminalContracts[token.toUpperCase()])
// }

// helper2()

helper()