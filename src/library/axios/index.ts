import Axios, { AxiosResponse, AxiosInstance } from "axios";
 
export interface IApiClient {
  get<TResponse>(path: string): Promise<TResponse>;
 
  post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: any
  ): Promise<TResponse>;
 
  patch<TRequest, TResponse>(
    path: string,
    payload: TRequest
  ): Promise<TResponse>;
 
  put<TRequest, TResponse>(path: string, payload: TRequest): Promise<TResponse>;
}
export default class ApiClient implements IApiClient {
  public axiosInstance: AxiosInstance;
  private baseUrl: string = "https://videooccupancy.azure-api.net";
  constructor() {
    this.axiosInstance = this.createAxiosInstance();
  }
 
  protected createAxiosInstance(): AxiosInstance {
    return Axios.create({
      baseURL: this.baseUrl,
      responseType: "json" as const,
    });
  }
 
  async get<TResponse>(path: string): Promise<TResponse> {
    try {
      const response = await this.axiosInstance.get<
        TResponse,
        AxiosResponse<TResponse>
      >(path);
      return response.data;
    } catch (error) {
      this.handleErrors(error);
    }
    return {} as TResponse;
  }
 
  async post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
 
  ): Promise<TResponse> {
    try {
      const response = await this.axiosInstance.post<
        TResponse,
        AxiosResponse<TResponse>,
        TRequest
      >(path, payload);
      return response.data;
    } catch (error) {
      this.handleErrors(error);
    }
    return {} as TResponse;
  }
 
  async patch<TRequest, TResponse>(
    path: string,
    payload: TRequest
  ): Promise<TResponse> {
    try {
      const response = await this.axiosInstance.patch<
        TResponse,
        AxiosResponse<TResponse>,
        TRequest
      >(path, payload);
      return response.data;
    } catch (error) {
      this.handleErrors(error);
    }
    return {} as TResponse;
  }
 
  async put<TRequest, TResponse>(
    path: string,
    payload: TRequest
  ): Promise<TResponse> {
    try {
      const response = await this.axiosInstance.put<
        TResponse,
        AxiosResponse<TResponse>,
        TRequest
      >(path, payload);
      return response.data;
    } catch (error) {
      this.handleErrors(error);
    }
    return {} as TResponse;
  }
 
  async delete<TResponse>(path: string): Promise<TResponse> {
    try {
      const response = await this.axiosInstance.delete<TResponse>(path);
      return response.data;
    } catch (error) {
      this.handleErrors(error);
    }
    return {} as TResponse;
  }
 
  protected handleErrors(errors: any) {
    console.log(errors);
    throw errors;
  }
}