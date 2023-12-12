import './Styles/App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Customer/Home';
import Checkout from './Pages/Customer/Checkout';
import Register from './Pages/Customer/Register';
import Loader from './Components/Loader/Loader';
import Products from './Pages/Customer/Products';
import ManagerProducts from './Pages/Manager/Products';
import AddProduct from './Pages/Manager/AddProduct';
import ViewProduct from './Pages/Customer/ViewProduct';
import Test from './Test';
import EditProduct from './Pages/Manager/EditProduct';
import ViewCategory from './Pages/Customer/viewCategory';
import Categories from './Pages/Customer/Categories';
import ManagerCategories from './Pages/Manager/Categories';
import AddCategory from './Pages/Manager/AddCategory';
import AllProducts from './Pages/Customer/AllProducts';
import EditCategory from './Pages/Manager/EditCategory';

function App() {
  return (
    <>
      <Loader />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/categories' element={<Categories/>} />
        <Route path='/products/:id' element={<Products/>} />
        <Route path='allProducts' element={<AllProducts/>} />
        <Route path='/viewProduct/:id' element={<ViewProduct/>}/>
        <Route path='/viewCategory/:id' element={<ViewCategory/>}/>
        <Route path='/checkout' element={<Checkout />} />


        <Route path='manager/products' element={<ManagerProducts />} />
        <Route path='manager/addProduct' element={<AddProduct />} />
        <Route path='manager/editProduct/:id' element={<EditProduct/>} />
        <Route path='manager/categories' element={<ManagerCategories/>} />
        <Route path='manager/addCategory' element={<AddCategory />} />
        <Route path='manager/editCategory/:id' element={<EditCategory/>} />

        <Route path='test' element={<Test/>} />
      </Routes>
    </>
  )
}

export default App
