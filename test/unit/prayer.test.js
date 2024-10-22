const { formatPrayerDisplay, constants } = require("../../src/prayer.10s");
const moment = require("moment");

const timings = {
  A: "06:26",
  B: "20:30",
};

test("it should properly display last & first prayer of the day ", () => {
  constants.prayers = ["A", "B"];
  constants.timeNow = moment().set({ hour: 19, minute: 30 });

  expect(formatPrayerDisplay(timings)).toBe("B in an hour");

  constants.timeNow = moment().set({ hour: 23 });
  expect(formatPrayerDisplay(timings)).toBe("B");

  constants.timeNow = moment().set({ hour: 4, minute: 30 }).add(1, "d");
  expect(formatPrayerDisplay(timings)).toBe("A in 2 hours");
});
