import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchRoutes } from '../api';
import BusCard from '../components/BusCard';
import './SearchResults.css';

export default function SearchResults() {
  const [params] = useSearchParams();
  const from = params.get('from');
  const to = params.get('to');
  const date = params.get('date');

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('departureTime');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    setLoading(true);
    searchRoutes({ from, to, date })
      .then(r => setRoutes(r.data))
      .catch(() => setRoutes([]))
      .finally(() => setLoading(false));
  }, [from, to, date]);

  const busTypes = ['All', ...new Set(routes.map(r => r.bus?.type).filter(Boolean))];

  const filtered = routes
    .filter(r => filterType === 'All' || r.bus?.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      return a.departureTime.localeCompare(b.departureTime);
    });

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="results-header">
          <div>
            <h1 className="results-title">
              <span>{from}</span>
              <span className="route-arrow">→</span>
              <span>{to}</span>
            </h1>
            <p className="results-meta">
              📅 {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              &nbsp;&nbsp;·&nbsp;&nbsp;
              <span className={`${filtered.length === 0 ? 'text-red' : 'text-green'}`}>
                {loading ? '...' : `${filtered.length} buses found`}
              </span>
            </p>
          </div>
        </div>

        <div className="results-layout">
          {/* Filters Sidebar */}
          <aside className="filters-panel card">
            <h3 className="filter-title">Filters</h3>
            <div className="filter-group">
              <label className="form-label">Sort By</label>
              <select className="form-input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="departureTime">Departure Time</option>
                <option value="price">Price: Low to High</option>
                <option value="duration">Duration</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="form-label">Bus Type</label>
              {busTypes.map(t => (
                <label key={t} className={`type-chip ${filterType === t ? 'active' : ''}`}>
                  <input type="radio" name="type" value={t} checked={filterType === t} onChange={() => setFilterType(t)} />
                  {t}
                </label>
              ))}
            </div>
          </aside>

          {/* Results */}
          <div className="results-list">
            {loading ? (
              <div className="spinner-wrapper"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="empty-state card">
                <span style={{ fontSize: '3rem' }}>🚌</span>
                <h3>No buses found</h3>
                <p>Try a different date or route.</p>
              </div>
            ) : (
              filtered.map(route => <BusCard key={route._id} route={route} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
