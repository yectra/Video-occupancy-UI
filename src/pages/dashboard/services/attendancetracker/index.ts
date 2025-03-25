import { apiClient } from "@/common/hooks/useApiClient";

import { AddEmployeeDetails, AttendanceDataResponseModel, CameraurlSetup, ManageEmployeeDetails, OrganizationSetup, AttendanceTrackerDetailsModel, IndividualTimesheet } from "@/pages/dashboard/models/attendancetracker"

const { httpGet, httpPost, httpPut, httpDelete } = apiClient();

interface IAttendanceDetails {
    addEmployeeDetails(employeeDetails: AddEmployeeDetails): Promise<any>;
    getAllEmployeeAttendanceDetails(employeeId?: string, date?: string): Promise<AttendanceDataResponseModel[]>;
    getIndividualEmployeeDetails(employeeId: string): Promise<any>;
    getManageEmployeeDetails(): Promise<any>;
    updateEmployeeDetails(employeeDetails: ManageEmployeeDetails): Promise<any>;
    searchEmployeeDetails(date: string, employeeName: string): Promise<any>;
    searchAllEmployeeDetails(searchTerm: string): Promise<any>;
    deleteEmployeeDetails(employeeId: string): Promise<any>;
    organizationDetails(organizationDetails: OrganizationSetup): Promise<any>;
    cameraurlDetails(cameraurlDetails: CameraurlSetup): Promise<any>;
    getAttendanceTrackerDetails(): Promise<AttendanceTrackerDetailsModel>;
    updateAttendanceTrackerDetails(organizationDetails: AttendanceTrackerDetailsModel): Promise<any>;
    getAttendance(): Promise<IndividualTimesheet[]>;
}

export class AttendanceDetails implements IAttendanceDetails {
    getEmployeeAttendanceByDate(_date: Date) {
        throw new Error("Method not implemented.");
    }

    addEmployeeDetails(employeeDetails: AddEmployeeDetails): Promise<any> {
        return httpPost('/employee', employeeDetails)
            .then((response) => response)
    }

    getAllEmployeeAttendanceDetails(employeeId?: string, date?: string): Promise<AttendanceDataResponseModel[]> {
        let url = `/attendance/all`;

        if (employeeId && date) {
            url += `?employeeId=${employeeId}&date=${date}`;
        } else if (employeeId) {
            url += `?employeeId=${employeeId}`;
        } else if (date) {
            url += `?date=${date}`;
        }

        return httpGet<AttendanceDataResponseModel[]>(url)
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

    updateEmployeeDetails(employeeDetails: ManageEmployeeDetails): Promise<any> {
        return httpPut(`/update-employee/${employeeDetails.employeeId}`, employeeDetails)
            .then((response) => response)
    }

    searchEmployeeDetails(date: string, employeeName: string): Promise<any> {
        return httpGet(`/attendance/search?date=${date}&employeeName=${employeeName}`)
            .then((response) => response)
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

    getAttendance(): Promise<IndividualTimesheet[]> {
        return httpGet<IndividualTimesheet[]>(`/api/attendance`).then((response) => response)
    }
}