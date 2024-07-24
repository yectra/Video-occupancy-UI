import { CircularProgressProps } from "@mui/material";

export class AttendanceData {
  employeeId: number;
  date: string;
  punchIn: string;
  punchOut: string;
  break: string;
  overTime: string;

  constructor(
    employeeId: number,
    date: string,
    punchIn: string,
    punchOut: string,
    breakTime: string,
    overTime: string
  ) {
    this.employeeId = employeeId;
    this.date = date;
    this.punchIn = punchIn;
    this.punchOut = punchOut;
    this.break = breakTime;
    this.overTime = overTime;
  }
}

export interface CircularProgressWithTextProps extends CircularProgressProps {
  value: number;
  text: string;
}

export class PunchStatus {
  message: string;
  time: string;

  constructor(message: string, time: string) {
    this.message = message;
    this.time = time;
  }
}

export interface TodayactivityProps {
  punchStatuses: PunchStatus[];
}

export interface TimesheetProps {
  onPunchIn: () => void;
  onPunchOut: () => void;
}

export interface CircularProgressWithTextProps extends CircularProgressProps {
  value: number;
  text: string;
}

export class PunchCardProps {
  label: string;
  time: string;
  isPunchIn: boolean;

  constructor(label: string, time: string, isPunchIn: boolean) {
    this.label = label;
    this.time = time;
    this.isPunchIn = isPunchIn;
  }
}

