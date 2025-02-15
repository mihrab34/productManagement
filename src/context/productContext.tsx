import { createContext } from "react";
import { ProductContextType } from "../types/product";


export const ProductContext = createContext<ProductContextType | undefined>(undefined);
