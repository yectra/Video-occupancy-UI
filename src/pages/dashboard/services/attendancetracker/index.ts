import { apiClient } from "@/common/hooks/useApiClient";
import { AddEmployeeDetails, ManageEmployeeDetails } from "@/pages/dashboard/models/attendancetracker"

const { httpGet, httpPost, httpPut } = apiClient();

interface IAttendanceDetails {
    addEmployeeDetails(employeeDetails: AddEmployeeDetails): Promise<any>;
    getAllEmployeeAttendanceDetails(date: string): Promise<any>;
    getIndividualEmployeeDetails(employeeId: string): Promise<any>;
    getManageEmployeeDetails(): Promise<any>;
    updateEmployeeDetails(employeeId: string, employeeDetails: Partial<ManageEmployeeDetails>): Promise<any>;
}

export class AttendanceDetails implements IAttendanceDetails {
    getEmployeeAttendanceByDate(_date: Date) {
        throw new Error("Method not implemented.");
    }
    addEmployeeDetails(employeeDetails: AddEmployeeDetails): Promise<any> {
        return httpPost('/employee', employeeDetails)
            .then((response) => response)
    }
    getAllEmployeeAttendanceDetails(): Promise<any> {
        return httpGet('/attendance/all')
            .then((response) => response)
    }
    getIndividualEmployeeDetails(employeeId: string): Promise<any> {
        return httpGet(`/attendance/all/${employeeId}`)
            .then((response) => response)
    }
    getManageEmployeeDetails(): Promise<any> {
        return httpGet('/employees')
            .then((response) => response)
    }
    updateEmployeeDetails(employeeId: string, employeeDetails: Partial<ManageEmployeeDetails>): Promise<any> {
        return httpPut(`/update-employee/${employeeId}`, employeeDetails)
            .then((response) => response)
    }
}