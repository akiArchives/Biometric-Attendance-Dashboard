import { describe, it, expect } from "vitest";
import { processDailyLogs, processUserHistoryLogs } from "./attendance-processor";

describe("processDailyLogs", () => {
  const mockEmployees = [
    { employee_id: 1, employee_name: "Alice Smith" },
    { employee_id: 2, employee_name: "Bob Jones" },
    { employee_id: 3, employee_name: "Charlie Brown" },
  ];

  it("should mark unlogged employees as absent with 0 hours", () => {
    const logs: Parameters<typeof processDailyLogs>[0] = [];
    const result = processDailyLogs(logs, mockEmployees);

    expect(result).toHaveLength(3);
    const charlie = result.find((r) => r.employee_id === "3");
    expect(charlie).toEqual({
      employee_id: "3",
      employee_name: "Charlie Brown",
      first_punch: null,
      last_punch: null,
      total_hours_worked: 0,
      status: "absent",
    });
  });

  it("should filter out duplicate scans within 2 minutes of the previous scan", () => {
    const logs = [
      {
        id: 1,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-22",
      },
      {
        id: 2,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T08:01:30.000Z",
        log_time: "08:01:30",
        log_date: "2026-06-22",
      },
      {
        id: 3,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T17:00:00.000Z",
        log_time: "17:00:00",
        log_date: "2026-06-22",
      },
    ];

    const result = processDailyLogs(logs, mockEmployees);
    const alice = result.find((r) => r.employee_id === "1");

    expect(alice).toBeDefined();
    expect(alice?.first_punch).toBe("2026-06-22T08:00:00.000Z");
    expect(alice?.last_punch).toBe("2026-06-22T17:00:00.000Z");
    // Diff is 9 hours. Since hours > 5, 1 hour break is deducted.
    // 9 - 1 = 8 hours
    expect(alice?.total_hours_worked).toBe(8);
  });

  it("should calculate correct status: late if after 08:00, present if at or before 08:00", () => {
    const logs = [
      {
        id: 1,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-22",
      },
      {
        id: 2,
        employee_id: 2,
        employee_name: "Bob Jones",
        log_date_time: "2026-06-22T08:01:00.000Z",
        log_time: "08:01:00",
        log_date: "2026-06-22",
      },
    ];

    const result = processDailyLogs(logs, mockEmployees);
    const alice = result.find((r) => r.employee_id === "1");
    const bob = result.find((r) => r.employee_id === "2");

    expect(alice?.status).toBe("present");
    expect(bob?.status).toBe("late");
  });

  it("should sort raw logs chronologically by date-time before processing", () => {
    const logs = [
      {
        id: 1,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T17:00:00.000Z",
        log_time: "17:00:00",
        log_date: "2026-06-22",
      },
      {
        id: 2,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-22",
      },
    ];

    const result = processDailyLogs(logs, mockEmployees);
    const alice = result.find((r) => r.employee_id === "1");

    expect(alice?.first_punch).toBe("2026-06-22T08:00:00.000Z");
    expect(alice?.last_punch).toBe("2026-06-22T17:00:00.000Z");
  });

  it("should deduct 1 hour break when total hours worked is greater than 5 hours", () => {
    const logs1 = [
      {
        id: 1,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-22",
      },
      {
        id: 2,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T14:00:00.000Z",
        log_time: "14:00:00",
        log_date: "2026-06-22",
      },
    ];

    const logs2 = [
      {
        id: 3,
        employee_id: 2,
        employee_name: "Bob Jones",
        log_date_time: "2026-06-22T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-22",
      },
      {
        id: 4,
        employee_id: 2,
        employee_name: "Bob Jones",
        log_date_time: "2026-06-22T13:00:00.000Z",
        log_time: "13:00:00",
        log_date: "2026-06-22",
      },
    ];

    const result1 = processDailyLogs(logs1, mockEmployees);
    const result2 = processDailyLogs(logs2, mockEmployees);

    const alice = result1.find((r) => r.employee_id === "1");
    const bob = result2.find((r) => r.employee_id === "2");

    expect(alice?.total_hours_worked).toBe(5);
    expect(bob?.total_hours_worked).toBe(5);
  });

  it("should handle employees with a single punch by setting last_punch to null and 0 hours worked", () => {
    const logs = [
      {
        id: 1,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-22",
      },
    ];

    const result = processDailyLogs(logs, mockEmployees);
    const alice = result.find((r) => r.employee_id === "1");

    expect(alice?.first_punch).toBe("2026-06-22T08:00:00.000Z");
    expect(alice?.last_punch).toBeNull();
    expect(alice?.total_hours_worked).toBe(0);
  });

  it("should calculate correct status based on workStartTime and gracePeriod parameters", () => {
    const logs = [
      {
        id: 1,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T09:10:00.000Z",
        log_time: "09:10:00",
        log_date: "2026-06-22",
      },
      {
        id: 2,
        employee_id: 2,
        employee_name: "Bob Jones",
        log_date_time: "2026-06-22T09:20:00.000Z",
        log_time: "09:20:00",
        log_date: "2026-06-22",
      },
    ];

    // Under workStartTime 09:00 and gracePeriod 15 (cutoff 09:15)
    const result = processDailyLogs(logs, mockEmployees, "09:00", 15);
    const alice = result.find((r) => r.employee_id === "1");
    const bob = result.find((r) => r.employee_id === "2");

    expect(alice?.status).toBe("present"); // 09:10 <= 09:15
    expect(bob?.status).toBe("late");    // 09:20 > 09:15
  });
});

describe("processUserHistoryLogs", () => {
  const employee = { employee_id: 1, employee_name: "Alice Smith" };

  it("should return an empty array if logs is empty", () => {
    const result = processUserHistoryLogs([], employee);
    expect(result).toEqual([]);
  });

  it("should group logs by date, sort dates descending, and attach date string to each PersonnelAnalytics record", () => {
    const logs = [
      {
        id: 1,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-21T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-21",
      },
      {
        id: 2,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-21T17:00:00.000Z",
        log_time: "17:00:00",
        log_date: "2026-06-21",
      },
      {
        id: 3,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-23T08:30:00.000Z",
        log_time: "08:30:00",
        log_date: "2026-06-23",
      },
      {
        id: 4,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-22T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-22",
      },
    ];

    const result = processUserHistoryLogs(logs, employee, "08:00", 15);

    // Verify descending sort order across all generated dates
    const dates = result.map((r) => r.date);
    const expectedSorted = [...dates].sort((a, b) => b.localeCompare(a));
    expect(dates).toEqual(expectedSorted);

    const rec23 = result.find((r) => r.date === "2026-06-23");
    const rec22 = result.find((r) => r.date === "2026-06-22");
    const rec21 = result.find((r) => r.date === "2026-06-21");

    expect(rec23).toBeDefined();
    expect(rec22).toBeDefined();
    expect(rec21).toBeDefined();

    // Check 2026-06-23 record (log at 08:30 with workStartTime 08:00, gracePeriod 15 => late)
    expect(rec23?.employee_id).toBe("1");
    expect(rec23?.status).toBe("late");

    // Check 2026-06-21 record (hours logged)
    expect(rec21?.total_hours_worked).toBe(8);
  });

  it("should generate absent records for missing weekdays and exclude weekends", () => {
    const mockEmployee = { employee_id: 1, employee_name: "Alice Smith" };
    const logs = [
      {
        id: 1,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-19T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-19",
      },
      {
        id: 2,
        employee_id: 1,
        employee_name: "Alice Smith",
        log_date_time: "2026-06-23T08:00:00.000Z",
        log_time: "08:00:00",
        log_date: "2026-06-23",
      },
    ];

    const result = processUserHistoryLogs(logs, mockEmployee, "08:00", 0);

    const dates = result.map((r) => r.date);
    expect(dates).toContain("2026-06-19");
    expect(dates).toContain("2026-06-22");
    expect(dates).toContain("2026-06-23");
    expect(dates).not.toContain("2026-06-20");
    expect(dates).not.toContain("2026-06-21");

    const mon = result.find((r) => r.date === "2026-06-22");
    expect(mon?.status).toBe("absent");
  });
});

