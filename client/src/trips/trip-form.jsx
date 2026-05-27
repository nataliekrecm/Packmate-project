import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FetchHelper from "../fetch-helper";

function TripForm({ trip, onClose }) {
  const navigate = useNavigate();
  const [name, setName] = useState(trip?.name || "");
  const [destination, setDestination] = useState(trip?.destination || "");
  const [startDate, setStartDate] = useState(trip?.startDate || "");
  const [endDate, setEndDate] = useState(trip?.endDate || "");
  const [description, setDescription] = useState(trip?.description || "");
  const [error, setError] = useState(null);

  async function handleSubmit() {
    if (!name || !destination || !startDate || !endDate) {
      setError("Please fill in all required fields.");
      return;
    }

    const dtoIn = { name, destination, startDate, endDate, description };
    let result;

    if (trip) {
      result = await FetchHelper.trip.update({ id: trip.id, ...dtoIn });
      if (result.ok) {
        onClose();
      } else {
        setError(result.data.message || "Something went wrong.");
      }
    } else {
      result = await FetchHelper.trip.create(dtoIn);
      if (result.ok) {
        navigate(`/trip/${result.data.id}`);
      } else {
        setError(result.data.message || "Something went wrong.");
      }
    }
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header px-4 py-3">
            <h5 className="modal-title fw-bold">{trip ? "Edit Trip" : "Create Trip"}</h5>
            <button className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="modal-body px-4 py-4">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <div className="mb-3">
              <label className="form-label">Trip Name *</label>
              <input
                className="form-control form-control-lg"
                placeholder="e.g. Summer Vacation"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Destination *</label>
              <input
                className="form-control"
                placeholder="e.g. Rome, Italy"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-6 mb-3">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-0">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Notes about your trip..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer px-4 py-3 bg-light-subtle">
            <button type="button" className="btn btn-outline border-0 fw-medium" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-4">
              {trip ? "Update Trip" : "Create & Start Packing"}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TripForm;