const allCollections = require("../config/collections");

const { Asset } = require("../schema");


(async ()=> {
    console.log(await Asset.findAll({
        where: {
            contract: '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b',
            supportsWyvern: 0
        }
    }))
})();