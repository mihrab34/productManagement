import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../context/productContext';
import { Product } from '../types/product';

const ProductLists: React.FC = () => {
    const { products, deleteProducts } = useProduct();
    const navigate = useNavigate();
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const sortedProducts = [...products.sort((a: Product, b: Product) => b.createdAt - a.createdAt)];
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

    const productAttributeFormatters = {
        DVD: (product: Product) => `Size: ${product.attributes.size} MB`,
        Book: (product: Product) => `Weight: ${product.attributes.weight} kg`,
        Furniture: (product: Product) => {
            const { height, width, length } = product.attributes.dimensions!;
            return `Dimensions: ${height} x ${width} x ${length} cm`;
        },
    } as const;

    const renderProductAttribute = (product: Product) => {
        const formatter = productAttributeFormatters[product.type as keyof typeof productAttributeFormatters];
        return formatter?.(product) ?? '';
    };

    return (
        <div>
            <div className="flex justify-between align-middle mb-4 border-b-2 pt-4 pb-3">
                <h1>Product List</h1>
                <div className='flex gap-2'>
                    {selectedProducts.length > 0 ? (
                        <button
                            className="bg-green-700 text-white px-3 py-1 rounded cursor-pointer"
                            onClick={() => navigate(`/edit-product/${selectedProducts[0]}`)}
                        >
                            EDIT
                        </button>
                    ) : (
                        <button
                            className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
                            onClick={() => navigate('/new-product')}
                        >
                            ADD
                        </button>
                    )}
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                        onClick={handleMassDelete}
                    >
                        MASS DELETE
                    </button>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentProducts.map(product => (
                    <div key={product.sku} className="border p-4 rounded">

                        <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.sku)}
                            onChange={() => handleCheckboxChange(product.sku)}
                            className="mb-2"
                        />
                        <div className='text-center'>
                            <p>{product.sku}</p>
                            <a
                                href={product.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {product.name}
                            </a>
                            <p>{product.price}</p>
                            <p>{renderProductAttribute(product)}</p>
                        </div>

                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
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