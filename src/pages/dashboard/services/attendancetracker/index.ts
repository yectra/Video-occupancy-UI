import { apiClient } from "@/common/hooks/useApiClient";


const {httpGet}=apiClient();

interface IAttendanceDetails{
    getAllEmployeeAttendanceDetails():Promise<any>;
    getIndividualEmployeeDetails(employeeId:string):Promise<any>;
}

export class AttendanceDetails implements IAttendanceDetails{
    getAllEmployeeAttendanceDetails(): Promise<any> {
        return httpGet('/videoAttendanceV5/employees')
        .then((response)=>response)
    }
    getIndividualEmployeeDetails(employeeId:String): Promise<any> {
        return httpGet(`videoAttendanceV5/employee/${employeeId}`)
        .then((response)=>response)
    }
    
}

