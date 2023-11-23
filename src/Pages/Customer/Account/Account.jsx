import { useEffect, useState } from "react";
import AccountSidebar from "../../../Components/AccountSidebar/AccountSidebar";
import MiniNav from "../../../Components/Navbar/MiniNav";
import Navbar from "../../../Components/Navbar/Navbar";
import styles from '../../../Styles/Customer/Account/account.module.css';
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth, fireStoreDB } from "../../../Firebase/base";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../../../main";

const Account = () => {
  const navigate = useNavigate();
  const { setLoader } = useLoader();
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        if (user.email)
          getDoc(doc(fireStoreDB, 'Customers/' + user.uid))
            .then((userDoc) => {
              if (userDoc.exists()) {
                const userAccount = userDoc.data().account
                userAccount.phone && setPhone(userAccount.phone);
                userAccount.email && setEmail(userAccount.email);
                userAccount.username && setUsername(userAccount.username);
                setLoader(false)
              }
              else {
                navigate('/register')
              }
            })
      } else {
        console.log("error")
      }
    })
  }, [])

  return (
    <section className="wrapper">
      <Navbar />
      <MiniNav />
      <section className='accountPanel'>
        <AccountSidebar props={{ username }} />
        <main>
          <header>
            <h2>My Account<sub></sub></h2>
          </header>

          <section className={styles.accountBox}>
            {
              username &&
              <div>
                <span>Username</span>
                <input type="text" value={username} readOnly />
              </div>
            }
            {
              phone &&
              <div>
                <span>Phone</span>
                <input type="text" value={phone} />
              </div>
            }
            {
              email &&
              <div>
                <span>Email</span>
                <input type="text" value={email} readOnly />
              </div>
            }
          </section>
        </main>
      </section>
    </section>
  );
}

export default Account;