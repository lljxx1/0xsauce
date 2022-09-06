const {task} = require('hardhat/config');

async function handler() {
  const operator = (await ethers.getSigners())[0];
  const chainId = Number(await hre.getChainId());
  console.log('operator', operator.address);
  console.log('Account balance:', (await operator.getBalance()).toString());
  const admin = operator.address;
  const ProofRegistry = await ethers.getContractFactory(
    'ProofRegistry'
  );
  const registry = await ProofRegistry.deploy();
  console.log('registry', registry.deployTransaction.hash);
  await registry.deployTransaction.wait();
  console.log({
    chainId,
    operator: admin,
    registry: registry.address,
  });
}

handler()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
