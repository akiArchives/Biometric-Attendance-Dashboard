// utils/attendance-processor.ts

import { PersonnelAnalytics } from "@/app/dashboard/analytics/columns"; // Adjust path as needed

interface RawBiometricLog {
  id: number;
  employee_id: number;
  employee_name: string | null;
  log_date_time: string | null;
  log_time: string | null;
  log_date: string | null;
}

export function processBiometricLogs(
  logs: RawBiometricLog[],
): PersonnelAnalytics[] {
  const groups: Record<number, RawBiometricLog[]> = {};

  logs.forEach((log) => {
    if (!groups[log.employee_id]) {
      groups[log.employee_id] = [];
    }
    groups[log.employee_id].push(log);
  });

  return Object.keys(groups).map((empIdStr) => {
    const empId = Number(empIdStr);
    const empLogs = groups[empId];

    const employeeName =
      empLogs.find((l) => l.employee_name)?.employee_name ||
      "Unregistered Token";

    const sortedLogs = empLogs
      .filter((l) => l.log_date_time)
      .sort(
        (a, b) =>
          new Date(a.log_date_time!).getTime() -
          new Date(b.log_date_time!).getTime(),
      );

    const firstPunch =
      sortedLogs.length > 0 ? sortedLogs[0].log_date_time : null;
    const lastPunch =
      sortedLogs.length > 1
        ? sortedLogs[sortedLogs.length - 1].log_date_time
        : null;

    let totalHoursWorked = 0;
    if (firstPunch && lastPunch) {
      const diffMs =
        new Date(lastPunch).getTime() - new Date(firstPunch).getTime();
      totalHoursWorked = diffMs / (1000 * 60 * 60); // Convert milliseconds to decimal hours
    }

    const isCurrentlyIn = empLogs.length % 2 !== 0;

    return {
      employee_id: empId.toString(),
      employee_name: employeeName,
      first_punch: firstPunch,
      last_punch: lastPunch,
      total_hours_worked: parseFloat(totalHoursWorked.toFixed(2)),
      is_currently_in: isCurrentlyIn,
    };
  });
}
