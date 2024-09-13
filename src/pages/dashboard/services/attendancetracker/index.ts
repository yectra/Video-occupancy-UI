import { apiClient } from "@/common/hooks/useApiClient";


const {httpGet}=apiClient();

interface IAttendanceDetails{
    getAllEmployeeAttendanceDetails(date:string):Promise<any>;
    getIndividualEmployeeDetails(employeeId:string):Promise<any>;
}

export class AttendanceDetails implements IAttendanceDetails{
    getAllEmployeeAttendanceDetails(): Promise<any> {
        return httpGet('/getattendance/all')
        .then((response)=>response)
    }
    getIndividualEmployeeDetails(employeeId:String): Promise<any> {
        return httpGet(`/getattendance/all${employeeId}`)
        .then((response)=>response)
    }
    
}

