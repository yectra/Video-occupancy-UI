import { CircularProgressProps } from "@mui/material";

export class AttendanceData {
  employeeId: number;
  date: string;
  punchIn: string;
  punchOut: string;
  break: string;
  overTime: string;
}

export interface CircularProgressWithTextProps extends CircularProgressProps {
  value: number;
  text: string;
}

export class PunchStatus {
  message: string;
  time: string;
}

export class TodayactivityProps {
  punchStatuses: PunchStatus[];
}

export class TimesheetProps {
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
}

export class Row {
  id: number;
  date: string;
  name: string;
  firstPunchIn: string;
  lastPunchOut: string;
  break: string;
  overTime: string;
}

export class IndividualTimesheet{
  email:string;
  employeeId:string;
  employeeName:string;
  break:string;
  overTime:string;
  punchIn:string;
  punchOut:string;
}
