const allCollections = require("../config/collections");
const { Asset } = require("../schema");
const { Op } = require("sequelize");

async function getAllCollectionData(contract = null) {

  const selected = allCollections.filter(_ => contract ? contract === _.contract : true)
  const allCounts = await Promise.all(
    selected.map((_) => {
      return Asset.count({
        where: {
          contract: _.contract,
          [Op.or]: [
            {
              scamSniffer: 1,
            },
            {
              supportsWyvern: 0,
            },
          ],
        },
      });
    })
  );
  const result = selected.map((_, index) => {
    return {
      ..._,
      totalStolen: allCounts[index],
    };
  }).sort((a, b) => parseFloat(b.floorPrice) - parseFloat(a.floorPrice));
  // console.log(result);
  return result;
}

async function getAllCollections(req, res) {
  try {
    res.json({
      result: await getAllCollectionData()
    })
  } catch (e) {
    res.json({
      error: e.toString()
    })
  }
}

async function getCollection(req, res) {
  try {
    const collection = req.query.id;
    res.json({
      collection: (await getAllCollectionData(collection))[0]
    })
  } catch (e) {
    res.json({
      error: e.toString() 
    })
  }
}

async function getTokens(req, res) {
  try {
    const { collection, limit = 20, offset = 0, status = 'block' } = req.query;
    const where =  {
      contract: collection
    }

    if (status === 'block') {
      where[Op.or] = [
        {
          scamSniffer: 1,
        },
        {
          supportsWyvern: 0,
        },
      ];
    }
    
    res.json({
      tokens: await Asset.findAll({
        raw: true,
        offset,
        limit,
        where
      })
    })
  } catch (e) {
    res.json({
      error: e.toString() 
    })
  }
}


async function getToken(req, res) {
  try {
    const { contract,  tokenId } = req.query;
    const where =  {
      contract: contract,
      tokenId,
    }
    res.json({
      token: await Asset.findOne({
        raw: true,
        where
      })
    })
  } catch (e) {
    res.json({
      error: e.toString() 
    })
  }
}


async function test() {
  await getAllCollectionData();
}

// test();
module.exports = {
  getAllCollections,
  getCollection,
  getTokens,
  getToken
};
