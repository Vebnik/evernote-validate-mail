const { Start } = require('./utilsSilenuim')
const wait = require('wait')
const { saveFile, range } = require('./fsUtils')
const arg = require('minimist')
const clearData = []


const niceJob = async (data, id, resolve) => {

	const url = 'https://www.evernote.com/Login.action'
	const app = await new Start('chrome', url)
	await app.createDriver()

	const checkValidate = async (i = 0) => {

		if (i === data.length) {
			//await saveFile(clearData, id)
			resolve(clearData)
			return await app.quit()
		}

		await app.open(url)
		await app.getElement('#username').then(async webEl => await app.inputKey(webEl[0], data[i]))
		await app.getElement('#loginButton').then(async el => await el[0].click())

		await wait(3000)

		await app.getElement('#responseMessage').then(async el => {
			await el[0].getText()
				.then(async text => {
					if (!/Аккаунта/gmi.test(text)) clearData.push({[data[i]]: text})
					console.log(text)
					await checkValidate(++i)
				})
		})
	}
	await checkValidate()

}

const multiThread = async (data, thread) => {

	const divide = (arr, div) => {
		const step = Math.ceil(arr.length/div)

		const tmp = []

		for (let i = 0; i <= arr.length; i+= step)
			tmp.push(arr.slice(i, (i+step)))

		return tmp.filter(el => el.length)
	}

	const promArr = divide(data, thread).map((divData, i) =>
		new Promise(resolve => {niceJob(divData, i, resolve).catch()} ))

	await Promise.all(promArr)
	return 'true'

}


const getValidMail = () => {

	const { f, t } = arg(process.argv)
	const mails = require(`./${f}.json`)

	multiThread(mails, t)
		.then(data => saveFile(clearData, 'clear'))
		.catch(err => console.error(err))
}; getValidMail()

