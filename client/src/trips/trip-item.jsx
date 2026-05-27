import { useNavigate } from "react-router-dom";

function TripItem({ trip, onDelete, onEdit }) {
  const navigate = useNavigate();

  // Calculate packing progress
  const totalItems = trip.packingList?.length || 0;
  const packedItems = trip.packingList?.filter(item => item.isPacked).length || 0;

  return (
    <div
      className="trip-card border-0 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/trip/${trip.id}`)}
    >
      <div className="p-4 d-flex flex-column h-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge rounded-pill bg-light text-muted border px-3 py-2 fw-bold" style={{ fontSize: '0.7rem' }}>
            📍 {trip.destination}
          </span>
          <div className="d-flex gap-1">
             <button
              className="btn btn-sm btn-light border-0 p-2 text-muted bg-transparent opacity-50 hover-opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(trip);
              }}
              title="Edit Trip"
            >
              ✎
            </button>
            <button
              className="btn btn-sm btn-light border-0 p-2 text-danger bg-transparent opacity-50 hover-opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(trip.id);
              }}
              title="Delete Trip"
            >
              ✕
            </button>
          </div>
        </div>
        
        <h3 className="h5 fw-bold mb-1" style={{ letterSpacing: '-0.01em' }}>{trip.name}</h3>
        <p className="text-muted small mb-0 fw-medium">
          {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
          <div className="text-muted small fw-bold text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>
            Items Packed
          </div>
          <div className={`small fw-bold ${packedItems === totalItems && totalItems > 0 ? 'text-success' : 'text-main'}`}>
            {totalItems > 0 ? `${packedItems} / ${totalItems}` : "0"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TripItem;