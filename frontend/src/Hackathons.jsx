import { useState, useEffect } from "react";
import { Calendar, Globe, Award, Users, Clock, Tag } from 'lucide-react';
// const cors = require('cors');

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch("http://localhost:4000/hackathons",{
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

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!hackathons || hackathons.length === 0) {
    return <div className="p-4 text-center text-gray-500">No hackathons available</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Upcoming Hackathons</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {hackathons.map((hackathon) => (
          <div 
            key={hackathon.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Thumbnail */}
              <div className="sm:w-48 h-48 flex-shrink-0">
                <img 
                  src={hackathon.thumbnail_url || "/api/placeholder/200/150"} 
                  alt={hackathon.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold mb-2 text-blue-700">
                    {hackathon.title}
                  </h2>
                  {hackathon.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 mb-2">
                  <p className="flex items-center mb-1">
                    <span className="mr-2"><Globe size={16} /></span>
                    {hackathon.displayed_location?.location || "Location not specified"}
                  </p>
                  <p className="flex items-center mb-1">
                    <span className="mr-2"><Calendar size={16} /></span>
                    {hackathon.submission_period_dates || "Dates not specified"}
                  </p>
                  <p className="flex items-center mb-1">
                    <span className="mr-2"><Clock size={16} /></span>
                    {hackathon.time_left_to_submission || "Deadline not specified"}
                  </p>
                  {hackathon.registrations_count && (
                    <p className="flex items-center mb-1">
                      <span className="mr-2"><Users size={16} /></span>
                      {hackathon.registrations_count} registered participants
                    </p>
                  )}
                </div>
                
                {/* Themes/Tags */}
                {hackathon.themes && hackathon.themes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hackathon.themes.map((theme) => (
                      <span 
                        key={theme.id} 
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Tag size={12} className="mr-1" />
                        {theme.name}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Prize Section */}
                {hackathon.prize_amount && (
                  <div className="flex items-center text-green-700 font-medium mb-3">
                    <Award size={18} className="mr-1" />
                    <span>Prize pool: {hackathon.prize_amount.replace(/<[^>]*>/g, '')}</span>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={() => toggleExpand(hackathon.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {expanded[hackathon.id] ? 'Show less' : 'Show more'}
                  </button>
                  
                  <div className="flex gap-2">
                    {hackathon.submission_gallery_url && (
                      <a 
                        href={hackathon.submission_gallery_url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
                      >
                        View Submissions
                      </a>
                    )}
                    {hackathon.url && (
                      <a 
                        href={hackathon.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                      >
                        More Info
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Expanded Section */}
                {expanded[hackathon.id] && (
                  <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong>Organization:</strong> {hackathon.organization_name || "Not specified"}</p>
                        <p><strong>Status:</strong> <span className="capitalize">{hackathon.open_state || "Not specified"}</span></p>
                        <p><strong>Invite Only:</strong> {hackathon.invite_only ? "Yes" : "No"}</p>
                      </div>
                      <div>
                        <p><strong>Prizes:</strong> {hackathon.prizes_counts?.cash > 0 ? `${hackathon.prizes_counts.cash} cash prize(s)` : "No cash prizes"}</p>
                        <p>
                          <strong>Managed by Devpost:</strong> {hackathon.managed_by_devpost_badge ? "Yes" : "No"}
                        </p>
                        {hackathon.start_a_submission_url && (
                          <a 
                            href={hackathon.start_a_submission_url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                          >
                            Start Submission
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hackathons;