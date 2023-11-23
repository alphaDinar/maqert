import { useEffect, useState } from "react";
import ManagerSidebar from "../../Components/ManagerSidebar/ManagerSidebar";
import { useLoader, useManagerSidebar } from "../../main";
import styles from '../../Styles/Customer/viewProduct.module.css';
import { icon } from "../../External/Design";
import { fireStoreDB, storageDB } from "../../Firebase/base";
import { uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const EditCategory = () => {
  const { id } = useParams();
  const { setLoader } = useLoader();
  const { managerSidebar } = useManagerSidebar();

  const [category, setCategory] = useState({});
  const [name, setName] = useState('');
  const [brandIn, setBrandIn] = useState('');
  const [brands, setBrands] = useState([]);

  const [media, setMedia] = useState('');
  const [mediaPreview, setMediaPreview] = useState('');


  useEffect(() => {
    getDoc(doc(fireStoreDB, 'Categories/' + id))
      .then((res) => {
        const categoryObj = res.data();
        setName(categoryObj.name)
        setBrands(categoryObj.brands)
        setMediaPreview(categoryObj.media)
        setLoader(false)
      })
  }, [])

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


  const updateCategory = () => {
    setLoader(true)
    if (media) {
      uploadBytes(sRef(storageDB, 'MaqeteStorage/' + media.name), media)
        .then((res) => {
          getDownloadURL(res.ref)
            .then((url) => {
              const timestamp = Date.now();
              updateDoc(doc(fireStoreDB, 'Categories/' + name), {
                name: name,
                media: url,
                brands: brands,
              })
                .then(() => {
                  setLoader(false);
                })
                .catch((error) => console.log(error))
            })
            .catch((error) => {
              console.log(error)
            })
        })
    } else {
      updateDoc(doc(fireStoreDB, 'Categories/' + name), {
        name: name,
        brands: brands,
      })
        .then(() => {
          setLoader(false);
        })
        .catch((error) => console.log(error))
    }
  }

  return (
    <section className="managerPage">
      <ManagerSidebar />

      <form className={managerSidebar ? 'managerPanel' : 'managerPanel change'} onSubmit={(e) => { e.preventDefault(); updateCategory() }} >
        <header>
          <strong>Edit Category</strong>
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
            <input style={{ display: 'none' }} type="file" id="addMedia" accept="image/*" onChange={(e) => { setMedia(e.target.files[0]); setMediaPreview(URL.createObjectURL(e.target.files[0])) }} />
          </label>
        </section>

        <div className={styles.subBox}>
          <button type="submit">Edit Category</button>
        </div>

      </form>
    </section>
  )
};

export default EditCategory;



