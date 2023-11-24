import { Link } from "react-router-dom";
import styles from './featuredBox.module.css';
import { icon, iconFont } from "../../External/Design";
import pixel from '../../assets/pixel.png';
import phone from '../../assets/iphone.jpg';
import cosmetics from '../../assets/cosmetics.png'
import fash from '../../assets/fash.png'

const FeaturedBox = () => {
  return (
    <section className={styles.featuredBox}>
      <section className={styles.left}>
        <Link>
          <img src={cosmetics} />
          <p>
            <strong>Cosmetics</strong>
            <small>Unveil Your Perfect Look</small>
          </p>
          <legend>
            {icon('north_east')}
          </legend>
        </Link>
        <Link style={{ background: '#bdf2d2' }}>
          <img src={fash} />
          <p>
            <strong>Fashion</strong>
            <small>Unveil Your Perfect Look</small>
          </p>
          <legend>
            {icon('north_east')}
          </legend>
        </Link>
      </section>
      <section className={styles.right}>
        <div data-aos="fade-up">
          <p>
            <button>{iconFont('fa-solid fa-heart')}</button>
            <button>{icon('add_shopping_cart')}</button>
          </p>
          <img src={pixel} />
          <article>
            <small>Top Picks</small>
            <strong className="cut">Google Pixel 8 Pro</strong>
            <legend>₵ 4,000</legend>
          </article>
        </div>
        <div data-aos="fade-up">
          <p>
            <button>{iconFont('fa-solid fa-heart')}</button>
            <button>{icon('add_shopping_cart')}</button>
          </p>
          <img src={phone} />
          <article>
            <small>Top Picks</small>
            <strong className="cut">Google Pixel 8 Pro</strong>
            <legend>₵ 4,000</legend>
          </article>
        </div>
      </section>
    </section>
  );
}

export default FeaturedBox;