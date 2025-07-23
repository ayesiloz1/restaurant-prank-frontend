import { useState, useEffect } from 'react'
import RestaurantCard from './RestaurantCard'
import './App.css'

// Use environment-based API URL with fallback for Render deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://restaurant-prank-backend.onrender.com'  // Will be updated with actual Render URL
    : 'http://localhost:3001')

function App() {
  const [votes, setVotes] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastVoted, setLastVoted] = useState('')
  const [showThankYou, setShowThankYou] = useState(false)

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
    { name: "Chick-fil-A", category: "Chicken", rating: 4.6, dodges: false }, // The chosen one!
    { name: "Chipotle Mexican Grill", category: "Mexican", rating: 4.1, dodges: true },
    { name: "Five Guys", category: "Burgers", rating: 4.3, dodges: true },
    { name: "In-N-Out Burger", category: "Burgers", rating: 4.5, dodges: true }
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
      setShowThankYou(true)
      
      // Hide thank you message after 3 seconds
      setTimeout(() => setShowThankYou(false), 3000)
      
      setError(null)
    } catch (err) {
      console.error('Error in castVote:', err)
      setError(err.message)
      // Don't let the error crash the app
    }
  }

  // Reset votes (admin function)
  const resetVotes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to reset votes')
      }

      const data = await response.json()
      setVotes(data)
      setLastVoted('')
      setShowThankYou(false)
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error resetting votes:', err)
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
        <h1>Vote for restaurant you would like to eat</h1>
        
        <div className="stats-container">
          <div className="stats">
            <div className="total-votes">
              <span className="label">Total Votes Cast:</span>
              <span className="count">{votes?.totalVotes || 0}</span>
            </div>
            <button onClick={resetVotes} className="admin-btn">
              Reset Results
            </button>
          </div>
        </div>
      </div>

      {showThankYou && (
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
            onVote={castVote}
            lastVoted={lastVoted === restaurant.name}
          />
        ))}
      </div>
    </div>
  )
}

export default App
