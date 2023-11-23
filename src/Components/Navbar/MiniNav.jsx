import styles from './navbar.module.css';
import logo from '../../assets/logo.png';
import { icon } from '../../External/Design';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore';
import { fireStoreDB } from '../../Firebase/base';

const MiniNav = () => {
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getDocs(collection(fireStoreDB, 'Categories/'))
      .then((res) => {
        setCategoryList(res.docs.map((el) => el.data()))
      })
  }, [])
  return (
    <section className={styles.miniNav}>
      <nav>
        <Link to={`/allProducts`}>All</Link>
        {categoryList.slice(0, 4).map((el) => (
          <Link to={`/products/${el.name}`}>{el.name}</Link>
        ))}
        <Link to={`/categories`}><small style={{ color: 'salmon' }}>more...</small></Link>
      </nav>
      <nav>
        <span>{icon('history')} Order History</span>
      </nav>
    </section>
  );
}

export default MiniNav;