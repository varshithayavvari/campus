/**
 * CampusBites API & Storage Service
 *
 * NOTE FOR PORTFOLIO & FUTURE BACKEND (Java Spring Boot / MySQL):
 * This service encapsulates all data access. Currently it uses HTML5 LocalStorage.
 * When integrating with Spring Boot:
 * Simply replace the internal LocalStorage methods with fetch(`${API_BASE_URL}/api/v1/...`)
 * calls. The data models and DTO structures are already aligned with standard REST conventions!
 */

import { CartItem, Order, StudentProfile, MenuItem } from '../types/food';
import { MENU_ITEMS } from '../data/menuData';

const STORAGE_KEYS = {
  CART: 'campusbites_cart_v1',
  FAVORITES: 'campusbites_favorites_v1',
  ORDERS: 'campusbites_orders_v1',
  PROFILE: 'campusbites_profile_v1',
  THEME: 'campusbites_theme_v1',
  COUPON: 'campusbites_coupon_v1',
};

// Initial default student profile
export const DEFAULT_PROFILE: StudentProfile = {
  name: 'Aarav Sharma',
  collegeId: 'CB2024-CS089',
  phone: '9876543210',
  department: 'Computer Science & Engineering',
  campusHostelOrBlock: 'Block B - Room 304'
};

export class ApiService {
  /**
   * Fetches all menu items (Equivalent to GET /api/v1/menu)
   */
  static async getMenuItems(): Promise<MenuItem[]> {
    return new Promise((resolve) => {
      // simulated micro-latency to simulate realistic API call
      setTimeout(() => resolve([...MENU_ITEMS]), 50);
    });
  }

  /**
   * Cart Operations (LocalStorage / GET & POST /api/v1/cart)
   */
  static getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveCart(cart: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to LocalStorage', e);
    }
  }

  /**
   * Favorites Operations
   */
  static getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : ['item-dosa', 'item-chole-bhature', 'item-tea'];
    } catch {
      return ['item-dosa', 'item-chole-bhature', 'item-tea'];
    }
  }

  static saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving favorites to LocalStorage', e);
    }
  }

  /**
   * Orders Operations (Equivalent to GET & POST /api/v1/orders)
   */
  static getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) {
        return JSON.parse(data);
      }
      // Provide an initial realistic past order for a rich demo experience
      const initialOrders: Order[] = [
        {
          id: 'CB10238',
          pickupToken: 'T-18',
          items: [
            { item: MENU_ITEMS[0], quantity: 1 },
            { item: MENU_ITEMS[11], quantity: 1 }
          ],
          subtotal: 80,
          discount: 0,
          packagingFee: 5,
          total: 85,
          studentName: 'Aarav Sharma',
          collegeId: 'CB2024-CS089',
          phone: '9876543210',
          pickupTime: '11:15 AM',
          notes: 'Crispy dosa with extra coconut chutney',
          appliedCoupon: null,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          estimatedReadyTime: '11:15 AM'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
      return initialOrders;
    } catch {
      return [];
    }
  }

  static saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to LocalStorage', e);
    }
  }

  /**
   * Student Profile Operations
   */
  static getProfile(): StudentProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  static saveProfile(profile: StudentProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile to LocalStorage', e);
    }
  }

  /**
   * Theme Preference (light | dark)
   */
  static getTheme(): 'light' | 'dark' {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (theme === 'dark' || theme === 'light') return theme;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    } catch {
      return 'light';
    }
  }

  static saveTheme(theme: 'light' | 'dark'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error('Error saving theme to LocalStorage', e);
    }
  }

  /**
   * Stored Coupon
   */
  static getSavedCoupon(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.COUPON);
    } catch {
      return null;
    }
  }

  static saveCoupon(code: string | null): void {
    try {
      if (code) {
        localStorage.setItem(STORAGE_KEYS.COUPON, code);
      } else {
        localStorage.removeItem(STORAGE_KEYS.COUPON);
      }
    } catch (e) {
      console.error('Error saving coupon to LocalStorage', e);
    }
  }
}
