import { apiClient } from "@/common/hooks/useApiClient";
import { AddUserDetails, BackendPayload, GraphResponseModel } from "@/pages/dashboard/models/liveoccupanytracker";


const { httpPost, httpGet, httpPut, httpDelete } = apiClient();

interface IOccupancyTracker {
    addSetupDetails(setupDetails: BackendPayload): Promise<any>;
    getCameraUrls(): Promise<BackendPayload>;
    getAllCounts(): Promise<any>;
    getGraphDetails(): Promise<GraphResponseModel>;
    updateCameraDetails(cameraDetails: BackendPayload): Promise<any>;
    checkUserExists(): Promise<any>;
    getPersonCountByDate(value: any): Promise<any>;
    getUserDetails(): Promise<any>;
    updateEmployeeDetails(userDetails: any): Promise<any>;
    deleteEmployeeDetails(user: any): Promise<any>;
    addUserDetails(useretails: AddUserDetails): Promise<any>;
    searchAllUserDetails(searchTerm: string): Promise<any>;
}

export class OccupancyTracker implements IOccupancyTracker {
    addSetupDetails(setupDetails: BackendPayload): Promise<any> {
        return httpPost("/api/saveData", setupDetails).then((response) => response)
    }

    getCameraUrls(): Promise<BackendPayload> {
        return httpGet<BackendPayload>("/api/getCameraUrls").then((response) => response)
    }

    getAllCounts(): Promise<any> {
        return httpGet("/api/getAllCounts").then((response) => response)
    }

    getGraphDetails(): Promise<GraphResponseModel> {
        return httpGet<GraphResponseModel>(`/api/getPersonDetectionOverTime`).then((response) => response)
    }

    updateCameraDetails(cameraDetails: BackendPayload): Promise<any> {
        return httpPut(`/api/editData`, cameraDetails)
            .then((response) => response)
    }

    checkUserExists(): Promise<any> {
        return httpGet(`/api/checkUserExists`).then((response) => response)
    }

    getPersonCountByDate(value: any): Promise<any> {
        let url = `api/getPersonCountByDate`;

        if (value && Object.keys(value).length > 0) {
            const queryParams = new URLSearchParams(value).toString();
            url += `?${queryParams}`;
        }

        return httpGet(url)
            .then((response) => response)
    }

    getUserDetails(): Promise<any> {
        return httpGet('api/getAllUsers')
            .then((response) => response)
    }

    updateEmployeeDetails(userDetails: any): Promise<any> {
        return httpPut(`api/editUser`, userDetails)
            .then((response) => response)
    }

    deleteEmployeeDetails(user: any): Promise<any> {
        return httpDelete(`/api/deleteUser`, user)
            .then((response) => (response))
    }

    addUserDetails(useretails: AddUserDetails): Promise<any> {
        return httpPost('/api/addUser', useretails)
            .then((response) => response)
    }

    searchAllUserDetails(searchTerm: string): Promise<any> {
        return httpGet(`/api/searchUsers?search=${searchTerm}`)
            .then((response) => response)
    }
}

