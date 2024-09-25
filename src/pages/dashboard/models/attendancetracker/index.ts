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
  attendanceList: {
    punchIn: string;
    punchOut: string;
  }[];
  break: string;
  date: string;
  email: string;
  employeeId: number;
  employeeName: string;
  firstPunchIn: string;
  id: string;
  imageUrl: string;
  lastPunchOut: string;
  overTime: string;
  }



//new


export class AddEmployeeDetails{
  employeeId:number | null;
  employeeName:string;
  role:string;
  email:string;
  dateOfJoining:string;
  imageUrl:string;
}

export class ManageEmployeeDetails{
  employeeId:number;
  employeeName:string;
  dateOfJoining:string;
  role:string;
  email:string;
  imageUrl:string;
}

