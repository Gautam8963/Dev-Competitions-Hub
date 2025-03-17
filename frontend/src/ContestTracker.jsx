import { useState, useEffect } from 'react';
import { FiExternalLink, FiCode, FiCalendar, FiClock, FiSearch } from 'react-icons/fi';

const ContestTracker = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchContests = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/contests');
        if (!response.ok) {
          throw new Error('Failed to fetch contests');
        }
        const data = await response.json();
        setContests(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const filteredContests = contests.filter(contest => {
    const matchesFilter = filter === 'all' || contest.platform.toLowerCase() === filter;
    const matchesSearch = contest.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
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

  const getPlatformStyles = (platform) => {
    switch (platform.toLowerCase()) {
      case 'leetcode':
        return 'from-yellow-400 to-yellow-600 shadow-yellow-300/50';
      case 'codeforces':
        return 'from-red-400 to-red-600 shadow-red-300/50';
      case 'codechef':
        return 'from-blue-400 to-blue-600 shadow-blue-300/50';
      default:
        return 'from-gray-400 to-gray-600 shadow-gray-300/50';
    }
  };

  return (
    <div className="w-screen h-screen overflow-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white font-mono">
      <div className="container mx-auto px-4 py-8 min-h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 inline-block text-transparent bg-clip-text">
            <h1 className="text-4xl font-bold mb-2">
              <FiCode className="inline-block mr-2" />
              Coding Contest Tracker
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Track upcoming coding contests from LeetCode, Codeforces, and CodeChef
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setFilter('all')}
            >
              All Platforms
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${filter === 'leetcode' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setFilter('leetcode')}
            >
              LeetCode
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${filter === 'codeforces' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setFilter('codeforces')}
            >
              Codeforces
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${filter === 'codechef' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setFilter('codechef')}
            >
              CodeChef
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              className="bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 w-full border border-gray-700 focus:outline-none focus:border-purple-500"
              placeholder="Search contests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content - This will expand to fill available space */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 p-4 rounded-lg text-center">
              <p className="text-red-200">{error}</p>
              <button 
                className="mt-4 bg-red-700 hover:bg-red-800 px-6 py-2 rounded-lg text-white"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filteredContests.length === 0 ? (
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <p className="text-gray-300">No contests found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContests.map((contest, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br ${getPlatformStyles(contest.platform)} bg-opacity-10 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${getPlatformStyles(contest.platform)}`}>
                        {contest.platform}
                      </span>
                      <h2 className="text-xl font-bold mt-3 mb-2">{contest.name}</h2>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-gray-200">
                      <FiCalendar className="mr-2" />
                      <span>{formatDate(contest.startTime)}</span>
                    </div>
                    <div className="flex items-center text-gray-200">
                      <FiClock className="mr-2" />
                      <span>{contest.duration}</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <a 
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center bg-gray-900 bg-opacity-50 hover:bg-opacity-70 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                    >
                      <FiExternalLink className="inline mr-2" />
                      View Contest
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      
        {/* Footer */}
        <footer className="mt-auto py-6 border-t border-gray-800">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Contest Tracker • Powered by LeetCode, Codeforces & CodeChef APIs</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ContestTracker;