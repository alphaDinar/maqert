import { useEffect, useState } from "react";
import ManagerSidebar from "../../Components/ManagerSidebar/ManagerSidebar";
import { useLoader, useManagerSidebar } from "../../main";
// import styles from '../../Styles/Manager/products.module.css';
import styles from '../../Styles/Customer/viewProduct.module.css';
import { icon } from "../../External/Design";
import { categoryList } from "../../External/lists";
import { fireStoreDB, storageDB } from "../../Firebase/base";
import { uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";
import { setDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();
  const { setLoader } = useLoader();
  const { managerSidebar } = useManagerSidebar();
  const [product, setProduct] = useState();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [details, setDetails] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');

  const [specIn, setSpecIn] = useState('');
  const [specs, setSpecs] = useState([]);

  const [mediaSet, setMediaSet] = useState(Array(4).fill());
  const [mediaTypeSet, setMediaTypeSet] = useState(Array(4).fill());
  const [mediaPreviewSet, setMediaPreviewSet] = useState(Array(4).fill());

  const [returnPolicy, setReturnPolicy] = useState('');
  const [size, setSize] = useState('');


  useEffect(() => {
    getDoc(doc(fireStoreDB, 'Products/' + id))
      .then((res) => {
        const prod = res.data();
        setName(prod.name)
        setPrice(prod.price)
        setDetails(prod.details)
        setCategory(prod.category)
        setBrand(prod.brand)
        setSpecs(prod.specs)

        JSON.parse(prod.media).forEach((el, i) => {
          if (el.url !== 'empty') {
            mediaPreviewSet[i] = el.url;
            mediaTypeSet[i] = el.type;
          } else {
            mediaPreviewSet[i] = 'empty';
          }
        })
      })
  }, [])

  const addSpec = () => {
    const updatedSPecs = [...specs, specIn];
    setSpecs(updatedSPecs)
    setSpecIn('')
  }

  const removeSpec = (val) => {
    const updatedSPecs = [...specs].filter((el) => el !== val)
    setSpecs(updatedSPecs)
  }

  const handleMediaSet = (val, i) => {
    const updatedMediaSet = [...mediaSet];
    updatedMediaSet[i] = val;
    const updatedMediaTypeSet = [...mediaTypeSet];
    updatedMediaTypeSet[i] = val.type.split('/')[0];
    const updatedMediaPreviewSet = [...mediaPreviewSet];
    updatedMediaPreviewSet[i] = URL.createObjectURL(val);
    setMediaSet(updatedMediaSet)
    setMediaTypeSet(updatedMediaTypeSet)
    setMediaPreviewSet(updatedMediaPreviewSet)
  }

  const uploadMedia = (mediaUrlSet) => {
    const uploadPromises = mediaSet.map((el, i) => {
      if (el) {
        return uploadBytes(sRef(storageDB, 'MaqeteStorage/' + el.name), el)
          .then((res) => getDownloadURL(res.ref))
          .catch((error) => console.log(error))
      } else {
        if (mediaUrlSet[i] !== 'empty') {
          return Promise.resolve(mediaUrlSet[i].url);
        }
      }
    })

    return Promise.all(uploadPromises)
      .then((urls) => {
        urls.forEach((url, i) => {
          if (url) {
            mediaUrlSet[i] = { url: url };
          }
        });
        return mediaUrlSet;
      });
  }

  const updateProduct = () => {
    setLoader(true)
    const mediaUrlSet = Array(4).fill();
    console.log(mediaPreviewSet)
    mediaPreviewSet.forEach((el, i) => {
      if (el !== 'empty') {
        mediaUrlSet[i] = {};
        mediaUrlSet[i]['url'] = el;
        mediaUrlSet[i]['type'] = mediaTypeSet[i];
      } else {
        mediaUrlSet[i] = 'empty';
      }
    })

    uploadMedia(mediaUrlSet)
      .then((mediaRes) => {
        mediaRes.map((el, i) => {
          if (el !== 'empty') {
            el['type'] = mediaTypeSet[i];
          }
        })

        const updatedMediaRes = JSON.stringify(mediaRes);
        const timestamp = Date.now();
        updateDoc(doc(fireStoreDB, 'Products/' + id), {
          name: name,
          details: details,
          media: updatedMediaRes,
          price: price,
          category: category,
          brand: brand,
          specs: specs,
          returnPolicy: returnPolicy,
          size: size,
          timestamp: timestamp
        })
          .then(() => {
            setLoader(false)
          })
          .catch((error) => console.log(error))
      })
      .catch((error) => console.log(error))
  }

  return (
    <section className="managerPage">
      <ManagerSidebar />

      <form className={managerSidebar ? 'managerPanel' : 'managerPanel change'} onSubmit={(e) => { e.preventDefault(); updateProduct() }} >
        <header>
          <strong>Add Product</strong>
        </header>
        <section className={styles.productBox} style={{ gap: '3rem' }}>
          <section className={styles.left} style={{ gridTemplateColumns: '1fr' }}>
            <section className={styles.infoBox}>
              <header>
                <div>
                  <h2 style={{ fontSize: '1.1rem' }}>Name<sub></sub></h2>
                  <textarea value={name} onChange={(e) => { setName(e.target.value) }} required></textarea>
                </div>
                <strong>{icon('payments')} GHc <input type="number" value={price} onChange={(e) => { setPrice(e.target.value) }} placeholder="price" required /></strong>
              </header>
              <article>
                <h2 style={{ fontSize: '1.1rem' }}>Product Details<sub></sub></h2>
                <textarea style={{ minHeight: '150px' }} value={details} onChange={(e) => { setDetails(e.target.value) }} required></textarea>
              </article>
              <article>
                <h2 style={{ fontSize: '1.1rem' }}>Category<sub></sub></h2>
                <select value={category} onChange={(e) => { setCategory(e.target.value) }} required>
                  <option hidden>Select Category</option>
                  {categoryList.map((el, i) => (
                    <option key={i} value={el.value}>{el.value}</option>
                  ))}
                </select>
              </article>
              <article>
                <h2 style={{ fontSize: '1.1rem' }}>Brand<sub></sub></h2>
                <select value={brand} onChange={(e) => { setBrand(e.target.value) }} required>
                  <option hidden>Select Brand</option>
                  <option value="other">Other</option>
                </select>
              </article>
              <article>
                <h2 style={{ fontSize: '1.1rem' }}>Specifications<sub></sub></h2>
                <div className={styles.specs}>
                  <input type="text" value={specIn} onChange={(e) => { setSpecIn(e.target.value) }} />
                  <sup onClick={addSpec}>+</sup>
                </div>
                <p>
                  {specs.map((el, i) => (
                    <legend key={i}>
                      <sub style={{ cursor: 'pointer' }} onClick={() => { removeSpec(el) }}>{icon('delete')}</sub>
                      <small>{el} </small>
                    </legend>
                  ))}
                </p>
              </article>
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
                <span>Return After</span>
                <select value={returnPolicy} onChange={(e) => { setReturnPolicy(e.target.value) }}>
                  <option hidden >Select Return Policy</option>
                  <option value="false">No returns</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="3 months">3 months</option>
                  <option value="6 months">6 months</option>
                </select>
              </div>

              <div>
                <span>Select Size</span>
                <select value={size} onChange={(e) => { setSize(e.target.value) }}>
                  <option hidden>Select Size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </section>

          </section>
        </section>

        <section className={styles.imageBox}>
          {mediaSet.map((img, i) => (
            <label key={i} htmlFor={`addMedia${i}`} className={styles.addMedia}>
              {icon('add')}
              {
                mediaTypeSet[i] === 'video' ?
                  <video controls muted src={mediaPreviewSet[i]}></video> :
                  <img src={mediaPreviewSet[i]} />
              }
              {i === 0 ?
                <input style={{ display: 'none' }} onChange={(e) => { handleMediaSet(e.target.files[0], i) }} id={`addMedia${i}`} type="file" accept="image/*" /> :
                <input style={{ display: 'none' }} onChange={(e) => { handleMediaSet(e.target.files[0], i) }} id={`addMedia${i}`} type="file" accept="image/*,video/*" />
              }
            </label>
          ))}
        </section>

        <div className={styles.subBox}>
          <button type="">Edit Product</button>
        </div>

      </form>
    </section>
  );
}

export default EditProduct;