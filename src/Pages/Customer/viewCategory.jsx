import { useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import MiniNav from "../../Components/Navbar/MiniNav";
import { useLoader } from "../../main";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireStoreDB } from "../../Firebase/base";
import ProductBox from "../../Components/ProductBox/ProductBox";

const ViewCategory = () => {
  const { id } = useParams();
  const { setLoader } = useLoader();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoader(false)

    getDocs(collection(fireStoreDB, 'Products/'))
      .then((res) => {
        const updatedProducts = res.docs.map((el) => el.data());
        setProducts(updatedProducts.filter((el) => el.category === id));
        setLoader(false);
      })
      .catch((error) => {
        console.log(error)
      })

  }, [])

  return (
    <section className="wrapper">
      <Navbar />
      <MiniNav />

      <section style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
        <h2>{id} <sub></sub></h2>

        <ProductBox props={{ products }} />
      </section>
    </section>
  );
}

export default ViewCategory;