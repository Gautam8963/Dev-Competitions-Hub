import { useState, useEffect } from "react";
// const cors = require('cors');

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch("http://localhost:4000/hack",{
            method: "GET",
            mode: "cors"
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Hackathons");
        }

        const data = await response.json();
        console.log("Fetched Data:", data);
        setHackathons(data?.data || []); // Ensure it's always an array
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHackathons();
  }, []);

  return (
    <div>
      <h1>Hackathons</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <ul>
        {hackathons.map((hackathon, index) => (
          <li key={index}>{hackathon.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Hackathons;