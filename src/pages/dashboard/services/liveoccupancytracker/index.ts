import { apiClient } from "@/common/hooks/useApiClient";
import { BackendPayload, GraphResponseModel } from "@/pages/dashboard/models/liveoccupanytracker";


const { httpPost, httpGet } = apiClient();

interface IOccupancyTracker {
    addSetupDetails(setupDetails: BackendPayload): Promise<any>;
    getAllCounts(): Promise<any>;
    getGraphDetails(): Promise<GraphResponseModel>
}

export class OccupancyTracker implements IOccupancyTracker {
    addSetupDetails(setupDetails: BackendPayload): Promise<any> {
        return httpPost("/api/saveData", setupDetails).then((response) => response)
    }

    getAllCounts(): Promise<any> {        
        return httpGet("/api/getAllCounts").then((response) => response)
    }

    getGraphDetails(): Promise<GraphResponseModel> {       
        return httpGet<GraphResponseModel>(`/api/getPersonDetectionOverTime`).then((response) => response)
    }
}