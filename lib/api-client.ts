import axios, { type AxiosInstance } from "axios";
import type {
  Payment,
  Subscription,
  AuthResponse,
  Application,
  CreateApplicationRequest,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
    });

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Load token from localStorage on client side
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("plaxo_token");
    }
  }

  async login(username: string, password: string): Promise<void> {
    const response = await this.client.post<AuthResponse>("/auth/login", {
      username,
      password,
    });
    this.token = response.data.access_token;
    if (typeof window !== "undefined") {
      localStorage.setItem("plaxo_token", this.token);
    }
  }

  logout(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("plaxo_token");
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Payment endpoints
  async getPaymentById(id: string): Promise<Payment> {
    const response = await this.client.get<Payment>(`/payments/${id}`);
    return response.data;
  }

  async getPaymentsByApplication(
    applicationId: string,
    status?: string
  ): Promise<Payment[]> {
    const response = await this.client.get<Payment[]>(
      `/payments/application/${applicationId}`,
      {
        params: status ? { status } : {},
      }
    );
    return response.data;
  }

  async getPaymentsBySubscription(subscriptionId: string): Promise<Payment[]> {
    const response = await this.client.get<Payment[]>(
      `/payments/subscription/${subscriptionId}`
    );
    return response.data;
  }

  // Subscription endpoints
  async getSubscriptionById(id: string): Promise<Subscription> {
    const response = await this.client.get<Subscription>(
      `/subscriptions/${id}`
    );
    return response.data;
  }

  async getSubscriptionsByApplication(
    applicationId: string,
    status?: string
  ): Promise<Subscription[]> {
    const response = await this.client.get<Subscription[]>(
      `/subscriptions/application/${applicationId}`,
      {
        params: status ? { status } : {},
      }
    );
    return response.data;
  }

  async getSubscriptionsByCustomer(
    customerId: string
  ): Promise<Subscription[]> {
    const response = await this.client.get<Subscription[]>(
      `/subscriptions/customer/${customerId}`
    );
    return response.data;
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    const response = await this.client.put<Subscription>(
      `/subscriptions/${id}/cancel`
    );
    return response.data;
  }

  async suspendSubscription(id: string): Promise<Subscription> {
    const response = await this.client.put<Subscription>(
      `/subscriptions/${id}/suspend`
    );
    return response.data;
  }

  async getRenewalsDue(): Promise<Subscription[]> {
    const response = await this.client.get<Subscription[]>(
      "/subscriptions/renewals/due"
    );
    return response.data;
  }

  // Application management endpoints
  async createApplication(
    data: CreateApplicationRequest
  ): Promise<Application> {
    const response = await this.client.post<Application>("/applications", data);
    return response.data;
  }

  async getAllApplications(): Promise<Application[]> {
    const response = await this.client.get<Application[]>("/applications");
    return response.data;
  }

  async getApplicationById(id: string): Promise<Application> {
    const response = await this.client.get<Application>(`/applications/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
