import {
  PersonnelAnalytics,
  AttendanceStatus,
} from "@/app/dashboard/analytics/columns";

export type EmployeeSummary = {
  employee_id: string;
  employee_name: string;
  last_log_date: string | null;
  total_hours_logged: number;
};

// EDIT LATE_CUTOFF
const LATE_CUTOFF = "08:00";

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

export function processEmployeeSummaries(
  logs: RawBiometricLog[],
): EmployeeSummary[] {
  const byEmployee: Record<number, RawBiometricLog[]> = {};

  logs.forEach((log) => {
    if (!byEmployee[log.employee_id]) byEmployee[log.employee_id] = [];
    byEmployee[log.employee_id].push(log);
  });

  return Object.keys(byEmployee).map((empIdStr) => {
    const empId = Number(empIdStr);
    const empLogs = byEmployee[empId];

    const employeeName =
      empLogs.find((l) => l.employee_name)?.employee_name ??
      "Unregistered Token";

    const lastLogDate = empLogs.reduce<string | null>((max, log) => {
      if (!log.log_date) return max;
      return !max || log.log_date > max ? log.log_date : max;
    }, null);

    // Group by date to compute per-day hours
    const byDate: Record<string, RawBiometricLog[]> = {};
    empLogs.forEach((log) => {
      if (!log.log_date) return;
      if (!byDate[log.log_date]) byDate[log.log_date] = [];
      byDate[log.log_date].push(log);
    });

    let totalHours = 0;
    Object.values(byDate).forEach((dayLogs) => {
      const sorted = [...dayLogs].sort((a, b) => {
        if (!a.log_date_time) return 1;
        if (!b.log_date_time) return -1;
        return (
          new Date(a.log_date_time).getTime() -
          new Date(b.log_date_time).getTime()
        );
      });

      const cleaned: RawBiometricLog[] = [];
      sorted.forEach((log) => {
        if (!log.log_date_time) return;
        const currentTime = new Date(log.log_date_time).getTime();
        const last = cleaned[cleaned.length - 1];
        if (last?.log_date_time) {
          const diffMin =
            (currentTime - new Date(last.log_date_time).getTime()) / 60_000;
          if (diffMin < 2) return;
        }
        cleaned.push(log);
      });

      if (cleaned.length < 2) return;

      const first = cleaned[0].log_date_time!;
      const last = cleaned[cleaned.length - 1].log_date_time!;
      let hours =
        (new Date(last).getTime() - new Date(first).getTime()) / 3_600_000;
      if (hours > 5) hours -= 1;
      totalHours += Math.max(0, hours);
    });

    return {
      employee_id: empIdStr,
      employee_name: employeeName,
      last_log_date: lastLogDate,
      total_hours_logged: parseFloat(totalHours.toFixed(2)),
    };
  });
}

export function processDailyLogs(
  logs: RawBiometricLog[],
  allEmployees: EmployeeStub[],
  isToday: boolean = true,
): PersonnelAnalytics[] {
  const groups: Record<number, RawBiometricLog[]> = {};

  logs.forEach((log) => {
    if (!groups[log.employee_id]) groups[log.employee_id] = [];
    groups[log.employee_id].push(log);
  });

  // DUPLICATE LIST
  const seen = new Set<number>();
  const uniqueEmployees: EmployeeStub[] = [];
  allEmployees.forEach((e) => {
    if (!seen.has(e.employee_id)) {
      seen.add(e.employee_id);
      uniqueEmployees.push(e);
    }
  });

  // ADD EMPTY GROUPS FOR UNLOGGED EMPLOYEES
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

    // SORT LOGS
    const sortedEmpLogs = [...rawEmpLogs].sort((a, b) => {
      if (!a.log_date_time) return 1;
      if (!b.log_date_time) return -1;
      return (
        new Date(a.log_date_time).getTime() -
        new Date(b.log_date_time).getTime()
      );
    });

    // CLEAN DATA: FILTER OUT ACCIDENTAL DOUBLE-SCANS WITHIN 2 MINUTES OF EACH OTHER EDIT WHEN NEEDED
    const cleanedLogs: RawBiometricLog[] = [];
    sortedEmpLogs.forEach((log) => {
      if (!log.log_date_time) return;

      const currentLogTime = new Date(log.log_date_time).getTime();
      const lastSavedLog = cleanedLogs[cleanedLogs.length - 1];

      if (lastSavedLog && lastSavedLog.log_date_time) {
        const lastLogTime = new Date(lastSavedLog.log_date_time).getTime();
        const diffMinutes = (currentLogTime - lastLogTime) / (1000 * 60);

        if (diffMinutes < 2) return; // Skip this duplicate punch
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
        status: "absent" as AttendanceStatus,
      };
    }

    // EXTRACT BOUNDARIES
    const firstPunch = cleanedLogs[0].log_date_time;
    const lastPunch =
      cleanedLogs.length > 1
        ? cleanedLogs[cleanedLogs.length - 1].log_date_time
        : null;

    // DETERMINE STATUS
    const punchTime = firstPunch ? firstPunch.substring(11, 16) : null;
    const status: AttendanceStatus =
      punchTime && punchTime > LATE_CUTOFF ? "late" : "present";

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
      status,
    };
  });
}
