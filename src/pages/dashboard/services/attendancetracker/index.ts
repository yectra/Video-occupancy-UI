import { apiClient } from "@/common/hooks/useApiClient";
import { AddEmployeeDetails } from "../../models/attendancetracker";


const {httpGet,httpPost}=apiClient();

interface IAttendanceDetails{
    addEmployeeDetails(employeeDetails:AddEmployeeDetails):Promise<any>;
    getAllEmployeeAttendanceDetails(date:string):Promise<any>;
    getIndividualEmployeeDetails(employeeId:string):Promise<any>;
    getManageEmployeeDetails():Promise<any>;
    
}

export class AttendanceDetails implements IAttendanceDetails{
    addEmployeeDetails(employeeDetails: AddEmployeeDetails): Promise<any> {
        return httpPost('employee',employeeDetails)
        .then((response)=>response)
        
    }
    getAllEmployeeAttendanceDetails(): Promise<any> {
        return httpGet('/attendance/all')
        .then((response)=>response)
    }
    getIndividualEmployeeDetails(employeeId:String): Promise<any> {
        return httpGet(`/attendance/all/${employeeId}`)
        .then((response)=>response)
    }
    getManageEmployeeDetails(): Promise<any> {
        return httpGet('/employees')
        .then((response)=>response)
    }
    
    
}

