import { useEffect, useState } from "react";
import ManagerSidebar from "../../Components/ManagerSidebar/ManagerSidebar";
import { useLoader, useManagerSidebar } from "../../main";
import productStyles from '../../Components/ProductBox/product.module.css';
import ProductBox from "../../Components/ProductBox/ProductBox";
import { icon } from "../../External/Design";
import { Link, useNavigate } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { fireStoreDB } from "../../Firebase/base";

const Products = () => {
  const {setLoader} = useLoader(); 
  const { managerSidebar } = useManagerSidebar();
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(()=>{
    getDocs(collection(fireStoreDB, 'Products/'))
    .then((res)=>{
      setProducts(res.docs.map((el)=> el.data()))
      setLoader(false)
    })
    .catch((error)=>{
      console.log(error)
    })
  },[])

  const deleteProduct =(el)=>{
    setLoader(true)
    const option = window.confirm(`Are you sure you want to delete ${el.name}`);
    if(option){
      deleteDoc(doc(fireStoreDB, 'Products/' + el.pid))
      .then(()=>{
        setProducts(products.filter((prod)=> prod.pid !== el.pid))
        setLoader(false)
      })
    }
  }

  return (
    <section className="managerPage">
      <ManagerSidebar />

      <main className={managerSidebar ? 'managerPanel' : 'managerPanel change'} >
        <header>
          <strong>Products</strong>
        </header>

        <section className={productStyles.products}>
          <Link to={'/manager/addProduct'} className={`${productStyles.product} ${productStyles.add}`}>
            {icon('add')}
          </Link>
          {products.length > 0 && products.map((el,i) => (
            <div className={productStyles.product} key={i}>
              <img src={JSON.parse(el.media)[0].url} />
              <div>
                <small>{el.category}</small>
                <span className='cut'>{el.name}</span>
                <sub>GH₵ {el.price}</sub>
              </div>
              <nav>
                <legend onClick={()=>{navigate(`/manager/editProduct/${el.pid}`)}}>{icon('edit')}</legend>
                <legend onClick={()=>{deleteProduct(el)}} >{icon('delete')}</legend>
              </nav>
            </div>
          ))}
        </section>
      </main>


    </section>
  );
}

export default Products;