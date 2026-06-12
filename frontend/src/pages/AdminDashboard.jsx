import { useEffect, useState } from 'react';
import { getAdminStats, getAdminBuses, getAdminRoutes, getAdminBookings, createBus, createRoute, deleteBus, deleteRoute } from '../api';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [busForm, setBusForm] = useState({ busNumber: '', name: '', type: 'AC', totalSeats: 40 });
  const [routeForm, setRouteForm] = useState({ from: '', to: '', date: '', departureTime: '', arrivalTime: '', duration: '', price: '', bus: '' });

  useEffect(() => {
    fetchData();
  }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'stats') {
        const res = await getAdminStats();
        setStats(res.data);
      } else if (tab === 'buses') {
        const res = await getAdminBuses();
        setBuses(res.data);
      } else if (tab === 'routes') {
        const [rRes, bRes] = await Promise.all([getAdminRoutes(), getAdminBuses()]);
        setRoutes(rRes.data);
        setBuses(bRes.data);
      } else if (tab === 'bookings') {
        const res = await getAdminBookings();
        setBookings(res.data);
      }
    } catch (err) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBus = async (e) => {
    e.preventDefault();
    try {
      await createBus(busForm);
      toast.success('Bus created successfully');
      setBusForm({ busNumber: '', name: '', type: 'AC', totalSeats: 40 });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bus');
    }
  };

  const handleCreateRoute = async (e) => {
    e.preventDefault();
    try {
      await createRoute(routeForm);
      toast.success('Route created successfully');
      setRouteForm({ from: '', to: '', date: '', departureTime: '', arrivalTime: '', duration: '', price: '', bus: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create route');
    }
  };

  const handleDeleteBus = async (id) => {
    if (!window.confirm('Delete this bus?')) return;
    try {
      await deleteBus(id);
      toast.success('Bus deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete bus');
    }
  };

  const handleDeleteRoute = async (id) => {
    if (!window.confirm('Delete this route?')) return;
    try {
      await deleteRoute(id);
      toast.success('Route deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete route');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 className="section-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          <button className={`tab-btn ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>Overview</button>
          <button className={`tab-btn ${tab === 'buses' ? 'active' : ''}`} onClick={() => setTab('buses')}>Buses</button>
          <button className={`tab-btn ${tab === 'routes' ? 'active' : ''}`} onClick={() => setTab('routes')}>Routes</button>
          <button className={`tab-btn ${tab === 'bookings' ? 'active' : ''}`} onClick={() => setTab('bookings')}>All Bookings</button>
        </div>

        {loading ? (
          <div className="spinner-wrapper"><div className="spinner" /></div>
        ) : (
          <div className="admin-content animate-fadeIn">
            {tab === 'stats' && stats && (
              <div className="stats-grid">
                <div className="stat-card card">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">₹{stats.revenue}</span>
                </div>
                <div className="stat-card card">
                  <span className="stat-label">Confirmed Bookings</span>
                  <span className="stat-value">{stats.confirmedBookings}</span>
                </div>
                <div className="stat-card card">
                  <span className="stat-label">Total Routes</span>
                  <span className="stat-value">{stats.totalRoutes}</span>
                </div>
                <div className="stat-card card">
                  <span className="stat-label">Active Users</span>
                  <span className="stat-value">{stats.totalUsers}</span>
                </div>
              </div>
            )}

            {tab === 'buses' && (
              <div className="admin-grid">
                <div className="admin-form card">
                  <h3>Add New Bus</h3>
                  <form onSubmit={handleCreateBus}>
                    <div className="form-group">
                      <label className="form-label">Bus Name</label>
                      <input className="form-input" value={busForm.name} onChange={e => setBusForm({...busForm, name: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bus Number</label>
                      <input className="form-input" value={busForm.busNumber} onChange={e => setBusForm({...busForm, busNumber: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select className="form-input" value={busForm.type} onChange={e => setBusForm({...busForm, type: e.target.value})}>
                        <option>AC</option><option>Non-AC</option><option>Sleeper</option><option>Volvo</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Total Seats</label>
                      <input type="number" className="form-input" value={busForm.totalSeats} onChange={e => setBusForm({...busForm, totalSeats: e.target.value})} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" style={{marginTop: '10px'}}>Add Bus</button>
                  </form>
                </div>
                <div className="admin-table card">
                  <table>
                    <thead><tr><th>Name</th><th>Number</th><th>Type</th><th>Seats</th><th>Action</th></tr></thead>
                    <tbody>
                      {buses.map(b => (
                        <tr key={b._id}>
                          <td>{b.name}</td><td>{b.busNumber}</td><td>{b.type}</td><td>{b.totalSeats}</td>
                          <td><button onClick={() => handleDeleteBus(b._id)} className="text-red">Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'routes' && (
              <div className="admin-grid">
                <div className="admin-form card">
                  <h3>Add New Route</h3>
                  <form onSubmit={handleCreateRoute}>
                    <div className="form-group">
                      <label className="form-label">From</label>
                      <input className="form-input" value={routeForm.from} onChange={e => setRouteForm({...routeForm, from: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">To</label>
                      <input className="form-input" value={routeForm.to} onChange={e => setRouteForm({...routeForm, to: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input type="date" className="form-input" value={routeForm.date} onChange={e => setRouteForm({...routeForm, date: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Departure</label>
                      <input type="time" className="form-input" value={routeForm.departureTime} onChange={e => setRouteForm({...routeForm, departureTime: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Arrival</label>
                      <input type="time" className="form-input" value={routeForm.arrivalTime} onChange={e => setRouteForm({...routeForm, arrivalTime: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price</label>
                      <input type="number" className="form-input" value={routeForm.price} onChange={e => setRouteForm({...routeForm, price: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Duration</label>
                      <input className="form-input" placeholder="e.g. 5h" value={routeForm.duration} onChange={e => setRouteForm({...routeForm, duration: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bus</label>
                      <select className="form-input" value={routeForm.bus} onChange={e => setRouteForm({...routeForm, bus: e.target.value})} required>
                        <option value="">Select Bus</option>
                        {buses.map(b => <option key={b._id} value={b._id}>{b.name} ({b.busNumber})</option>)}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" style={{marginTop: '10px'}}>Add Route</button>
                  </form>
                </div>
                <div className="admin-table card">
                  <table>
                    <thead><tr><th>Route</th><th>Date</th><th>Departure</th><th>Price</th><th>Bus</th><th>Action</th></tr></thead>
                    <tbody>
                      {routes.map(r => (
                        <tr key={r._id}>
                          <td>{r.from} → {r.to}</td><td>{r.date}</td><td>{r.departureTime}</td><td>₹{r.price}</td><td>{r.bus?.name}</td>
                          <td><button onClick={() => handleDeleteRoute(r._id)} className="text-red">Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'bookings' && (
              <div className="admin-table card">
                <table>
                  <thead><tr><th>ID</th><th>User</th><th>Route</th><th>Seats</th><th>Amount</th><th>Status</th></tr></thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b._id}>
                        <td>{b.bookingId}</td><td>{b.user?.name}</td><td>{b.route?.from} → {b.route?.to}</td><td>{b.seats.join(',')}</td><td>₹{b.totalAmount}</td>
                        <td><span className={`badge ${b.status === 'confirmed' ? 'badge-green' : 'badge-red'}`}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
