// @ts-check
const puppeteer = require("puppeteer");
const $ = require("cheerio");

const origin = "https://myreservations.omnibees.com";
const href = ({ checkin, checkout }) =>
  `https://myreservations.omnibees.com/default.aspx?q=5462&version=MyReservation&sid=27649d55-4a73-4c8f-abe5-6f694733016e#/&diff=false&CheckIn=${checkin}&CheckOut=${checkout}&Code=&group_code=&loyality_card=&NRooms=1&ad=1&ch=0&ag=-`;

const selectors = require("./selectors");

async function searchRooms({ checkin, checkout }) {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setRequestInterception(true);

  // disable css and img loading for faster loading
  page.on("request", req => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // goto and wait for loader to disappear
  await page.goto(href({ checkin, checkout }));
  await page.waitForSelector("#preloader", { hidden: true });

  const html = await page.content();

  // check for errors
  const error = $(selectors.error, html);
  if (error.length) {
    await browser.close();
    throw error.first().text();
  }

  // get dat sweet rooms
  const rooms = $(selectors.eachRoom, html)
    .map((index, eachRoom) => {
      const result = {};
      if ($(selectors.soldOut, eachRoom).css("display") != "none")
        return (result.soldOut = true);

      const images = $(selectors.images, eachRoom);
      result.images = images
        .map((key, el) => origin + $(el).attr("src"))
        .toArray();

      result.name = $(selectors.name, eachRoom).text();
      result.description = $(selectors.description, eachRoom).text();
      result.price = $(selectors.price, eachRoom).text();

      return result;
    })
    .toArray();
  await browser.close();

  return rooms;
}

module.exports = {
  searchRooms
};
