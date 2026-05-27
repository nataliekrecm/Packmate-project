import { useState } from "react";
import FetchHelper from "../fetch-helper";

const CATEGORIES = ["Clothes", "Documents", "Health", "Cosmetics", "Electronics", "Other"];

function CreateItemModal({ onClose }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit() {
    if (!name || !category) {
      setError("Please fill in all required fields.");
      return;
    }
    const result = await FetchHelper.item.create({ name, category });
    if (result.ok) {
      onClose(result.data);
    } else {
      setError(result.data.message || "Failed to create item.");
    }
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header px-4 py-3">
            <h5 className="modal-title fw-bold">Create New Item</h5>
            <button className="btn-close" onClick={() => onClose(null)} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="modal-body px-4 py-4">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <div className="mb-4">
              <label className="form-label">Item Name *</label>
              <input
                className="form-control form-control-lg"
                placeholder="e.g. Rain jacket"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-0">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer px-4 py-3 bg-light-subtle">
            <button type="button" className="btn btn-outline border-0 fw-medium" onClick={() => onClose(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary px-4">Create Item</button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateItemModal;