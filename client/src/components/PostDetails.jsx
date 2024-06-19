import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PostDetails.css'; // CSS 파일 추가

function PostDetail() {
  const { id } = useParams(); // URL 파라미터에서 게시물 ID를 가져옴
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  //const [user, setUser] = useState({ name: '개똥이', userID: 'ddong' }); // 사용자 정보 예시

  useEffect(() => {
    const fetchPost = async () => {
      const result = await axios.get(`http://localhost:8123/posts/${id}`, { withCredentials: true });
      setPost(result.data);
    };
    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      const result = await axios.get(`http://localhost:8123/posts/${id}/comments`, { withCredentials: true });
      setComments(result.data);
    };
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:8123/posts/${id}/comments`, {
      postidx: id,
      content: commentContent,
    }, { withCredentials: true });

    setCommentContent('');
    // 댓글 작성 후 댓글 목록을 다시 불러옵니다.
    const result = await axios.get(`http://localhost:8123/posts/${id}/comments`, { withCredentials: true });
    setComments(result.data);
  };

  if (!post) return <div>Loading...</div>;
  console.log(post.img_url)
  return (
    <div className="parent">
      <div className="post-detail">
        <h1>{post.title}</h1>
        <p>{post.contents}</p>
        <p>작성자: {post.userID}</p>
        <p>작성일: {post.regdate}</p>
        {post.img_url && <img src={post.img_url} alt="Post image" className="post-image" />} {/* 이미지가 있는 경우 렌더링 */}

      </div>
      <div className="comments-section">
        <h2>댓글</h2>
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.idx}>
              <p>{comment.comment}</p>
              <p>작성자: {comment.userID}</p>
              <p>작성일: {comment.regdate}</p>
            </li>
          ))}
        </ul>
        <div className="comment-form">
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 작성하세요"
              required
            />
            <button type="submit">댓글 달기</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;



// function PostDetail({ match,location, history }) { // match 객체를 props로 받음.  match는 React Router에 의해 주입되는 객체로 <component = {PostDetail}>형태로 전달(element가 아니라 component로 받음 그래야 match,location같은 객체를 받을 수 있음), 현재 URL의 동적 세그먼트에 대한 정보를 포함하고 있음. 이 경우, postId를 URL로부터 추출합니다.
//     // { match,location, history }에 대한 자세한 내용은 노션 react 부분 function({match,location,historu})토글 부분에 자세히 적어둠.
//   console.log(match.params.id); // URL에서 :id에 해당하는 부분
//   console.log(location.pathname); // 현재 경로
//     ///console.log(history.push('/some/path')); // 다른 경로로 이동
//   const [post, setPost] = useState(null);
//   const postId = match.params.id;

//   useEffect(() => { // 이 훅은 컴포넌트가 DOM에 마운트 될때와 postId가 변경될 때 마다 실행됨.
//     const fetchPost = async () => {
//       const result = await axios.get(`http://localhost:8123/posts/${postId}`,{withCredentials : true});
//       setPost(result.data);
//     };

//     fetchPost();
//   }, [postId]); //postId가 변할때 마다 이 훅은 재실행되어 새 포스트 데이터를 로드함. (의존성 배열) -> []로 바꾸어도 될듯?

//   if (!post) return <div>Loading...</div>;

//   return (
//     <div>
//       <h1>{post.title}</h1>
//       <p>{post.content}</p>
//     </div>
//   );
// }

// export default PostDetail;
