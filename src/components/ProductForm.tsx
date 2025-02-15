import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { Product, ProductType } from '../types/product';



const ProductForm: React.FC = () => {
    const { sku } = useParams();
    const navigate = useNavigate();
    const { addProduct, updateProduct, getProduct } = useProduct();
    const [formData, setFormData] = useState<Partial<Product>>({
      sku: '',
      name: '',
      price: 0,
      imageUrl: '',
      type: 'DVD' as ProductType,
      attributes: {}
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
  
    useEffect(() => {
      if (sku) {
        const product = getProduct(sku);
        if (product) {
          setFormData(product);
        }
      }
    }, [sku]);
  
    const validateForm = () => {
      const newErrors: Record<string, string> = {};
  
      if (!formData.sku) newErrors.sku = 'Please, submit required data';
      if (!formData.name) newErrors.name = 'Please, submit required data';
      if (!formData.price || formData.price <= 0) newErrors.price = 'Please, provide valid price';
      if (!formData.imageUrl) newErrors.imageUrl = 'Please, submit required data';
  
      switch (formData.type) {
        case 'DVD':
          if (!formData.attributes?.size) {
            newErrors.size = 'Please, provide size';
          }
          break;
        case 'Book':
          if (!formData.attributes?.weight) {
            newErrors.weight = 'Please, provide weight';
          }
          break;
        case 'Furniture':
          if (!formData.attributes?.dimensions?.height) {
            newErrors.height = 'Please, provide height';
          }
          if (!formData.attributes?.dimensions?.width) {
            newErrors.width = 'Please, provide width';
          }
          if (!formData.attributes?.dimensions?.length) {
            newErrors.length = 'Please, provide length';
          }
          break;
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        if (sku) {
          updateProduct(formData as Product);
        } else {
          addProduct({
            ...formData,
            createdAt: Date.now()
          } as Product);
        }
        navigate('/');
      }
    };
  
    const handleCancel = () => {
      navigate('/');
    };
  
    return (
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
        <div className="mb-4">
          <label htmlFor="sku" className="block mb-2">SKU</label>
          <input
            id="sku"
            type="text"
            value={formData.sku}
            onChange={e => setFormData({ ...formData, sku: e.target.value })}
            className="w-full border p-2 rounded"
          />
          {errors.sku && <p className="text-red-500">{errors.sku}</p>}
        </div>
  
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
  
        <div className="mb-4">
          <label htmlFor="price" className="block mb-2">Price</label>
          <input
            id="price"
            type="number"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full border p-2 rounded"
          />
          {errors.price && <p className="text-red-500">{errors.price}</p>}
        </div>
  
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block mb-2">Image URL</label>
          <input
            id="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full border p-2 rounded"
          />
          {errors.imageUrl && <p className="text-red-500">{errors.imageUrl}</p>}
        </div>
  
        <div className="mb-4">
          <label htmlFor="productType" className="block mb-2">Product Type</label>
          <select
            id="productType"
            value={formData.type}
            onChange={e => setFormData({
              ...formData,
              type: e.target.value as ProductType,
              attributes: {}
            })}
            className="w-full border p-2 rounded"
          >
            <option value="DVD">DVD</option>
            <option value="Book">Book</option>
            <option value="Furniture">Furniture</option>
          </select>
        </div>
  
        {formData.type === 'DVD' && (
          <div className="mb-4">
            <label htmlFor="size" className="block mb-2">Size (MB)</label>
            <input
              id="size"
              type="number"
              value={formData.attributes?.size || ''}
              onChange={e => setFormData({
                ...formData,
                attributes: { size: Number(e.target.value) }
              })}
              className="w-full border p-2 rounded"
            />
            {errors.size && <p className="text-red-500">{errors.size}</p>}
            <p className="text-gray-600 mt-1">Please, provide size</p>
          </div>
        )}
  
        {formData.type === 'Book' && (
          <div className="mb-4">
            <label htmlFor="weight" className="block mb-2">Weight (Kg)</label>
            <input
              id="weight"
              type="number"
              value={formData.attributes?.weight || ''}
              onChange={e => setFormData({
                ...formData,
                attributes: { weight: Number(e.target.value) }
              })}
              className="w-full border p-2 rounded"
            />
            {errors.weight && <p className="text-red-500">{errors.weight}</p>}
            <p className="text-gray-600 mt-1">Please, provide weight</p>
          </div>
        )}
  
        {formData.type === 'Furniture' && (
          <>
            <div className="mb-4">
              <label htmlFor="height" className="block mb-2">Height (cm)</label>
              <input
                id="height"
                type="number"
                value={formData.attributes?.dimensions?.height || ''}
                onChange={e => setFormData({
                  ...formData,
                  attributes: {
                    ...formData.attributes,
                    dimensions: {
                      ...formData.attributes?.dimensions,
                      height: Number(e.target.value)
                    }
                  }
                })}
                className="w-full border p-2 rounded"
              />
              {errors.height && <p className="text-red-500">{errors.height}</p>}
            </div>
  
            <div className="mb-4">
              <label htmlFor="width" className="block mb-2">Width (cm)</label>
              <input
                id="width"
                type="number"
                value={formData.attributes?.dimensions?.width || ''}
                onChange={e => setFormData({
                  ...formData,
                  attributes: {
                    ...formData.attributes,
                    dimensions: {
                      ...formData.attributes?.dimensions,
                      width: Number(e.target.value)
                    }
                  }
                })}
                className="w-full border p-2 rounded"
              />
              {errors.width && <p className="text-red-500">{errors.width}</p>}
            </div>
  
            <div className="mb-4">
              <label htmlFor="length" className="block mb-2">Length (cm)</label>
              <input
                id="length"
                type="number"
                value={formData.attributes?.dimensions?.length || ''}
                onChange={e => setFormData({
                  ...formData,
                  attributes: {
                    ...formData.attributes,
                    dimensions: {
                      ...formData.attributes?.dimensions,
                      length: Number(e.target.value)
                    }
                  }
                })}
                className="w-full border p-2 rounded"
              />
                {errors.length && <p className="text-red-500">{errors.length}</p>}
            </div>
          </>