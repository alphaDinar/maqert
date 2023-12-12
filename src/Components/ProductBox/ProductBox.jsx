import styles from './product.module.css';
import { icon, iconFont } from '../../External/Design';
import { Link, useNavigate } from 'react-router-dom';
import { solveRatings } from '../../External/math';
import { useCart, useCartInfo, useCartTrigger, useWishList } from '../../main';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth, fireStoreDB } from '../../Firebase/base';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProductBox = ({ props }) => {
  const navigate = useNavigate();
  const { products } = props;
  const { cart, setCart } = useCart();
  const { cartInfo, setCartInfo } = useCartInfo();
  const { cartTrigger, setCartTrigger } = useCartTrigger();
  const {wishList, setWishList} = useWishList();
  const [uid, setUid] = useState('');


  useEffect(() => {
    onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        setUid(user.uid)
        getDoc(doc(fireStoreDB, 'Customers/' + user.uid))
          .then((res) => {
            if (res.data().wishList) {
              setWishList(res.data().wishList)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })

    AOS.init({
      duration: "1000",
    })
  }, [])

  const addToCart = (product) => {
    const itemObj = {
      pid: product.pid,
      name: product.name,
      category: product.category,
      media: JSON.parse(product.media)[0].url,
      quantity: 1,
      price: Number(product.price),
      total: Number(product.price),
    }

    const itemExists = cart.find((el) => el.pid === product.pid);
    if (itemExists) {
      itemExists.quantity += 1;
      itemExists.total += Number(product.price);
      cartInfo.itemCount += 1;
      cartInfo.total += Number(product.price);
      localStorage.setItem('cart', JSON.stringify(cart))
      localStorage.setItem('cartInfo', JSON.stringify(cartInfo))
    } else {
      cartInfo.itemCount += 1;
      cartInfo.total += Number(product.price);
      const updatedCart = [...cart, itemObj];
      setCart(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      localStorage.setItem('cartInfo', JSON.stringify(cartInfo))
    }
    const updatedTrigger = cartTrigger + 1;
    setCartTrigger(updatedTrigger)
  }

  const addToWishList = (pid) => {
    const itemExists = wishList.find((el) => el === pid)
    if (itemExists) {
      const updatedWishList = wishList.filter((el) => el !== pid);
      setWishList(updatedWishList)
      updateDoc(doc(fireStoreDB, 'Customers/' + uid), {
        wishList: updatedWishList,
      })
    } else {
      const updatedWishList = [...wishList, pid];
      setWishList(updatedWishList)
      updateDoc(doc(fireStoreDB, 'Customers/' + uid), {
        wishList: updatedWishList,
      })
    }
  }

  return (
    <section className={styles.products}>
      {products.map((product, i) => (
        <div key={i} className={styles.product} data-aos="fade-up" data-aos-delay={100 * i}>
          <img src={JSON.parse(product.media)[0].url} />
          <div>
            {
              wishList.find((el)=> el === product.pid) ? 
              <sup className={styles.supLeft} onClick={() => { addToWishList(product.pid) }}>{iconFont('fa-solid fa-heart')}</sup> :
              <sup className={styles.supLeft} onClick={() => { addToWishList(product.pid) }}>{iconFont('fa-regular fa-heart')}</sup>
            }

            <sup className={styles.supRight}>Buy Now</sup>

            <Link to={`/products/${product.category}`} style={{ height: 'auto' }}>
              <small>
                {product.category}
              </small>
            </Link>
            <span className='cut' onClick={() => { navigate(`/viewProduct/${product.pid}`) }} style={{ textAlign: 'center' }}>{product.name}</span>
            <sub>GH₵ {parseInt(product.price).toLocaleString()}</sub>
            <article>
              <p>
                <legend>
                  {Array(solveRatings(product.ratings)).fill().map((el) => (
                    iconFont('fa-solid fa-star', 'orange')
                  ))}
                </legend>
                <small>({product.ratings.length})</small>
              </p>
            </article>
          </div>            
          <button onClick={() => { addToCart(product) }}><span style={{color:'white'}}>Add To Cart</span> {icon('add_shopping_cart')}</button>
        </div>
      ))}


      {products.length === 0 &&
        Array(10).fill().map(() => (
          <Skeleton className={styles.product} height={230}></Skeleton>
        ))
      }
    </section>
  );
}

export default ProductBox;