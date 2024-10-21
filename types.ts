export type IProduct = {
  imgs: string[];
  name: string;
  price: number;
  _id?: string;
  stock: number;
  hasDiscount: boolean;
  discountedPrice: number;
  availableColors: string[];
  collection: string;
  rating: number;
  description?: string;
  isNew?: boolean;
  selectedColor?: string;
  discountedPercentage?: number;
};

export type IBuySet = {
  completeSetId: string;
  productIds: string[];
};

export type IProductFilter = "001" | "002" | "003";
export type IUserRole = "user" | "admin" | "superuser";

export type IUser = {
  id?: string;
  name: string;
  avatar: string;
  email: string;
  address: {
    state: string;
    lga: string;
  };
  totalSpent: number;
  role: IUserRole;
  recentOrder: {
    orders: number;
    products: IOrder[];
  };
};

export type IPaymentStatus = "Pending" | "Paid" | "Failed";

export type IDeliveryMethod = "waybill" | "pick_up";

export type IOrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export type IOrderProducts = (IProduct & { colorPrefrence: string })[];

export type IOrder = {
  _id?: string;
  items: IOrderProducts;
  orderDate: Date | string | number;
  totalAmount: number;
  address: {
    state: string;
    lga: string;
    address: string;
  };
  paymentStatus: IPaymentStatus;
  orderStatus: IOrderStatus;
  deliveryFee: number;
  paymentLink: string;
  customer: {
    name?: string;
    phoneNumber?: string;
    email: string;
    note?: string;
  };
};

export type ICollection = {
  image: string;
  name: string;
  slug: string;
  remainingInStock: number;
};

export type AdminMessage = {
  id: string;
  title: string;
  message: string;
  createdAt: string | Date;
};

export type IBanner = {
  message: string;
  description?: string;
  productId: string;
};

export type IPromotion = {
  discountPercentage: number;
  applicableTo: "AllProducts" | "SelectedProducts";
  productIds?: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
};

export interface IGoogleUser {
  email: string;
  picture?: string;
  given_name?: string;
}

export type IWebHookStatus = "successful" | "failed";

export type IFlutterwaveWebHook = {
  event: string; // "charge.completed" in this case
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    device_fingerprint: string;
    amount: number;
    currency: string; // "NGN"
    charged_amount: number;
    app_fee: number;
    merchant_fee: number;
    processor_response: string;
    auth_model: string; // "PIN", etc.
    ip: string;
    narration: string;
    status: IWebHookStatus;
    payment_type: string; // "card", etc.
    created_at: string; // Date string
    account_id: number;
    meta: IOrder;
    customer: {
      id: number;
      name: string;
      email: string;
      created_at: string; // Date string
    };
  };
};
