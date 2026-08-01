
export interface Product {
    _id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    category: string,
    images: string[],
    averageRating: number,
    totalReviews: number,
    createdAt: string
    updatedAt: string
}

export interface User {
    _id: string,
    clerkId: string,
    email: string,
    name: string,
    imageUrl: string,
    role: "customer"|"admin",
    addresses: string[],
    wishList: string[],
    createdAt: string,
    updatedAt: string,
}

export interface CartItem {
    _id: string,
    product: Product,
    quantity: number
}
export interface Cart {
    _id: string,
    user: string,
    clerkId: string,
    items: CartItem[],
    createdAt: string,
    updatedAt: string,
}

export interface Address {
    _id:string,
    label:string
    fullName: string,
    streetAddress: string,
    city: string,
    state: string,
    zipCode: string,
    phoneNumber: string,
    isDefault: boolean,
}

export interface Order {
    _id: string,
    user: String,
    clerkId: string,
    orderitems: OrdertItem[],
    shippingAddress: {
        fullName: string,
        streetAddress: string,
        city: string,
        state: string,
        zipCode: string,
        phoneNumber: string,
    },
    paymentResult:{
        id:string,
        status:string,
    },
    totalPrice:number,
    status:"pending"|"shipped"|"delivered"|"cancilled",
    hasReviewed:number,
    createdAt:string,
    updatedAt:string,
}

export interface OrdertItem{
    _id:string,
    product: string | Product,
    name:string,
    price:number,
    quantity:number,
    image:string,
}

export interface Review {
      _id:string,
      productId:string
      userId:string | User
      orderId:string
      rating:number
      creadedAt:string
      updatedAt:string
}