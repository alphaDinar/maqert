import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import styles from '../../Styles/Customer/register.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { iconFont } from '../../External/Design';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { fireAuth, fireStoreDB, googleProvider } from '../../Firebase/base';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useLoader } from '../../main';

// {signInWithRedirect}

const Register = () => {
  const navigate = useNavigate();
  const { setLoader } = useLoader();
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginForm, setLoginForm] = useState(true);

  useEffect(() => {
    setLoader(false)
  }, [])

  const handleForm = () => {
    if (loginForm) {

    }
  }

  const googleLogin = () => {
    signInWithPopup(fireAuth, googleProvider)
      .then((res) => {
        const user = res.user
        setLoader(true)
        getDoc(doc(fireStoreDB, 'Customers/' + user.uid))
          .then((userDoc) => {
            if (userDoc.exists()) {
              navigate('/account')
            } else {
              const accountObj = {
                email: user.email,
                username: user.displayName,
                phone: '',
                password: ''
              }
              setDoc(doc(fireStoreDB, 'Customers/' + user.uid), {
                account: accountObj,
                wishList : []
              })
                .then(() => {
                  navigate('/account')
                })
                .catch((error) => console.log(error))
            }
          })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <section className={styles.wrapper}>
    <Link to={'/'}>
      <img src={logo} />
    </Link>

      <section className={styles.formBox}>
        <header>
          <legend onClick={() => { setLoginForm(true) }}>Login <sub style={loginForm ? { width: '100%' } : { width: '0' }}></sub></legend>
          <legend onClick={() => { setLoginForm(false) }}>Register <sub style={!loginForm ? { width: '100%' } : { width: '0' }}></sub></legend>
        </header>
        <form onSubmit={(e) => { e.preventDefault() }}>
          <div>
            <span>Phone</span>
            <p>
              <select onChange={(e) => { setCode(e.target.value) }}>
                <option value="">+233</option>
              </select>
              <input type="text" value={phone} onChange={(e) => (setPhone(e.target.value))} style={{ letterSpacing: '1px' }} required />
            </p>
          </div>
          <div>
            <span>Password</span>
            <input type="password" onChange={(e) => { setPassword(e.target.value) }} value={password} required />
          </div>

          {!loginForm &&
            <>
              <div>
                <span>Confirm Password</span>
                <input type="password" onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword} required />
              </div>
              <small>
                Your personal data will be used to support your experience throughout this website,
                to manage access to your account, and for other purposes described in our <Link style={{ borderBottom: '1px solid black' }}>privacy policy</Link> .
              </small>
            </>
          }
          {loginForm ?
            <button>Login</button> :
            <button>Register</button>
          }
        </form>

        {loginForm ?
          <article onClick={() => { setLoginForm(false) }} style={{ textAlign: 'center', cursor: 'pointer', borderBottom: '1px solid black', margin: 'auto', fontSize: '1rem' }}>
            <small>Are you new to Maqete? Register here</small>
          </article> :
          <article onClick={() => { setLoginForm(true) }} style={{ textAlign: 'center', cursor: 'pointer', borderBottom: '1px solid black', margin: 'auto', fontSize: '1rem' }}>
            <small>Do you already have an account? Login here</small>
          </article>
        }


        <legend type="buttton" onClick={googleLogin} className={styles.googleBox}>
          {iconFont('fa-brands fa-google', 'skyblue')}
          <span>Sign in with Google</span>
        </legend>
      </section>

      <footer>
        <Link>{iconFont('fa-brands fa-instagram', 'var(--theme)')}</Link>
        <Link>{iconFont('fa-brands fa-facebook-f', 'var(--theme)')}</Link>
        <Link>{iconFont('fa-brands fa-x-twitter', 'var(--theme)')}</Link>
      </footer>
    </section>
  );
}

export default Register;