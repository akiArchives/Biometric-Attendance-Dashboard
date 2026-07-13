import { describe, it, expect } from "vitest";
import { processDailyLogs } from "./attendance-processor";

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
