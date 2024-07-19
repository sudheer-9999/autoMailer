import puppeteer from "puppeteer";
import { scrollPageToBottom } from "puppeteer-autoscroll-down";
import { db } from "~/server/db";

export const runScripts = async () => {
  // Launch the browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"],
    executablePath: "/usr/bin/google-chrome-stable",
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
    await page.goto(url);

    async function scrollAndWait() {
      let isLoadingAvailable = true;
      let lastHeight = 0;

      let count = 0;

      while (isLoadingAvailable) {
        await scrollPageToBottom(page, { size: 5000 });

        await new Promise((resolve) => setTimeout(resolve, 10000));

        let currentHeight = await page.evaluate(
          () => document.body.scrollHeight,
        );

        if (currentHeight === lastHeight) {
          isLoadingAvailable = false;
          console.log("No new content loaded, stopping scroll.");
        } else {
          lastHeight = currentHeight;
          count += 1;
          console.log("🚀 ~ scrollAndWait ~ count:", count);
        }
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
