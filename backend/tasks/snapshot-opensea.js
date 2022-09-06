const { OPENSEA_API } = require("../config/config.json");
const { Asset } = require("../schema");
const fetch = require("node-fetch");
const allCollections = require("../config/collections");

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchAsset(asset_contract_address, tokenId, retry = 5) {
  for (let index = 0; index < retry; index++) {
    try {
      const url = `https://api.opensea.io/api/v1/asset/${asset_contract_address}/${tokenId}`;
      const res = await fetch(url, {
        agent: require("proxy-agent")("socks://127.0.0.1:9998"),
        headers: {
          "x-api-key": OPENSEA_API,
        },
      });
      const result = await res.json();
      if (!result) throw new Error("err");
      return result;
    } catch (e) {
      console.log("error", e);
    }
  }
  return null;
}

async function snapshotCollection(
  contract,
  { max = 1, min = 1 },
  force = false,
  delay = 1
) {
  const total = max - min;
  for (let index = 0; index <= total; index++) {
    const tokenId = min + index;
    if (!force) {
      const isFetched = await Asset.findOne({
        where: {
          contract: contract,
          tokenId: tokenId,
        },
      });
      if (isFetched) {
        console.log("fetched", tokenId);
        continue;
      }
    }

    try {
      const detail = await fetchAsset(contract, tokenId);
      const result = await Asset.bulkCreate(
        [detail].map((_) => {
          return {
            contract,
            tokenId,
            name: detail.name,
            imageOriginalUrl: detail.image_original_url,
            imageUrl: detail.image_url,
            imagePreviewUrl: detail.image_preview_url,
            supportsWyvern: detail.supports_wyvern ? 1 : 0,
            scamSniffer: 0,
          };
        }),
        {
          validate: true,
          updateOnDuplicate: [
            "contract",
            "tokenId",
            "name",
            "imageOriginalUrl",
            "imageUrl",
            "imagePreviewUrl",
            "supportsWyvern",
            "scamSniffer",
          ],
        }
      );
      console.log(result.length, tokenId);
    } catch (e) {
      console.log("failed", e);
    }
    await wait(delay * 1000);
  }
}

(async () => {
  for (let index = 0; index < allCollections.length; index++) {
    const collection = allCollections[index];
    await snapshotCollection(collection.contract, collection);
  }
})();
