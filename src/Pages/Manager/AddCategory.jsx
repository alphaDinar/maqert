import { useEffect, useState } from "react";
import ManagerSidebar from "../../Components/ManagerSidebar/ManagerSidebar";
import { useLoader, useManagerSidebar } from "../../main";
import styles from '../../Styles/Customer/viewProduct.module.css';
import { icon } from "../../External/Design";
import { fireStoreDB, storageDB } from "../../Firebase/base";
import { uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";

const AddCategory = () => {
  const { setLoader } = useLoader();
  const { managerSidebar } = useManagerSidebar();

  const [name, setName] = useState('');
  const [brandIn, setBrandIn] = useState('');
  const [brands, setBrands] = useState([]);

  const [media, setMedia] = useState('');
  const [mediaPreview, setMediaPreview] = useState('');

  const resetFormState = () => {
    setName('')
    setBrands([])
    setMediaPreview('');
  }

  const addBrand = () => {
    const updatedBrands = [...brands, brandIn];
    setBrands(updatedBrands)
    setBrandIn('')
  }

  const removeBrand = (val) => {
    const updatedBrands = [...brands].filter((el) => el !== val)
    setBrands(updatedBrands)
  }


  const createCategory = () => {
    setLoader(true)
    uploadBytes(sRef(storageDB, 'MaqeteStorage/' + media.name), media)
      .then((res) => {
        getDownloadURL(res.ref)
          .then((url) => {
            const timestamp = Date.now();
            setDoc(doc(fireStoreDB, 'Categories/' + name), {
              name: name,
              media: url,
              brands: brands,
              timestamp: timestamp
            })
              .then(() => {
                resetFormState();
                setLoader(false);
              })
              .catch((error) => console.log(error))
          })
          .catch((error) => {
            console.log(error)
          })
      })
  }

  return (
    <section className="managerPage">
      <ManagerSidebar />

      <form className={managerSidebar ? 'managerPanel' : 'managerPanel change'} onSubmit={(e) => { e.preventDefault(); createCategory() }} >
        <header>
          <strong>Add Category</strong>
        </header>
        <section className={styles.productBox} style={{ gap: '3rem' }}>
          <section className={styles.left} style={{ gridTemplateColumns: '1fr' }}>
            <section className={styles.infoBox}>
              <header>
                <div>
                  <h2 style={{ fontSize: '1.1rem' }}>Name<sub></sub></h2>
                  <textarea value={name} onChange={(e) => { setName(e.target.value) }} required></textarea>
                </div>
              </header>

              <article>
                <h2 style={{ fontSize: '1.1rem' }}>Brands<sub></sub></h2>
                <div className={styles.specs}>
                  <input type="text" value={brandIn} onChange={(e) => { setBrandIn(e.target.value) }} />
                  <sup onClick={addBrand}>+</sup>
                </div>
                <p>
                  {brands.map((el, i) => (
                    <legend key={i}>
                      <sub style={{ cursor: 'pointer' }} onClick={() => { removeBrand(el) }}>{icon('delete')}</sub>
                      <small>{el} </small>
                    </legend>
                  ))}
                </p>
              </article>
            </section>
          </section>
        </section>

        <section className={styles.imageBox}>
          <label htmlFor={`addMedia`} className={styles.addMedia}>
            {icon('add')}
            <img src={mediaPreview} />
            <input style={{ display: 'none' }} required type="file" id="addMedia" accept="image/*" onChange={(e) => { setMedia(e.target.files[0]); setMediaPreview(URL.createObjectURL(e.target.files[0])) }} />
          </label>
        </section>

        <div className={styles.subBox}>
          <button type="submit">Add Category</button>
        </div>

      </form>
    </section>
  )
};

export default AddCategory;



