import axiosInstance from "./axios"



export const productsApi = {
    getAllProducts: async () => {
        const { data } = await axiosInstance.get("/admin/products")
        return data
    },

    createProducts: async (formDate) => {
        const { data } = await axiosInstance.post("/admin/products", formDate)
        return data
    },

    updateProduct: async ({ id, formDate }) => {
        const { data } = await axiosInstance.put(`/admin/products/${id}`, formDate)
        return data
    },

}

export const orderApi = {
    getAllOrders: async () => {
        const { data } = await axiosInstance.get("/admin/orders")
        return data
    },

    updateOrderStatus: async ({orderId, status}) => {
        const { data } = await axiosInstance.patch(`/admin/orders/${orderId}/status`,{status})
        return data
    }
}

export const userApi ={
    syncUser: async ()=>{
        const {data}= await axiosInstance.post("/users/sync-user")
        return data
    }
}