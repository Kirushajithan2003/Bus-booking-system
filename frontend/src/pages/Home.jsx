import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCities } from '../api';
import './Home.css';

const POPULAR_ROUTES = [
  { from: 'Trincomalee', to: 'Colombo' },
  { from: 'Colombo', to: 'Kandy' },
  { from: 'Colombo', to: 'Galle' },
  { from: 'Colombo', to: 'Jaffna' },
  { from: 'Anuradhapura', to: 'Colombo' },
  { from: 'Kandy', to: 'Colombo' },
];

export default function Home() {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [cities, setCities] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    getCities().then(r => setCities(r.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!from || !to || !date) return;
    navigate(`/search?from=${from}&to=${to}&date=${date}`);
  };

  const quickSearch = (route) => {
    setFrom(route.from);
    setTo(route.to);
    // Set date to tomorrow automatically for quick search convenience
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setDate(dateStr);
    
    // Auto trigger search if user prefers, but let's just fill for now to be safe
    // navigate(`/search?from=${route.from}&to=${route.to}&date=${dateStr}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">🚌 Sri Lanka's Premier Bus Booking Platform</div>
          <h1 className="hero-title">
            Travel Smarter.<br />
            Book <span className="gradient-text">Bus Tickets</span><br />
            Instantly.
          </h1>
          <p className="hero-subtitle">
            Search from all major Sri Lankan routes, choose your seats, and travel in comfort.<br />
            Secure bookings. Instant confirmation.
          </p>

          {/* Search Form */}
          <form className="search-card card" onSubmit={handleSearch}>
            <div className="search-fields">
              <div className="search-field">
                <label className="form-label">From</label>
                <div className="input-icon-wrap">
                  <span className="field-icon">📍</span>
                  <input
                    list="cities-from"
                    className="form-input"
                    placeholder="Departure city"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    required
                  />
                  <datalist id="cities-from">
                    {cities.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>

              <button type="button" className="swap-btn" onClick={() => { setFrom(to); setTo(from); }}>
                ⇄
              </button>

              <div className="search-field">
                <label className="form-label">To</label>
                <div className="input-icon-wrap">
                  <span className="field-icon">🏁</span>
                  <input
                    list="cities-to"
                    className="form-input"
                    placeholder="Destination city"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    required
                  />
                  <datalist id="cities-to">
                    {cities.map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
              </div>

              <div className="search-field date-field">
                <label className="form-label">Date</label>
                <div className="input-icon-wrap">
                  <span className="field-icon">📅</span>
                  <input
                    type="date"
                    className="form-input"
                    value={date}
                    min={today}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg search-btn">
              🔍 Search Buses
            </button>
          </form>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="popular-section">
        <div className="container">
          <h2 className="section-title">Popular Routes</h2>
          <div className="popular-grid">
            {POPULAR_ROUTES.map(r => (
              <div key={`${r.from}-${r.to}`} className="popular-card card" onClick={() => quickSearch(r)}>
                <div className="popular-route">
                  <span className="popular-city">{r.from}</span>
                  <span className="popular-arrow">→</span>
                  <span className="popular-city">{r.to}</span>
                </div>
                <span className="popular-cta">Book Now</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {[
              { icon: '🪑', title: 'Interactive Seat Map', desc: 'Pick your preferred seat with our real-time interactive bus layout.' },
              { icon: '⚡', title: 'Instant Booking', desc: 'Secure your ticket instantly with real-time availability across Sri Lanka.' },
              { icon: '🔒', title: 'Secure & Reliable', desc: 'Your data is protected with industrial-grade security and JWT encryption.' },
              { icon: '🎫', title: 'Easy Management', desc: 'View, download, or cancel bookings easily from your dashboard.' },
            ].map(f => (
              <div key={f.title} className="feature-card card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
