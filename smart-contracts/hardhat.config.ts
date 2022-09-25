import {HardhatUserConfig} from 'hardhat/config';
import {BigNumber} from 'ethers';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';
import 'hardhat-contract-sizer';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';
import dotenv from 'dotenv';
// import './tasks';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const gasPrice = process.env.GAS_PRICE || 1;
const mnemonic = 'test test test test test test test test test test test junk';
let accounts;
if (privateKey) {
  accounts = [privateKey];
} else {
  accounts = {
    mnemonic,
  };
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.6.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.5.16',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.5.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
        accountsBalance: '100000000000000000000000000',
      },
      blockGasLimit: 60000000,
      initialBaseFeePerGas: 0,
    },
    localhost: {
      url: 'http://localhost:7545',
      accounts,
      timeout: 60000,
      blockGasLimit: 60000000,
      gasPrice: BigNumber.from(gasPrice)
        .mul(10 ** 9)
        .toNumber(),
    },
    ether: {
      url: 'https://light-little-sanctuary.discover.quiknode.pro/6556bef83624e969dc756ac0219251b786433890/',
,
      accounts,
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts,
      // gasPrice: BigNumber.from(900)
      //   .mul(10 ** 9)
      //   .toNumber(),
      timeout: 60000,
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      accounts
    },
    optimism: {
      url: 'https://mainnet.optimism.io/',
      accounts
    }
  },
  namedAccounts: {
    deployer: 0,
    accountA: 1,
    accountB: 2,
    accountC: 3,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 1,
  },
  typechain: {
    outDir: './sdk/src/typechain',
    target: 'ethers-v5',
  },
  etherscan: {
    apiKey: process.env.APIKEY,
  },
};
export default config;
