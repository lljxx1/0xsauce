const EpnsAPI = require("@epnsproject/sdk-restapi");
const ethers = require("ethers");
const { EPNS_CHANNEL_KEY } = require('../config/config.json');

const Pkey = `0x${EPNS_CHANNEL_KEY}`;
const signer = new ethers.Wallet(Pkey);
const channel = "0xbECdD47d13023647F34084e8Feb6B018738D901A";

const sendNotification = async(recipient, payload, notification) => {
    try {
      const apiResponse = await EpnsAPI.payloads.sendNotification({
        signer,
        type: 3, // target
        identityType: 2, // direct payload
        notification,
        payload,
        // notification: {
        //   title: `[SDK-TEST] notification TITLE:`,
        //   body: `[sdk-test] notification BODY`
        // },
        // payload: {
        //   title: `[sdk-test] payload title`,
        //   body: `sample msg body`,
        //   cta: '',
        //   img: ''
        // },
        recipients: `eip155:42:${recipient}`, // recipient address
        channel: `eip155:42:${channel}`, // your channel address
        env: 'staging'
      });
      
      // apiResponse?.status === 204, if sent successfully!
      console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err);
    }
}


module.exports = {
    sendNotification
}