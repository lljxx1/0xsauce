const EpnsAPI = require("@epnsproject/sdk-restapi");
const ethers = require("ethers");
const { EPNS_CHANNEL_KEY, EPNS_CHANNEL } = require('../config/config.json');

const Pkey = `0x${EPNS_CHANNEL_KEY}`;
const signer = new ethers.Wallet(Pkey);
const channel = EPNS_CHANNEL;

const sendNotification = async(recipient, payload, notification) => {
    try {
      const apiResponse = await EpnsAPI.payloads.sendNotification({
        signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification,
        payload,
        recipients: `eip155:1:${recipient}`, // recipient address
        channel: `eip155:1:${channel}`, // your channel address
        env: 'prod'
      });
      // apiResponse?.status === 204, if sent successfully!
      // console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err.toString());
    }
}


module.exports = {
    sendNotification
}