import { apiClient } from "@/common/hooks/useApiClient";
import { BackendPayload, GraphResponseModel } from "@/pages/dashboard/models/liveoccupanytracker";


const { httpPost, httpGet, httpPut } = apiClient();

interface IOccupancyTracker {
    addSetupDetails(setupDetails: BackendPayload): Promise<any>;
    getCameraUrls(): Promise<BackendPayload>;
    getAllCounts(): Promise<any>;
    getGraphDetails(): Promise<GraphResponseModel>;
    updateCameraDetails(cameraDetails: BackendPayload): Promise<any>;
    checkUserExists(): Promise<any>;
    getPersonCountByDate(date: string): Promise<any>
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

    getPersonCountByDate(date: string): Promise<any> {
        return httpGet(`api/getPersonCountByDate?date=${date}`).then((response) => response)
    }
}