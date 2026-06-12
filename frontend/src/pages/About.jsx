import './About.css';

export default function About() {
  return (
    <div className="page-wrapper animate-fadeIn">
      <div className="container about-container">
        <h1 className="section-title">About BusGo Sri Lanka</h1>
        
        <div className="about-grid">
          <div className="about-text card">
            <h2>Our Mission</h2>
            <p>
              BusGo is Sri Lanka's leading digital platform for bus ticket reservations. 
              Our mission is to revolutionize the way people travel across the island 
              by providing a seamless, secure, and instant booking experience.
            </p>
            <p>
              Whether you're traveling from Colombo to the sandy beaches of Trincomalee 
               or the misty hills of Kandy, we ensure you get the best seats at the best prices.
            </p>
          </div>
          
          <div className="about-stats card">
            <div className="about-stat-item">
              <span className="stat-num">50+</span>
              <span className="stat-txt">Premium Buses</span>
            </div>
            <div className="about-stat-item">
              <span className="stat-num">100+</span>
              <span className="stat-txt">Daily Routes</span>
            </div>
            <div className="about-stat-item">
              <span className="stat-num">10k+</span>
              <span className="stat-txt">Happy Travelers</span>
            </div>
          </div>
        </div>

        <div className="about-features card">
          <h2>Why Choose BusGo?</h2>
          <div className="about-features-grid">
            <div className="feat-item">
              <h3>Real-time Seat Selection</h3>
              <p>No more guessing. See exactly which seats are available and pick your favorite.</p>
            </div>
            <div className="feat-item">
              <h3>Secure Payments</h3>
              <p>Your transactions are protected with state-of-the-art encryption.</p>
            </div>
            <div className="feat-item">
              <h3>24/7 Availability</h3>
              <p>Book your tickets anytime, anywhere, from any device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
