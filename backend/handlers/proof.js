const fs = require('fs');

async function getProof(req, res) {
  const item = req.query;
  const { collection, tokenId } = item
  const proofFile = __dirname + `/../proof/${collection.toLowerCase()}.json`;

  if (!fs.existsSync(proofFile)) {
    return res.json({
      error: 'collection not found'
    })
  }

  const findIds = tokenId.split(',').length > 1 ? tokenId.split(',')  : [tokenId];
  const poofDatabase = JSON.parse(fs.readFileSync(proofFile, 'utf-8'));
  const rows = poofDatabase.tokens.filter(c => findIds.includes(c.tokenId));
  res.json({
    results: rows
  });
}


module.exports = {
  getProof
};
