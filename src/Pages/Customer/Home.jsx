import MiniNav from "../../Components/Navbar/MiniNav";
import Navbar from "../../Components/Navbar/Navbar";
import styles from '../../Styles/Customer/home.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { EffectFade, Navigation, Pagination,Autoplay } from 'swiper/modules';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import { Pagination } from 'swiper/modules';
import { icon, iconFont } from "../../External/Design";
import { Link, useNavigate } from "react-router-dom";
import ProductBox from "../../Components/ProductBox/ProductBox";
import Footer from "../../Components/Footer/Footer";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { fireStoreDB } from "../../Firebase/base";
import { useCart, useCartInfo, useCartTrigger, useLoader } from "../../main";
import sam from '../../assets/ites.jpg';
import gadget from '../../assets/gadget.jpg'
import tv from '../../assets/tv.webp'
import FeaturedBox from "../../Components/FeaturedBox/FeaturedBox";
import { solveRatings } from "../../External/math";

const Home = () => {
  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1697224824/iphone-15_g1evtv.jpg';
  const images = [sam, gadget, tv]

  const navigate = useNavigate();
  const { setLoader } = useLoader();
  const { cart, setCart } = useCart();
  const { cartInfo, setCartInfo } = useCartInfo();
  const { cartTrigger, setCartTrigger } = useCartTrigger();

  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    const productsQuery = query(collection(fireStoreDB, 'Products/'), orderBy('timestamp', 'desc'), limit(30));
    getDocs(productsQuery)
      .then((res) => {
        if (window.innerWidth < 650) {
          setProducts(res.docs.map((el) => el.data()).slice(0, 6))
        } else {
          setProducts(res.docs.map((el) => el.data()).slice(0, 10))
        }
        setAllProducts(res.docs.map((el) => el.data()).slice(0, 50))
        setLoader(false)
      })
      .catch((error) => {
        console.log(error)
      })

    getDocs(collection(fireStoreDB, 'Categories/'))
      .then((res) => {
        setCategoryList(res.docs.map((el) => el.data()))
      })

    AOS.init({
      duration: "1000",
    })
  }, [])


  const headBoxTags = [
    { iconEl: 'bolt', top: 'Fast Shipping', low: '3 - 5 days' },
    { iconEl: 'deployed_code_history', top: '30 day Free Returns', low: 'all purchase methods' },
    { iconEl: 'local_shipping', top: '3 Day Delivery', low: 'Free - spend over GH₵ 80' },
    { iconEl: 'support_agent', top: 'Expert Customer Service', low: 'Chat or call us' },
  ]

  const addToCart = (product) => {
    const itemObj = {
      pid: product.pid,
      name: product.name,
      category: product.category,
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
          modules={[EffectFade, Pagination,Autoplay]}
          loop={true}
          autoplay={{delay : 3500}}
          effect={'fade'}
          className={styles.topSwiper}
        >
        {images.map((el, i) => (
          <SwiperSlide key={i} >
            <section className={styles.topSlide} style={{ backgroundImage: `url(${el})` }}>
              <Link to={'/allProducts'}>
                <article>
                  {icon(headBoxTags[i].iconEl)}
                  <p>
                    <span>{headBoxTags[i].top}</span>
                    <small>{headBoxTags[i].low}</small>
                  </p>
                </article>
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

        <FeaturedBox />


        <section className={styles.productBox}>
          <header>
            <strong>Shop By Category</strong>
            <small>Discover Our Exclusive Collection: Unveiling the Finest Picks Just for You!.</small>
            <nav>
              {categoryList.map((el) => (
                <span>{el.name} <sub></sub></span>
              ))}
            </nav>
          </header>

          <section className={styles.categoryProducts}>
            {products.map((el) => (
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
                  <button>{iconFont('fa-regular fa-heart')}</button>
                  <button>{icon('add_shopping_cart')}</button>
                </nav>
              </div>
            ))}
          </section>
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