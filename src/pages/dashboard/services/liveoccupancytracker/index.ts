import { apiClient } from "@/common/hooks/useApiClient";
import { BackendPayload } from "@/pages/dashboard/models/liveoccupanytracker";


const { httpPost, httpGet } = apiClient();

interface IOccupancyTracker {
    addSetupDetails(setupDetails: BackendPayload): Promise<any>;
    getAllCounts(): Promise<any>;
}

export class OccupancyTracker implements IOccupancyTracker {
    addSetupDetails(setupDetails: BackendPayload): Promise<any> {
        return httpPost("/api/saveData", setupDetails).then((response) => response)
    }

    getAllCounts(): Promise<any> {        
        return httpGet("/api/getAllCounts").then((response) => response)
    }
}