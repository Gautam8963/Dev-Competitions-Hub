import { useState, useEffect } from 'react';

const Hackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const response = await fetch('http://localhost:4000/hackathons');
                if (!response.ok) {
                    throw new Error('Failed to fetch Hackathons');
                }
                const data = await response.json();
                setHackathons(data.data); // Update state with the correct field
                console.log("Response:", response);
                console.log("Data:", data);
            } catch (err) {
                setError(err.message);
            }
        };
        
        fetchHackathons(); // Call the function inside useEffect
    }, []);

    return (
        <div>
            <h1>Hackathons</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <ul>
                {hackathons.map((hackathon, index) => (
                    <li key={index}>{hackathon.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default Hackathons;