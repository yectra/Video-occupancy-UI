 export class CameraSetup {
    entranceName: string;
    cameraPosition: string;
    videoSource: string;
  }

  class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
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
  