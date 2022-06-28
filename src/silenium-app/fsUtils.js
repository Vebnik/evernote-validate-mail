const fs = require('fs')
const path = require('path')


const saveFile = (data, name) => {
	fs.writeFile(`${name}Results.json`, JSON.stringify(data, null, 2), err => {
		if (err) return console.log(err)
	})
}

const parsingLocalTxt = async () => {
	const data = new Promise(resolve => {
		fs.readFile(path.join('data.txt'), (str) => {
			const splitMail = str.split(/;([\s\S]+?)\n/gmi).filter(el => /@/.test(el))
			fs.writeFile('clearMail.json', JSON.stringify(splitMail, null, 2), err => {})
		})
	})

	await Promise.all([data])
	return data
}


function *range(stop = 0, start = 0, step = 1) {
	for (let i = start; i <= stop; i+= step) {
		yield i
	}
}

module.exports = { saveFile, parsingLocalTxt, range }