require('mithril/test-utils/browserMock')(global)

const fs = require('fs');
const path = require('path');

const express = require('express');

const toHTML = require('mithril-node-render');
const m = require('mithril');

const manifestPath = path.resolve(__dirname, '../public/build/manifest.json');

class Website
{
	constructor(hostname, port)
	{
		this.hostname = hostname;
		this.port = port;

		this.app = express();
	}

	start()
	{
		this.app.get('/*', (req, res, next) => {
			return new Promise((resolve, reject) => {
				fs.readFile(manifestPath, (e, d) => {
					if (e) {return reject(e);}
					resolve(JSON.parse(d.toString()));
				});
			}).then((manifest) => {
				return m('html', [
					m('head', [
						m('title', 'Muck Man'),
						m('link', {
							rel: 'icon',
							href: '/assets/favicon/favicon.ico'
						}),
						m('link', {
							rel: 'stylesheet',
							href: `/build/${manifest['main.css']}`,
							type: 'text/css'
						}),
						m('meta', {charset: 'UTF-8'}),
						m('meta', {
							property: 'description',
							content: 'Muck Cleaner'
						}),
						m('meta', {
							property: 'og:image',
							content: '/assets/images/logo.png'
						})
					]),
					m('body', [
						m('div', {id: 'app'}),
						m('script', {
							src: `/build/${manifest['main.js']}`
						})
					])
				]);
			}).then(toHTML).then((html) => {
				res.type('html');
				return res.send(html);
			}).catch(next);
		});

		this.app.listen(this.port, this.hostname);
	}
}

module.exports = Website;