import { useLoader } from '../../main';
import styles from './loader.module.css';
import logo from '../../assets/logo.png';

const Loader = () => {
  const {loader} = useLoader();
  
  return ( 
    <section className={styles.loader} style={loader ? {display:'flex'} : {display:'none'}}>
      <img src={logo} alt="" width={300} style={{objectFit:'contain'}} />
    </section>
   );
}
 
export default Loader;