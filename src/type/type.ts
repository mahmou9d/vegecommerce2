export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  access: string;
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  refresh: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password1: string;
  password2: string;
}

export interface SignupResponse {
  message: string;
}
export interface CartItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  img_url: string;
}

export interface CartResponse {
  items: CartItem[];
  total?: number;
}

export interface CheckoutResponse {
  order_id: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface EditCartRequest {
  product_id: number;
  quantity: number;
}

export interface RemoveCartRequest {
  product_id: number;
}
export interface CheckoutSessionRequest {
    order_id: number;
}

export interface CheckoutSessionResponse {
    url?: string;
    session_id?: string;
    // عدّل حسب الـ response الفعلي من الـ API
}
export interface TReview {
    id: number;
    comment: string;
    rating: number;
    customer: string;
    created: string;
    product: string;
}

export interface ReviewsResponse {
    reviews: TReview[];
}

export interface AddReviewRequest {
    product_id: number;
    comment: string;
    rating: number;
}
export interface OrderRecent {
    id: number;
    customer: string;
    status: string;
    total_price: number;
}

export interface SalesOrder {
    month: string;
    orders: number;
    sales: number;
}

export interface TopSellingProduct {
    id: number;
    name: string;
    sales: number;
}

// Response Types
export interface OrderRecentResponse {
    orders: OrderRecent[];
}

export interface OrdersCountResponse {
  orders: string;
  shipped: string;
  pending: string;
  delivered: string;
  cancelled?: string;
}

export interface UsersCountResponse {
    users: number;
}

export interface TotalSalesResponse {
    total_sales: number;
}

export interface TopSellingResponse {
    topSelling: TopSellingProduct[];
}
export interface TProduct {
  id?: number;
    product_id?: number;
    name: string;
    description: string;
    original_price: string;
    final_price?: string;
    discount: number;
    stock: number;
    categories: string[];
    tags: string[];
    img?: string;
    average_rating?: number;
    img_url?: string;
}

export interface WishlistResponse {
    wishlist: {
        products: TProduct[];
    };
}
export interface TProductInput {
    name: string;
    description: string;
    original_price: string;
    discount: number;
    stock: number;
    categories: string[];
    tags: string[];
    img: File[];
}

export interface ProductsCountResponse {
    total_products: number;
}
export interface Counted {
    orders: string;
    shipped: string;
    pending: string;
    delivered: string;
    cancelled?: string;
    paid?:string
}

