/**
 * Spring Boot 3.x & MySQL REST API Client for Namma Raitha
 * Handles JWT Authentication, Bearer Token injection, and Spring Data JPA / REST Endpoints
 */

const API_BASE_URL = (import.meta as any).env?.VITE_SPRING_BOOT_API_URL || '/api/v1';

export interface JwtAuthResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  username: string;
  fullName: string;
  phone: string;
  role: string;
  district: string;
  state: string;
  expiresInMs: number;
}

export interface SpringApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

class SpringBootApiClient {
  private token: string | null = null;

  constructor() {
    try {
      this.token = localStorage.getItem('nammaraitha_jwt_token');
    } catch (e) {
      this.token = null;
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    try {
      if (token) {
        localStorage.setItem('nammaraitha_jwt_token', token);
      } else {
        localStorage.removeItem('nammaraitha_jwt_token');
      }
    } catch (e) {}
  }

  public getToken(): string | null {
    if (!this.token) {
      try {
        this.token = localStorage.getItem('nammaraitha_jwt_token');
      } catch (e) {}
    }
    return this.token;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const currentToken = this.getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }
    return headers;
  }

  // --- Auth Endpoints ---
  async login(usernameOrPhone: string, password: string):Promise<JwtAuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameOrPhone, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(err.message || 'Invalid credentials');
    }

    const json: SpringApiResponse<JwtAuthResponse> = await res.json();
    this.setToken(json.data.accessToken);
    return json.data;
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role?: string;
    district?: string;
    state?: string;
  }): Promise<JwtAuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(err.message || 'Could not register user');
    }

    const json: SpringApiResponse<JwtAuthResponse> = await res.json();
    this.setToken(json.data.accessToken);
    return json.data;
  }

  async checkAuthMe(): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) throw new Error('Unauthenticated');
    const json: SpringApiResponse<string> = await res.json();
    return json.data;
  }

  // --- Products Endpoints (Spring Data JPA) ---
  async getProducts(category: string = 'all', query: string = ''): Promise<any[]> {
    const url = new URL(`${window.location.origin}${API_BASE_URL}/products`);
    if (category && category !== 'all') url.searchParams.set('category', category);
    if (query) url.searchParams.set('query', query);

    const res = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });

    if (!res.ok) throw new Error('Failed to fetch products');
    const json: SpringApiResponse<any[]> = await res.json();
    return json.data;
  }

  async createProduct(product: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });

    if (!res.ok) throw new Error('Failed to create product');
    const json: SpringApiResponse<any> = await res.json();
    return json.data;
  }

  // --- Orders Endpoints ---
  async placeOrder(order: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error('Failed to place order');
    const json: SpringApiResponse<any> = await res.json();
    return json.data;
  }

  // --- Mandi Prices Endpoints ---
  async getMandiPrices(state: string = 'all', category: string = 'all'): Promise<any[]> {
    const url = new URL(`${window.location.origin}${API_BASE_URL}/mandi`);
    if (state && state !== 'all') url.searchParams.set('state', state);
    if (category && category !== 'all') url.searchParams.set('category', category);

    const res = await fetch(url.toString(), {
      headers: this.getHeaders(),
    });

    if (!res.ok) throw new Error('Failed to fetch mandi prices');
    const json: SpringApiResponse<any[]> = await res.json();
    return json.data;
  }
}

export const springBootApi = new SpringBootApiClient();
