import React, { useState } from 'react';
//import './SignUpForm.css'; // CSS 파일 경로는 실제 파일 위치에 맞게 조정
import axios from "axios";


function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [idCheck, setIdCheck] = useState(false);
  
  // ID 중복 검사 함수
  const checkId = () => {
    // API 요청을 통한 ID 중복 검사 로직 구현
    // 예시를 위해 무조건 true로 설정
    setIdCheck(true);
    alert("사용가능한 ID 입니다.");
  };

 
  // 폼 제출 핸들러 a
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 맞지 않습니다.");
      return;
    }
    console.log("Submitted:", { username, email, id, password });
    // 회원 가입 API 호출 구현 부분
    axios({
      url: "http://localhost:8123/signup",
      method: "POST",
      withCredentials: true,
      data: {
        username: username,
        email: email,
        id: id,
        password: password,
      },
    }).then((result) => {
      if (result.status === 200) {
        alert("회원가입이 완료되었습니다.");
        //로그인 페이지로 이동
        window.open('/', '_self')
      }
    });

  };



  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text1"
          id="username"
          className="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="id">ID:</label>
        <input
          type="text1"
          id="id"
          className="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button type="button" onClick={checkId}>Check ID</button>
        <span>{idCheck ? "Available" : ""}</span>
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
      <button onClick={()=>window.open("/", "_self")}>Back</button>
    </form>
    
  );
}

export default SignUpForm;
