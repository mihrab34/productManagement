export type ProductType = 'DVD' | 'Book' | 'Furniture';

export interface Product {
    sku: string;
    name: string;
    price: number;
    imageUrl: string;
    type: ProductType;
    attributes: {
      size?: number;
      weight?: number;
      dimensions?: {
        height: number;
        width: number;
        length: number;
      };
    };
    createdAt: number;
  }


  export interface ProductContextType {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProducts: (sku: string[]) => void;
    getProduct: (sku: string) => Product | undefined;
    }