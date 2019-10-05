const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));


app.post('/form', (req, res) => {
	fs.readFile('req.audio', (err, data) =>{
		if (err) console.log(err)
		console.log(data);
	});
	
	 const {audio} = req.body;
	 console.log(req.body, audio);
	 res.send('file sent!');

})


app.listen(3005, () => {
	console.log('app is running on port 3005')
});