import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import '../../GlobalStyles/main.css';


/**
 * InstagramFeed fetches and displays a grid of Instagram posts using the Instagram Graph API.
 */
const InstagramFeed = ({ accessToken }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  /**
   * Fetches posts from Instagram API and updates component state with results.
   * NB: The access token must be updated every 60 days.
   */
  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`);
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram posts');
        }
        
        // Parse the response as JSON and shuffel the posts
        const data = await response.json();
        const shuffledPosts = data.data.sort(() => 0.5 - Math.random()).slice(0, 16);
        setPosts(shuffledPosts);

      // Catch any errors and set the error state
      } catch (error) {
        setError(error.message);
      } 
      // Set loading to false when the fetch is done
      finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, [accessToken]);


  // Display loading message while fetching data
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress style={{ color: '#F6964B' }} /> 
      </div>
    );
  }

  // Display error message if there is an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    // Display the Instagram posts in a grid with 4 columns and a gap of 10px between the posts 
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', 'border-radius': '15px' }}>
      {posts.map(post => (

        // Display the Instagram post as a link with the image as a background
        <a href={post.permalink} key={post.id} className="card-link" style={{ padding: '5px', border: '1px solid white', boxSizing: 'border-box', aspectRatio: '1 / 1' }}>
          <div className="hover-message">Click to open the Instagram post</div>
          <img src={post.media_url} alt={post.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </a>
      ))}
    </div>
  );
};

export default InstagramFeed;
