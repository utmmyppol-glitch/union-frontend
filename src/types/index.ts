// Post types
export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  category: 'NOTICE' | 'INSIGHT' | 'EVENT';
  thumbnailUrl: string | null;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// CustomerStory types
export interface CustomerStory {
  id: number;
  company: string;
  industry: string;
  title: string;
  content: string;
  thumbnailUrl: string | null;
  logoUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Inquiry types
export interface InquiryRequest {
  name: string;
  company: string;
  phone: string;
  email: string;
  message?: string;
  product?: string;
  consentPrivacy: boolean;
  consentMarketing?: boolean;
  file?: File;
}

export interface InquiryResponse {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  message: string;
  product: string;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

// Download (brochure gate) types
export interface DownloadRequest {
  name: string;
  company: string;
  phone: string;
  email: string;
  fileType?: string;
  consentPrivacy: boolean;
  consentMarketing?: boolean;
}

// Banner types
export interface Banner {
  id: number;
  title: string;
  imageUrl: string | null;
  linkUrl: string | null;
  position: 'HERO' | 'POPUP' | 'PROMOTION';
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

// ClientLogo types
export interface ClientLogo {
  id: number;
  name: string;
  logoUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

// Pagination
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Theme
export type Theme = 'light' | 'dark';
