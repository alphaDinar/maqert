import { useEffect, useState } from 'react';
import { icon } from '../../External/Design';
import styles from './managerSidebar.module.css';
import { useLoader, useManagerSidebar } from '../../main';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';

const ManagerSidebar = () => {
  const { managerSidebar, setManagerSidebar } = useManagerSidebar();

  useEffect(() => {
    setManagerSidebar(true)
  }, [])

  const toggleSidebar = () => {
    managerSidebar ? setManagerSidebar(false) : setManagerSidebar(true);
  }

  return (
    <section className={managerSidebar ? styles.sidebar : `${styles.sidebar} ${styles.change}`}>
      <Loader/>
      <legend onClick={toggleSidebar}>{icon('linear_scale')}</legend>

      <header>
        <strong>Admin</strong>
      </header>

      <nav>
        <Link to={'/manager/categories'}>
          {icon('category')}
          <span>Categories</span>
        </Link>
        <Link to={'/manager/products'}>
          {icon('inventory_2')}
          <span>Products</span>
        </Link>
        <Link to={'/manager/products'}>
          {icon('analytics')}
          <span>Analytics</span>
        </Link>
      </nav>

      <footer>
        {icon('power_settings_new')}
      </footer>
    </section>
  );
}

export default ManagerSidebar;