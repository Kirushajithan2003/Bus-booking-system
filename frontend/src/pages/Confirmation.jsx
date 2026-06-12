import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Confirmation.css';

const GENDERS = ['Male', 'Female', 'Other'];

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { route, selectedSeats, totalAmount } = state || {};
  const [passengers, setPassengers] = useState(
    (selectedSeats || []).map(seat => ({ seatNumber: seat, name: '', age: '', gender: 'Male' }))
  );
  const [loading, setLoading] = useState(false);

  if (!route || !selectedSeats) {
    navigate('/');
    return null;
  }

  const updatePassenger = (idx, field, value) => {
    setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleConfirm = async () => {
    for (const p of passengers) {
      if (!p.name.trim() || !p.age || !p.gender) {
        toast.error('Please fill in all passenger details');
        return;
      }
      if (p.age < 1 || p.age > 120) {
        toast.error('Please enter a valid age');
        return;
      }
    }
    setLoading(true);
    try {
      const { data } = await createBooking({
        routeId: route._id,
        passengers: passengers.map(p => ({ ...p, age: Number(p.age) })),
        seats: selectedSeats,
      });
      toast.success('🎉 Booking confirmed!');
      navigate('/my-bookings', { state: { newBookingId: data._id } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 860 }}>
        <div className="confirm-header">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="section-title" style={{ margin: 0 }}>Passenger Details</h1>
        </div>

        {/* Step Indicator */}
        <div className="steps">
          <div className="step done"><span>1</span> Search</div>
          <div className="step-line done" />
          <div className="step done"><span>2</span> Select Seats</div>
          <div className="step-line done" />
          <div className="step active"><span>3</span> Confirm</div>
          <div className="step-line" />
          <div className="step"><span>4</span> Booked!</div>
        </div>

        <div className="confirm-layout">
          {/* Passenger Forms */}
          <div className="passengers-section">
            {passengers.map((p, idx) => (
              <div key={idx} className="passenger-card card">
                <div className="passenger-card-header">
                  <div className="seat-badge-lg">Seat {p.seatNumber}</div>
                  <h3>Passenger {idx + 1}</h3>
                </div>
                <div className="passenger-form">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-input" placeholder="e.g. Rahul Sharma"
                      value={p.name} onChange={e => updatePassenger(idx, 'name', e.target.value)}
                    />
                  </div>
                  <div className="pax-row">
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <input
                        type="number" className="form-input" placeholder="25" min="1" max="120"
                        value={p.age} onChange={e => updatePassenger(idx, 'age', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select className="form-input" value={p.gender} onChange={e => updatePassenger(idx, 'gender', e.target.value)}>
                        {GENDERS.map(g => <option key={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary-panel">
            <div className="order-summary card">
              <h3>Order Summary</h3>
              <div className="divider" />

              <div className="order-route">
                <span className="order-city">{route.from}</span>
                <span className="order-arrow">→</span>
                <span className="order-city">{route.to}</span>
              </div>
              <p className="order-detail">📅 {route.date} &nbsp;·&nbsp; 🕐 {route.departureTime}</p>
              <p className="order-detail">🚌 {route.bus?.name} ({route.bus?.type})</p>
              <p className="order-detail">🪑 Seats: {selectedSeats.join(', ')}</p>

              <div className="divider" />

              <div className="summary-row">
                <span>Base fare × {selectedSeats.length}</span>
                <span>₹{route.price * selectedSeats.length}</span>
              </div>
              <div className="summary-row">
                <span>Service fee</span>
                <span className="text-green">Free</span>
              </div>
              <div className="divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="divider" />

              <div className="contact-info">
                <p className="contact-label">Contact Info</p>
                <p>{user?.name}</p>
                <p className="text-muted">{user?.email}</p>
              </div>

              <button
                className="btn btn-primary btn-lg confirm-btn"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? <span className="btn-spinner" /> : '✅ Confirm & Book'}
              </button>
              <p className="secure-msg">🔒 Secure booking — instant confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
