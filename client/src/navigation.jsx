import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  const isTripsActive = location.pathname === '/' || location.pathname.startsWith('/trip/');

  return (
    <div className="container nav-wrapper">
      <Link className="brand" to="/">
        <div className="bg-primary bg-opacity-10 p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
          <span style={{ fontSize: '1.4rem' }}>🎒</span>
        </div>
        <span className="fw-bold h4 mb-0 tracking-tight">PackMate</span>
      </Link>
      
      <div className="d-flex align-items-center gap-4">
        <Link 
          className={`text-decoration-none fw-bold small ${isActive('/items') ? 'text-primary' : 'text-muted'}`} 
          to="/items"
          style={{ transition: 'color 0.2s' }}
        >
          Item Catalog
        </Link>
        <Link
          className={`py-2 px-4 shadow-sm btn ${isTripsActive ? 'btn-primary' : 'btn-outline-primary'}`}
          to="/"
          style={{ borderRadius: '12px' }}
        >
          My Trips
        </Link>
      </div>
    </div>
  );
}

export default Navigation;