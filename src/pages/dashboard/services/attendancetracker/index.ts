import { apiClient } from "@/common/hooks/useApiClient";

import { AddEmployeeDetails, ManageEmployeeDetails } from "@/pages/dashboard/models/attendancetracker"

const { httpGet, httpPost, httpPut,httpDelete } = apiClient();

interface IAttendanceDetails {

    addEmployeeDetails(employeeDetails: AddEmployeeDetails): Promise<any>;

    getAllEmployeeAttendanceDetails(date: string): Promise<any>;

    getIndividualEmployeeDetails(employeeId: string): Promise<any>;

    getManageEmployeeDetails(): Promise<any>;   

    updateEmployeeDetails(employeeDetails: ManageEmployeeDetails): Promise<any>;

    searchEmployeeDetails(employeeName:string):Promise<any>;

    deleteEmployeeDetails(employeeId:string):Promise<any>;
}

export class AttendanceDetails implements IAttendanceDetails {
    getEmployeeAttendanceByDate(_date: Date) {
        throw new Error("Method not implemented.");
    }

    addEmployeeDetails(employeeDetails: AddEmployeeDetails): Promise<any> {
        return httpPost('/employee', employeeDetails)
            .then((response) => response)
    }

    getAllEmployeeAttendanceDetails(date:string): Promise<any> {
        return httpGet(`/attendance/all?date=${date}`)   
            .then((response) => response)
    }

    getIndividualEmployeeDetails(employeeId: string): Promise<any> {
        return httpGet(`/attendance/all?employeeId=${employeeId}`)
            .then((response) => response)
    }

    getManageEmployeeDetails(): Promise<any> {
        return httpGet('/employees')
            .then((response) => response)
    }
    
    updateEmployeeDetails( employeeDetails: ManageEmployeeDetails): Promise<any> {
        return httpPut(`/update-employee/${employeeDetails.employeeId}`, employeeDetails)
            .then((response) => response)
    }

    searchEmployeeDetails(employeeName: string): Promise<any> {
        return httpGet(`/attendance/search?employeeName=${employeeName}`)
            .then((response)=> response)
    }

    deleteEmployeeDetails(employeeId:string):Promise<any>{
        return httpDelete(`/employee/${employeeId}`)
        .then((response)=>(response))
    }
}