import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProduct } from '../context/ProductContext';
import { useImageUpload } from '../hooks/useImageUpload';
import { Product, ProductType } from '../types/Product';
import { generateSKU } from '../utils/generateSKU';



const ProductForm: React.FC = () => {
    const { sku } = useParams();
    const navigate = useNavigate();
    const { addProduct, updateProduct, getProduct, products } = useProduct();
    const { uploadImage, uploading, error: uploadError } = useImageUpload();

    const [formData, setFormData] = useState<Partial<Product>>({
        sku: '',
        name: '',
        price: 0,
        imageUrl: '',
        type: 'DVD' as ProductType,
        attributes: {}
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (sku) {
            const product = getProduct(sku);
            if (product) {
                setFormData(product);
            } else {
                navigate('/');
            }
        } else {
            // Generate new SKU for new products
            setFormData(prev => ({
                ...prev,
                sku: generateSKU()
            }));
        }
    }, [sku, getProduct, navigate]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Form validation
        if (!formData.sku?.trim()) {
            newErrors.sku = 'Please, submit required data';
        } else if (!sku && products.some((p: Product) => p.sku === formData.sku)) {
            newErrors.sku = 'SKU must be unique';
        }

        if (!formData.name?.trim()) {
            newErrors.name = 'Please, submit required data';
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Please, provide valid price';
        }

        if (!formData.imageUrl?.trim()) {
            newErrors.imageUrl = 'Please, submit required data';
        }

        // Type-specific validation
        switch (formData.type) {
            case 'DVD':
                if (!formData.attributes?.size || formData.attributes.size <= 0) {
                    newErrors.size = 'Please, provide valid size';
                }
                break;
            case 'Book':
                if (!formData.attributes?.weight || formData.attributes.weight <= 0) {
                    newErrors.weight = 'Please, provide valid weight';
                }
                break;
            case 'Furniture':
                {
                    const dimensions = formData.attributes?.dimensions;
                    if (!dimensions?.height || dimensions.height <= 0) {
                        newErrors.height = 'Please, provide valid height';
                    }
                    if (!dimensions?.width || dimensions.width <= 0) {
                        newErrors.width = 'Please, provide valid width';
                    }
                    if (!dimensions?.length || dimensions.length <= 0) {
                        newErrors.length = 'Please, provide valid length';
                    }
                    break;
                }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
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
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                submit: 'Failed to save product'
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const imageUrl = await uploadImage(file);
                setFormData(prev => ({
                    ...prev,
                    imageUrl
                }));
            } catch (error) {
                setErrors(prev => ({
                    ...prev,
                    imageUrl: 'Failed to upload image'
                }));
            }
        }
    };

    const handleTypeChange = (type: ProductType) => {
        setFormData(prev => ({
            ...prev,
            type,
            attributes: {} // Reset attributes when type changes
        }));
        setErrors({}); // Clear errors when type changes
    };

    const handleCancel = () => {
        navigate('/');
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">
                {sku ? 'Edit Product' : 'Add Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* SKU Field */}
                <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                        SKU
                    </label>
                    <input
                        id="sku"
                        type="text"
                        value={formData.sku}
                        onChange={e => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        disabled={!!sku} // Disable SKU field when editing
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.sku && (
                        <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
                    )}
                </div>

                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Price Field */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price ($)
                    </label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                        Image URL
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                        <input
                            id="imageUrl"
                            type="text"
                            value={formData.imageUrl}
                            onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Upload
                        </label>
                    </div>
                    {errors.imageUrl && (
                        <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                    )}
                    {uploadError && (
                        <p className="mt-1 text-sm text-red-600">{uploadError}</p>
                    )}
                </div>

                {/* Product Type Switcher */}
                <div>
                    <label htmlFor="productType" className="block text-sm font-medium text-gray-700">
                        Product Type
                    </label>
                    <select
                        id="productType"
                        value={formData.type}
                        onChange={e => handleTypeChange(e.target.value as ProductType)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="DVD">DVD</option>
                        <option value="Book">Book</option>
                        <option value="Furniture">Furniture</option>
                    </select>
                </div>

                {/* Dynamic Attributes Based on Type */}
                {formData.type === 'DVD' && (
                    <div>
                        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                            Size (MB)
                        </label>
                        <input
                            id="size"
                            type="number"
                            value={formData.attributes?.size || ''}
                            onChange={e => setFormData(prev => ({
                                ...prev,
                                attributes: { size: parseFloat(e.target.value) }
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.size && (
                            <p className="mt-1 text-sm text-red-600">{errors.size}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">Please, provide size in MB</p>
                    </div>
                )}

                {formData.type === 'Book' && (
                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                            Weight (Kg)
                        </label>
                        <input
                            id="weight"
                            type="number"
                            step="0.1"
                            value={formData.attributes?.weight || ''}
                            onChange={e => setFormData(prev => ({
                                ...prev,
                                attributes: { weight: parseFloat(e.target.value) }
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.weight && (
                            <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">Please, provide weight in Kg</p>
                    </div>
                )}

                {formData.type === 'Furniture' && (
                    <div className="space-y-4">
                        {/* Height input */}
                        <div>
                            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                                Height (cm)
                            </label>
                            <input
                                id="height"
                                type="number"
                                value={formData.attributes?.dimensions?.height || ''}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    attributes: {
                                        ...prev.attributes,
                                        dimensions: {
                                            ...(prev.attributes?.dimensions || {}),
                                            height: parseFloat(e.target.value) || 0
                                        }
                                    }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.height && (
                                <p className="mt-1 text-sm text-red-600">{errors.height}</p>
                            )}
                        </div>

                        {/* Width input */}
                        <div>
                            <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                                Width (cm)
                            </label>
                            <input
                                id="width"
                                type="number"
                                value={formData.attributes?.dimensions?.width || ''}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    attributes: {
                                        ...prev.attributes,
                                        dimensions: {
                                            ...(prev.attributes?.dimensions || {}),
                                            width: parseFloat(e.target.value) || 0
                                        }
                                    }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.width && (
                                <p className="mt-1 text-sm text-red-600">{errors.width}</p>
                            )}
                        </div>

                        {/* Length input */}
                        <div>
                            <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                                Length (cm)
                            </label>
                            <input
                                id="length"
                                type="number"
                                value={formData.attributes?.dimensions?.length || ''}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    attributes: {
                                        ...prev.attributes,
                                        dimensions: {
                                            ...(prev.attributes?.dimensions || {}),
                                            length: parseFloat(e.target.value) || 0
                                        }
                                    }
                                }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.length && (
                                <p className="mt-1 text-sm text-red-600">{errors.length}</p>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">Please, provide dimensions in HxWxL format</p>
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || uploading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>

                {errors.submit && (
                    <p className="mt-2 text-sm text-red-600">{errors.submit}</p>
                )}
            </form>
        </div>
    );
};

export default ProductForm;