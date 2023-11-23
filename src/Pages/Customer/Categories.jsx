import { Link } from "react-router-dom";
import MiniNav from "../../Components/Navbar/MiniNav";
import Navbar from "../../Components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { useLoader } from "../../main";
import { collection, getDocs } from "firebase/firestore";
import { fireStoreDB } from "../../Firebase/base";

const Categories = () => {
  const {setLoader} = useLoader();
  const [categoryList, setCategoryList] = useState([]);

  useEffect(()=>{
    setLoader(false)
    getDocs(collection(fireStoreDB, 'Categories/'))
    .then((res)=>{
      setCategoryList(res.docs.map((el)=> el.data()))
    })
  }, [])

  return (
    <section className="wrapper">
      <Navbar />
      <MiniNav />

      <section className="categoryBox">
        <h2>Categories <sub></sub></h2>

        <section>
          {categoryList.map((category)=>(
            <Link to={`/products/${category.name}`} style={{backgroundImage: `url(${category.media})`}}>
              <span>{category.name}</span>
            </Link>
          ))}
        </section>
      </section>
    </section>
  );
}

export default Categories;