import { Link, useParams } from "react-router-dom";
import MiniNav from "../../Components/Navbar/MiniNav";
import Navbar from "../../Components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { useLoader } from "../../main";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fireStoreDB } from "../../Firebase/base";
import ProductBox from "../../Components/ProductBox/ProductBox";
import { sortByTime } from "../../External/time";
import { sortByViews } from "../../External/math";

const AllProducts = () => {
  const { id } = useParams();
  const { setLoader } = useLoader();
  const [header, setHeader] = useState('All Products');
  const [products, setProducts] = useState([]);
  const [productsBank, setProductsBank] = useState([]);
  // const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    setLoader(true)
    const productsQuery = collection(fireStoreDB, 'Products/')
    getDocs(productsQuery)
      .then((res) => {
        setProducts(res.docs.map((el) => el.data()))
        setProductsBank(res.docs.map((el) => el.data()))
        setLoader(false)
      })
  }, [])


  const sortProducts =(val, title)=>{
    const updatedProducts = [...productsBank];
    setHeader(title);

    if(val === 'all'){
      setProducts(updatedProducts)
    }

    if(val === 'popular'){
      console.log('pop')
    }

    if(val === 'new'){
      updatedProducts.sort(sortByTime);
      setProducts(updatedProducts);
    }

    if(val === 'most'){
      updatedProducts.sort(sortByViews);
      setProducts(updatedProducts); 
    }
  }

  return (
    <section className="wrapper">
      <Navbar />
      <MiniNav />

      <section className="categoryBox">
      <header className="navBox">
      <p>
        <span onClick={()=>{sortProducts('all','All Products')}}>All Products<sub></sub></span>
        <span onClick={()=>{sortProducts('popular', 'Popular Products')}}>Popular Products <sub></sub></span>
        <span onClick={()=>{sortProducts('new', 'New Arrivals')}}>New Arrivals <sub></sub></span>
        <span onClick={()=>{sortProducts('favorite', 'We Think You"ll Love')}}>We Think You'll Love <sub></sub></span>
        <span onClick={()=>{sortProducts('most', 'Most Viewed Products')}}>Most Viewed Products <sub></sub></span>
      </p>
      <h2>{header}  <sub></sub></h2>
      </header>

        <ProductBox props={{ products }} />
      </section>
    </section>
  );
}

export default AllProducts;