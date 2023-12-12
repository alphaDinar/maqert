import { useEffect, useState } from "react";
import MiniNav from "../../Components/Navbar/MiniNav";
import Navbar from "../../Components/Navbar/Navbar";
import { useLoader, useWishList } from "../../main";
import { onAuthStateChanged } from "firebase/auth";
import { fireAuth, fireStoreDB } from "../../Firebase/base";
import { doc, getDoc } from "firebase/firestore";

const WishList = () => {
  const { setLoader } = useLoader();
  const { wishList, setWishList } = useWishList();
  const [uid, setUid] = useState('');

  useEffect(() => {
    onAuthStateChanged(fireAuth, (user) => {
      if (user) {
        setUid(user.uid)
        getDoc(doc(fireStoreDB, 'Customers/' + user.uid))
          .then((res) => {
            if (res.data().wishList) {
              setWishList(res.data().wishList)
              setLoader(false)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })
  }, [])

  return (
    <section className="wrapper">
      <Navbar />
      <MiniNav />

      <section className="categoryBox">
        <header className="navBox">
          <h2>Wish List  <sub></sub></h2>
        </header>

      </section>
    </section>
  );
}

export default WishList;