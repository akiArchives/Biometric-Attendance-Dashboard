import { PersonnelAnalytics } from "@/app/dashboard/analytics/columns";

interface RawBiometricLog {
  id: number;
  employee_id: number;
  employee_name: string | null;
  log_date_time: string | null;
  log_time: string | null;
  log_date: string | null;
}

interface EmployeeStub {
  employee_id: number;
  employee_name: string | null;
}

export function processDailyLogs(
  logs: RawBiometricLog[],
  allEmployees: EmployeeStub[],
  isToday: boolean = true,
): PersonnelAnalytics[] {
  const groups: Record<number, RawBiometricLog[]> = {};

  // 1. Group today's logs by employee
  logs.forEach((log) => {
    if (!groups[log.employee_id]) groups[log.employee_id] = [];
    groups[log.employee_id].push(log);
  });

  // 2. Build a deduplicated master employee list
  const seen = new Set<number>();
  const uniqueEmployees: EmployeeStub[] = [];
  allEmployees.forEach((e) => {
    if (!seen.has(e.employee_id)) {
      seen.add(e.employee_id);
      uniqueEmployees.push(e);
    }
  });

  // 3. For employees with no logs today, inject an empty group
  uniqueEmployees.forEach((e) => {
    if (!groups[e.employee_id]) groups[e.employee_id] = [];
  });

  return Object.keys(groups).map((empIdStr) => {
    const empId = Number(empIdStr);
    const rawEmpLogs = groups[empId];
    const employeeName =
      rawEmpLogs.find((l) => l.employee_name)?.employee_name ||
      uniqueEmployees.find((e) => e.employee_id === empId)?.employee_name ||
      "Unregistered Token";

    // 2. Sort chronologically before processing
    const sortedEmpLogs = [...rawEmpLogs].sort((a, b) => {
      if (!a.log_date_time) return 1;
      if (!b.log_date_time) return -1;
      return (
        new Date(a.log_date_time).getTime() -
        new Date(b.log_date_time).getTime()
      );
    });

    // 3. Clean data: Filter out accidental double-scans within 2 minutes of each other
    const cleanedLogs: RawBiometricLog[] = [];
    sortedEmpLogs.forEach((log) => {
      if (!log.log_date_time) return;

      const currentLogTime = new Date(log.log_date_time).getTime();
      const lastSavedLog = cleanedLogs[cleanedLogs.length - 1];

      if (lastSavedLog && lastSavedLog.log_date_time) {
        const lastLogTime = new Date(lastSavedLog.log_date_time).getTime();
        const diffMinutes = (currentLogTime - lastLogTime) / (1000 * 60);

        if (diffMinutes < 2) return; // Skip this duplicate/accidental punch
      }
      cleanedLogs.push(log);
    });

    if (cleanedLogs.length === 0) {
      return {
        employee_id: empIdStr,
        employee_name: employeeName,
        first_punch: null,
        last_punch: null,
        total_hours_worked: 0,
        is_currently_in: false,
      };
    }

    // 3. Extract boundaries
    const firstPunch = cleanedLogs[0].log_date_time;
    const lastPunch =
      cleanedLogs.length > 1
        ? cleanedLogs[cleanedLogs.length - 1].log_date_time
        : null;

    // 4. Determine presence status
    // Odd number of punches = still inside, but only meaningful for today.
    // For past dates, they definitely went home.
    const isCurrentlyIn = isToday && cleanedLogs.length % 2 !== 0;

    // 5. Calculate Total Hours
    let totalHoursWorked = 0;
    if (firstPunch && lastPunch) {
      const diffMs =
        new Date(lastPunch).getTime() - new Date(firstPunch).getTime();
      let decimalHours = diffMs / (1000 * 60 * 60);

      // EDIT BREAK HOUR MINUS
      if (decimalHours > 5) {
        decimalHours -= 1;
      }

      totalHoursWorked = parseFloat(Math.max(0, decimalHours).toFixed(2));
    }

    return {
      employee_id: empId.toString(),
      employee_name: employeeName,
      first_punch: firstPunch,
      last_punch: lastPunch,
      total_hours_worked: totalHoursWorked,
      is_currently_in: isCurrentlyIn,
    };
  });
}
