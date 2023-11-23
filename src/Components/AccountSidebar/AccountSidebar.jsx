import { Link } from 'react-router-dom';
import jacket from '../../assets/jacket.png';
import styles from './accountSidebar.module.css';
import { icon } from '../../External/Design';
import { useEffect, useRef, useState } from 'react';

const AccountSidebar = ({props}) => {
  const {username} = props;
  const [miniMenuToggled, setMiniMenuToggled] = useState(false);

  const sidebarTags = [
    {label : 'My Account', iconEl : 'person', link : 'account', linkTo : '/account'},
    {label : 'Orders', iconEl : 'package', link : 'orders', linkTo : '/orders'},
    {label : 'Address', iconEl : 'location_pin', link : 'address', linkTo : '/'},
    {label : 'Payment Details', iconEl : 'account_balance_wallet', link : 'payment', linkTo : '/'},
    {label : 'Logout', iconEl : 'power_settings_new', link : 'logout', linkTo : '/'},
  ]
  const currentLink = window.location.href.split('/')[window.location.href.split('/').length - 1];

  const toggleMiniMenu =()=>{
    miniMenuToggled ? setMiniMenuToggled(false) : setMiniMenuToggled(true);
  }

  return (
    <section className={styles.sidebar}>
      <header>
        <img src={jacket} />
        <p>
          <strong>Hello !</strong>
          <span>{username}</span>
        </p>
        <legend className={styles.sidebarTag} onClick={toggleMiniMenu}>{icon('expand_more')}</legend>
      </header>

      <nav style={window.innerWidth < 1000 ? miniMenuToggled ? {display : 'flex'} : {display : 'none'} : {display:'flex'} }>
        {sidebarTags.map((tag, i)=>(
          <Link key={i} to={tag.linkTo}> <sub style={currentLink === tag.link ? {opacity:1} : {opacity:0}}>
            </sub>{icon(tag.iconEl)}{tag.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}

export default AccountSidebar;