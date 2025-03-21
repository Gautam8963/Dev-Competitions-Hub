import { useState, useEffect } from 'react';
import { Calendar, Clock, ExternalLink, Search, Filter, Award, Globe, Users, Tag, Code } from 'lucide-react';

const CompetitionsTracker = () => {
  const [competitions, setCompetitions] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('contests');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState({});

  const url = 'https://contests-cyus.onrender.com';
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch contests
        const contestsResponse = await fetch(url+'/contests');
        if (!contestsResponse.ok) {
          throw new Error('Failed to fetch contests');
        }
        const contestsData = await contestsResponse.json();
        setCompetitions(contestsData.data || []);
        
        // Fetch hackathons
        const hackathonsResponse = await fetch(url+'/hackathons');
        if (!hackathonsResponse.ok) {
          throw new Error('Failed to fetch hackathons');
        }
        const hackathonsData = await hackathonsResponse.json();
        setHackathons(hackathonsData.data || []);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCompetitions = competitions.filter(competition => {
    const matchesFilter = filter === 'all' || competition.platform.toLowerCase() === filter;
    const matchesSearch = competition.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredHackathons = hackathons.filter(hackathon => {
    return hackathon.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getPlatformStyles = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'leetcode':
        return 'bg-amber-500 text-white';
      case 'codeforces':
        return 'bg-red-500 text-white';
      case 'codechef':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Dev <span className="text-indigo-600">Competitions</span> Hub
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover coding contests and hackathons from top platforms all in one place
          </p>
        </div>

        {/* Search and Tab Navigation */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-6 py-2 rounded-lg transition-colors ${activeTab === 'contests' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm`}
              onClick={() => setActiveTab('contests')}
            >
              <Code size={18} className="inline mr-2" />
              Coding Contests
            </button>
            <button 
              className={`px-6 py-2 rounded-lg transition-colors ${activeTab === 'hackathons' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm`}
              onClick={() => setActiveTab('hackathons')}
            >
              <Award size={18} className="inline mr-2" />
              Hackathons
            </button>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input 
              type="text" 
              className="bg-white text-gray-800 rounded-lg pl-10 pr-4 py-2 w-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={activeTab === 'contests' ? "Search contests..." : "Search hackathons..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'contests' && (
          <>
            {/* Platform Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm transition-colors`}
                onClick={() => setFilter('all')}
              >
                All Platforms
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'leetcode' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm transition-colors`}
                onClick={() => setFilter('leetcode')}
              >
                LeetCode
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'codeforces' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm transition-colors`}
                onClick={() => setFilter('codeforces')}
              >
                Codeforces
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm font-medium ${filter === 'codechef' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'} shadow-sm transition-colors`}
                onClick={() => setFilter('codechef')}
              >
                CodeChef
              </button>
            </div>

            {/* Contests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : error ? (
                <div className="col-span-full bg-red-50 p-4 rounded-lg text-center border border-red-200">
                  <p className="text-red-600">{error}</p>
                  <button 
                    className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              ) : filteredCompetitions.length === 0 ? (
                <div className="col-span-full bg-white p-6 rounded-lg text-center shadow-sm border border-gray-200">
                  <p className="text-gray-500">No contests found matching your criteria.</p>
                </div>
              ) : (
                filteredCompetitions.map((contest, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* <div className={`h-2 ${getPlatformStyles(contest.platform)}`}></div> */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">{contest.name}</h2>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPlatformStyles(contest.platform)}`}>
                          {contest.platform}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          <span>{formatDate(contest.startTime)}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock size={16} className="mr-2 text-gray-400" />
                          <span>{contest.duration}</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <a 
                          href={contest.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          <ExternalLink size={16} className="mr-2" />
                          View Contest
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}



        {/* Hackathons Section */}
        {activeTab === 'hackathons' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                <p className="text-red-600">{error}</p>
                <button 
                  className="mt-4 bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg text-white transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : filteredHackathons.length === 0 ? (
              <div className="bg-white p-6 rounded-lg text-center shadow-sm border border-gray-200">
                <p className="text-gray-500">No hackathons found matching your criteria.</p>
              </div>
            ) : (
              filteredHackathons.map((hackathon) => (
                <div 
                  key={hackathon.id} 
                  className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumbnail */}
                    <div className="sm:w-48 h-48 flex-shrink-0 bg-gray-100">
                      <img 
                        src={hackathon.thumbnail_url || "/api/placeholder/200/150"} 
                        alt={hackathon.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">
                          {hackathon.title}
                        </h2>
                        {hackathon.featured && (
                          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Globe size={16} className="mr-2 text-gray-400" />
                          {hackathon.displayed_location?.location || "Location not specified"}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Calendar size={16} className="mr-2 text-gray-400" />
                          {hackathon.submission_period_dates || "Dates not specified"}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock size={16} className="mr-2 text-gray-400" />
                          {hackathon.time_left_to_submission || "Deadline not specified"}
                        </div>
                        {hackathon.registrations_count && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <Users size={16} className="mr-2 text-gray-400" />
                            {hackathon.registrations_count} participants
                          </div>
                        )}
                      </div>
                      
                      {/* Prize Section */}
                      {hackathon.prize_amount && (
                        <div className="flex items-center text-green-700 font-medium mb-4">
                          <Award size={18} className="mr-2" />
                          <span>Prize pool: {hackathon.prize_amount.replace(/<[^>]*>/g, '')}</span>
                        </div>
                      )}
                      
                      {/* Themes/Tags */}
                      {hackathon.themes && hackathon.themes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {hackathon.themes.map((theme) => (
                            <span 
                              key={theme.id} 
                              className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full flex items-center"
                            >
                              <Tag size={12} className="mr-1" />
                              {theme.name}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex justify-between items-center mt-4">
                        <button 
                          onClick={() => toggleExpand(hackathon.id)}
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {expanded[hackathon.id] ? 'Show less' : 'Show more'}
                        </button>
                        
                        <div className="flex gap-2">
                          {/* {hackathon.submission_gallery_url && (
                            <a 
                              href={hackathon.submission_gallery_url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
                            >
                              View Projects
                            </a>
                          )} */}
                          {hackathon.start_a_submission_url && (
                        <a 
                        href={hackathon.start_a_submission_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        register
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
                              <p><strong>Managed by Devpost:</strong> {hackathon.managed_by_devpost_badge ? "Yes" : "No"}</p>
                              {hackathon.start_a_submission_url && (
                                <a 
                                  href={hackathon.url} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                                >
                                  More Details
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 py-6 border-t border-gray-200">
          <div className="flex flex-1 justify-center text-center text-gray-500 text-sm">
            <a href="https://www.linkedin.com/in/gautam-dhodi-848567237">
            <img width="48" height="48" src="https://img.icons8.com/color/48/linkedin.png" alt="linkedin"/>
            </a>
            {/* <a href="">
            <img width="48" height="48" src="https://img.icons8.com/color/48/twitterx--v1.png" alt="twitterx--v1"/>
            </a> */}
            <a href="https://github.com/Gautam8963/">
            <img width="48" height="48" src="https://img.icons8.com/glyph-neue/64/github.png" alt="github"/>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CompetitionsTracker;