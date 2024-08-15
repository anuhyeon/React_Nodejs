import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainPageButton() {
  const navigate = useNavigate();

  const mainPage = () => {
    // '/main' 경로로 리디렉션
    navigate('/main');
  };

  return (
    <button onClick={mainPage} className="mainPageButton">
      메인 페이지로 이동
    </button>
  );
}

export default MainPageButton;