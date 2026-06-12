import { useNavigate } from 'react-router-dom';
import './BusCard.css';

const amenityIcon = (a) => {
  const icons = { 'WiFi': '📶', 'AC': '❄️', 'Water': '💧', 'Charging Port': '🔌', 'Blanket': '🛏️', 'Pillow': '💤', 'Snacks': '🍿' };
  return icons[a] || '✨';
};

export default function BusCard({ route }) {
  const navigate = useNavigate();
  const { _id, from, to, departureTime, arrivalTime, duration, price, bus, date, totalSeats, bookedSeats = [], availableSeats } = route;
  const available = availableSeats ?? (totalSeats - bookedSeats.length);
  const occupancyPct = Math.round(((totalSeats - available) / totalSeats) * 100);

  return (
    <div className="bus-card card animate-fadeUp">
      <div className="bus-card-header">
        <div className="bus-identity">
          <div className="bus-icon-wrap">🚌</div>
          <div>
            <h3 className="bus-name">{bus?.name}</h3>
            <span className={`badge badge-${bus?.type === 'Volvo' ? 'accent' : bus?.type === 'Sleeper' ? 'orange' : 'green'}`}>
              {bus?.type}
            </span>
          </div>
        </div>
        <div className="bus-price">
          <span className="price-label">from</span>
          <span className="price-value">₹{price}</span>
          <span className="price-per">/ seat</span>
        </div>
      </div>

      <div className="bus-route-info">
        <div className="time-block">
          <span className="time">{departureTime}</span>
          <span className="city">{from}</span>
        </div>
        <div className="route-line">
          <span className="duration-badge">{duration}</span>
          <div className="line">
            <div className="dot" /><div className="dash" /><div className="bus-emoji">🚌</div><div className="dash" /><div className="dot" />
          </div>
        </div>
        <div className="time-block right">
          <span className="time">{arrivalTime}</span>
          <span className="city">{to}</span>
        </div>
      </div>

      <div className="bus-card-footer">
        <div className="bus-meta">
          <div className="seats-info">
            <span className={`seats-count ${available < 5 ? 'low' : ''}`}>{available} seats left</span>
            <div className="occupancy-bar">
              <div className="occupancy-fill" style={{ width: `${occupancyPct}%` }} />
            </div>
          </div>
          <div className="amenities">
            {bus?.amenities?.slice(0, 4).map(a => (
              <span key={a} className="amenity-tag" title={a}>{amenityIcon(a)} {a}</span>
            ))}
          </div>
        </div>
        <button
          className="btn btn-orange"
          onClick={() => navigate(`/book/${_id}`)}
          disabled={available === 0}
        >
          {available === 0 ? 'Fully Booked' : 'Book Now'}
        </button>
      </div>
    </div>
  );
}
