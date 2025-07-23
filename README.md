# Restaurant Prank Voting App - Frontend

A hilarious React-based voting application where restaurants dodge your clicks! This is the frontend interface for the restaurant prank voting system.

## 🎭 What's the Prank?

This app appears to be a normal restaurant voting interface, but there's a twist! When users try to click on most restaurants, they magically "dodge" the cursor and move away. Only **Chick-fil-A** stays put and allows voting, making it hilariously obvious which restaurant will win!

## ✨ Features

- **Dodging Mechanics**: 11 out of 12 restaurants dodge mouse clicks with smooth animations
- **Visual Effects**: Laughing emojis (😂) appear when restaurants dodge
- **Mobile Responsive**: Touch-friendly interface for mobile devices
- **Real-time Voting**: Live vote counts with backend synchronization
- **Professional UI**: Clean, modern design with gradient backgrounds
- **Error Handling**: Comprehensive error boundaries and graceful fallbacks

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Custom CSS3 with animations and responsive design
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API for backend communication
- **Build Tool**: Vite for fast development and optimized builds

## 🎯 How It Works

1. **Normal Restaurant**: User hovers/clicks → Restaurant moves away → Laughing emoji appears
2. **Chick-fil-A**: User hovers/clicks → Stays in place → Vote is cast successfully
3. **Mobile**: Touch events trigger the same prank mechanics
4. **Reset**: Admin can reset all votes via the reset button

## 🚀 Deployment Options

### Vercel (Recommended for React)
1. Connect this repository to Vercel
2. Set environment variable: `VITE_API_URL=your-backend-url`
3. Deploy automatically

### Netlify
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: `VITE_API_URL=your-backend-url`

### Render Static Site
1. Connect repository to Render
2. Build command: `npm run build`
3. Publish directory: `dist`

## 📦 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
```

For production, set this to your deployed backend URL.

## 📱 Responsive Design

The app is fully responsive with:
- **Desktop**: Hover effects and smooth mouse dodge animations
- **Tablet**: Touch-optimized interactions with proper spacing
- **Mobile**: Single-column layout with touch-friendly buttons

## 🎨 Restaurant List

- McDonald's (dodges)
- Burger King (dodges)
- KFC (dodges)
- Subway (dodges)
- Pizza Hut (dodges)
- Domino's Pizza (dodges)
- Taco Bell (dodges)
- **Chick-fil-A** (stays put - the target!)
- Wendy's (dodges)
- Chipotle (dodges)
- Starbucks (dodges)
- Dunkin' (dodges)

## 🔧 Development

The app uses Vite for development with:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Optimized build process
- ES modules support

```bash
# Development mode
npm run dev
# Opens http://localhost:5173
```

## 📁 Project Structure

```
├── src/
│   ├── App.jsx              # Main application component
│   ├── App.css              # Main application styles
│   ├── RestaurantCard.jsx   # Individual restaurant component
│   ├── ErrorBoundary.jsx    # Error handling component
│   ├── main.jsx             # React app entry point
│   ├── index.css            # Global styles
│   └── assets/              # Static assets
├── public/                  # Public static files
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

## 🎭 Animation Details

- **Dodge Animation**: 0.3s smooth CSS transitions
- **Return Animation**: 1s delay before returning to original position
- **Laughing Emojis**: 2s fade-out animation with floating effect
- **Mobile Touch**: Instant feedback with visual prank confirmation

## 🔗 Backend Integration

This frontend connects to the backend API for:
- Fetching current vote counts
- Casting new votes
- Resetting vote counts
- Health checks

## 📝 License

This project is part of the Restaurant Prank Voting App suite - designed for entertainment and harmless pranks!
