var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var gulp = require('gulp')
var exec = require('child_process').exec;
var https = require('https')
var argv = require('yargs').demand(['repo', 'secret']).argv
var moment = require('moment')
var crypto = require('crypto')

var cmd = 'gulp build';
var port = 8090
var GITHUB_API_ENDPOINT = 'api.github.com'

function gulpBuilder(url, ver, date) {
	return cmd + ' --url ' + url + ' --ver ' + ver + ' --date ' + dateFormatter(date)
}

function dateFormatter(date) {
	return moment(date).format('Y-MM-DD')
}

function verifyWebHook(hash, data) {
	return hash === 'sha1=' + crypto.createHmac('sha1', argv.secret).update(data).digest('hex')
}

https.get({
	host: GITHUB_API_ENDPOINT,
	path: '/repos/' + argv.repo + '/releases/latest',
	headers: {
		'User-Agent': 'ui.baildon.co'
	}
}, function(res) {
	var body = []
	res.on('data', function(chunk) {
		body.push(chunk)
	})
	res.on('end', function() {
		body = JSON.parse(body.join(''))
		var ver = body['tag_name']
		var url = body['zipball_url']
		var date = body['published_at']
		exec(gulpBuilder(url, ver, date), function(error, stdout, stderr) {
			console.log(`stderr: ${stderr}`);
			console.log('first fetch')
		})
	})
})

app.use(bodyParser.json())

app.post('/hook/github/release', function(req, res) {
	var sig   = req.headers['x-hub-signature']
	if (!verifyWebHook(sig, req.body)) {
		console.error('Could not verify webhook')
		return
	}
	var url = req.body.release.zipball_url
	var ver = req.body.release.tag_name
	var date = req.body.release.published_at

	console.log('webhook ' + url + ' ' + ver)
	exec(gulpBuilder(url, ver, date), function(error, stdout, stderr) {
		console.log("release webhook")
	})
})

app.use(express.static('build/'));

app.listen(port, function () {
	console.log('Example app listening on port ' + port);
});
