import { useLoader } from '../../main';
import styles from './loader.module.css';

const Loader = () => {
  const {loader} = useLoader();
  
  return ( 
    <section className={styles.loader} style={loader ? {display:'flex'} : {display:'none'}}>
      
    </section>
   );
}
 
export default Loader;