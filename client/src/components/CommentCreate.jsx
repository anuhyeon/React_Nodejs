import React, { useState } from 'react';
import axios from 'axios';

function CommentCreate({ postId }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8123/posts/${postId}/comments`, { content },{withCredentials : true});
      alert('Comment added!');
      setContent('');
    } catch (error) {
      console.error('댓글 달기 실패', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글 달기"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default CommentCreate;