const { fetchData } = require("../../src/prayer.10s");
const moment = require("moment");

test("should get proper real data", async () => {
  const location = "London, ON";
  const today = moment().format("DD-MM-YYYY");
  const resp = await fetchData(today, location);

  expect(resp).toMatchObject({
    timings: {
      Fajr: expect.any(String),
      Dhuhr: expect.any(String),
      Asr: expect.any(String),
      Maghrib: expect.any(String),
      Isha: expect.any(String),
      Firstthird: expect.any(String),
      Midnight: expect.any(String),
      Lastthird: expect.any(String),
    },
    meta: {
      timezone: expect.any(String),
      method: {
        name: expect.any(String),
      },
    },
    date: {
      hijri: {
        weekday: {
          en: expect.any(String),
        },
        day: expect.any(String),
        month: {
          en: expect.any(String),
          number: expect.any(Number),
        },
        year: expect.any(String),
      },
    },
  });
});
