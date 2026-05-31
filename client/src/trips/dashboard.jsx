import { useState, useEffect } from "react";
import FetchHelper from "../fetch-helper";
import Loading from "../common/loading";
import Error from "../common/error";
import TripItem from "./trip-item";
import TripForm from "./trip-form";

function Dashboard() {
  const [tripList, setTripList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTrip, setEditTrip] = useState(null);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    setLoading(true);
    const result = await FetchHelper.trip.list();
    if (result.ok) {
      setTripList(result.data.itemList);
    } else {
      setError("Failed to load trips.");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    const result = await FetchHelper.trip.delete({ id });
    if (result.ok) {
      loadTrips();
    } else {
      setError("Failed to delete trip.");
    }
  }

  function handleEdit(trip) {
    setEditTrip(trip);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditTrip(null);
    loadTrips();
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="pb-5">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-5 pt-4">
        <div>
          <h1 className="h1 fw-bold mb-1" style={{ letterSpacing: '-0.03em' }}>My Trips</h1>
          <p className="text-muted mb-0">Track your packing and plan your next adventures.</p>
        </div>
        <button
          className="btn btn-primary px-4 py-2"
          onClick={() => setShowForm(true)}
        >
          + Create Trip
        </button>
      </div>

      {tripList.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border-0 shadow-sm">
          <div style={{ fontSize: "3.5rem" }} className="mb-3 opacity-75">🏝️</div>
          <h3 className="fw-bold">No trips planned yet</h3>
          <p className="text-muted mb-4">Ready for a new adventure? Create your first packing list!</p>
          <button
            className="btn btn-primary px-4"
            onClick={() => setShowForm(true)}
          >
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="trip-grid">
          {tripList.map((trip) => (
            <TripItem
              key={trip.id}
              trip={trip}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TripForm
          trip={editTrip}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

export default Dashboard;