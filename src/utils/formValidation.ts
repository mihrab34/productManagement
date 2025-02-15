
    import { Product, ProductFormData } from "../types/product";
    export const validateForm = (formData: ProductFormData, sku: string, products: Product[], setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
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