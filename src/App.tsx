import { Route, BrowserRouter as Router, Routes } from 'react-router';
import './App.css';
import ProductLists from './components/ProductLists';
import { ProductProvider } from './context/ProductProvider';
const App: React.FC = () => {
    return (
      <ProductProvider>
        <Router>
          <div className="container mx-auto px-4">
            <main>
              <Routes>
                <Route path="/" element={<ProductLists />} />
                {/* <Route path="/new-product" element={<ProductForm />} /> */}
                {/* <Route path="/edit-product/:sku" element={<ProductForm />} /> */}
              </Routes>
            </main>
          </div>
        </Router>
      </ProductProvider>
    );
  };
  

export default App
