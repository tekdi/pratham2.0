// pages/fake-api-react.js

import { useEffect, useState } from "react";

const Profile = () => {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
        console.log(response, "response");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log(data, "data");
        setPostData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means the effect runs only once when the component mounts

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Profile API Data (Next.js)</h1>
      <p><strong>Title:</strong> {postData.title}</p>
      <p><strong>Body:</strong> {postData.body}</p>
    </div>
  );
};

export default Profile;
