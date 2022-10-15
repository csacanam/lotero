# Lotero♦

> The cryptolottery with the highest chance of winning (10%)! 🚀

🧪 Quickly experiment with Solidity using a frontend that adapts to your smart contract:

![image](https://2958401806-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FDz1PgCN0WeiWDNrmpiG5%2Fuploads%2FkenJxmF7j4Ot7WWSRWBS%2FCripto%20Loteri%CC%81a%402x.png?alt=media&token=d66e608f-162f-4011-8805-4009a2acb4ad)


# 🏄‍♂️ Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 lotero:

```bash
git clone https://github.com/csacanam/lotero.git
```

> install and start your 👷‍ Hardhat chain:

```bash
cd lotero
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd lotero
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd lotero
yarn deploy
```

🔏 Edit the smart contract `Lotero.sol` in `packages/hardhat/contracts`

📝 Edit the frontend `App.jsx` in `packages/react-app/src`

💼 Edit the deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

# 📚 Whitepaper

Visit: [criptomano.gitbook.io/criptoloteria](https://criptomano.gitbook.io/criptoloteria/)

# 💌 P.S.

🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 Make sure you update the `InfuraID` before you go to production. Huge thanks to [Infura](https://infura.io/) for our special account that fields 7m req/day!

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/+fgkMlphOOI8zNjRh) to ask questions and find others using Lotero♦!
