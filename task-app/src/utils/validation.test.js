import {
  clampProgress,
  safeDateLabel,
  validateAge,
  validateDateRange,
  validateImageFile,
} from "./validation";

describe("validation helpers", () => {
  test("rejects text in numeric age field", () => {
    expect(() => validateAge("abc")).toThrow("Age must be a valid number");
  });

  test("clamps progress inside 0 to 100", () => {
    expect(clampProgress(120)).toBe(100);
    expect(clampProgress(-5)).toBe(0);
  });

  test("rejects non-numeric progress", () => {
    expect(() => clampProgress("done")).toThrow("Progress must be a number");
  });

  test("rejects end date before start date", () => {
    expect(() => validateDateRange("2026-05-31T10:00", "2026-05-30T10:00"))
      .toThrow("End date must be after start date.");
  });

  test("formats invalid dates as fallback", () => {
    expect(safeDateLabel("not-a-date", "-")).toBe("-");
  });

  test("rejects images larger than 10MB", () => {
    const file = { type: "image/png", size: 11 * 1024 * 1024 };
    expect(() => validateImageFile(file)).toThrow("Image must be 10MB or smaller.");
  });
});
