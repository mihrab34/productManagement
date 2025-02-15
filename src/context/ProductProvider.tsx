import { useEffect, useState } from 'react';
import { ProductContext } from "../context/productContext";
import { Product } from "../types/product";


export const ProductProvider: React.FC <{ children: React.ReactNode }>  = ({ children }) => {
    const [products, setProducts] = useState<Product[]>(() => {
        const savedProducts = localStorage.getItem('products');
        return savedProducts ? JSON.parse(savedProducts) : [];
    });

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const addProduct = (product: Product) => {
        setProducts(prev => [...prev, {...product, createdAt: Date.now()}]);
    };

    const updateProduct = (product: Product) => {
        setProducts(prev => prev.map(p => p.sku === product.sku ? {...product, createdAt: p.createdAt} : p));
    };

    const deleteProducts = (sku: string[]) => {
        setProducts(prev => prev.filter(p => !sku.includes(p.sku)));
    };

    const getProduct = (sku: string) => {
        return products.find(p => p.sku === sku);
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProducts, getProduct }}>
            {children}
        </ProductContext.Provider>
    );
    };