import { useState } from "react";
import FetchHelper from "../fetch-helper";
import CreateItemModal from "../items/create-item-modal";

function AddItemModal({ tripId, itemCatalog: initialCatalog, packingList, onClose }) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [error, setError] = useState(null);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [localCatalog, setLocalCatalog] = useState(initialCatalog);

  async function handleAddItem() {
    if (!selectedItemId) {
      setError("Please select an item.");
      return;
    }
    const result = await FetchHelper.trip.addItem({
      tripId,
      itemId: selectedItemId,
    });
    if (result.ok) {
      onClose();
    } else {
      setError(result.data.message || "Failed to add item.");
    }
  }

  const availableItems = localCatalog.filter(
    (item) => !packingList.some((p) => p.itemId === item.id)
  );

  if (showCreateItem) {
    return (
      <CreateItemModal
        onClose={async (newItem) => {
          setShowCreateItem(false);
          if (newItem) {
            const result = await FetchHelper.item.list();
            if (result.ok) setLocalCatalog(result.data.itemList);
            setSelectedItemId(newItem.id);
          }
        }}
      />
    );
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header px-4 py-3">
            <h5 className="modal-title fw-bold">Add Item to Trip</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body px-4 py-4">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <div className="mb-4">
              <label className="form-label">Search or select item *</label>
              {localCatalog.length === 0 ? (
                <div className="alert alert-warning py-2 small mb-0">
                  The catalog is empty. Please define items in the global catalog first.
                </div>
              ) : (
                <select
                  className="form-select form-select-lg"
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                >
                  <option value="">Select an item...</option>
                  {availableItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} — {item.category}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="bg-light p-3 rounded-3 text-center">
              <span className="text-muted small d-block mb-2">Can't find the item you're looking for?</span>
              <button
                className="btn btn-sm btn-outline px-3"
                onClick={() => setShowCreateItem(true)}
              >
                + Create New Item
              </button>
            </div>
          </div>
          <div className="modal-footer px-4 py-3 bg-light-subtle">
            <button className="btn btn-outline border-0 fw-medium" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary px-4" onClick={handleAddItem}>Add to List</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;