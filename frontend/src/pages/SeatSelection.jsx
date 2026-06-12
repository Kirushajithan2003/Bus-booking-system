import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRouteById, getSeats } from '../api';
import SeatLayout from '../components/SeatLayout';
import './SeatSelection.css';

export default function SeatSelection() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRouteById(routeId), getSeats(routeId)])
      .then(([routeRes, seatsRes]) => {
        setRoute(routeRes.data);
        setBookedSeats(seatsRes.data.bookedSeats);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [routeId]);

  const toggleSeat = (num) => {
    setSelectedSeats(prev =>
      prev.includes(num) ? prev.filter(s => s !== num) : [...prev, num]
    );
  };

  const totalAmount = route ? selectedSeats.length * route.price : 0;

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    navigate('/confirm', { state: { route, selectedSeats, totalAmount } });
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;
  if (!route) return null;

  const available = route.totalSeats - bookedSeats.length;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="seat-page-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="section-title" style={{ margin: 0 }}>Select Your Seats</h1>
        </div>

        {/* Route Summary Bar */}
        <div className="route-summary card">
          <div className="rs-item">
            <span className="rs-label">Route</span>
            <span className="rs-value">{route.from} → {route.to}</span>
          </div>
          <div className="rs-item">
            <span className="rs-label">Bus</span>
            <span className="rs-value">{route.bus?.name}</span>
          </div>
          <div className="rs-item">
            <span className="rs-label">Date</span>
            <span className="rs-value">{route.date}</span>
          </div>
          <div className="rs-item">
            <span className="rs-label">Departure</span>
            <span className="rs-value">{route.departureTime}</span>
          </div>
          <div className="rs-item">
            <span className="rs-label">Price/Seat</span>
            <span className="rs-value accent">₹{route.price}</span>
          </div>
          <div className="rs-item">
            <span className="rs-label">Available</span>
            <span className={`rs-value ${available < 5 ? 'red' : 'green'}`}>{available} seats</span>
          </div>
        </div>

        <div className="seat-main-layout">
          {/* Seat Grid */}
          <div className="seat-area card">
            <h2 className="seat-area-title">Bus Layout</h2>
            <SeatLayout
              totalSeats={route.totalSeats}
              bookedSeats={bookedSeats}
              selectedSeats={selectedSeats}
              onToggle={toggleSeat}
            />
          </div>

          {/* Booking Summary */}
          <div className="seat-summary-panel">
            <div className="summary-card card">
              <h3>Booking Summary</h3>
              <div className="divider" />
              {selectedSeats.length === 0 ? (
                <p className="no-seat-msg">👈 Click on a seat to select it</p>
              ) : (
                <>
                  <div className="summary-seats">
                    {selectedSeats.sort((a,b)=>a-b).map(s => (
                      <span key={s} className="summary-seat-chip">Seat {s}</span>
                    ))}
                  </div>
                  <div className="divider" />
                  <div className="summary-row">
                    <span>Seats selected</span>
                    <span>{selectedSeats.length}</span>
                  </div>
                  <div className="summary-row">
                    <span>Price per seat</span>
                    <span>₹{route.price}</span>
                  </div>
                  <div className="divider" />
                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </>
              )}
              <button
                className="btn btn-orange btn-lg"
                style={{ width: '100%', marginTop: '20px' }}
                disabled={selectedSeats.length === 0}
                onClick={handleContinue}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
