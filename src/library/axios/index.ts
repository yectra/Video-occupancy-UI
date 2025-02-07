import Axios, { AxiosResponse, AxiosInstance, AxiosRequestConfig } from "axios";
 
export interface IApiClient {
  get<TResponse>(path: string): Promise<TResponse>;
 
  post<TRequest, TResponse>(
    path: string,
    payload: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse>;
 
  patch<TRequest, TResponse>(
    path: string,
    payload: TRequest
  ): Promise<TResponse>;
 
  put<TRequest, TResponse>(path: string, payload: TRequest): Promise<TResponse>;
}
export default class ApiClient implements IApiClient {
  public axiosInstance: AxiosInstance;
  private baseUrl: string = "https://videooccupancy.azure-api.net/occupancyTracker";
  constructor() {
    this.axiosInstance = this.createAxiosInstance();
  }

  protected createAxiosInstance(): AxiosInstance {
    const axiosInstance = Axios.create({
      baseURL: this.baseUrl,
      responseType: "json" as const,
    });

    // Add a request interceptor
    axiosInstance.interceptors.request.use((config) => {
        // Retrieve the access token (replace with your token logic)
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken && config.headers) {        
          // Use the `set` method for AxiosHeaders
          config.headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return config;
      },
      (error) => {
        // Handle request errors
        return Promise.reject(error);
      }
    );

    // Optionally, add a response interceptor
    axiosInstance.interceptors.response.use(
      (response) => response, // Pass through successful responses
      (error) => {
        // Handle response errors
        console.error("API Error:", error);
        return Promise.reject(error);
      }
    );

    return axiosInstance;
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
    config?: any
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
 
  async delete<TRequest, TResponse>(
    path: string,
    payload: TRequest
  ): Promise<TResponse> {
    try {
      const response = await this.axiosInstance.delete<
        TResponse,
        AxiosResponse<TResponse>,
        TRequest
      >(path, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      this.handleErrors(error);
    }
    return {} as TResponse;
  }
 
  protected handleErrors(errors: any) {
    // console.log(errors);
    throw errors;
  }
}