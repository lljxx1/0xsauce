const fetch = require('node-fetch');
const { Covalent_API } = require('../config/config.json');
const allCollections = require('../config/collections');
const topCollections = require('../config/top.json');
const fs = require('fs');
const stateFile = __dirname + '/state.json';
const BlackList = require('./blacklist/scamsniffer+slowmist.json');
const watchCollections = allCollections.map(c => c.contract);
const topCollectionIds = topCollections.map(c => c.contract.address);
const { Asset } = require('../schema');
const { EPNS_CHANNEL_KEY, EPNS_CHANNEL } = require('../config/config.json');
const { sendNotification } = require('./notify');

let state = {};

async function fetchTransactions(address, size = 100) {
    const url = `https://api.covalenthq.com/v1/1/address/${address}/transactions_v2/?key=${Covalent_API}&page-size=${size}`;
    const req = await fetch(url, {
        // agent: require("proxy-agent")("http://127.0.0.1:9999"),
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

    console.log('inWatchCollections', inWatchCollections)
    if (inWatchCollections.length) {
        for (let index = 0; index < inWatchCollections.length; index++) {
            const watchToken = inWatchCollections[index];
            // flag token 
            await Asset.update({
                scamSniffer: 1
            }, {
                where: {
                    contract: watchToken.sender_address,
                    tokenId: watchToken.tokenId
                }
            })
        }
    }

    if (isTopCollections.length) {
        // If token in opensea top 1000 collection, send notification to owner
        for (let index = 0; index < isTopCollections.length; index++) {
            const token = isTopCollections[index];
            const payload = {
                title: `[Stolen] ${token.sender_name} #${token.tokenId}`,
                body: `Your ${token.sender_name} #${token.tokenId} has been stolen`
            }
            console.log(payload)
            try {
                await sendNotification(
                    // token.from,
                    EPNS_CHANNEL,
                    payload, 
                    {
                        ...payload,
                        cta: '',
                        img: ''
                    }
                )
            } catch(e) {
                console.log('sendNotification.error', e)
            }
        }
    }
}


async function watchAll() {
    for (let index = 0; index < BlackList.length; index++) {
        const address = BlackList[index];
        try {
            await scanAddress(address);
        } catch(e) {
            console.log('scanAddress', e)
        }
    }
}

async function scanTask() {
    await loadState();
    for (let index = 0; index < Infinity; index++) {
        await watchAll();
        await new Promise((resolve) => {
            setTimeout(resolve, 60 * 1000 * 30);
        })
    }
}

async function test() {
    await loadState();
    await scanAddress('0xaa18164d0b6139ccb9227de28dad2571e38303c7')
}

// test();

scanTask();