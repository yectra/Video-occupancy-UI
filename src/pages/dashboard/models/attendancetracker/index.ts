import { CircularProgressProps } from "@mui/material";

export class AttendanceData {
  employeeId: string;
  date: string;
  punchIn: string;
  punchOut: string;
  break: string;
  overTime: string;
}

export class AttendanceDataResponseModel {
  attendanceList: AttendanceListModel[];
  employeeId: string;
  date: string;
  break: string;
  overTime: string;
  email: string;
  employeeName: string;
  firstPunchIn: string;
  id: string;
  imageUrl: string;
  lastPunchOut: string;
  organizationId: string;
  totalWorkingHours: string;
}

export class AttendanceListModel {
  punchIn: string;
  punchOut: string;
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

export class IndividualTimesheet {
  attendanceList: {
    punchIn: string;
    punchOut: string;
  }[];
  break: string;
  date: string;
  email: string;
  employeeId: string;
  employeeName: string;
  firstPunchIn: string;
  id: string;
  imageUrl: string;
  lastPunchOut: string;
  overTime: string;
  totalWorkingHours: string;
  userId: string;
  organizationId: string;
}
export class AddEmployeeDetails {
  employeeName: string;
  role: string;
  email: string;
  imageBase64: string;
}
export class ManageEmployeeDetails {
  employeeId: string;
  employeeName?: string;
  role?: string;
  email?: string;
  imageUrl?: string;
  newImageBase64?: string;
}

export class employeeResponse {
  employees: ManageEmployeeDetails[];
  page_number: number;
  page_size: number;
  total_records: number;
}
export class OrganizationSetup {
  organizationName: string;
  phoneNumber: string;
  websiteUrl: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: number | null;
  workTiming: number | null;
}
export class CameraurlSetup {
  email: string;
  cameraDetails: AttendanceCameraDetailsModel[];
}
export class AttendanceCameraDetailsModel {
  cameraId: number | null;
  punchinCamera: string;
  punchinUrl: string;
  punchoutCamera: string;
  punchoutUrl: string;
}
export class AttendanceTrackerDetailsModel {
  cameraData: CameraurlSetup;
  organizationData: OrganizationSetup;
}
export class employeeAttendanceResponse {
  data: IndividualTimesheet[];
  page_number: number;
  page_size: number;
  total_records: number;
}

export class CameraStatusModel {
  id: string;
  user_id: string;
  camera_id: string;
  videoUrl: string;
  status: string;
  date: string;
  time: string;
  camera_type: string;
  camera_name: string;
}