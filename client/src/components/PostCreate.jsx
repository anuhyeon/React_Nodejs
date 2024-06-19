import React, { useState,useEffect } from 'react';
import axios from 'axios';
import './PostCreate.css';
import { useNavigate } from 'react-router-dom';

// const FormData = require('form-data')

function PostCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [user,setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchUserInfo = async () => {
      const result = await axios.get('http://localhost:8123/posts',{withCredentials : true});
      setUser({
        name: result.data.name, // 서버에서 받아온 사용자 ID를 이름으로 설정
        email: result.data.email // 서버에서 받아온 이메일을 설정
      });
    }
    fetchUserInfo();

  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(title);
    //console.log(content);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    // FormData의 key 확인
    // @ts-ignore
    // console.log('adsadf')
    // for (const key of formData.keys()) {
    //   console.log(key);
    // }
    // // FormData의 value 확인
    // // @ts-ignore
    // console.log('adsadf')
    // for (const value of formData.values()) {
    //   console.log(value);
    // }
    //console.log(formData);

    try {
      await axios.post('http://localhost:8123/postcreate', {title,content}, {
        withCredentials: true,
        // headers: {
        //   //'Accept': 'application/json',
        //   // 'Content-Type': 'multipart/form-data'
        // }
      });
      alert('게시물이 등록되었습니다!');
      setTitle('');
      setContent('');
      setImage(null);
      navigate('/main');
    } catch (error) {
      console.error('등록 실패', error);
    }
  };

  return (
    <div className="post-container">
    <div className="post-create">
      <div className="header">
        <span>{user.name} ({user.email})</span>
        <button className="Post-create-Button" onClick={() => window.history.back()}>뒤로 가기</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows='14'
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="Post-create-Button" type="submit">Submit</button>
      </form>
    </div>
    </div>
  );
}

export default PostCreate;





// const handleSubmit = async (e) => { //
//   e.preventDefault(); // 이 메소드는 폼이 제출될 때 페이지가 다시 로드 되는 것과 같은 기본 동작을 방지한다.(폼 제출 이벤트('onSubmit'의 기본 동작은 폼데이터를 서버로 전송 후 페이지를 새로 고침하는 것임.) 폼 제출의 경우 기본적으로 페이지를 새로고침하거나 새 페이지로 이동하는데, 이를 방지하여 (SPA, single page application)을 유지. SPA에서는 페이지 전환 없이 동적으로 콘텐츠를 갱신하는 것이 일반적이므로, 폼 제출 후에도 페이지가 새로고침되지 않도록 관리해야함.
//   try {
//     await axios.post('http://localhost:8123/posts', { title, content },{withCredentials : true}); // await는 axios.post()함수가 반환하는 프로미스가 해결될 때까지 함수 실행을 일시 중지한다. 즉, 네트워크 요청이 완료될 때 까지 다음 코드 줄로 넘어가지 않는다. -> 이것이 없으면 기본적으로 비동기적으로 실행되기 때문에 서버에 요청하고 응답을 기다리는 동안 콜백함수가 실행될수 있음.
//     alert('게시물이 등록되었습니다!'); // 사용자에게 성공적으로 등록되었단,ㄴ 알림을 보냄
//     setTitle(''); // setTitle은 React의 상태 관리 훅 useState에 의해 제공된 함수로, 해당 컴포넌트의 title 상태를 초기화함. 사용자가 다음 포스트를 작성할 수 있도록 입력 필드를 비움
//     setContent(''); // setContent도 useState 훅에 의해 제공된 함수로, content 상태를 초기화함.
//   } catch (error) {
//     console.error('등록 실패', error);
//   }
// };
//onSubmit={handleSubmit} 코드는 HTML <form> 태그에서 사용되는 이벤트 핸들러임. 
// 해당 핸들러는 사용자가 폼을 제출할 때 , 즉 submit버튼(type='submit')을 클릭할 경우 호출되는 함수를 지정.
// 여기서 handleSubmit은 해당 폼의 제출이벤트를 처리하기 위한 함수이다. 이 함수는 데이터를 수정하여 서버로 전송하는 등의 작업을 수행.
