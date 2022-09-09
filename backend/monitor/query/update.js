
const { Asset } = require('../../schema');
const stolenTokenFromBlacklist = require('./result/merged.json');

(async () => {
    for (let index = 0; index < stolenTokenFromBlacklist.length; index++) {
        const stolenToken = stolenTokenFromBlacklist[index];
        const token = await Asset.findOne({
            where: {
                contract: stolenToken.contract_address,
                tokenId: stolenToken.tokenId
            }
        });
        if (token) {
            // update state
            token.scamSniffer = 1;
            await token.save();
            console.log('state', token.id)
        }
    }
})();