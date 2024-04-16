import React, { useEffect, useState } from 'react';

const InstagramFeed = ({ accessToken }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`);
      const data = await response.json();
      // Shuffel the posts and only show 16 of them 
      const shuffledPosts = data.data.sort(() => 0.5 - Math.random()).slice(0, 16);
      setPosts(shuffledPosts);
    };

    fetchInstagramPosts();
  }, [accessToken]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
      {posts.map(post => (
        <div key={post.id} style={{ padding: '5px', border: '1px solid white', boxSizing: 'border-box', aspectRatio: '1 / 1' }}>
          <img src={post.media_url} alt={post.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}
    </div>
  );
};

export default InstagramFeed;
