// data.ts

export type PersonnelAnalytics = {
  employee_id: string;
  employee_name: string;
  department_name?: string;
  first_punch: string | null; // ISO timestamp string
  last_punch: string | null; // ISO timestamp string
  total_hours_worked: number; // Decimal hours format
  is_currently_in: boolean;
};

export const analyticsData: PersonnelAnalytics[] = [
  {
    employee_id: "EMP-2026-001",
    employee_name: "John Doe",
    department_name: "IT",
    first_punch: "2026-06-16T08:00:00.000Z",
    last_punch: "2026-06-16T17:00:00.000Z",
    total_hours_worked: 9.0,
    is_currently_in: false, // Clocked out for the day
  },
  {
    employee_id: "EMP-2026-042",
    employee_name: "Jane Smith",
    department_name: "Marketing",
    first_punch: "2026-06-16T07:45:00.000Z",
    last_punch: "2026-06-16T13:15:00.000Z", // Currently logged data
    total_hours_worked: 5.5,
    is_currently_in: true, // Still in the building
  },
  {
    employee_id: "EMP-2026-089",
    employee_name: "Alex Rivera",
    department_name: "Human Resources",
    first_punch: "2026-06-16T09:15:00.000Z", // Came in late
    last_punch: "2026-06-16T13:45:00.000Z",
    total_hours_worked: 4.5,
    is_currently_in: true,
  },
  {
    employee_id: "EMP-2026-112",
    employee_name: "Michael Chang",
    department_name: "Engineering",
    first_punch: "2026-06-16T08:30:00.000Z",
    last_punch: "2026-06-16T17:15:00.000Z",
    total_hours_worked: 8.75, // Parses to 8h 45m in your columns formatter
    is_currently_in: false,
  },
  {
    employee_id: "EMP-2026-015",
    employee_name: "Sarah Jenkins",
    department_name: "Marketing",
    first_punch: null, // Absent or hasn't clocked in today
    last_punch: null,
    total_hours_worked: 0.0,
    is_currently_in: false,
  },
  {
    employee_id: "EMP-2026-204",
    employee_name: "David Vance",
    department_name: "IT Support",
    first_punch: "2026-06-16T06:00:00.000Z", // Early shift
    last_punch: "2026-06-16T14:30:00.000Z",
    total_hours_worked: 8.5, // Parses to 8h 30m
    is_currently_in: false,
  },
];
