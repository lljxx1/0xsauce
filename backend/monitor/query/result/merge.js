const fs = require('fs');

// send from blacklist address
const from = require('./from.json');

// receive from blacklist address
const receive = require('./receive.json');
all = new Set();

const uniqueTokens = [].concat(receive, from).filter((_) => {
  const id = `${_.contract_address}:${_.tokenId}`;
  const exists = all.has(id);
  if (!exists) {
    all.add(id);
  }
  return !exists;
}).map(_ => {
    _.contract_address = _.contract_address.replace("\\", "0");
    _.receivers = _.receivers.split(";;").map((c) => c.replace("\\", "0"));
    _.senders = _.senders.split(";;").map((c) => c.replace("\\", "0"));
    return _;
});


console.log('uniqueTokens', uniqueTokens.length)
fs.writeFileSync('merged.json', JSON.stringify(uniqueTokens, null, 2))