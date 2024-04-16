import React, { useEffect, useState } from 'react';

const InstagramFeed = ({ accessToken }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Fetch Instagram posts
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`);
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }
        // Get the data, and shuffel the posts and only show 16 of them 
        const data = await response.json();
        const shuffledPosts = data.data.sort(() => 0.5 - Math.random()).slice(0, 16);
        setPosts(shuffledPosts);
      }
      catch (error) {
        setError(error.message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, [accessToken]);


  // If the posts are loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there is an error, show the error message
  if (error) {
    return <div>Error: {error}</div>;
  }


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
