import type {
  Post,
  CustomerStory,
  InquiryRequest,
  InquiryResponse,
  DownloadRequest,
  Banner,
  ClientLogo,
  Page,
} from '@/types';

class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ??
      process.env.NEXT_PUBLIC_API_URL ??
      'http://localhost:8080/api/union';
  }

  private async request<T>(
    path: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        body = await res.text();
      }
      throw new ApiError(
        `API error ${res.status}: ${res.statusText}`,
        res.status,
        body,
      );
    }

    // Handle 204 No Content
    if (res.status === 204) {
      return undefined as T;
    }

    return res.json() as Promise<T>;
  }

  // ── Posts ──────────────────────────────────────────────

  async getPosts(
    category?: Post['category'],
    page: number = 0,
    size: number = 10,
  ): Promise<Page<Post>> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (category) params.set('category', category);

    return this.request<Page<Post>>(`/posts?${params}`);
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  // ── Customer Stories ──────────────────────────────────

  async getCustomerStories(
    industry?: string,
    page: number = 0,
    size: number = 10,
  ): Promise<Page<CustomerStory>> {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (industry) params.set('industry', industry);

    return this.request<Page<CustomerStory>>(`/customer-stories?${params}`);
  }

  // ── Inquiries ─────────────────────────────────────────

  async submitInquiry(data: InquiryRequest): Promise<InquiryResponse> {
    if (data.file) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('company', data.company);
      formData.append('phone', data.phone);
      formData.append('email', data.email);
      if (data.message) formData.append('message', data.message);
      if (data.product) formData.append('product', data.product);
      formData.append('consentPrivacy', String(data.consentPrivacy));
      if (data.consentMarketing !== undefined) formData.append('consentMarketing', String(data.consentMarketing));
      formData.append('file', data.file);

      const url = `${this.baseUrl}/inquiries`;
      const res = await fetch(url, { method: 'POST', body: formData });
      if (!res.ok) {
        let body: unknown;
        try { body = await res.json(); } catch { body = await res.text(); }
        throw new ApiError(`API error ${res.status}: ${res.statusText}`, res.status, body);
      }
      return res.json() as Promise<InquiryResponse>;
    }

    return this.request<InquiryResponse>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ── Downloads (Brochure Gate) ─────────────────────────

  async submitDownload(
    data: DownloadRequest,
  ): Promise<{ message: string; id: number }> {
    return this.request<{ message: string; id: number }>('/downloads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ── Banners ───────────────────────────────────────────

  async getBanners(position?: Banner['position']): Promise<Banner[]> {
    const params = new URLSearchParams();
    if (position) params.set('position', position);
    const query = params.toString();

    return this.request<Banner[]>(`/banners${query ? `?${query}` : ''}`);
  }

  // ── Client Logos ──────────────────────────────────────

  async getClientLogos(): Promise<ClientLogo[]> {
    return this.request<ClientLogo[]>('/client-logos');
  }
}

// Singleton instance for client-side use
export const apiClient = new ApiClient();

// Export class for testing / custom instances
export { ApiClient, ApiError };
