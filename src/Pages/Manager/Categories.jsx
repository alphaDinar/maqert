import { Link, useNavigate } from "react-router-dom";
import ManagerSidebar from "../../Components/ManagerSidebar/ManagerSidebar";
import { useLoader, useManagerSidebar } from "../../main";
import productStyles from '../../Components/ProductBox/product.module.css';
import styles from '../../Styles/Manager/categories.module.css';
import { icon } from "../../External/Design";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireStoreDB } from "../../Firebase/base";

const Categories = () => {
  const navigate = useNavigate();
  const { setLoader } = useLoader();
  const { managerSidebar } = useManagerSidebar();

  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getDocs(collection(fireStoreDB, 'Categories/'))
      .then((res) => {
        setCategoryList(res.docs.map((el) => el.data()))
        setLoader(false)
      })
  }, [])

  const deleteCategory = () => {
    console.log('del')
  }

  return (
    <section className="managerPage">
      <ManagerSidebar />

      <main className={managerSidebar ? 'managerPanel' : 'managerPanel change'} >
        <header>
          <strong>Categories</strong>
        </header>

        <section className={styles.categories} style={{ gap: '1rem' }}>
          <Link to={'/manager/addCategory'} className={`${productStyles.product} ${productStyles.add}`}>
            {icon('add')}
          </Link>
          {categoryList.map((el,i) => (
            <div key={i} className={styles.category}>
              <img src={el.media} alt="" />
              <nav>
                <legend onClick={() => { navigate(`/manager/editCategory/${el.name}`) }}>{icon('edit')}</legend>
                <legend onClick={() => { deleteCategory('el') }} >{icon('delete')}</legend>
              </nav>
              <span>{el.name}</span>
            </div>
          ))}
        </section>
      </main>


    </section>
  );
}

export default Categories;