import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { Product } from '../types/product';

const ProductLists:React.FC = () => {
    const {products, deleteProducts} = useProduct();
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const sortedProducts = [...products.sort((a, b) => b.createdAt - a.createdAt)];
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleCheckboxChange = (sku: string) => {
        if (selectedProducts.includes(sku)) {
            setSelectedProducts(prev => prev.filter(id => id !== sku));
        } else {
            setSelectedProducts(prev => [...prev, sku]);
            }
    }

    const handleMassDelete = () => {
        deleteProducts(selectedProducts);
        setSelectedProducts([]);
    }

    const renderProductAttribute = (product: Product) => {
        switch (product.type) {
            case 'DVD':
                return `Size ${product.attributes.size} MB`;
            case 'Book':
                return `Weight ${product.attributes.weight} kg`;
            case 'Furniture':
                { const { height, width, length } = product.attributes.dimensions!;
                return `Dimensions ${height} x ${width} x ${length} cm`; }
            default:
                return '';
        }
    }
  return (
    <div>
        <div className="flex justify-between mb-4">
        <h1>Product List</h1>
        <div>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/new-product')}
        >
          ADD
        </button>
        {selectedProducts.length > 0 && (
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => navigate(`/edit-product/${selectedProducts[0]}`)}
          >
            EDIT
          </button>
        )}
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleMassDelete}
        >
          MASS DELETE
        </button>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentProducts.map(product => (
          <div key={product.sku} className="border p-4 rounded">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.sku)}
              onChange={() => handleCheckboxChange(product.sku)}
              className="mb-2"
            />
            <p>SKU: {product.sku}</p>
            <a 
              href={product.imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {product.name}
            </a>
            <p>Price: ${product.price}</p>
            <p>{renderProductAttribute(product)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
export default ProductLists;