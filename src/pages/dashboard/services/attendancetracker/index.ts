import { apiClient } from "@/common/hooks/useApiClient";

import { AddEmployeeDetails, AttendanceDataResponseModel, CameraurlSetup, ManageEmployeeDetails, OrganizationSetup, AttendanceTrackerDetailsModel, IndividualTimesheet, employeeResponse } from "@/pages/dashboard/models/attendancetracker"

const { httpGet, httpPost, httpPut, httpDelete } = apiClient();

interface IAttendanceTracker {
    addEmployeeDetails(employeeDetails: AddEmployeeDetails): Promise<any>;
    getAllEmployeeAttendanceDetails(value: any): Promise<AttendanceDataResponseModel[]>;
    getManageEmployeeDetails(page_number: number, page_size: number): Promise<employeeResponse>;
    updateEmployeeDetails(employeeDetails: ManageEmployeeDetails): Promise<any>;
    searchEmployeeDetails(value: any): Promise<any>;
    searchAllEmployeeDetails(searchTerm: string): Promise<any>;
    deleteEmployeeDetails(employeeId: string): Promise<any>;
    organizationDetails(organizationDetails: OrganizationSetup): Promise<any>;
    cameraurlDetails(cameraurlDetails: CameraurlSetup): Promise<any>;
    getAttendanceTrackerDetails(): Promise<AttendanceTrackerDetailsModel>;
    updateAttendanceTrackerDetails(organizationDetails: AttendanceTrackerDetailsModel): Promise<any>;
    getAttendance(value?: any): Promise<IndividualTimesheet[]>;
    checkUserExists(): Promise<any>; 
    getAllCameraStatus(): Promise<any>;
}

export class AttendanceTracker implements IAttendanceTracker {
    getEmployeeAttendanceByDate(_date: Date) {
        throw new Error("Method not implemented.");
    }

    addEmployeeDetails(employeeDetails: AddEmployeeDetails): Promise<any> {
        return httpPost('/employee', employeeDetails)
            .then((response) => response)
    }

    getAllEmployeeAttendanceDetails(value: any): Promise<AttendanceDataResponseModel[]> {
        let url = `/attendance/all`;

        if (value && Object.keys(value).length > 0) {
            const queryParams = new URLSearchParams(value).toString();
            url += `?${queryParams}`;
        }

        return httpGet<AttendanceDataResponseModel[]>(url)
            .then((response) => response)
    }

    getManageEmployeeDetails(page_number: number, page_size: number): Promise<employeeResponse> {
        return httpGet<employeeResponse>(`/employees?page_number=${page_number}&page_size=${page_size}`)
            .then((response) => response)
    }

    updateEmployeeDetails(employeeDetails: ManageEmployeeDetails): Promise<any> {
        return httpPut(`/update-employee/${employeeDetails.employeeId}`, employeeDetails)
            .then((response) => response)
    }

    searchEmployeeDetails(value: any): Promise<any> {
        let url = `/attendance/search`;

        if (value && Object.keys(value).length > 0) {
            const queryParams = new URLSearchParams(value).toString();
            url += `?${queryParams}`;
        }
        return httpGet(url).then((response) => response)
    }

    searchAllEmployeeDetails(searchTerm: string): Promise<any> {
        return httpGet(`/employees/search?search=${searchTerm}`)
            .then((response) => response)
    }

    deleteEmployeeDetails(employeeId: string): Promise<any> {
        return httpDelete(`/employee/${employeeId}`)
            .then((response) => (response))
    }

    organizationDetails(organizationDetails: OrganizationSetup): Promise<any> {
        return httpPost('/organization', organizationDetails)
            .then((response) => response);
    }

    cameraurlDetails(cameraurlDetails: CameraurlSetup): Promise<any> {
        return httpPost('api/cameraUrl', cameraurlDetails)
            .then((response) => response);
    }

    getAttendanceTrackerDetails(): Promise<AttendanceTrackerDetailsModel> {
        return httpGet<AttendanceTrackerDetailsModel>('api/organization/camera-data')
            .then((response) => response)
    }

    updateAttendanceTrackerDetails(organizationDetails: AttendanceTrackerDetailsModel): Promise<any> {
        return httpPut(`update_organization_camera_data`, organizationDetails)
            .then((response) => response)
    }

    getAttendance(value?: any): Promise<IndividualTimesheet[]> {
        let url = `/api/attendance`;

        if (value && Object.keys(value).length > 0) {
            const queryParams = new URLSearchParams(value).toString();
            url += `?${queryParams}`;
        }
        return httpGet<IndividualTimesheet[]>(url).then((response) => response)
    }

    checkUserExists(): Promise<any> {
        return httpGet(`/api/checkUserExists`).then((response) => response)
    }
    
    getAllCameraStatus(): Promise<any> {
        return httpGet(`/api/getFailedCameraStatusAttendance`).then((response) => response)
    }
}