import { describe, it, expect } from "vitest";
import { EmployeeAttendanceCalendar } from "./employee-attendance-calendar";
import { RawBiometricLog } from "@/utils/attendance-processor";

describe("EmployeeAttendanceCalendar", () => {
  const mockLogs: RawBiometricLog[] = [
    {
      id: 1,
      employee_id: 101,
      employee_name: "John Doe",
      log_date_time: "2026-07-06T08:50:00.000Z",
      log_time: "08:50:00",
      log_date: "2026-07-06",
    },
  ];

  it("should be exported as a React component function", () => {
    expect(EmployeeAttendanceCalendar).toBeTypeOf("function");
    expect(EmployeeAttendanceCalendar.name).toBe("EmployeeAttendanceCalendar");
  });
});
