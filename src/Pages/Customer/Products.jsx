import { Link, useParams } from "react-router-dom";
import MiniNav from "../../Components/Navbar/MiniNav";
import Navbar from "../../Components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { useLoader } from "../../main";
import { collection, getDocs, query, where } from "firebase/firestore";
import { fireStoreDB } from "../../Firebase/base";
import ProductBox from "../../Components/ProductBox/ProductBox";

const Products = () => {
  const {id} = useParams();
  const { setLoader } = useLoader();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoader(true)
    let categoryQuery = query(collection(fireStoreDB, 'Products/'), where("category", "==", id))
    if(id === 'all' || id === 'All'){
      categoryQuery = collection(fireStoreDB, 'Products/')
    }

    getDocs(categoryQuery)
      .then((res) => {
        setProducts(res.docs.map((el) => el.data()).slice(0, 50))
        setLoader(false)
      })

  }, [id])

  return (
    <section className="wrapper">
      <Navbar />
      <MiniNav />

      <section className="categoryBox">
        <h2>Products | {id} ({products.length})  <sub></sub></h2>

        <ProductBox props={{ products }} />
      </section>
    </section>
  );
}

export default Products;