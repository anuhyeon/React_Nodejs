import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import SignUpForm from "./components/SignUpForm";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({});
  const [showSignUpForm, setShowSignUpForm] = useState(false); // 회원가입 폼 표시 상태

  const accessToken = () => {
    axios({
      url: "http://localhost:8123/accesstoken",
      method: "GET",
      withCredentials: true,
    });
  };

  const refreshToken = () => {
    axios({
      url: "http://localhost:8123/refreshtoken",
      method: "GET",
      withCredentials: true,
    });
  };

  const logout = () => {
    axios({
      url: "http://localhost:8123/logout",
      method: "POST",
      withCredentials: true,
    }).then((result) => {
      if (result.status === 200) {
        window.open("/", "_self");
      }
    });
  };

 

  useEffect(() => {
    try {
      axios({
        url: "http://localhost:8123/login/success",
        method: "GET",
        withCredentials: true,
      })
        .then((result) => {
          if (result.data) {
            setIsLogin(true);
            setUser(result.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src='sloth.png' className="App-logo" alt="logo" />
        
        <a onClick={accessToken} className="App-link">
          get Access Token
        </a>
        <a onClick={refreshToken} className="App-link">
          get Refresh Token
        </a>
       
        
        {isLogin ? (
          <>
            <h3>{user.name} 님이 로그인했습니다.</h3>
            <button onClick={logout} className="loginButton">
              Logout
            </button>
            <button onClick={() => setShowSignUpForm(false)} className="signUpButton">
              Hide SignUp
            </button>
          </>
        ) : showSignUpForm ? (
          <SignUpForm />
        ) : (
          <>
            <Login setUser={setUser} setIsLogin={setIsLogin} />
            <button onClick={() => setShowSignUpForm(true)} className="signUpButton">
              SignUp
            </button>
          </>
        )}
          

      </header>
    </div>
  );
}

export default App;
