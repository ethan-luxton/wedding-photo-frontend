import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import UploadPage from './pages/UploadPage'
import GalleryPage from './pages/GalleryPage'
import './App.css'

const Ornament = () => (
  <div className="ornament" aria-hidden="true">
    <svg viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="10" x2="80" y2="10" stroke="currentColor" strokeWidth="0.5" />
      <path d="M85 10 L92 3 Q100 0 108 3 L115 10 L108 17 Q100 20 92 17 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="100" cy="10" r="2" fill="currentColor" opacity="0.5" />
      <line x1="120" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="0.5" />
    </svg>
  </div>
)

function App() {
  const location = useLocation()
  const isGallery = location.pathname.startsWith('/gallery')

  return (
    <div className="app">
      {/* Full-bleed hero */}
      <header className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="hero__content">
          <span className="hero__script">Welcome to</span>
          <h1 className="hero__title">Our Wedding</h1>
          <div className="hero__line" aria-hidden="true" />
          <p className="hero__subtitle">
            {isGallery
              ? 'Every photo from friends & family lives together in this gallery.'
              : 'Help us relive the magic. Share your favorite moments from our celebration.'}
          </p>
          <div className="hero__actions">
            <Link className={`btn ${isGallery ? 'secondary' : 'primary'}`} to="/">
              Upload
            </Link>
            <Link className={`btn ${isGallery ? 'primary' : 'ghost'}`} to="/gallery">
              View Gallery
            </Link>
          </div>
        </div>
        <div className="hero__rings" aria-hidden="true">
          <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
            <circle cx="45" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
            <circle cx="75" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
          </svg>
        </div>
      </header>

      {/* Navigation */}
      <nav className="view-toggle" aria-label="Page views">
        <NavLink
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
          to="/"
          end
        >
          Upload
        </NavLink>
        <NavLink
          className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}
          to="/gallery"
        >
          Gallery
        </NavLink>
        <div className="toggle-meta">Private album for wedding guests</div>
      </nav>

      <Ornament />

      {/* Main content */}
      <main className="main">
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Ornament />

      {/* Tips section */}
      <section className="panel info-panel" id="guest-tips">
        <div className="info-grid">
          <div className="info-card">
            <div className="info-card__icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="5" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="1.2"/>
                <circle cx="10" cy="12" r="2.5" stroke="currentColor" strokeWidth="1"/>
                <path d="M3 19L9 14L13 17L19 11L25 16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>What to Capture</h3>
            <p>Look for candids, tiny details, and the people you love most.</p>
          </div>
          <div className="info-card">
            <div className="info-card__icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 24V8M14 8L8 14M14 8L20 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 18V22C4 23.1046 4.89543 24 6 24H22C23.1046 24 24 23.1046 24 22V18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Easy Sharing</h3>
            <p>Select your photos and videos, tap upload, and you're done.</p>
          </div>
          <div className="info-card">
            <div className="info-card__icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 4C8.47715 4 4 8.47715 4 14C4 19.5228 8.47715 24 14 24C19.5228 24 24 19.5228 24 14C24 8.47715 19.5228 4 14 4Z" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M10 14L13 17L18 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Keep It Cozy</h3>
            <p>This gallery is meant for invited wedding guests only.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer__ornament" aria-hidden="true">
          <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15 Q30 0 50 15 Q70 30 90 15" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
          </svg>
        </div>
        <p className="footer__script">with love</p>
        <p className="footer__note">Made with care for our wedding day</p>
      </footer>
    </div>
  )
}

export default App
