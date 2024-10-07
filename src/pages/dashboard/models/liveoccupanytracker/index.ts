 export class CameraSetup {
    entranceName: string;
    cameraPosition: string;
    videoSource: string;
  }
  

 export interface BackendPayload {
    capacityOfPeople: number;
    alertMessage: string;
    cameraDetails: {
      entranceName: string;
      cameraPosition: string;
      videoUrl: string;
      doorCoordinates: number[][] | undefined;
    }[];
  }
  