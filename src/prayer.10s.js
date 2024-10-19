#!/usr/bin/env /opt/homebrew/bin/node

const moment = require("moment");

const exec = async () => {
  const dateToday = moment().format("DD-MM-YYYY");
  const location = "London, ON";
  const resp = await new fetch(`https://api.aladhan.com/v1/timingsByAddress/${dateToday}?address=${location}`);
  const respJSON = await resp.json();
  const { timings, meta, date } = respJSON.data;

  const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const timeNow = moment();
  const nextPrayer = prayers.find((p) => moment(timings[p], "HH:mm").isAfter(timeNow));
  const currentPrayer = prayers[prayers.indexOf(nextPrayer) ? prayers.indexOf(nextPrayer) - 1 : prayers.length - 1];

  const currentPrayerTime = moment(timings[currentPrayer], "HH:mm");
  const nextPrayerTime = moment(timings[nextPrayer], "HH:mm");
  const timeUntilNextPrayer = moment.duration(nextPrayerTime.diff(timeNow));

  const timeInBetween = moment.duration(nextPrayerTime.diff(currentPrayerTime)).asMinutes();
  const elappsedTime = moment.duration(timeNow.diff(currentPrayerTime)).asMinutes();

  /**
   * 30 minutes before the next prayer, show the time until the next prayer
   * 50% of current prayer until next prayer, show current prayer
   * then show the next prayer and until time
   */
  if (timeUntilNextPrayer.asMinutes() < 30) console.log(`🕌 ${nextPrayer} in ${timeUntilNextPrayer.humanize()}`);
  else if (isMoreThanHalf(timeInBetween, elappsedTime)) console.log(`🕌 ${nextPrayer} in ${timeUntilNextPrayer.humanize()}`);
  else console.log(`🕌 ${currentPrayer}`);

  console.log("---");
  const arabicDate = `${date.hijri.weekday.en}, ${date.hijri.day} ${date.hijri.month.en} (${date.hijri.month.number}) ${date.hijri.year}`;
  console.log(`📍 ${location} - ${meta.timezone}`);
  console.log(`🕌 ${meta.method.name}`);
  console.log(`🗓️ ${arabicDate}`);

  console.log("---");
  for (const [key, value] of Object.entries(timings)) {
    const readableTime = moment(value, "HH:mm").format("hh:mm a");
    if (prayers.includes(key)) console.log(`${key}: ${readableTime}`);
  }

  console.log("---");

  // Firstthird - Midnight - Lastthird
  const firstThird = moment(timings["Midnight"], "HH:mm").format("hh:mm a");
  const midnight = moment(timings["Midnight"], "HH:mm").format("hh:mm a");
  const lastThird = moment(timings["Lastthird"], "HH:mm").format("hh:mm a");

  // •	🌑  New Moon:  Signifies a fresh start or a period of introspection.
  // •	  Waxing Crescent Moon:  Represents growth and potential.
  // •	  Full Moon:  Symbolizes completion, illumination, and emotional intensity.
  // •	🌘  Waning Gibbous Moon:  Indicates a time of release and letting go.

  console.log(`🌘 First Third: ${firstThird}`);
  console.log(`🌕 Midnight: ${midnight}`);
  console.log(`🌒 Last Third: ${lastThird}`);
};

function isMoreThanHalf(timeInBetween, elappsedTime) {
  return elappsedTime > timeInBetween / 2;
}

exec();
