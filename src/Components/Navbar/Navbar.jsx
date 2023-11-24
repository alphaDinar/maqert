import styles from './navbar.module.css';
import logo from '../../assets/logo.png';
import { icon } from '../../External/Design';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth';
import { fireAuth, fireStoreDB } from '../../Firebase/base';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useCart, useCartInfo, useCartTrigger, useWishList } from '../../main';

const Navbar = () => {
  const [searchIn, setSearchIn] = useState('');
  const [categoryMenuToggled, setCategoryMenuToggled] = useState(false);
  const [categoryMenuChoice, setCategoryMenuChoice] = useState('All');
  const [sideMenuToggled, setSideMenuToggled] = useState(false);
  const [sideCartToggled, setSideCartToggled] = useState(false);
  const [user, setUser] = useState('');
  const [categoryList, setCategoryList] = useState([]);

  const { cart, setCart } = useCart();
  const { cartInfo, setCartInfo } = useCartInfo();
  const { cartTrigger, setCartTrigger } = useCartTrigger();
  const { wishList, setWishList } = useWishList();

  const sidebarTags = [
    { label: 'My Account', iconEl: 'person', link: 'account', linkTo: '/account' },
    { label: 'Track Orders', iconEl: 'local_shipping', link: 'orders', linkTo: '/orders' },
    { label: 'Orders', iconEl: 'package', link: 'orders', linkTo: '/orders' },
    { label: 'Address', iconEl: 'location_pin', link: 'address', linkTo: '/' },
    { label: 'Payment Details', iconEl: 'account_balance_wallet', link: 'payment', linkTo: '/' },
  ]

  const toggleCategoryMenu = () => {
    categoryMenuToggled ? setCategoryMenuToggled(false) : setCategoryMenuToggled(true);
  }
  const toggleSideMenu = () => {
    sideMenuToggled ? setSideMenuToggled(false) : setSideMenuToggled(true);
  }
  const toggleSideCart = () => {
    sideCartToggled ? setSideCartToggled(false) : setSideCartToggled(true);
  }

  const changeCategory = (val) => {
    setCategoryMenuChoice(val)
  }

  useEffect(() => {
    if (localStorage.getItem('cart'), localStorage.getItem('cartInfo')) {
      setCart(JSON.parse(localStorage.getItem('cart')))
      setCartInfo(JSON.parse(localStorage.getItem('cartInfo')))
    }

    getDocs(collection(fireStoreDB, 'Categories/'))
      .then((res) => {
        setCategoryList(res.docs.map((el) => el.data()))
      })
    onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        setUser(user.displayName)
        getDoc(doc(fireStoreDB, 'Customers/' + user.uid))
          .then((res) => {
            setWishList(res.data().wishList)
          })
      }
    })
  }, [cartTrigger])

  const updateCartInfo = (cart) => {
    cartInfo.itemCount = cart.reduce((acc, el) => acc + el.quantity, 0);
    cartInfo.total = cart.reduce((acc, el) => acc + el.total, 0);
    localStorage.setItem('cart', JSON.stringify(cart))
    localStorage.setItem('cartInfo', JSON.stringify(cartInfo))
    const updatedTrigger = cartTrigger + 1;
    setCartTrigger(updatedTrigger)
  }

  const addToCart = (product) => {
    const itemExists = cart.find((el) => el.pid === product.pid);
    itemExists.quantity += 1;
    itemExists.total += Number(product.price);
    updateCartInfo(cart)
  }

  const remFromCart = (product) => {
    const itemExists = cart.find((el) => el.pid === product.pid);
    if (itemExists.quantity > 1) {
      itemExists.quantity += -1;
      itemExists.total += -Number(product.price);
    } else {
      const itemIndex = cart.indexOf(itemExists);
      cart.splice(itemIndex, 1)
    }
    updateCartInfo(cart)
  }

  return (
    <section className={styles.navbar}>
      <section onClick={toggleSideMenu} className={styles.sheet} style={sideMenuToggled ? { left: 0 } : { left: '-100%' }} ></section>
      <section onClick={toggleSideCart} className={styles.sheet} style={sideCartToggled ? { right: 0 } : { right: '-100%' }} ></section>


      <article className={styles.topNav}>
        <section>
          <legend className={styles.menuTab} onClick={toggleSideMenu}>{icon('menu')}</legend>
          <Link to={'/'}>
            <img src={logo} />
          </Link>
          <Link onClick={toggleSideCart}>
            <span>{icon('shopping_cart')}</span>
            <span>Cart</span>
            <sub>{cartInfo.itemCount}</sub>
          </Link>
        </section>
        <form>
          <input type="text" value={searchIn} onChange={(e) => { setSearchIn(e.target.value) }} placeholder='Search Product' />
          {icon('search')}
        </form>
      </article>

      <section className={styles.mainNav}>
        <legend className={styles.menuTab} onClick={toggleSideMenu}>{icon('menu')}</legend>

        <Link to={'/'}>
          <img src={logo} />
        </Link>

        <form onSubmit={(e) => { e.preventDefault() }}>
          <div className={styles.categoryMenu} style={categoryMenuToggled ? { display: 'flex' } : { display: 'none' }}>
            <sub onClick={toggleCategoryMenu}>{icon('close')}</sub>
            <h4>{categoryMenuChoice}</h4>
            <h3>Select Category</h3>
            <p>
              {categoryList.slice(0, 6).map((el) => (
                <span onClick={() => { changeCategory(el.name) }}>{el.name}</span>
              ))}
              <span onClick={() => { changeCategory('all') }}>All</span>
            </p>
          </div>

          <div className={styles.categorySelect} onClick={toggleCategoryMenu}>
            <span>{categoryMenuChoice}</span>
            {icon('expand_more')}
          </div>
          <input type="text" value={searchIn} onChange={(e) => { setSearchIn(e.target.value) }} />
          <button type="button">{icon('search')}</button>
        </form>
      </section>

      <nav>
        {user ?
          <Link to={'/account'}>
            {icon('person')}
            <span>{user}</span>
          </Link> :
          <Link to={'/register'}>
            {icon('person')}
            <span>Register</span>
          </Link>
        }
        <Link>
          {icon('favorite')}
          <span>Wishlist</span>
          <sub>{wishList.length}</sub>
        </Link>
        <div onClick={toggleSideCart}>
          <span>{icon('shopping_cart')}</span>
          <span>Cart</span>
          <sub>{cartInfo.itemCount}</sub>
        </div>
      </nav>

      <main className={sideCartToggled ? `${styles.sideCart} ${styles.change}` : styles.sideCart}>
        <legend onClick={toggleSideCart}>{icon('horizontal_rule')}</legend>
        <ul>
          <h2>shopping Cart <sub></sub></h2>
          {cart.map((el, i) => (
            <div key={i}>
              <img src={el.media} />
              <article>
                <p>
                  <span className='cut'>{el.name}</span>
                </p>
                <strong>GH₵ {el.price.toLocaleString()}</strong>
                <footer>
                  <sup onClick={() => { remFromCart(el) }}>{icon('remove')}</sup>
                  <small>{el.quantity}</small>
                  <sup onClick={() => { addToCart(el) }}>{icon('add')}</sup>
                </footer>
              </article>
            </div>
          ))}
        </ul>

        <article className={styles.sideCartFooter}>
          <p>
            <span>Total</span>
            <button>GH₵ {cartInfo.total.toLocaleString()}</button>
          </p>
          <p>
            <Link to={'/checkout'}>Checkout</Link>
          </p>
        </article>
      </main>

      <article className={sideMenuToggled ? `${styles.sideMenu} ${styles.change}` : styles.sideMenu}>
        <legend onClick={toggleSideMenu}>{icon('horizontal_rule')}</legend>

        {user ?
          <header>
            <h2>Hello <sub></sub></h2>
            <h1>{user}</h1>
          </header>
          :
          <header>
            <h2>Register <sub></sub></h2>
          </header>
        }
        <hr />
        {user ?
          <p className={styles.mid}>
            {sidebarTags.map((el, i) => (
              <Link to={el.linkTo} key={i}>
                <span>
                  {icon(el.iconEl)} <small>{el.label}</small> <sub className='material-symbols-outlined'>chevron_right</sub>
                </span>
              </Link>
            ))}
          </p> :
          <p className={styles.mid}>
            <Link to={'/allProducts'}><sup>Shop By Category <sub>see all</sub></sup></Link>
            {categoryList.slice(0, 7).map((el, i) => (
              <Link to={`/products/${el.name}`} key={i}>
                <span>
                  {icon('box')} <small>{el.name}</small> <sub className='material-symbols-outlined'>chevron_right</sub>
                </span>
              </Link>
            ))}
          </p>
        }

        <hr />

        {user ?
          <p>
            <Link>
              <span>
                {icon('power_settings_new')} <small>Logout</small> <sub className='material-symbols-outlined'>chevron_right</sub>
              </span>
            </Link>
          </p>
          :
          <span>All Products</span>
        }

      </article>

      <article className={styles.bottomNav}>
        <Link>
          {icon('home')}
          <small>Home</small>
        </Link>
        <Link>
          {icon('store')}
          <small>Shop</small>
        </Link>
        <Link>
          {icon('favorite')}
          <small>Wishlist</small>
          <sub>{wishList.length}</sub>
        </Link>
        <Link to={'/checkout'}>
          {icon('shopping_cart')}
          <small>Cart</small>
          <sub>{cartInfo.itemCount}</sub>
        </Link>
        {user ?
          <Link to={'/account'}>
            {icon('person')}
            <span>{user}</span>
          </Link> :
          <Link to={'/register'}>
            {icon('person')}
            <span>Register</span>
          </Link>
        }
      </article>
    </section>
  );
}

export default Navbar;