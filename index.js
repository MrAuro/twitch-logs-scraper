// node index.js <channel> <user> <mode?>

import axios from 'axios';
import fs from 'fs';

const args = process.argv.slice(2);

// messages | timeouts
const mode = args[2] || 'messages';
const user = args[1];
const channel = args[0];

if (!user || !channel) {
	console.log('missing user or channel');
	process.exit(1);
}

const fetchedData = new Map();
const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

let errorMax = 10;

const getMonthlyData = async (month, year) => {
	console.log('getting data for', month, year);
	const url = `https://logs.ivr.fi/channel/${channel}/user/${user}/${year}/${month}`;
	try {
		let response = await axios.get(url);
		if (mode == 'messages') {
			let lineCount = response.data.split('\n').length;
			fetchedData.set(`${year} ${month}`, lineCount);
		} else if (mode == 'timeouts') {
			let timeouts = response.data.match(/has\sbeen\stimed\sout\sfor/g);
			fetchedData.set(`${year} ${month}`, timeouts.length);
		} else {
			throw new Error('invalid mode');
		}
	} catch (err) {
		errorMax--;
	}
};

const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;

(async () => {
	while (errorMax > 0) {
		await getMonthlyData(month, year);
		if (month === 1) {
			month = 12;
			year--;
		} else {
			month--;
		}
	}

	const csv = [...fetchedData]
		.map(([key, value]) => {
			const monthString = months[key.split(' ')[1] - 1];
			return `${monthString} ${key.split(' ')[0]},${value}`;
		})
		.join('\n');
	fs.writeFileSync(`${user}-${channel}.csv`, csv);
})();

process.on('SIGINT', () => {
	const csv = [...fetchedData]
		.map(([key, value]) => {
			const monthString = months[key.split(' ')[1] - 1];
			return `${monthString} ${key.split(' ')[0]},${value}`;
		})
		.join('\n');
	fs.writeFileSync(`${user}-${channel}.csv`, csv);
	process.exit(0);
});