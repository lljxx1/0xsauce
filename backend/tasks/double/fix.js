
const stolenTokens = require('./dump.json');
const doubleCheckedStolenTokens = require('./stolen.json');
const { Asset } = require('../../schema');

(async () => {
    for (let index = 0; index < stolenTokens.length; index++) {
        const stolenToken = stolenTokens[index];
        const inStolen = doubleCheckedStolenTokens.find(c => c.contract === stolenToken.contract && c.tokenId === stolenToken.tokenId)
        if (!inStolen) {
            const result = await Asset.update({
                supportsWyvern: 1,
            }, {
                where: {
                    contract: stolenToken.contract,
                    tokenId: stolenToken.tokenId,
                    supportsWyvern: 0
                }
            })
            console.log('double check failed', result)
        }
    }
})();