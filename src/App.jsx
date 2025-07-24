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
      
      setLastVoted(restaurant)
      setHasVoted(true)
      setShowThankYou(true)
      
      // Store vote in localStorage to prevent multiple votes
      localStorage.setItem('restaurant-prank-voted', restaurant)
      
      // Hide thank you message after 3 seconds
      setTimeout(() => setShowThankYou(false), 3000)
      
      setError(null)
    } catch (err) {
      console.error('Error in castVote:', err)
      setError(err.message)
      // Don't let the error crash the app
    }
  }

  // Reset votes (admin function) - REMOVED FOR PRODUCTION

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
        <h1>Vote for restaurant you would like to eat</h1>
        
        <div className="stats-container">
          <div className="stats">
            <div className="total-votes">
              <span className="label">Total Votes Cast:</span>
              <span className="count">{votes?.totalVotes || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {hasVoted && (
        <div className="already-voted-message">
          🗳️ You have already voted for {lastVoted}! Here are the current results:
        </div>
      )}

      {showThankYou && !hasVoted && (
        <div className="thank-you-message">
          ✅ Thank you for voting for {lastVoted}! Your vote has been recorded.
        </div>
      )}

      <div className="restaurants-grid">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.name}
            restaurant={restaurant}
            votes={votes?.restaurants?.[restaurant.name] || 0}
            onVote={hasVoted ? null : castVote}
            lastVoted={lastVoted === restaurant.name}
            disabled={hasVoted}
          />
        ))}
      </div>
    </div>
  )
}

export default App
