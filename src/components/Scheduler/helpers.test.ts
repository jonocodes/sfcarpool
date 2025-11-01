import { LocalDate, LocalTime } from "@js-joda/core";
import { eventToDb } from "./helpers";

describe("eventToDb", () => {
  it("converts successfully", () => {
    const event = {
      row: 2,
      start: LocalTime.of(9, 10),
      end: LocalTime.of(12, 20),
      text: "words",
      data: {
        entry: 0,
        mode: "passenger",
        likelihood: 95,
      },
    };

    const startDate = LocalDate.of(2020, 2, 20); // February 20, 2020 (0-indexed would be March, but LocalDate uses 1-indexed months)
    const gql_data = eventToDb(event, startDate, "1");

    // The function adds row (2) days to startDate, so date should be 2020-02-22
    // start and end are LocalTime.toString() which returns "HH:mm"
    expect(gql_data).toMatchObject({
      label: "words",
      active: true,
      start: "09:10",
      end: "12:20",
      likelihood: 95,
      location_id: "1",
      passenger: true,
    });

    // Check that date is a Date object
    expect(gql_data.date).toBeInstanceOf(Date);
    // The date should be 2020-02-22 (startDate + 2 days)
    expect(gql_data.date.toISOString()).toMatch(/2020-02-22/);
  });
});

// getWeekStart function is commented out in helpers.ts, so this test is disabled
// describe("getWeekStart", () => {
//   it("calculates successfully", () => {
//     // This function doesn't exist anymore
//   });
// });
