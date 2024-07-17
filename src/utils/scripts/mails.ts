import puppeteer from "puppeteer";
import { db } from "~/server/db";

export const runScripts = async () => {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null, // Disable default viewport settings
    args: [
      "--start-maximized", // Start browser maximized
      "--disable-notifications", // Disable notifications
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  );

  await page.goto("https://www.linkedin.com/login");

  await page.type("#username", process.env.LINKEDIN_USERNAME!);
  await page.type("#password", process.env.LINKEDIN_PASSWORD!);
  await page.click('[aria-label="Sign in"]');

  await page.waitForNavigation();

  // Function to execute scraping for a given URL
  const scrapeLinkedIn = async (url: string, key: string) => {
    // Navigate to the provided LinkedIn search results page
    await page.goto(url);

    // Scroll to load more content
    async function scrollAndWait() {
      let previousHeight = 0;
      while (true) {
        previousHeight = (await page.evaluate(
          "document.body.scrollHeight",
        )) as number;
        await page.locator("div").scroll({
          scrollLeft: 10,
          scrollTop: previousHeight, // Scroll to the current height to load more content
        });

        // Wait for 10 seconds after each scroll
        await timeout(10000);

        const newHeight = await page.evaluate("document.body.scrollHeight");
        if (newHeight === previousHeight) break;
      }
    }

    // Utility function for timeout
    function timeout(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Execute the scroll and wait function
    await scrollAndWait();

    // Extract email addresses
    const emails = await page.evaluate(() => {
      const emailElements = document.querySelectorAll("*"); // Select all elements on the page
      const emailArray: string[] = [];

      emailElements.forEach((element) => {
        if (
          element.tagName === "A" &&
          element.getAttribute("href")?.startsWith("mailto:")
        ) {
          // Extract email from mailto links
          const email = element.getAttribute("href")?.replace("mailto:", "");
          if (email) {
            emailArray.push(email);
          }
        } else {
          // Extract emails from text content
          const text = element.textContent || "";
          const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
          const matches = text.match(regex);
          if (matches) {
            emailArray.push(...matches);
          }
        }
      });

      return emailArray;
    });
    addEmailsToDatabase(emails, key);

    console.log(`Extracted Emails for ${key}:`, emails);
  };

  // Iterate over the obj and scrape each URL
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const url = obj[key];
      if (url) await scrapeLinkedIn(url, key);
    }
  }

  // Close the browser
  await browser.close();
};

interface LinkedInUrls {
  [key: string]: string;
}

const obj: LinkedInUrls = {
  reactjs:
    "https://www.linkedin.com/search/results/content/?datePosted=%22past-24h%22&keywords=reactjs%20hiring&origin=FACETED_SEARCH&sid=XP6&sortBy=%22date_posted%22",
  reactNative:
    "https://www.linkedin.com/search/results/content/?datePosted=%22past-24h%22&keywords=reactnative%20hiring&origin=FACETED_SEARCH&searchId=a110848e-b605-40cf-b2f6-74e774a08829&sid=IRm&sortBy=%22date_posted%22",
};
async function addEmailsToDatabase(emails: string[], title: string) {
  for (const email of emails) {
    const existingJobPosting = await db.jobPosting.findFirst({
      where: {
        hrMail: email,
        title: title,
      },
    });

    if (!existingJobPosting) {
      await db.jobPosting.create({
        data: {
          hrMail: email,
          title: title,
        },
      });
    }
  }
}
