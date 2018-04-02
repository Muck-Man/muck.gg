const Website = require('./server');

(() => {
	const website = new Website('127.0.0.1', 8291);
	website.start();
})();