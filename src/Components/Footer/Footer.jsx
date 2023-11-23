import { iconFont } from '../../External/Design';
import styles from './footer.module.css';
import {Link} from 'react-router-dom';

const Footer = () => {
  return ( 
    <section className={styles.footer}>
      <header>
        <strong>Get Exclusive Offers & Updates</strong>
        <small>Get recommendations, tips, updates, promotions and more.</small>
      </header>

      <main>
        <p>
          <span>Get to Know Us</span>

          <nav>
            <Link>About Us</Link>
            <Link>News Blog</Link>
            <Link>Careers</Link>
            <Link>Investors</Link>
            <Link>Contact us</Link>
          </nav>
        </p>

        <p>
          <span>Get to Know Us</span>

          <nav>
            <Link>About Us</Link>
            <Link>News Blog</Link>
            <Link>Careers</Link>
            <Link>Investors</Link>
            <Link>Contact us</Link>
          </nav>
        </p>
        <p>
          <span>Get to Know Us</span>

          <nav>
            <Link>About Us</Link>
            <Link>News Blog</Link>
            <Link>Careers</Link>
            <Link>Investors</Link>
            <Link>Contact us</Link>
          </nav>
        </p>
        <p>
          <span>Get to Know Us</span>

          <nav>
            <Link>About Us</Link>
            <Link>News Blog</Link>
            <Link>Careers</Link>
            <Link>Investors</Link>
            <Link>Contact us</Link>
          </nav>
        </p>
      </main>

      <article className={styles.socialBox}>
      <Link>
      {iconFont('fa-brands fa-instagram')}
      </Link>
      <Link>
      {iconFont('fa-brands fa-x-twitter')}
      </Link>
      <Link>
      {iconFont('fa-brands fa-tiktok')}
      </Link>
      </article>
    </section>
   );
}
 
export default Footer;