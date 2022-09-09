const allCollections = require("../config/collections");
const { Asset } = require("../schema");
const fs = require('fs');

(async () => {
  const allTokens = [];

  for (let index = 0; index < allCollections.length; index++) {
    const collection = allCollections[index];
    const stolenTokens = await Asset.findAll({
      where: {
        contract: collection.contract,
        supportsWyvern: 0,
      },
    });

    stolenTokens.forEach((_) => {
      allTokens.push({
        contract: _.contract,
        tokenId: _.tokenId,
      });
    });
  }
  console.log(allTokens.length);
//   fs.writeFileSync('./stolen-tokens.json', JSON.stringify(allTokens))
})();
