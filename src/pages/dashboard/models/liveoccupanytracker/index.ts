export class CameraSetup {
  entranceName: string;
  cameraPosition: string;
  videoSource: string;
}

export class BackendPayload {
  capacityOfPeople: number;
  alertMessage: string;
  cameraDetails: CameraDetailsModel[];
}

export class CameraDetailsModel {
  entranceName: string;
  cameraPosition: string;
  videoUrl: string;
  doorCoordinates: number[][] | undefined;
}

export class GraphResponseModel {
  data: GraphModel[]
}
export class GraphModel {
  date: string;
  camera_counts: any;
  hour_range: string;
  percentage: number;
  total_person_count: number;
}
export class GraphDataModel {
  percentage: number;
  time_interval: string;
}