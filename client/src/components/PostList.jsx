import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostList.css'; 
import { useNavigate } from 'react-router-dom';



function PostList() {
  const [posts, setPosts] = useState([]);

  const [user, setUser] = useState({ name: '개똥이', email: 'ddong@example.com' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await axios.get('http://localhost:8123/posts',{withCredentials : true});
      setPosts(result.data);
      //setUser()
    };
    fetchPosts();
  }, []);

  console.log(posts); // 이 부분은 렌더링될 때마다 실행됨.

  const navigate = useNavigate();
  const toPostCreate = ()=>{
    // '/create' 경로로 리디렉션
    navigate('/create');
  }

//   const prevPage = () => {
    
//   }
//   const nextPage = () => {
//     navigate('/');
//  }

const toPostDetail = (idx) => {
    navigate(`/main/${idx}`);
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


  return (
    <div className="post-list-container">
    <div className="post-list">
    <div className="header">
      <h1 className="post-list-name">게시판</h1>
      <div className="user-info">
        <span>{user.name} ({user.email})</span>
        <button onClick={toPostCreate} className="new-post-button">새글 작성</button>
        <button onClick={logout}>로그아웃</button>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>등록순</th>
          <th>제목</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, index) => (
          <tr key={post.idx} onClick={() => toPostDetail(post.idx)} style={{ cursor: 'pointer' }}>
            <td>{posts.length - index}</td>
            <td>{post.title}</td>
            <td>{post.userID}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="pagination">
    <div className="post-list-next-prev">
     <button >이전 페이지 </button>
     <button >다음 페이지 </button>
     </div>
    </div>
  </div>
  </div>
    
  
  );
}

export default PostList;
// 위 코드에서 post는 배열이며, 게시물의 객체들을 요소로 가지고 있음.
// map함수 : 배열 'posts'의 각 요소, 즉, 각 게시물에 대해서 실행됨.
// map함수의 콜백함수에서는 각 게시물을 나타내는 jsx요소 <li>를 반환한다.
// react에서 배열의 요소들을 렌더링할 때에는 각 요소에 고유한 key를 제공해야한다. 이는 react가 dom(html 태그 요소라고 생각하면됨)을 효율적으로 업데이트 하기위해 사용됨.
// key 는 일반적으로 데이터의 고유한 식별자를 사용하기 위해서 지정. 따라서 key값은 중복되지 않아야고 형제 요소들 사이에서 유일해야함! 따라서 key값을 id로 해줘야함.
// map함수의 장점 -> 원본 배열을 변경하지 않고 새 배열을 반환하여 react의 불변성 원칙을 따르는데 도움됨.