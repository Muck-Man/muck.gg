const m = require('mithril');

const Components = {
	Pages: require('./components/pages')
};

const Rest = require('./rest');
const Utils = require('./utils');

class App
{
	constructor(prefix)
	{
		m.route.prefix(prefix || '');

		this.rest = new Rest(this);
		this.cache = new Utils.Cache(3600);

		this.pages = {}
		Components.Pages.forEach((Page) => {
			if (Page.path in this.pages) {
				throw new Error(`${Page.path} is already taken!`);
			}
			const page = new Page(this);
			this.pages[page.path] = {
				page,
				onmatch: page.onmatch.bind(page),
				render: page.render.bind(page)
			};
		});
	}

	get authed()
	{
		return this.cache.has('users.me');
	}

	auth()
	{
		return new Promise((resolve, reject) => {
			//maybe check cache, idk
			if (!this.rest.token) {
				reject(new Error('No token to auth with'));
				return;
			}

			this.rest.request({
				method: 'get',
				url: '/api/users/@me',
				query: {connections: true},
				useAuth: true
			}).then((data) => {
				this.cache.set('users.me', data, 0);
				resolve(data);
			}).catch(reject);
		});
	}

	start()
	{
		return Promise.resolve().then(() => {
			if (localStorage.token) {
				this.rest.setToken(JSON.parse(localStorage.getItem('token')));
				return this.auth();
			} else {
				return Promise.resolve();
			}
		}).catch(console.error).finally(() => {
			m.route(document.getElementById('app'), '/error/404', this.pages);
		})
	}
}

(() => {
	const app = new App();
	app.start();
})();