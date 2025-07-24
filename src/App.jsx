import { useState, useEffect } from 'react'
import RestaurantCard from './RestaurantCard'
import './App.css'

// Use environment-based API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://restaurant-prank-backend.onrender.com/api'  // Added /api path
    : 'http://localhost:3001/api')

function App() {
  const [votes, setVotes] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastVoted, setLastVoted] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [showMobileAdmin, setShowMobileAdmin] = useState(false)
  const [tapCount, setTapCount] = useState(0)

  // Secret admin panel toggle (Ctrl+Alt+R) or mobile tap
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'r') {
        setShowAdminPanel(prev => !prev)
        // Reset admin auth when panel is closed
        if (showAdminPanel) {
          setIsAdminAuthenticated(false)
          setAdminPassword('')
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showAdminPanel])

  // Mobile admin access - tap header 7 times quickly
  const handleHeaderTap = () => {
    setTapCount(prev => {
      const newCount = prev + 1
      if (newCount >= 7) {
        setShowMobileAdmin(true)
        setShowAdminPanel(true)
        return 0
      }
      
      // Reset tap count after 2 seconds of no tapping
      setTimeout(() => setTapCount(0), 2000)
      return newCount
    })
  }

  // Check if user has already voted (using localStorage)
  useEffect(() => {
    const userHasVoted = localStorage.getItem('restaurant-prank-voted')
    if (userHasVoted) {
      setHasVoted(true)
      setLastVoted(userHasVoted)
    }
  }, [])

  // List of restaurants - Chick-fil-A is the only one that doesn't dodge!
  const restaurants = [
    { name: "McDonald's", category: "Fast Food", rating: 4.2, dodges: true },
    { name: "Burger King", category: "Fast Food", rating: 4.0, dodges: true },
    { name: "KFC", category: "Fried Chicken", rating: 4.1, dodges: true },
    { name: "Subway", category: "Sandwiches", rating: 3.9, dodges: true },
    { name: "Pizza Hut", category: "Pizza", rating: 4.3, dodges: true },
    { name: "Domino's Pizza", category: "Pizza", rating: 4.4, dodges: true },
    { name: "Taco Bell", category: "Mexican", rating: 4.0, dodges: true },
    { name: "Wendy's", category: "Fast Food", rating: 4.2, dodges: true },
    { name: "Chick-fil-A", category: "Chicken", rating: 4.6, dodges: false } // The chosen one!
  ]

  // Fetch votes data
  const fetchVotes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/votes`)
      if (!response.ok) {
        throw new Error('Failed to fetch votes')
      }
      const data = await response.json()
      setVotes(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching votes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Cast a vote
  const castVote = async (restaurant) => {
    // Prevent voting if user has already voted
    if (hasVoted) {
      console.log('User has already voted, blocking vote attempt')
      return
    }

    console.log('castVote called for:', restaurant)
    try {
      console.log('Making API request to:', `${API_BASE_URL}/vote`)
      const response = await fetch(`${API_BASE_URL}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurant }),
      })

      console.log('API response status:', response.status)
      if (!response.ok) {
        throw new Error('Failed to cast vote')
      }

      const data = await response.json()
      console.log('API response data:', data)
      
      // Check if data has the expected structure
      if (data && data.data && data.data.restaurants) {
        setVotes(data.data)
      } else if (data && data.restaurants) {
        setVotes(data)
      } else {
        console.error('Unexpected API response structure:', data)
        setVotes(data)
      }
      
      // Set voting state immediately to prevent double voting
      setLastVoted(restaurant)
      setHasVoted(true)
      setShowThankYou(true)
      
      // Store vote in localStorage to prevent multiple votes
      localStorage.setItem('restaurant-prank-voted', restaurant)
      localStorage.setItem('restaurant-prank-voted-timestamp', Date.now().toString())
      
      setError(null)
    } catch (err) {
      console.error('Error in castVote:', err)
      setError(err.message)
      // Don't let the error crash the app
    }
  }

  // Admin authentication
  const handleAdminLogin = () => {
    // Simple password check (you can change this password)
    if (adminPassword === 'admin123') {
      setIsAdminAuthenticated(true)
    } else {
      alert('Incorrect password!')
      setAdminPassword('')
    }
  }

  // Admin reset function (hidden)
  const resetAllVotes = async () => {
    if (!isAdminAuthenticated) {
      alert('Please authenticate first!')
      return
    }

    if (!confirm('Are you sure you want to reset all votes? This cannot be undone!')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to reset votes')
      }

      const data = await response.json()
      setVotes(data)
      
      // Clear localStorage for current user
      localStorage.removeItem('restaurant-prank-voted')
      localStorage.removeItem('restaurant-prank-voted-timestamp')
      setHasVoted(false)
      setLastVoted('')
      setShowThankYou(false)
      setError(null)
      
      alert('All votes have been reset successfully!')
    } catch (err) {
      setError(err.message)
      console.error('Error resetting votes:', err)
      alert('Failed to reset votes: ' + err.message)
    }
  }

  // Load votes on component mount
  useEffect(() => {
    fetchVotes()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading restaurant data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchVotes} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="app-header">
        <h1 onClick={handleHeaderTap} style={{ cursor: 'pointer' }}>
          Vote for restaurant you would like to eat
        </h1>
        {tapCount > 0 && tapCount < 7 && (
          <div className="tap-indicator">
            Tap {7 - tapCount} more times...
          </div>
        )}
      </div>

      {showAdminPanel && (
        <div className="admin-panel">
          <h3>🔧 Admin Panel</h3>
          {!isAdminAuthenticated ? (
            <div className="admin-login">
              <input
                type="password"
                placeholder="Enter admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="password-input"
              />
              <button onClick={handleAdminLogin} className="login-btn">
                Login
              </button>
            </div>
          ) : (
            <div className="admin-controls">
              <p>✅ Authenticated as Admin</p>
              <button onClick={resetAllVotes} className="reset-btn">
                🗑️ Reset All Votes
              </button>
            </div>
          )}
          <small>Press Ctrl+Alt+R to hide {showMobileAdmin && '(or tap header 7 times)'}</small>
        </div>
      )}

      {!hasVoted && (
        <div className="voting-instructions">
          Click on your favorite restaurant to vote! 🍽️
        </div>
      )}

      {hasVoted && (
        <div className="thank-you-section">
          <div className="thank-you-message">
            🎉 Thank you for voting for {lastVoted}!
          </div>
          <div className="results-title">
            🏆 Current Results
          </div>
          <div className="results-chart">
            {restaurants
              .sort((a, b) => (votes?.restaurants?.[b.name] || 0) - (votes?.restaurants?.[a.name] || 0))
              .map((restaurant, index) => {
                const voteCount = votes?.restaurants?.[restaurant.name] || 0;
                const maxVotes = Math.max(...restaurants.map(r => votes?.restaurants?.[r.name] || 0));
                const percentage = maxVotes > 0 ? (voteCount / maxVotes) * 100 : 0;
                
                return (
                  <div key={restaurant.name} className="result-bar">
                    <div className="result-info">
                      <span className="restaurant-name">{restaurant.name}</span>
                      <span className="vote-count">{voteCount} votes</span>
                    </div>
                    <div className="bar-container">
                      <div 
                        className={`bar ${index === 0 && voteCount > 0 ? 'winner' : ''}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {!hasVoted && (
        <div className="restaurants-grid">
          {restaurants.map((restaurant, index) => (
            <div key={restaurant.name} className="restaurant-row">
              <RestaurantCard
                restaurant={restaurant}
                votes={votes?.restaurants?.[restaurant.name] || 0}
                onVote={castVote}
                lastVoted={lastVoted === restaurant.name}
                disabled={hasVoted}
              />
              {/* Arrow pointing to Chick-fil-A (last item) */}
              {index === restaurants.length - 1 && (
                <div className="chick-fil-a-arrow">
                  <div className="arrow-emoji">👈</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
