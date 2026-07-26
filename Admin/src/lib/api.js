import axiosInstance from "./axios"



export const productsApi = {
    getAllProducts: async () => {
        const { data } = await axiosInstance.get("/admin/products")
        return data
    },

   createProducts: async (formData) => {
    try {
        const { data } = await axiosInstance.post("/admin/products", formData);
        return data;
    } catch (error) {
        // 🚀 Extract the header from the server response and attach it to the error object
        if (error.response && error.response.headers) {
            error.cidError = error.response.headers['x-cid-error'];
        }
        
        // Re-throw so TanStack Query knows the mutation failed
        throw error;
    }
},


    updateProduct: async ({ id, formData }) => {
        const { data } = await axiosInstance.put(`/admin/products/${id}`, formData)
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

export const statsApi ={
    getDashBoard: async()=>{
        const {data} = await axiosInstance.get("/admin/stats")
        return data
    }
}