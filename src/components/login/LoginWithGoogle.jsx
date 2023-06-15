
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import '../../styles/login/loginWithGoogle.css'
const env = import.meta.env

const LoginWithGoogle = ({ responseGoogle }) => {

  return (

    <GoogleOAuthProvider clientId={env.VITE_GOOGLE_LOGIN_TOKEN}>
      <GoogleLogin
        className='btn-google'
        buttonText='Continuar con Google'
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
        plugin_name={'hol'}
        scope='profile'
        size='large'
        width={'250px'}
        logo_alignment= 'center'
        useOneTap={false}
      />
    </GoogleOAuthProvider>


  )
}

export default LoginWithGoogle