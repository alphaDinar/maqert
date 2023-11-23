import { Link, useParams } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import MiniNav from "../../Components/Navbar/MiniNav";
import styles from '../../Styles/Customer/viewProduct.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { useLoader } from "../../main";
import { useEffect, useRef, useState } from "react";
import { icon, iconFont } from "../../External/Design";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { fireStoreDB } from "../../Firebase/base";
import { getRealDate } from "../../External/time";
import { solveRatings } from "../../External/math";

const ViewProduct = () => {
  const { id } = useParams();
  const { setLoader } = useLoader();
  const productSwiper = useRef(null);
  const productSwiperThumb = useRef(null);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getDoc(doc(fireStoreDB, 'Products/' + id))
      .then((res) => {
        setProduct(res.data())
        setLoader(false)
      })

    updateDoc(doc(fireStoreDB, 'Products/' + id), {
      views: increment(1)
    })
      .then(() => { console.log('1') })
  }, [])

  const changeSlide = (val) => {
    productSwiper.current.swiper.slideTo(val)
  }


  return (
    <section className="wrapper">
      <Navbar />
      <MiniNav />

      {product &&
        <section className={styles.productBox}>
          <section className={styles.left}>
            <section className={styles.swiperBox}>
              <Swiper
                className={styles.productSwiper}
                ref={productSwiper}
                style={{ pointerEvents: 'none' }}
              >
                {JSON.parse(product.media).map((img, i) => (
                  img &&
                  img.url !== 'empty' &&
                  <SwiperSlide key={i}>
                    {img.type === 'image' ?

                      <img src={img.url} /> :
                      <video src={img.url} autoPlay muted loop controls></video>
                    }
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                className={styles.productSwiperThumb}
                spaceBetween={10}
                slidesPerView={3}
                ref={productSwiperThumb}
              >
                {JSON.parse(product.media).map((img, i) => (
                  img &&
                  img.url !== 'empty' &&
                  <SwiperSlide key={i} onClick={() => { changeSlide(i) }}>
                    {img.type === 'image' ?
                      <img src={img.url} /> :
                      <video src={img.url} autoPlay muted loop></video>
                    }
                  </SwiperSlide>
                ))}
              </Swiper>

              <article className={styles.ratings}>
                {product.ratings.map((el) => (
                  <li>
                    <legend>
                      {iconFont('fa-solid fa-star', 'orange')}
                      {iconFont('fa-solid fa-star', 'orange')}
                      {iconFont('fa-solid fa-star', 'orange')}
                    </legend>

                    <div style={{ display: 'grid' }}>
                      <small>{el.review}</small>
                      <small style={{ fontSize: '0.7rem', color: 'darkgray' }}>{getRealDate(parseInt(el.timestamp))}</small>
                    </div>
                    <p>
                      <small>{el.user}</small>
                      {icon('task_alt')}
                    </p>
                  </li>
                ))}
              </article>
            </section>

            <section className={styles.infoBox}>
              <header>
                <h4>{product.name}</h4>
                <strong>{icon('payments')} GHc {parseInt(product.price).toLocaleString()}</strong>
                <p>
                  {Array(solveRatings(product.ratings)).fill().map((el, i) => (
                    <legend key={i}>
                      {iconFont('fa-solid fa-star', 'orange')}
                    </legend>
                  ))}
                  <small>({product.ratings.length} verified ratings)</small>
                </p>
                <button type="button" onClick={()=>{addToCart(product)}}>Add To Cart{icon('add_shopping_cart')}</button>
              </header>

              <article>
                <h2 style={{ fontSize: '1.1rem' }}>Product Details<sub></sub></h2>
                <small>
                  {product.details}
                </small>
              </article>
              {product.specs.length > 0 &&
                <article>
                  <h2 style={{ fontSize: '1.1rem' }}>Specifications<sub></sub></h2>
                  <p>
                    {product.specs.map((el, i) => (
                      <legend key={i}>
                        {icon('arrow_right_alt')}
                        <small>{el}</small>
                      </legend>
                    ))}
                  </p>
                </article>
              }
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
              <small>
                {icon('deployed_code_alert')}
                {product.returnPolicy !== 'false' ?
                  <p>
                    <strong>Return Policy</strong>
                    Free return within {product.returnPolicy} for all eligible items.Details
                  </p> :
                  <p>
                    <strong>Return Policy</strong>
                    This Product has no return policies.
                  </p>
                }
              </small>
            </section>

            <article className={styles.totalBox}>
              <p>
                <span>{icon('receipt_long')} Sub Total (20)</span>
                <strong>GH₵ {parseInt(product.price).toLocaleString()}</strong>
              </p>
              <p>
                <span>{icon('local_shipping')} Delivery Fee</span>
                <strong>GH₵ 50</strong>
              </p>
              <hr />
              <p>
                <span>{icon('payments')} Total</span>
                <strong>GH₵ {eval(parseInt(product.price) + parseInt(50))}</strong>
              </p>
            </article>
          </section>
        </section>
      }
    </section>
  );
}

export default ViewProduct;