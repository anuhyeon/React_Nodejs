//import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPageButton from './components/MainPageButton'; // MainPageButton 컴포넌트를 임포트
import MainPage from './components/MainPage'; // 메인 페이지 컴포넌트를 임포트 (이 컴포넌트는 실제 메인 페이지의 내용을 표시합니다)
import LoginForm from "./components/LoginForm";
import PostList from "./components/PostList";
import PostCreate from "./components/PostCreate";
import PostDetails from "./components/PostDetails";

function App() {
  return (
    
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/main" element={<PostList />} />
          <Route path="/main/:id" element={<PostDetails />} /> {/* 게시물 상세 페이지 */}
          <Route path="/create" element={<PostCreate />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;

// {/* <MainPageButton /> 
//                 <Routes>
//                   <Route path="/main" element={<MainPage />} />
//                   <Route path="/hihi" element={<div>안녕0</div>} ><
//                 </Routes> */}