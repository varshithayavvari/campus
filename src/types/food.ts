/**
 * CampusBites Type Definitions
 * Structured to cleanly map to Java Spring Boot DTOs and MySQL schemas for future backend integration.
 */

export type Category = 'breakfast' | 'lunch' | 'snacks' | 'beverages' | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: number; // in INR (₹)
  isVeg: boolean;
  rating: number; // out of 5
  ratingCount: number;
  prepTime: string; // e.g. "10 mins"
  prepTimeMinutes: number;
  calories?: string;
  isPopular?: boolean;
  isSpecial?: boolean;
  image: string;
  ingredients: string[];
  allergens?: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  customization?: string;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'completed';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  packagingFee: number;
  total: number;
  studentName: string;
  collegeId: string;
  phone: string;
  pickupTime: string;
  notes: string;
  appliedCoupon: string | null;
  status: OrderStatus;
  createdAt: string;
  estimatedReadyTime: string;
  pickupToken: string; // e.g. "T-42"
}

export interface StudentProfile {
  name: string;
  collegeId: string;
  phone: string;
  department: string;
  campusHostelOrBlock: string;
}

export interface Coupon {
  code: string;
  title: string;
  discountPercent: number;
  flatDiscount?: number;
  minOrder: number;
  description: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
