const {Builder, Browser, By, Key, until, Capabilities, HttpResponse, } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

// Logic
const caps = new Capabilities()


class Start {

	#Driver
	#browser
	#startArgs = ['--disable-gpu'] // --repl
	#url

	constructor(browser, url) {
		this.#browser = browser

		// Capabilities
		caps.setPageLoadStrategy('normal')
	}

	async createDriver() {
		this.#Driver = await new Builder().
		withCapabilities(caps).
		forBrowser(Browser.CHROME).
		setChromeOptions(new chrome.Options().addArguments(this.#startArgs)).
		build()

		await this.#Driver.manage().setTimeouts( { implicit: 10000 } )
	}

	async open(url) {
		await this.#Driver.get(url)
	}

	async getElement (selector = 'a') {
		return await this.#Driver.findElements(By.css(selector))
	}

	async inputKey (element, input) {
		await element.sendKeys(input, Key.RETURN)
	}

	async quit () {
		await this.#Driver.quit()
	}
}


module.exports = { Start }


