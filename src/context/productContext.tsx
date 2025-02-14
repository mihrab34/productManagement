import React, { createContext } from "react";
import { Product } from "../types/product";

interface ProductContextType {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    }

export const ProductContext = createContext<ProductContextType>({
    products: [],
    setProducts: () => {}
})