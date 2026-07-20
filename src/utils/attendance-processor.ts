import {
  PersonnelAnalytics,
  AttendanceStatus,
} from "@/app/dashboard/analytics/columns";

export interface RawBiometricLog {
  id: number;
  employee_id: number;
  employee_name: string | null;
  log_date_time: string | null;
  log_time: string | null;
  log_date: string | null;
}

export interface EmployeeStub {
  employee_id: number;
  employee_name: string | null;
}

export function processDailyLogs(
  logs: RawBiometricLog[],
  allEmployees: EmployeeStub[],
  workStartTime: string = "08:00",
  gracePeriod: number = 0,
): PersonnelAnalytics[] {
  const groups: Record<number, RawBiometricLog[]> = {};

  logs.forEach((log) => {
    if (!groups[log.employee_id]) groups[log.employee_id] = [];
    groups[log.employee_id].push(log);
  });

  const seen = new Set<number>();
  const uniqueEmployees: EmployeeStub[] = [];
  allEmployees.forEach((e) => {
    if (!seen.has(e.employee_id)) {
      seen.add(e.employee_id);
      uniqueEmployees.push(e);
    }
  });

  uniqueEmployees.forEach((e) => {
    if (!groups[e.employee_id]) groups[e.employee_id] = [];
  });

  // Calculate LATE_CUTOFF by adding gracePeriod minutes to workStartTime
  let lateCutoff = workStartTime;
  try {
    const [hoursStr, minutesStr] = workStartTime.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const totalMinutes = hours * 60 + minutes + gracePeriod;
      const cutoffHours = Math.floor(totalMinutes / 60) % 24;
      const cutoffMinutes = totalMinutes % 60;
      lateCutoff = `${String(cutoffHours).padStart(2, "0")}:${String(cutoffMinutes).padStart(2, "0")}`;
    }
  } catch (e) {
    console.error("Failed to parse workStartTime or gracePeriod", e);
  }

  return Object.keys(groups).map((empIdStr) => {
    const empId = Number(empIdStr);
    const rawEmpLogs = groups[empId];
    const employeeName =
      rawEmpLogs.find((l) => l.employee_name)?.employee_name ||
      uniqueEmployees.find((e) => e.employee_id === empId)?.employee_name ||
      "Unregistered Token";

    const sortedEmpLogs = [...rawEmpLogs].sort((a, b) => {
      if (!a.log_date_time) return 1;
      if (!b.log_date_time) return -1;
      return (
        new Date(a.log_date_time).getTime() -
        new Date(b.log_date_time).getTime()
      );
    });

    const cleanedLogs: RawBiometricLog[] = [];
    sortedEmpLogs.forEach((log) => {
      if (!log.log_date_time) return;

      const currentLogTime = new Date(log.log_date_time).getTime();
      const lastSavedLog = cleanedLogs[cleanedLogs.length - 1];

      if (lastSavedLog && lastSavedLog.log_date_time) {
        const lastLogTime = new Date(lastSavedLog.log_date_time).getTime();
        const diffMinutes = (currentLogTime - lastLogTime) / (1000 * 60);

        if (diffMinutes < 2) return;
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

    const firstPunch = cleanedLogs[0].log_date_time;
    const lastPunch =
      cleanedLogs.length > 1
        ? cleanedLogs[cleanedLogs.length - 1].log_date_time
        : null;

    const punchTime = firstPunch ? firstPunch.substring(11, 16) : null;
    const status: AttendanceStatus =
      punchTime && punchTime > lateCutoff ? "late" : "present";

    let totalHoursWorked = 0;
    if (firstPunch && lastPunch) {
      const diffMs =
        new Date(lastPunch).getTime() - new Date(firstPunch).getTime();
      let decimalHours = diffMs / (1000 * 60 * 60);

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

export function processUserHistoryLogs(
  logs: RawBiometricLog[],
  employee: EmployeeStub,
  workStartTime: string = "08:00",
  gracePeriod: number = 0
): PersonnelAnalytics[] {
  const dateGroups: Record<string, RawBiometricLog[]> = {};

  logs.forEach((log) => {
    const dateStr =
      log.log_date ||
      (log.log_date_time ? log.log_date_time.substring(0, 10) : null);
    if (!dateStr) return;

    if (!dateGroups[dateStr]) {
      dateGroups[dateStr] = [];
    }
    dateGroups[dateStr].push(log);
  });

  const loggedDates = Object.keys(dateGroups);
  if (loggedDates.length === 0) return [];

  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const minDateStr = loggedDates.reduce(
    (min, cur) => (cur < min ? cur : min),
    loggedDates[0]
  );

  const allDatesToEvaluate = new Set<string>();
  Object.keys(dateGroups).forEach((d) => allDatesToEvaluate.add(d));

  const curr = new Date(minDateStr + "T12:00:00");
  const end = new Date(todayStr + "T12:00:00");

  while (curr <= end) {
    const dayOfWeek = curr.getDay();
    const y = curr.getFullYear();
    const m = String(curr.getMonth() + 1).padStart(2, "0");
    const dayVal = String(curr.getDate()).padStart(2, "0");
    const dateStr = `${y}-${m}-${dayVal}`;

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      allDatesToEvaluate.add(dateStr);
    }
    curr.setDate(curr.getDate() + 1);
  }

  const sortedDates = Array.from(allDatesToEvaluate).sort((a, b) =>
    b.localeCompare(a)
  );

  return sortedDates.map((dateStr) => {
    const dayLogs = dateGroups[dateStr];

    if (!dayLogs || dayLogs.length === 0) {
      return {
        employee_id: String(employee.employee_id),
        employee_name: employee.employee_name || "Unregistered Token",
        first_punch: null,
        last_punch: null,
        total_hours_worked: 0,
        status: "absent" as AttendanceStatus,
        date: dateStr,
      };
    }

    const [dailyRecord] = processDailyLogs(
      dayLogs,
      [employee],
      workStartTime,
      gracePeriod
    );

    return {
      ...dailyRecord,
      date: dateStr,
    };
  });
}
