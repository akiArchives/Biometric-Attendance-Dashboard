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

export interface EmployeeMonthlyStats {
  onTimeRatePercent: number;
  loggedHoursThisWeek: number;
  lateCount: number;
  avgLateMins: number;
  presentDaysCount: number;
  elapsedWorkdaysCount: number;
  todayStatus: {
    state: "checked_in" | "checked_out" | "not_scanned";
    firstPunch: string | null;
    lastPunch: string | null;
  };
}

export interface CalendarDayStatus {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  status: "on_time" | "late" | "absent" | "weekend" | "future";
  firstPunch: string | null;
  lastPunch: string | null;
  totalHours: number;
  lateMins: number;
  logs: RawBiometricLog[];
}

function getCutoffTimeStr(workStartTime: string, gracePeriod: number): string {
  try {
    const [hoursStr, minutesStr] = workStartTime.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    if (!isNaN(hours) && !isNaN(minutes)) {
      const totalMinutes = hours * 60 + minutes + gracePeriod;
      const cutoffHours = Math.floor(totalMinutes / 60) % 24;
      const cutoffMinutes = totalMinutes % 60;
      return `${String(cutoffHours).padStart(2, "0")}:${String(cutoffMinutes).padStart(2, "0")}`;
    }
  } catch (e) {
    console.error("Failed to parse workStartTime", e);
  }
  return workStartTime;
}

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function processSingleDayEmpLogs(
  dayLogs: RawBiometricLog[],
  workStartTime: string,
  gracePeriod: number
): {
  firstPunch: string | null;
  lastPunch: string | null;
  totalHours: number;
  status: "on_time" | "late" | "absent";
  lateMins: number;
  cleanedLogs: RawBiometricLog[];
} {
  const sortedEmpLogs = [...dayLogs].sort((a, b) => {
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
      firstPunch: null,
      lastPunch: null,
      totalHours: 0,
      status: "absent",
      lateMins: 0,
      cleanedLogs: [],
    };
  }

  const firstPunch = cleanedLogs[0].log_date_time;
  const lastPunch =
    cleanedLogs.length > 1
      ? cleanedLogs[cleanedLogs.length - 1].log_date_time
      : null;

  const punchTime = firstPunch ? firstPunch.substring(11, 16) : null;
  const lateCutoff = getCutoffTimeStr(workStartTime, gracePeriod);

  let status: "on_time" | "late" = "on_time";
  let lateMins = 0;

  if (punchTime && punchTime > lateCutoff) {
    status = "late";
    const punchMins = timeToMinutes(punchTime);
    const startMins = timeToMinutes(workStartTime);
    lateMins = Math.max(0, punchMins - startMins);
  }

  let totalHours = 0;
  if (firstPunch && lastPunch) {
    const diffMs =
      new Date(lastPunch).getTime() - new Date(firstPunch).getTime();
    let decimalHours = diffMs / (1000 * 60 * 60);

    if (decimalHours > 5) {
      decimalHours -= 1;
    }

    totalHours = parseFloat(Math.max(0, decimalHours).toFixed(2));
  }

  return {
    firstPunch,
    lastPunch,
    totalHours,
    status,
    lateMins,
    cleanedLogs,
  };
}

export function calculateEmployeePersonalStats(
  logs: RawBiometricLog[],
  empId: number,
  workStartTime: string = "08:00",
  gracePeriod: number = 0,
  monthDates: string[],
  todayStr: string
): EmployeeMonthlyStats {
  const empLogs = logs.filter((l) => l.employee_id === empId);

  const logsByDate: Record<string, RawBiometricLog[]> = {};
  empLogs.forEach((l) => {
    const d =
      l.log_date ||
      (l.log_date_time ? l.log_date_time.substring(0, 10) : null);
    if (d) {
      if (!logsByDate[d]) logsByDate[d] = [];
      logsByDate[d].push(l);
    }
  });

  let elapsedWorkdaysCount = 0;
  let presentDaysCount = 0;
  let lateCount = 0;
  let totalLateMins = 0;

  monthDates.forEach((dateStr) => {
    if (dateStr > todayStr) return;
    const dateObj = new Date(dateStr + "T12:00:00Z");
    const dayOfWeek = dateObj.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    if (!isWeekend) {
      elapsedWorkdaysCount++;
      const dayLogs = logsByDate[dateStr] || [];
      if (dayLogs.length > 0) {
        const res = processSingleDayEmpLogs(dayLogs, workStartTime, gracePeriod);
        presentDaysCount++;
        if (res.status === "late") {
          lateCount++;
          totalLateMins += res.lateMins;
        }
      }
    }
  });

  const onTimeCount = presentDaysCount - lateCount;
  const onTimeRatePercent =
    elapsedWorkdaysCount > 0
      ? Math.round((onTimeCount / elapsedWorkdaysCount) * 100)
      : 100;

  const avgLateMins =
    lateCount > 0 ? Math.round(totalLateMins / lateCount) : 0;

  const todayDateObj = new Date(todayStr + "T12:00:00Z");
  const dayOfWeek = todayDateObj.getUTCDay();
  const mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const mondayObj = new Date(todayDateObj);
  mondayObj.setUTCDate(todayDateObj.getUTCDate() + mondayDiff);

  const sundayObj = new Date(mondayObj);
  sundayObj.setUTCDate(mondayObj.getUTCDate() + 6);

  const mondayStr = mondayObj.toISOString().substring(0, 10);
  const sundayStr = sundayObj.toISOString().substring(0, 10);

  let loggedHoursThisWeek = 0;
  Object.keys(logsByDate).forEach((dStr) => {
    if (dStr >= mondayStr && dStr <= sundayStr) {
      const res = processSingleDayEmpLogs(
        logsByDate[dStr],
        workStartTime,
        gracePeriod
      );
      loggedHoursThisWeek += res.totalHours;
    }
  });
  loggedHoursThisWeek = parseFloat(loggedHoursThisWeek.toFixed(2));

  const todayLogs = logsByDate[todayStr] || [];
  let todayStatus: EmployeeMonthlyStats["todayStatus"] = {
    state: "not_scanned",
    firstPunch: null,
    lastPunch: null,
  };

  if (todayLogs.length > 0) {
    const res = processSingleDayEmpLogs(todayLogs, workStartTime, gracePeriod);
    if (res.cleanedLogs.length === 1) {
      todayStatus = {
        state: "checked_in",
        firstPunch: res.firstPunch,
        lastPunch: null,
      };
    } else if (res.cleanedLogs.length >= 2) {
      todayStatus = {
        state: "checked_out",
        firstPunch: res.firstPunch,
        lastPunch: res.lastPunch,
      };
    }
  }

  return {
    onTimeRatePercent,
    loggedHoursThisWeek,
    lateCount,
    avgLateMins,
    presentDaysCount,
    elapsedWorkdaysCount,
    todayStatus,
  };
}

export function generateMonthlyCalendarMatrix(
  logs: RawBiometricLog[],
  empId: number,
  year: number,
  month: number,
  workStartTime: string = "08:00",
  gracePeriod: number = 0,
  todayStr: string
): CalendarDayStatus[] {
  const empLogs = logs.filter((l) => l.employee_id === empId);

  const logsByDate: Record<string, RawBiometricLog[]> = {};
  empLogs.forEach((l) => {
    const d =
      l.log_date ||
      (l.log_date_time ? l.log_date_time.substring(0, 10) : null);
    if (d) {
      if (!logsByDate[d]) logsByDate[d] = [];
      logsByDate[d].push(l);
    }
  });

  const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0));
  const dayOfWeek = firstDayOfMonth.getUTCDay(); // 0 is Sun, 1 is Mon...
  const leadingPaddingDays = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastDayOfMonth = new Date(Date.UTC(year, month, 0, 12, 0, 0));
  const daysInMonth = lastDayOfMonth.getUTCDate();

  const startDate = new Date(firstDayOfMonth);
  startDate.setUTCDate(firstDayOfMonth.getUTCDate() - leadingPaddingDays);

  const totalDaysSoFar = leadingPaddingDays + daysInMonth;
  const totalCells = Math.ceil(totalDaysSoFar / 7) * 7;

  const matrix: CalendarDayStatus[] = [];

  for (let i = 0; i < totalCells; i++) {
    const cellDate = new Date(startDate);
    cellDate.setUTCDate(startDate.getUTCDate() + i);

    const yyyy = cellDate.getUTCFullYear();
    const mm = String(cellDate.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(cellDate.getUTCDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const dayNumber = cellDate.getUTCDate();
    const isCurrentMonth = cellDate.getUTCMonth() === month - 1;
    const dow = cellDate.getUTCDay();
    const isWeekend = dow === 0 || dow === 6;

    const dayLogs = logsByDate[dateStr] || [];
    const res = processSingleDayEmpLogs(dayLogs, workStartTime, gracePeriod);

    let status: CalendarDayStatus["status"];
    if (isWeekend) {
      status = "weekend";
    } else if (dateStr > todayStr) {
      status = "future";
    } else if (dayLogs.length === 0) {
      status = "absent";
    } else {
      status = res.status === "late" ? "late" : "on_time";
    }

    matrix.push({
      date: dateStr,
      dayNumber,
      isCurrentMonth,
      isWeekend,
      status,
      firstPunch: res.firstPunch,
      lastPunch: res.lastPunch,
      totalHours: res.totalHours,
      lateMins: res.lateMins,
      logs: dayLogs,
    });
  }

  return matrix;
}

