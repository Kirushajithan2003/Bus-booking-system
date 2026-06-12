import './SeatLayout.css';

export default function SeatLayout({ totalSeats, bookedSeats = [], selectedSeats = [], onToggle }) {
  const rows = Math.ceil(totalSeats / 4);

  const getStatus = (num) => {
    if (bookedSeats.includes(num)) return 'booked';
    if (selectedSeats.includes(num)) return 'selected';
    return 'available';
  };

  return (
    <div className="seat-layout-wrapper animate-fadeIn">
      <div className="bus-container">
        {/* Mirror Details */}
        <div className="mirror left" />
        <div className="mirror right" />

        <div className="bus-frame">
          {/* Cockpit Area */}
          <div className="bus-cockpit">
            <div className="cockpit-dash">
              <div className="steering-wheel">⭕</div>
              <div className="instrument-cluster" />
            </div>
            <div className="driver-seat">
              <span className="driver-icon">👤</span>
            </div>
            <div className="door-step" />
          </div>

          <div className="seat-grid-container">
            <div className="seat-grid">
              {Array.from({ length: rows }, (_, rowIdx) => (
                <div key={rowIdx} className="seat-row">
                  <div className="seat-pair left">
                    {[0, 1].map(col => {
                      const num = rowIdx * 4 + col + 1;
                      if (num > totalSeats) return <div key={col} className="seat-placeholder" />;
                      const status = getStatus(num);
                      return (
                        <button
                          key={col}
                          className={`seat-item ${status}`}
                          disabled={status === 'booked'}
                          onClick={() => status !== 'booked' && onToggle(num)}
                          title={`Seat ${num}`}
                        >
                          <span className="seat-label">{num}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="bus-aisle" />

                  <div className="seat-pair right">
                    {[2, 3].map(col => {
                      const num = rowIdx * 4 + col + 1;
                      if (num > totalSeats) return <div key={col} className="seat-placeholder" />;
                      const status = getStatus(num);
                      return (
                        <button
                          key={col}
                          className={`seat-item ${status}`}
                          disabled={status === 'booked'}
                          onClick={() => status !== 'booked' && onToggle(num)}
                          title={`Seat ${num}`}
                        >
                          <span className="seat-label">{num}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Back Lights */}
          <div className="tail-light left" />
          <div className="tail-light right" />
        </div>
      </div>

      <div className="seat-legend-panel card">
        <div className="legend-item">
          <div className="legend-box available" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box selected" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-box booked" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}
