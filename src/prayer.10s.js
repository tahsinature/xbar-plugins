#!/usr/bin/env /opt/homebrew/bin/node

const moment = require("moment");

const dateToday = moment().format("DD-MM-YYYY");
const location = "London, ON";

module.exports.constants = {
  dateToday,
  location,
  prayers: ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"],
  timeNow: moment(),
};

module.exports.fetchData = async (dateToday, location) => {
  const resp = await new fetch(`https://api.aladhan.com/v1/timingsByAddress/${dateToday}?address=${location}`);
  const respJSON = await resp.json();
  const { timings, meta, date } = respJSON.data;

  return { timings, meta, date };
};

const exec = async () => {
  const { timings, meta, date } = await this.fetchData(dateToday, location);

  const display = this.formatPrayerDisplay(timings);
  console.log(`🕌 ${display}`);

  console.log("---");
  const arabicDate = `${date.hijri.weekday.en}, ${date.hijri.day} ${date.hijri.month.en} (${date.hijri.month.number}) ${date.hijri.year}`;
  console.log(`📍 ${location} - ${meta.timezone}`);
  console.log(`🕌 ${meta.method.name}`);
  console.log(`🗓️ ${arabicDate}`);

  console.log("---");
  for (const [key, value] of Object.entries(timings)) {
    const readableTime = moment(value, "HH:mm").format("hh:mm a");
    if (this.constants.prayers.includes(key)) console.log(`${key}: ${readableTime}`);
  }

  console.log("---");
  const firstThird = moment(timings["Firstthird"], "HH:mm").format("hh:mm a");
  const midnight = moment(timings["Midnight"], "HH:mm").format("hh:mm a");
  const lastThird = moment(timings["Lastthird"], "HH:mm").format("hh:mm a");

  console.log(`🌘 First Third: ${firstThird}`);
  console.log(`🌕 Midnight: ${midnight}`);
  console.log(`🌒 Last Third: ${lastThird}`);
};

function isMoreThanHalf(timeInBetween, elappsedTime) {
  return elappsedTime > timeInBetween / 2;
}

module.exports.formatPrayerDisplay = (timings) => {
  const { prayers } = this.constants;
  const nextPrayer = prayers.find((p) => moment(timings[p], "HH:mm").isAfter(this.constants.timeNow)) || prayers[0];
  const currentPrayer = prayers[prayers.indexOf(nextPrayer) ? prayers.indexOf(nextPrayer) - 1 : prayers.length - 1];

  const currentPrayerTime = moment(timings[currentPrayer], "HH:mm");
  const nextPrayerTime = moment(timings[nextPrayer], "HH:mm");

  if (nextPrayer === prayers[0]) nextPrayerTime.add(1, "day");
  const timeUntilNextPrayer = moment.duration(nextPrayerTime.diff(this.constants.timeNow));

  const timeInBetween = moment.duration(nextPrayerTime.diff(currentPrayerTime)).asMinutes();
  const elappsedTime = moment.duration(this.constants.timeNow.diff(currentPrayerTime)).asMinutes();

  /**
   * 30 minutes before the next prayer, show the time until the next prayer
   * 50% of current prayer until next prayer, show current prayer
   * then show the next prayer and until time
   */
  if (timeUntilNextPrayer.asMinutes() < 30) return `${nextPrayer} in ${timeUntilNextPrayer.humanize()}`;
  else if (isMoreThanHalf(timeInBetween, elappsedTime)) return `${nextPrayer} in ${timeUntilNextPrayer.humanize()}`;
  else return currentPrayer;
};

if (require.main === module) exec();
