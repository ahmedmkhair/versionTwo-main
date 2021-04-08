const puppeteer = require('puppeteer')

async function test() {
    let browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    let page = await browser.newPage()

    await page.goto("http://localhost:3001")
    await page.setViewport({
        width: 0,
        height: 0
    })



    let user1 = await page.$('input[name=username]')
    await user1.type("seif")

    await page.waitForTimeout(2000)


    let password = await page.$('input[name=password]')
    await password.type("123")

    await page.waitForTimeout(2000)


    let login = await page.$('[name=submit]')
    await login.click()

    await page.waitForTimeout(2000)


    await page.waitForSelector('.data')
    await page.click('.data')
    await page.waitForTimeout(2000)



    let inputmessage = await page.$('input[name=message]')
    await inputmessage.type("Hello from puppeteer")

    await page.waitForTimeout(2000)



    let message = await page.$('[name=submitmessage]')
    await message.click()

    await page.waitForTimeout(2000)



    let back = await page.$('[name=back]')
    await back.click()

    await page.waitForTimeout(2000)



    let logout = await page.$('[name=logout]')
    await logout.click()

    await page.waitForTimeout(2000)










    let admin = await page.$('input[name=username]')
    await admin.type("omar")

    await page.waitForTimeout(2000)


    let password2 = await page.$('input[name=password]')
    await password2.type("admin1234")

    await page.waitForTimeout(2000)

    let submit1 = await page.$('[name=submit]')
    await submit1.click()

    await page.waitForTimeout(2000)


    await page.waitForSelector('.allchat')
    await page.click('.allchat')
    await page.waitForTimeout(2000)







    let back2 = await page.$('[name=back]')
    await back2.click()

    await page.waitForTimeout(2000)



    let logout2 = await page.$('[name=logout]')
    await logout2.click()

    await page.waitForNavigation()

    browser.close()

}


test()
