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

export class ManageUserDetails {
  organization_id: string;
  pagination: any;
  users: userDetails[];
}

export class userDetails {
  created_at: string;
  id: string;
  name: string;
  role: string;
  email: string;
  organization_id?: string;
}

export class AddUserDetails {
  name: string;
  role: string;
  email: string;
}

export class SetupCompleteResponse {
  attendance: boolean;
  occupancy: boolean;
  message: string;
}
