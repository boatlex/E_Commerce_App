import React from 'react'
import { useState, } from 'react'
import { PencilIcon, PlusIcon, Trash2Icon, ImageIcon, XIcon } from "lucide-react"
import { productsApi } from "../lib/api"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { getStockStatusBadge } from '../lib/utils'



const ProductsPage = () => {

  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  })

  const queryClient = useQueryClient()


  const { data: response, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getAllProducts
  })
  const products = response?.products || response?.data || []

  const createProductMutation = useMutation({
    mutationFn: productsApi.createProducts,
    onSuccess: () => {
      closeModal()
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },

    onError:(response)=>{
      console.log( response.message),
      console.log("This CID Error:", response.cidError)
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: productsApi.updateProduct,

    onSuccess: () => {
      closeModal()
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    })
    setImages([])
    setImagePreviews([])
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    
    
  setFormData({
    name: product.name ?? "",
    category: product.category?? "", 
    price: product.price?.toString()?? "", 
    stock: product.stock?.toString()?? "", 
    description: product.description?? "", 
  })

    setImagePreviews(product.images || [])
    setShowModal(true)
  }


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 3) return alert("Maximum 3 images allowed")

    setImages(files)
    setImagePreviews(files.map((file) => URL.createObjectURL(file)))

  }


  const handleSubmit = (e) => {
    e.preventDefault()

    if (!editingProduct && imagePreviews.length === 0) {
      return alert("Please upload at least one image")
    }

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    formDataToSend.append("category", formData.category)
    formDataToSend.append("price", formData.price)
    formDataToSend.append("stock", formData.stock)
    formDataToSend.append("description", formData.description)

     if (images.length > 0) {
    images.forEach((image) => formDataToSend.append('images', image))
  } else if (editingProduct && imagePreviews.length > 0) {
    imagePreviews.forEach((url) => formDataToSend.append('existingImages', url))
  }



    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct?._id, formData: formDataToSend })
    } else {
      createProductMutation.mutate(formDataToSend)
    }
  }



    return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'> Products</h1>
          <p className='text-base-content/70 mt-1'>Manage Your Products Inventory</p>
        </div>

        <button onClick={() => setShowModal(true)} className='btn btn-primary gap-2'>
          <PlusIcon className='w-5 h-5' />
          Add Product
        </button>
      </div>

      {/* product Grid */}
      <div className='grid grid-cols-1 gap-4'>
        {isLoadingProducts ? (
          <div className="text-center py-10">Loading products...</div>
        ) : products?.map((product) => {
          const status = getStockStatusBadge(product?.stock)

          return (
            <div key={product?._id} className='card bg-base-100 shadow-xl'>
              <div className='card-body'>
                <div className='flex items-center gap-6'>
                  <div className='avatar'>
                    <div className='w-20 rounded-xl'>
                      <img src={product?.images?.[0] || "/placeholder.png"} alt={product?.name} />
                    </div>
                  </div>

                  <div className='flex-1'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='card-title'>{product?.name}</h3>
                        <p className='text-base-content/70 text-sm'>{product?.category}</p>
                      </div>
                      <div className={`badge ${status?.class || 'badge-ghost'}`}>
                        {status?.text || 'Unknown'}
                      </div>
                    </div>

                    <div className='flex items-center gap-6 mt-4'>
                      <div>
                        <p className='text-xs text-base-content/70'>Price</p>
                        <p className='font-bold text-lg'>${product?.price}</p>
                      </div>
                      <div>
                        <p className='text-xs text-base-content/70'>Stock</p>
                        <p className='font-bold text-lg'>{product?.stock} units</p>
                      </div>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button
                      className='btn btn-square btn-ghost'
                      onClick={() => handleEdit(product)}
                    >
                      <PencilIcon className='w-5 h-5' />
                    </button>
                    <button
                      className='btn btn-square btn-ghost text-error'
                    >
                      <Trash2Icon className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/*Add Edit Product Modal  */}
      <input type="checkbox" className='modal-toggle' checked={showModal} readOnly />
      <div className='modal'>
        <div className='modal-box max-w-2xl'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold text-2xl'>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <button type="button" onClick={closeModal} className='btn btn-sm btn-circle btn-ghost'>
              <XIcon className='w-5 h-5' />
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4 '>
              <div className='form-control'>
                <label className='label'>
                  <span>Product Name</span>
                </label>
                <input
                  type="text"
                  placeholder='Enter Product Name'
                  className='input input-bordered'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span>Category</span>
                </label>
                <select
                  className='select select-bordered'
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value=""> Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Machines">Machines</option>
                  <option value="Foods">Foods</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Furniture">Furniture</option>
                </select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Price ($)</span>
                </label>
                <input
                  type="number"
                  step='0.01'
                  placeholder='0.00'
                  className='input input-bordered'
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Stock</span>
                </label>
                <input
                  type="number"
                  placeholder='0'
                  className='input input-bordered'
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className='form-control flex flex-col gap-2'>
              <label className='label'>
                <span className='label-text'>Description</span>
              </label>
              <textarea
                placeholder='Enter Product Description'
                className='textarea textarea-bordered h-24 w-full'
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-semibold text-base flex items-center gap-2'>
                  <ImageIcon className='w-5 h-5' />
                  Product Images
                </span>
                <span className='label-text-alt text-xs opacity-60'>Maximum 3 Images</span>
              </label>

              <div className='bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors'>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className='file-input file-input-bordered file-input-primary w-full'
                  required={!editingProduct}
                />

                {editingProduct && (
                  <p className='text-xs text-base-content/60 mt-2 text-center'>
                    Leave Empty to Keep Current Images
                  </p>
                )}
              </div>

              {/* Safe image preview layout render block */}
              {imagePreviews?.length > 0 && (
                <div className='flex gap-2 mt-4'>
                  {imagePreviews.map((src, index) => (
                    <div key={index} className='relative w-20 h-20 border rounded-xl overflow-hidden'>
                      <img src={src} alt="Preview" className='w-full h-full object-cover' />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions Footer Buttons */}
            <div className='modal-action'>
              <button type="button" onClick={closeModal} className='btn btn-ghost'>
                Cancel
              </button>
              <button 
                type="submit" 
                className='btn btn-primary'
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {createProductMutation.isPending || updateProductMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage