const m = require('mithril');

const Page = require('../page');

class CustomPage extends Page
{
	constructor(app)
	{
		super(app, {
			path: '/',
			class: 'home'
		});
	}

	init(args, requestedPath)
	{
		return new Promise((resolve, reject) => {
			this.app.rest.request({
				method: 'get',
				url: '/api/muck/stats'
			}).then((data) => {
				data.scores.sort((x, y) => x.type.localeCompare(y.type));
				this.app.cache.set('muck.stats', data, 0);
				resolve();
			}).catch(reject);
		});
	}

	view()
	{
		const data = this.app.cache.get('muck.stats');

		const date = 'yesterday';

		return [
			m('div', {class: 'head text-center'}, [
				m('img', {src: '/assets/images/logo.png', style: 'height: 128px; width: 128px;'}),
				m('h1', 'Muck Man'),
				m('span', {class: 'small-text'}, 'no muck allowed'),
				m('div', {class: 'btn-group'}, [
					m('a', {href: '/invite', class: 'btn'}, 'Invite'),
					m('a', {href: '/discord', class: 'btn'}, 'Discord')
				])
			]),
			m('div', {class: 'stats'}, [
				data.scores.map((score) => {
					return m('div', {class: `stat ${score.type}`}, [
						m('div', {class: 'title'}, [
							m('h3', score.type.toTitleCase()),
							m('span', `Total of ${score.data.count.toLocaleString()} messages since ${date}`)
						]),
						m('div', {class: 'sections'}, Object.keys(score.data).sort((x, y) => x.localeCompare(y)).map((attribute) => {
							if (attribute === 'count') {return;}

							const stat = score.data[attribute];

							const rgb = [
								parseInt(255 * stat),
								parseInt(255 * (1 - stat)),
								0
							];

							return m('div', {class: 'section'}, [
								m('span', attribute.toTitleCase()),
								m('span', {class: 'percent'}, `${parseInt(stat * 100)}%`),
								m('div', {
									class: 'progress',
									style: `background-color: rgb(${rgb.join(', ')})`,
								}, [
									m('div', {
										class: 'progress-bar',
										role: 'progressbar',
										style: `width: ${100 - parseInt(stat * 100)}%`,
										'aria-valuenow': parseInt(stat * 100),
										'aria-valuemin': 0,
										'aria-valuemax': 100
									})
								])
							]);
						}))
					]);
				})
			])
		];
	}
}

module.exports = CustomPage;