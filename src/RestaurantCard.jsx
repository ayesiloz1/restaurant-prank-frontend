import { useState, useRef, useEffect } from 'react'

const RestaurantCard = ({ restaurant, votes, onVote, lastVoted }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [dodgeCount, setDodgeCount] = useState(0)
  const cardRef = useRef(null)
  const containerRef = useRef(null)

  const { name, category, rating, dodges } = restaurant

  // Function to generate random corner position
  const generateRandomPosition = () => {
    if (!containerRef.current || !cardRef.current) return { x: 0, y: 0 }

    const container = containerRef.current.getBoundingClientRect()
    const card = cardRef.current.getBoundingClientRect()
    
    // Choose a random corner or edge of the viewport
    const corners = [
      { x: -card.width + 20, y: -card.height + 20 }, // top-left (off screen)
      { x: container.width - 20, y: -card.height + 20 }, // top-right (off screen)
      { x: -card.width + 20, y: container.height - 20 }, // bottom-left (off screen)
      { x: container.width - 20, y: container.height - 20 }, // bottom-right (off screen)
      { x: -card.width + 50, y: container.height / 2 }, // far left
      { x: container.width - 50, y: container.height / 2 }, // far right
      { x: container.width / 2, y: -card.height + 50 }, // far top
      { x: container.width / 2, y: container.height - 50 } // far bottom
    ]
    
    // Pick a random corner/edge
    const randomCorner = corners[Math.floor(Math.random() * corners.length)]
    
    return randomCorner
  }

  // Handle mouse enter (hover start)
  const handleMouseEnter = () => {
    if (!dodges) return // Chick-fil-A doesn't dodge!
    
    setIsHovered(true)
    
    // Move to random corner position
    const newPosition = generateRandomPosition()
    setPosition(newPosition)
    setDodgeCount(prev => prev + 1)
    
    // Return to original position after 1 second (faster)
    setTimeout(() => {
      setPosition({ x: 0, y: 0 })
      setIsHovered(false)
    }, 1000)
  }

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Handle click
  const handleClick = () => {
    console.log('RestaurantCard clicked:', name, 'dodges:', dodges)
    
    if (dodges) {
      // If it's a dodging restaurant, dodge to corner on click!
      const newPosition = generateRandomPosition()
      setPosition(newPosition)
      setDodgeCount(prev => prev + 1)
      
      // Return to original position after 1 second (faster)
      setTimeout(() => {
        setPosition({ x: 0, y: 0 })
        setIsHovered(false)
      }, 1000)
    } else {
      // Only Chick-fil-A allows voting
      console.log('Calling onVote for:', name)
      onVote(name)
    }
  }

  // Reset position when container resizes
  useEffect(() => {
    const handleResize = () => {
      if (dodges) {
        setPosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [dodges])

  return (
    <div 
      ref={containerRef}
      className="restaurant-card-container"
    >
      <div
        ref={cardRef}
        className={`restaurant-card ${dodges ? 'dodging' : 'stationary'} ${isHovered ? 'hovered' : ''} ${lastVoted ? 'just-voted' : ''}`}
        style={dodges ? {
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isHovered ? 'transform 0.4s ease-out' : 'none'
        } : {}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="restaurant-info">
          <div className="restaurant-main">
            <h3 className="restaurant-name">{name}</h3>
            <div className="restaurant-details">
              <span className="restaurant-category">{category}</span>
            </div>
          </div>
        </div>
        
        {!dodges && (
          <div className="featured-badge">
            Featured
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantCard
