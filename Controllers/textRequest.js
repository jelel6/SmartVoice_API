const Houndify = require('houndify');
const path = require('path');

const argv = require('minimist')(process.argv.slice(2));
const configFile = argv.config || './config.json';
const config = require(path.join(__dirname, configFile));


const houndTextRequest = (req, res) => {
const {searchTerm} = req.body;
 if (!searchTerm) {
    return res.status(400).json('Empty string! Please, provide a valid search term.');
 }

const textRequest = new Houndify.TextRequest({

  	query: searchTerm,

    clientId: config.clientId,
    clientKey: config.clientKey,

    //REQUEST INFO JSON
    //see https://houndify.com/reference/RequestInfo
    requestInfo: {
        UserID: "test_user",
        Latitude: 37.388309,
        Longitude: -121.973968
    },

    onResponse: (response, info) => {
        console.log(response);
        return res.json(response);
    },

    onError: (err, info) => {
        console.log(err);
        return res.json(err);
    }
  });
}


module.exports = {
	houndTextRequest
}