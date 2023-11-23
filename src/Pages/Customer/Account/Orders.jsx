import { useEffect, useState } from "react";
import AccountSidebar from "../../../Components/AccountSidebar/AccountSidebar";
import MiniNav from "../../../Components/Navbar/MiniNav";
import Navbar from "../../../Components/Navbar/Navbar";
import styles from '../../../Styles/Customer/Account/orders.module.css';
import { useLoader } from "../../../main";
import { icon } from "../../../External/Design";

const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1697224824/iphone-15_g1evtv.jpg';

const Orders = () => {
  const { setLoader } = useLoader();
  const username = 'King Kong';
  const [orderType, setOrderType] = useState('all');
  const [orders, setOrders] = useState([]);
  const [targetOrder, setTargetOrder] = useState(null);

  const ordersList = [{
    oid : 111,
    cart: [
      { pid: '1', name: 'Both of these approaches will ensure that', 'category': 'home', price: '20', quantity: '4', total: '80', img: 'https' },
      { pid: '1', name: 'lamp', 'category': 'home', price: '20', quantity: '4', total: '80', img: 'https' },
      { pid: '1', name: 'lamp', 'category': 'home', price: '20', quantity: '4', total: '80', img: 'https' },
    ],
    total: 160,
    status: 'active',
    timestamp: '11111',
    address: { city: 'kumasi', contact: '0558420368', town: 'ayeduase' }
  },
  {
    cart: [
      { pid: '1', name: 'lamp', 'category': 'home', price: '20', quantity: '4', total: '80', img: 'https' },
      { pid: '1', name: 'lamp', 'category': 'home', price: '20', quantity: '4', total: '80', img: 'https' },
      { pid: '1', name: 'lamp', 'category': 'home', price: '20', quantity: '4', total: '80', img: 'https' },
    ],
    total: 160,
    status: 'completed',
    timestamp: '11111',
    address: { city: 'kumasi', contact: '0558420368', town: 'ayeduase' }
  }
  ]

  const changeOrderType = (val) => {
    setOrderType(val)
    if(val === 'all'){
      setOrders(ordersList)
    }else{
      setOrders(ordersList.filter((el)=>el.status === val))
    }
  }

  useEffect(() => {
    setLoader(false)
    setOrders(ordersList)
  }, [])
  
  const handleTargetOrder =(val)=>{
    if(targetOrder === val){
      setTargetOrder(null)
    }else{
      setTargetOrder(val)
    }
  }

  return (
    <section className="wrapper">
      <Navbar />
      <MiniNav />
      <section className='accountPanel'>
        <AccountSidebar props={{ username }} />
        <main>
          <header>
            <h2>My Orders<sub></sub></h2>
          </header>

          <section className={styles.orderBox}>
            <div className={styles.topNav}>
              <span onClick={() => { changeOrderType('all') }}>All <sub style={orderType === 'all' ? { width: '100%' } : { width: 0 }}></sub></span>
              <span onClick={() => { changeOrderType('active') }}>Active <sub style={orderType === 'active' ? { width: '100%' } : { width: 0 }}></sub></span>
              <span onClick={() => { changeOrderType('completed') }}>Completed <sub style={orderType === 'completed' ? { width: '100%' } : { width: 0 }}></sub></span>
            </div>

            <ul className={styles.orders}>
              {orders.map((order, i) => (
                <div key={i}>
                  <article>
                    <p className={styles.imgBox}>
                      {order.cart.map((el, ii) => (
                        ii < 2 &&
                        <img src={sample} />
                      ))}
                    </p>
                    <span onClick={()=>{handleTargetOrder(i)}}>2 Products {icon('expand_more')} </span>
                    <strong>GHc 4,500</strong>
                    <p className={styles.timeBox}>
                      <small>Delivery Date</small>
                      <small>25th - 27th Oct. 2023</small>
                    </p>
                    <sup>23/05/23</sup>
                    <sub></sub>
                  </article>
                  <p className={styles.products} style={i === targetOrder ? {display : 'flex'} : {display:'none'}}>
                    {order.cart.map((product, pi) => (
                      <li key={pi}>
                        <img src={sample} />
                        <span className="cut">{product.name}</span>
                        <span>{product.quantity}pcs.</span>
                        <strong>GHc {product.total}</strong>
                      </li>
                    ))}
                  </p>
                </div>
              ))}
            </ul>
          </section>
        </main>
      </section>
    </section>
  );
}

export default Orders;