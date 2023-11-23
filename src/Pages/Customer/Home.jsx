import MiniNav from "../../Components/Navbar/MiniNav";
import Navbar from "../../Components/Navbar/Navbar";
import styles from '../../Styles/Customer/home.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { EffectFade, Navigation, Pagination } from 'swiper/modules';

// import { Pagination } from 'swiper/modules';
import { icon, iconFont } from "../../External/Design";
import machine from '../../assets/machine.png'
import { Link, useNavigate } from "react-router-dom";
import ProductBox from "../../Components/ProductBox/ProductBox";
import Footer from "../../Components/Footer/Footer";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireStoreDB } from "../../Firebase/base";
import { useCart, useCartInfo, useCartTrigger, useLoader } from "../../main";
import pixel from '../../assets/pixel.png';
import sam from '../../assets/ites.jpg';
import gadget from '../../assets/gadget.jpg'
import cosmetics from '../../assets/cosmetics.png'

const Home = () => {
  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1697224824/iphone-15_g1evtv.jpg';
  const images = [sam, gadget]

  const navigate = useNavigate();
  const { setLoader } = useLoader();
  const { cart, setCart } = useCart();
  const { cartInfo, setCartInfo } = useCartInfo();
  const {cartTrigger, setCartTrigger} = useCartTrigger();

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    getDocs(collection(fireStoreDB, 'Products/'))
      .then((res) => {
        setProducts(res.docs.map((el) => el.data()).slice(0, 10))
        setAllProducts(res.docs.map((el) => el.data()))
        setLoader(false)
      })
      .catch((error) => {
        console.log(error)
      })

    getDocs(collection(fireStoreDB, 'Categories/'))
      .then((res) => {
        setCategoryList(res.docs.map((el) => el.data()))
      })
  }, [])

  const addToCart = (product) => {
    const itemObj = {
      pid: product.pid,
      name: product.name,
      category : product.category,
      media: JSON.parse(product.media)[0].url,
      quantity: 1,
      price: Number(product.price),
      total: Number(product.price)
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

  return (
    <section className='wrapper'>
      <Navbar />
      <MiniNav />

      <section className="conBox">
        <Swiper
          pagination={{
            dynamicBullets: true,
          }}
          modules={[EffectFade, Pagination]}
          loop={true}
          autoplay={true}
          effect={'fade'}
          className={styles.topSwiper}
        >
          {images.map((el, i) => (
            <SwiperSlide key={i} >
              <section className={styles.topSlide} style={{backgroundImage : `url(${el})`}}>
                <Link>
                  <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.</span>
                  <legend></legend>
                </Link>
              </section>
            </SwiperSlide>
          ))}
        </Swiper>


        <section className={styles.productBox}>
          <header>
            <strong>Featured Products</strong>
            <small>Discover Our Exclusive Collection: Unveiling the Finest Picks Just for You!.</small>
            <nav>

              <span><Link to={'/allProducts'}>All Products</Link> <sub></sub></span>
              <span>Popular Products <sub></sub></span>
              <span>New Arrivals <sub></sub></span>
              <span>We Think You'll Love <sub></sub></span>
              <span>Most Viewed Products <sub></sub></span>
            </nav>
          </header>

          <ProductBox props={{ products }} />
        </section>

        <section className={styles.featuredBox}>
          <Link className={styles.left}>
            <img src={cosmetics} /> 

            <p>
              <strong>Cosmetics</strong>
              <small>Unveil Your Perfect Look</small>
            </p>

            <legend>
              {icon('north_east')}
            </legend>
          </Link>
          <section className={styles.right}>
            <div style={{ background: 'wheat' }}>
              <span>Save Up To 40% </span>
              <strong>Active Wear</strong>
              <Link>Shop Now</Link>
              <img src={machine} />

            </div>
            <div style={{ background: 'black', color: 'var(--theme)' }}>
              <span>Save Up To 40% </span>
              <strong>Active Wear</strong>
              <Link style={{ color: 'var(--theme)' }}>Shop Now</Link>
              <img src={machine} />
            </div>
          </section>
        </section>

        <section className={styles.categoryBox}>
          <header>
            <h3>Shop Deals By Category</h3>
            <Link to={'/categories'}>
              <sub>See All Categories</sub>
            </Link>
          </header>
          <section className={styles.categories}>
            {categoryList.slice(0, 10).map((el, i) => (
              <Link key={i} to={`/products/${el.name}`}>
                <img src={el.media} />
                <span className="cut">{el.name}</span>
              </Link>
            ))}
          </section>
        </section>

        <section className={styles.galleryBox}>
          <section className={styles.left}>
            <img src={sample} />
          </section>
          <section className={styles.mid}>
            <span>Styling inspiration</span>
            <strong>New Look</strong>
            <span>The motivaton you need to keep moving</span>
            <nav>
              <Link>Shop Men</Link>
              <Link>Shop Women</Link>
            </nav>
          </section>
          <section className={styles.right}>
            <img src={sample} />
          </section>
        </section>


        <section className={styles.serviceBox}>
          <article>
            {icon('bolt')}
            <p>
              <span>Fast Shipping</span>
              <small>3 - 5 days</small>
            </p>
          </article>
          <article>
            {icon('deployed_code_history')}
            <p>
              <span>30 day Free Returns</span>
              <small>all purchase methods</small>
            </p>
          </article>
          <article>
            {icon('local_shipping')}
            <p>
              <span>3 Day Delivery</span>
              <small>Free - spend over GH₵ 80</small>
            </p>
          </article>
          <article>
            {icon('support_agent')}
            <p>
              <span>Expert Customer Service</span>
              <small>Chat or call us</small>
            </p>
          </article>
        </section>

        <section className={styles.offerBox} style={{ display: 'none' }}>
          {[0, 0, 0, 0].map((el, i) => (
            <Link key={i} style={{ backgroundImage: `url(${sample})` }}>
              <p>
                <strong>Workspace</strong>
                <small>Create space for productivity</small>
                <span>Shop now</span>
              </p>
              <legend>
                <sup>From</sup>
                <sub>GH₵ 50.00</sub>
              </legend>
            </Link>
          ))}
        </section>
      </section>


      <Footer />
    </section>
  );
}

export default Home;