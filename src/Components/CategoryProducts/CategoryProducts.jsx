import { icon, iconFont } from '../../External/Design';
import { solveRatings } from '../../External/math';
import styles from '../../Styles/Customer/home.module.css';
import { useCart, useCartInfo, useCartTrigger, useWishList } from '../../main';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth, fireStoreDB } from '../../Firebase/base';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const CategoryProducts = ({ props }) => {
  const { selectedCategory } = props;
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
    <section className={styles.categoryProducts}>
      {products.filter((prod) => prod.category == selectedCategory).map((el) => (
        <div>
          <img src={JSON.parse(el.media)[0].url} />
          <article>
            <small>{el.category}</small>
            <h3 className="cut">{el.name}</h3>
            <span style={{ fontWeight: 600 }}>GH₵ {el.price.toLocaleString()}</span>
            <p>
              <legend>
                {Array(solveRatings(el.ratings)).fill().map((el) => (
                  iconFont('fa-solid fa-star', 'orange')
                ))}
              </legend>
              <small>({el.ratings.length})</small>
            </p>
          </article>
          <nav>
            <button onClick={()=>{addToWishList(el)}} style={{cursor:'pointer'}}>{iconFont('fa-regular fa-heart')}</button>
            <button onClick={()=>{addToCart(el)}} style={{cursor:'pointer'}}>{icon('add_shopping_cart')}</button>
          </nav>
        </div>
      ))}
    </section>
  );
}

export default CategoryProducts;