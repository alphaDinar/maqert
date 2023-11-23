import { useEffect, useState } from "react";
import ManagerSidebar from "../../Components/ManagerSidebar/ManagerSidebar";
import { useLoader, useManagerSidebar } from "../../main";
import styles from '../../Styles/Customer/viewProduct.module.css';
import { icon } from "../../External/Design";
import { fireStoreDB, storageDB } from "../../Firebase/base";
import { uploadBytes, ref as sRef, getDownloadURL } from "firebase/storage";
import { setDoc, doc, getDocs, collection } from "firebase/firestore";

const AddProduct = () => {
  const sample = 'https://res.cloudinary.com/dvnemzw0z/image/upload/v1697224824/iphone-15_g1evtv.jpg';
  const { setLoader } = useLoader();
  const { managerSidebar } = useManagerSidebar();

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
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);

  useEffect(()=>{
    getDocs(collection(fireStoreDB, 'Categories/'))
    .then((res) => {
      setCategoryList(res.docs.map((el) => el.data()))
      setLoader(false)
    })
  },[])

  const resetFormState = () => {
    setName('')
    setPrice('')
    setDetails('')
    setCategory('')
    setBrand('')
    setSpecs([])
    setMediaSet(Array(4).fill())
    setMediaTypeSet(Array(4).fill())
    setMediaPreviewSet(Array(4).fill())
    setReturnPolicy('')
    setSize('')
  }

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
    const uploadPromises = mediaSet.map((el) => {
      if (el) {
        return uploadBytes(sRef(storageDB, 'MaqeteStorage/' + el.name), el)
          .then((res) => getDownloadURL(res.ref))
          .catch((error) => console.log(error))
      } else {
        return Promise.resolve('empty');
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

  const createProduct = () => {
    setLoader(true)
    const mediaUrlSet = Array(4).fill();
    uploadMedia(mediaUrlSet)
      .then((mediaRes) => {
        mediaRes.map((el, i) => {
          if (el) {
            el['type'] = mediaTypeSet[i];
          }
        })

        const updatedMediaRes = JSON.stringify(mediaRes);
        const timestamp = Date.now();
        const pid = 'p' + timestamp;
        setDoc(doc(fireStoreDB, 'Products/' + pid), {
          pid: pid,
          name: name,
          details: details,
          media: updatedMediaRes,
          price: price,
          category: category,
          brand: brand,
          specs: specs,
          ratings: [],
          saleCount: 0,
          saleTotal: 0,
          returnPolicy : returnPolicy,
          size : size,
          orderCount: 0,
          views : 0, 
          likes : 0,
          timestamp: timestamp
        })
          .then(() => {
            resetFormState();
            setLoader(false);
          })
          .catch((error) => console.log(error))
      })
      .catch((error) => console.log(error))
  }

  return (
    <section className="managerPage">
      <ManagerSidebar />

      <form className={managerSidebar ? 'managerPanel' : 'managerPanel change'} onSubmit={(e) => { e.preventDefault(); createProduct() }} >
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
                <select onChange={(e) => { setCategory(e.target.value); setBrandList(categoryList.find((el)=>el.name === e.target.value).brands)}} required>
                  <option hidden>Select Category</option>
                  {categoryList.map((el, i) => (
                    <option key={i} value={el.name}>{el.name}</option>
                  ))}
                </select>
              </article>
              <article>
                <h2 style={{ fontSize: '1.1rem' }}>Brand<sub></sub></h2>
                <select onChange={(e) => { setBrand(e.target.value) }} required>
                  <option hidden>Select Brand</option>
                  <option value="other">Other</option>
                  {brandList.map((el, i)=>(
                    <option key={i} value={el}>{el}</option>
                  ))}
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
                <select value={returnPolicy} onChange={(e)=>{setReturnPolicy(e.target.value)}}>
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
                  <select value={size} onChange={(e)=>{setSize(e.target.value)}}>
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
          <button type="">Add Product</button>
        </div>

      </form>
    </section>
  )
};

export default AddProduct;



