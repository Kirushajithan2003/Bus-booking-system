import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../api';
import toast from 'react-hot-toast';
import './MyBookings.css';

const statusColor = { confirmed: 'badge-green', cancelled: 'badge-red', pending: 'badge-orange' };

export default function MyBookings() {
  const { state } = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [expanded, setExpanded] = useState(state?.newBookingId || null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    setLoading(true);
    getMyBookings()
      .then(r => setBookings(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? Seats will be released.')) return;
    setCancelling(id);
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled. Refund initiated.');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 860 }}>
        <h1 className="section-title">My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="empty-state card">
            <span style={{ fontSize: '3rem' }}>🎫</span>
            <h3>No bookings yet</h3>
            <p>Book your first bus ticket and it will appear here.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(b => {
              const route = b.route;
              const isOpen = expanded === b._id;
              const isNew = state?.newBookingId === b._id;
              return (
                <div key={b._id} className={`booking-card card ${isNew ? 'highlight' : ''}`}>
                  <div className="booking-header" onClick={() => setExpanded(isOpen ? null : b._id)}>
                    <div className="booking-id-section">
                      <span className="booking-id">#{b.bookingId}</span>
                      <span className={`badge ${statusColor[b.status]}`}>{b.status}</span>
                      {isNew && <span className="badge badge-accent">New!</span>}
                    </div>
                    <div className="booking-route-mini">
                      <span>{route?.from}</span>
                      <span className="arrow">→</span>
                      <span>{route?.to}</span>
                    </div>
                    <div className="booking-meta-mini">
                      <span>📅 {route?.date}</span>
                      <span>🕐 {route?.departureTime}</span>
                      <span className="booking-amount">₹{b.totalAmount}</span>
                    </div>
                    <button className={`expand-btn ${isOpen ? 'open' : ''}`}>▼</button>
                  </div>

                  {isOpen && (
                    <div className="booking-details animate-fadeIn">
                      <div className="divider" />
                      <div className="booking-info-grid">
                        <div className="info-item">
                          <span className="info-label">Bus</span>
                          <span>{route?.bus?.name} ({route?.bus?.type})</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Journey</span>
                          <span>{route?.from} → {route?.to}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Departure</span>
                          <span>{route?.departureTime} — {route?.date}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Arrival</span>
                          <span>{route?.arrivalTime}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Seats</span>
                          <span>{b.seats?.join(', ')}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Total Paid</span>
                          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>₹{b.totalAmount}</span>
                        </div>
                      </div>

                      {/* Passengers */}
                      <div className="divider" />
                      <h4 className="passengers-title">Passengers</h4>
                      <div className="passengers-table">
                        <div className="pax-table-header">
                          <span>Seat</span><span>Name</span><span>Age</span><span>Gender</span>
                        </div>
                        {b.passengers?.map((p, i) => (
                          <div key={i} className="pax-table-row">
                            <span className="pax-seat">{p.seatNumber}</span>
                            <span>{p.name}</span>
                            <span>{p.age}</span>
                            <span>{p.gender}</span>
                          </div>
                        ))}
                      </div>

                      {b.status === 'confirmed' && (
                        <div className="booking-actions">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(b._id)}
                            disabled={cancelling === b._id}
                          >
                            {cancelling === b._id ? 'Cancelling...' : '✕ Cancel Booking'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
