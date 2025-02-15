export type ProductType = 'DVD' | 'Book' | 'Furniture';


interface ProductAttributes{
  size?: number;
  weight?: number;
  dimensions?: {
    height: number;
    width: number;
    length: number;
  };
}

export interface Product {
    sku: string;
    name: string;
    price: number;
    imageUrl: string;
    type: ProductType;
    attributes: ProductAttributes;
    createdAt: number;
  }

  export type ProductFormData = Omit<Product, 'createdAt'> & { createdAt?: number };



