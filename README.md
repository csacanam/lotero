# Loteroβ¦

> The cryptolottery with the highest chance of winning (10%)! π

π§ͺ Lotero is a decentralized application (DApp) that allows people to bet their cryptocurrencies and multiply them by 5 with a probability of 10%

Read more about Lotero in: https://criptomano.gitbook.io/criptoloteria/

![image](https://2958401806-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FDz1PgCN0WeiWDNrmpiG5%2Fuploads%2FkenJxmF7j4Ot7WWSRWBS%2FCripto%20Loteri%CC%81a%402x.png?alt=media&token=d66e608f-162f-4011-8805-4009a2acb4ad)


# πββοΈ Quick Start

Prerequisites: [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork π lotero:

```bash
git clone https://github.com/csacanam/lotero.git
```

> install and start your π·β Hardhat chain:

```bash
cd lotero
yarn install
yarn chain
```

> in a second terminal window, start your π± frontend:

```bash
cd lotero
yarn start
```

> in a third terminal window, π° deploy your contract:

```bash
cd lotero
yarn deploy
```

π Edit the smart contract `Lotero.sol` in `packages/hardhat/contracts`

π Edit the frontend `App.jsx` in `packages/react-app/src`

πΌ Edit the deployment scripts in `packages/hardhat/deploy`

π± Open http://localhost:3000 to see the app

# π Whitepaper

Visit: [criptomano.gitbook.io/criptoloteria](https://criptomano.gitbook.io/criptoloteria/)

# π P.S.

π You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

π£ Make sure you update the `InfuraID` before you go to production. Huge thanks to [Infura](https://infura.io/) for our special account that fields 7m req/day!

# π¬ Support Chat

Join the telegram [support chat π¬](https://t.me/+fgkMlphOOI8zNjRh) to ask questions and find others using Loteroβ¦!
