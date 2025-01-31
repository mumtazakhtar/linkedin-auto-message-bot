const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");

puppeteer.use(StealthPlugin());

const LINKEDIN_URL = "https://www.linkedin.com";
const COOKIES_FILE_PATH = "./cookies.json";
const SEARCH_QUERY = "https://www.linkedin.com/search/results/people/?firstName=akhtar&network=%5B%22F%22%5D&origin=FACETED_SEARCH&sid=dlE";
const MESSAGE_TEMPLATE_PATH = "./message_template.txt"; // Path to message template

let loggedInUserFirstName = "there"; // Default if not found

/**
 * Launches Puppeteer browser
 */
async function launchBrowser() {
  return await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: null,
    timeout: 30000,
  });
}

/**
 * Loads cookies if available
 */
async function loadCookies(page) {
  if (fs.existsSync(COOKIES_FILE_PATH)) {
    const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE_PATH, "utf8"));
    await page.setCookie(...cookies);
    console.log("✅ Cookies loaded.");
  }
}

/**
 * Saves cookies after login
 */
async function saveCookies(page) {
  const cookies = await page.cookies();
  fs.writeFileSync(COOKIES_FILE_PATH, JSON.stringify(cookies, null, 2));
  console.log("✅ Cookies saved.");
}

/**
 * Logs into LinkedIn and extracts the logged-in user's first name
 */
async function loginToLinkedIn(page, email, password) {
  console.log("🔹 Opening LinkedIn...");
  await page.goto(LINKEDIN_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

  const isLoggedIn = await page.evaluate(() => !!document.querySelector('[aria-label="Search"]'));
  if (isLoggedIn) {
    console.log("✅ Already logged in.");
    await extractLoggedInUserFirstName(page);
    return;
  }

  console.log("🔹 Logging in...");
  await page.goto(`${LINKEDIN_URL}/login`, { waitUntil: "networkidle2" });

  await page.waitForSelector("#username", { timeout: 30000 });
  await page.waitForSelector("#password", { timeout: 30000 });

  await page.type("#username", email, { delay: 100 });
  await page.type("#password", password, { delay: 100 });
  await page.click('button[type="submit"]');

  await page.waitForSelector('[aria-label="Search"]', { timeout: 60000 });
  console.log("✅ Logged in successfully.");

  await extractLoggedInUserFirstName(page);
  await saveCookies(page);
}

/**
 * Extracts the logged-in user's first name from LinkedIn homepage
 */
async function extractLoggedInUserFirstName(page) {
    try {
      console.log("🔹 Extracting logged-in user's first name...");
  
      // Navigate to the LinkedIn profile page
      await page.goto(`${LINKEDIN_URL}/in/me`, { waitUntil: "domcontentloaded", timeout: 90000 });
  
      // Wait for the new profile name selector
      await page.waitForSelector("h1.inline.t-24.v-align-middle.break-words", { visible: true, timeout: 40000 });
  
      // Extract the full name
      const fullName = await page.evaluate(() => {
        let nameElement = document.querySelector("h1.inline.t-24.v-align-middle.break-words");
        return nameElement ? nameElement.innerText.trim() : null;
      });
  
      if (fullName) {
        loggedInUserFirstName = fullName.split(" ")[0]; // Extract first name only
        console.log(`✅ Logged-in user detected: ${loggedInUserFirstName}`);
      } else {
        console.log("❌ Failed to extract logged-in user's first name.");
      }
    } catch (error) {
      console.log(`❌ Error extracting logged-in user's name: ${error.message}`);
    }
  }
   
  
/**
 * Extracts profile information from LinkedIn search results
 */
async function extractProfiles(page) {
  console.log("🔹 Navigating to LinkedIn search...");
  await page.goto(SEARCH_QUERY, { waitUntil: "networkidle2", timeout: 60000 });

  await page.waitForSelector(".search-results-container", { timeout: 30000 });

  const profiles = await page.$$("ul[role='list'] > li");
  console.log(`🔍 Found ${profiles.length} profiles.`);

  let results = [];

  for (const profile of profiles) {
    try {
      const nameElement = await profile.$("a span[dir='ltr']");
      const name = nameElement ? await page.evaluate(el => el.innerText.trim(), nameElement) : null;
      const firstName = name ? name.split(" ")[0] : "first";

      const jobElement = await profile.$("div.t-14.t-black.t-normal");
      const jobText = jobElement ? await page.evaluate(el => el.innerText.trim(), jobElement) : null;
      const [role, company] = jobText ? jobText.split(" at ") : [jobText, null];

      const linkElement = await profile.$("a");
      const link = linkElement ? await page.evaluate(el => el.href.split("?")[0], linkElement) : null;

      if (name && link) {
        results.push({ name: firstName, currentJob: role, company: company, linkedinUrl: link });
        await sendMessage(page, profile, firstName, role, company);
      }
    } catch (error) {
      console.log(`❌ Error processing profile: ${error.message}`);
    }
  }

  return results;
}

/**
 * Loads the message template and replaces placeholders dynamically
 */
function getMessageTemplate(firstName, role, company) {
    try {
      let template = fs.readFileSync(MESSAGE_TEMPLATE_PATH, "utf8");
  
      // Replace placeholders with actual values
      let message = template
        .replace(/{firstName}/g, firstName)
        .replace(/{senderName}/g, loggedInUserFirstName)
        .replace(/{role}/g, role || "a professional")
        .replace(/{company}/g, company || "your company");
  
      // Fix extra blank lines: remove consecutive empty lines
      // **🔹 Remove only excessive blank lines while keeping intentional ones**
    message = message
    .split(/\r?\n/) // Split into lines, handling both Windows & Unix line endings
    .reduce((acc, line, index, arr) => {
      if (line.trim() !== "" || (index > 0 && arr[index - 1].trim() !== "")) {
        acc.push(line.trimEnd()); // Trim spaces at the end but keep structure
      }
      return acc;
    }, [])
    .join("\n"); // Rejoin into a cleaned-up message
  
      return message;
    } catch (error) {
      console.error("❌ Error reading message template:", error);
      return `Hello ${firstName}, I came across your profile and wanted to connect!`;
    }
  }
  
  
  

/**
 * Sends a message to a LinkedIn profile
 */
async function sendMessage(page, profile, firstName, role, company) {
  try {
    const messageButton = await profile.$('button.artdeco-button--secondary');
    if (messageButton) {
      console.log(`📩 Clicking "Message" button for ${firstName}`);

      await page.evaluate(el => el.click(), messageButton);
      await page.waitForSelector('div.msg-form__contenteditable', { visible: true });

      const messageInput = await page.$('div.msg-form__contenteditable');
      await messageInput.focus();

      const message = getMessageTemplate(firstName, role, company);

      await messageInput.type(message, { delay: 50 });

      const sendButton = await page.$('button.msg-form__send-button');
      if (sendButton) {
        console.log(`✅ Sending message to ${firstName}...`);
        await page.evaluate(el => el.click(), sendButton);
      } else {
        console.log(`⚠️ Send button not found for ${firstName}`);
      }

      const closeButton = await page.$('button[aria-label="Dismiss"]');
      if (closeButton) {
        await page.evaluate(el => el.click(), closeButton);
      }

      await page.waitForFunction(() => document.readyState === "complete");
      
    } else {
      console.log(`⚠️ No "Message" button found for ${firstName}`);
    }
  } catch (error) {
    console.log(`❌ Error messaging ${firstName}: ${error.message}`);
  }
}

/**
 * Main function to run the scraper
 */
async function scrapeLinkedInProfiles(email, password) {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  try {
    await loadCookies(page);
    await loginToLinkedIn(page, email, password);
    const profiles = await extractProfiles(page);
    console.log(`✅ Scraped ${profiles.length} profiles.`);
    return { success: true, profiles };
  } catch (error) {
    console.error("❌ Error during scraping:", error);
    return { success: false, error: error.message };
  } finally {
    await browser.close();
  }
}

module.exports = scrapeLinkedInProfiles;
