import axios from "axios";

const platformApi = 'http://localhost:8080/api/v1';

/**
 * @class BaseApi
 * @summary Shared HTTP client for the platform.
 * Handles JSON and multipart/form-data automatically.
 */
export class BaseApi {
  #http;

  constructor() {
    this.#http = axios.create({
      baseURL: platformApi
    });

    this.#http.interceptors.request.use(
      (config) => {
        if (config.data instanceof FormData) {
          // Let the browser set multipart/form-data + boundary
          delete config.headers['Content-Type'];
        } else if (config.data) {
          config.headers['Content-Type'] = 'application/json';
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Auth interceptor goes here
    // this.#http.interceptors.request.use(iamInterceptor);
  }

  get http() {
    return this.#http;
  }
}
