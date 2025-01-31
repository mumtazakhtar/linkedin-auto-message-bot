const puppeteer = require('puppeteer');
async function sendMessage(profileUrl, messageContent) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.linkedin.com/login');
    
    await page.waitForSelector('#username');
    const loginDetails = await page.evaluate(() => {
        const email = prompt('Enter LinkedIn Email:');
        const password = prompt('Enter LinkedIn Password:');
        return { email, password };
    });
    
    await page.type('#username', loginDetails.email);
    await page.type('#password', loginDetails.password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    
    await page.goto(profileUrl);
    await page.click('button[aria-label="Message"]');
    await page.waitForSelector('.msg-form__contenteditable');
    
    await page.type('.msg-form__contenteditable', messageContent);
    await page.click('button[aria-label="Send now"]');
    
    await browser.close();
    return { success: true };
}
module.exports = sendMessage;
