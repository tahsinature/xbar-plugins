const vitalAppCheck = require("../../src/vital-app-check.1s");

const getRunningAppsSpy = jest.spyOn(vitalAppCheck, "getRunningApps");
const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(jest.fn());

test("should be happy when no required apps", () => {
  vitalAppCheck.required = [];
  getRunningAppsSpy.mockReturnValue(["A", "B"]);
  vitalAppCheck.exec();

  expect(consoleLogSpy).toHaveBeenCalledWith(vitalAppCheck.lights.grey);
});

test("should be happy when all required apps are running", () => {
  vitalAppCheck.required = ["A", "B"];
  getRunningAppsSpy.mockReturnValue(["A", "B"]);
  vitalAppCheck.exec();

  expect(consoleLogSpy).toHaveBeenCalledWith(vitalAppCheck.lights.grey);
});

test("should be sad when some required apps are missing", () => {
  vitalAppCheck.required = ["A", "B", "C"];
  getRunningAppsSpy.mockReturnValue(["A"]);
  vitalAppCheck.exec();

  expect(consoleLogSpy).toHaveBeenCalledWith(`2 ${vitalAppCheck.lights.red}`);
  expect(consoleLogSpy).toHaveBeenCalledWith("B");
});

test("should be sad when all required apps are missing", () => {
  vitalAppCheck.required = ["A", "B", "C"];
  getRunningAppsSpy.mockReturnValue([]);
  vitalAppCheck.exec();

  expect(consoleLogSpy).toHaveBeenCalledWith(`3 ${vitalAppCheck.lights.red}`);
  expect(consoleLogSpy).toHaveBeenCalledWith("A");
  expect(consoleLogSpy).toHaveBeenCalledWith("B");
  expect(consoleLogSpy).toHaveBeenCalledWith("C");
});
