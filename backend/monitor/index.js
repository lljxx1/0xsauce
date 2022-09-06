const fetch = require('node-fetch');
const { Covalent_API } = require('../config/config.json');
const allCollections = require('../config/collections');
const topCollections = require('../config/top.json');
const fs = require('fs');
const stateFile = __dirname + '/state.json';
const BlackList = require('./blacklist/scamsniffer+slowmist.json');
const watchCollections = allCollections.map(c => c.contract);
const topCollectionIds = topCollections.map(c => c.contract.address);

let state = {};

async function fetchTransactions(address, size = 200) {
    const url = `https://api.covalenthq.com/v1/1/address/${address}/transactions_v2/?key=${Covalent_API}&page-size=${size}`;
    const req = await fetch(url, {
        agent: require("proxy-agent")("socks://127.0.0.1:9998"),
    })
    const result = await req.json();
    return result;
}

async function loadState() {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
}

async function getLastScan(address) {
    return state[address] || 0;
}

async function saveLastScan(address, block) {
    state[address] = block;
    fs.writeFileSync(stateFile, JSON.stringify(state))
}


async function findRecentNFTTransfer(address, lastBlock = 0) {
    const result = await fetchTransactions(address);
    const allTokenTransfer = [];
    const data = result.data.items.filter(_ => _.block_height > lastBlock).map(_ => {
        if (_.log_events) {
            const transferEvents = _.log_events.filter(c => {
                return c.decoded && c.decoded.name === 'Transfer'
            })
            .map(event => {
                return {
                    time: event.block_signed_at,
                    sender_name: event.sender_name,
                    sender_address: event.sender_address,
                    from: event.decoded.params[0].value,
                    to: event.decoded.params[1].value,
                    tokenId: event.decoded.params[2].value
                }
            })

            transferEvents.forEach(c => {
                allTokenTransfer.push(c);
            })
        }
        return _;
    })

    const recentBlock = data.length ? data[0].block_height : lastBlock;
    const inWatchCollections = allTokenTransfer.filter(c => watchCollections.includes(c.sender_address));
    const isTopCollections = allTokenTransfer.filter(c => topCollectionIds.includes(c.sender_address));
    // console.log('isTopCollections', isTopCollections.length)
    // console.log('inWatchCollections', inWatchCollections.length)
    // console.log('recentBlock', recentBlock)
    return {
        recentBlock,
        isTopCollections,
        inWatchCollections
    }
}


async function scanAddress(address) {
    const lastBlock = await getLastScan(address)
    const {
        recentBlock,
        isTopCollections,
        inWatchCollections
    } = await findRecentNFTTransfer(address, lastBlock);

    await saveLastScan(address, recentBlock);
    if (inWatchCollections.length) {
        // flag token

    }

    if (isTopCollections.length) {
        console.log('transfer in top collection', isTopCollections.length)
    }
}


async function test() {
    await loadState();
    await scanAddress('0xaa18164d0b6139ccb9227de28dad2571e38303c7')
}

test();