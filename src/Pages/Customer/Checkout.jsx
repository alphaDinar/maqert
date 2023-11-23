import Navbar from "../../Components/Navbar/Navbar";
import { icon } from "../../External/Design";
import styles from '../../Styles/Customer/checkout.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useCartInfo, useCartTrigger, useLoader } from "../../main";
import { useEffect, useState } from "react";

const Checkout = () => {
  const { setLoader } = useLoader();
  const navigate = useNavigate();
  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1697224824/iphone-15_g1evtv.jpg';
  const { cart, setCart } = useCart();
  const { cartInfo, setCartInfo } = useCartInfo();
  const { cartTrigger, setCartTrigger } = useCartTrigger();
  const [quantityList, setQuantityList] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(10);

  useEffect(() => {
    setQuantityList(cart.map((el) => el.quantity), 'value')
    setLoader(false)
  }, [cart])

  const updateCartInfo = (cart) => {
    cartInfo.itemCount = cart.reduce((acc, el) => acc + el.quantity, 0);
    cartInfo.total = cart.reduce((acc, el) => acc + el.total, 0);
    localStorage.setItem('cart', JSON.stringify(cart))
    localStorage.setItem('cartInfo', JSON.stringify(cartInfo))
    const updatedTrigger = cartTrigger + 1;
    setCartTrigger(updatedTrigger)
  }

  const handleQuantity = (pid, val, i) => {
    if (val < 101) {
      console.log(val, 101)
      const updatedQuantityList = [...quantityList];
      updatedQuantityList[i] = val;
      setQuantityList(updatedQuantityList)
    }

    if (val > 0) {
      const updatedVal = parseInt(val);
      const item = cart.find((el) => el.pid === pid);
      item.quantity = updatedVal;
      item.total = val * item.price;
      updateCartInfo(cart);
    }
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

  const delFromCart = (product) => {
    console.log('me')
    const itemExists = cart.find((el) => el.pid === product.pid);
    const itemIndex = cart.indexOf(itemExists);
    console.log(itemIndex)
    cart.splice(itemIndex, 1);
    updateCartInfo(cart);
    localStorage.setItem('cart', JSON.stringify(cart))
    localStorage.setItem('cartInfo', JSON.stringify(cartInfo))
    const updatedTrigger = cartTrigger + 1;
    setCartTrigger(updatedTrigger)
  }

  return (
    <section className="wrapper">
      <Navbar />


      <main className={styles.checkoutMain}>
        <section className={styles.cartBox}>
          <header>
            <h2>Shopping Cart</h2>
            <strong>{cart.length} Products</strong>
          </header>
          <section className={styles.items}>
            <li className={styles.topLi}>
              <span>Product Details</span>
              <span>Quantity</span>
              <span>Price</span>
              <span>Total</span>
            </li>

            {cart.map((product, i) => (
              <li key={i}>
                <article>
                  <img src={product.media} />
                  <p>
                    <Link to={`/viewProduct/${product.pid}`}>
                      <small className="cut">
                        {product.name}
                      </small>
                    </Link>
                    <small style={{ color: 'darkgray' }} className="cut">
                      {product.category}
                    </small>
                    <legend onClick={() => { delFromCart(product) }}>
                      {icon('delete')}
                    </legend>
                  </p>
                </article>
                <nav>
                  <button onClick={() => { remFromCart(product) }}>{icon('remove')}</button>
                  <input max={100} type="number" value={quantityList[i]} onChange={(e) => { handleQuantity(product.pid, e.target.value, i) }} />
                  <button onClick={() => { addToCart(product) }}>{icon('add')}</button>
                </nav>
                <p>
                  <sub>Unit Price</sub>
                  <h5>GH₵ {product.price.toLocaleString()}</h5>
                </p>

                <p>
                  <sub>Total</sub>
                  <h5 style={{ fontWeight: '600' }}>GH₵ {product.total.toLocaleString()}</h5>
                </p>
              </li>
            ))}
          </section>
        </section>


        <section className={styles.checkoutBox}>
          <header>
            <h2>
              Order Summary
            </h2>
          </header>

          <section className={styles.locationBox}>
            <div>
              <span>{icon('location_pin')} Choose Your Location</span>
              <select>
                <option value="">Accra</option>
                <option value="">Kumasi</option>
              </select>
              <select>
                <option value="">Ablekuma</option>
                <option value="">Awoshie</option>
              </select>
            </div>

            <small>
              {icon('schedule')}
              <p>
                <strong>Door Delivery</strong>
                Ready for delivery between 31 October & 01 November when you order within next 1hrs 23mins
              </p>
            </small>
          </section>

          <article className={styles.totalBox}>
            <p>
              <span>{icon('receipt_long')} Sub Total (20)</span>
              <strong>GH₵ {cartInfo.total.toLocaleString()}</strong>
            </p>
            <p>
              <span>{icon('local_shipping')} Delivery Fee</span>
              <strong>GH₵ {deliveryFee.toLocaleString()}</strong>
            </p>
            <hr />
            <p>
              <span>{icon('payments')} Total</span>
              <strong>GH₵ {(cartInfo.total + deliveryFee).toLocaleString()}</strong>
            </p>
          </article>
          <Link className={styles.checkout}>Go To Checkout</Link>
        </section>
      </main>


    </section>
  );
}

export default Checkout;