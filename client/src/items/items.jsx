import { useState, useEffect } from "react";
import FetchHelper from "../fetch-helper";
import Loading from "../common/loading";
import Error from "../common/error";
import CreateItemModal from "./create-item-modal";

function Items() {
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    const result = await FetchHelper.item.list();
    if (result.ok) {
      setItemList(result.data.itemList);
    } else {
      setError("Failed to load items.");
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    const result = await FetchHelper.item.delete({ id });
    if (result.ok) {
      loadItems();
    } else {
      setError("Failed to delete item.");
    }
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="pb-5">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-5 pt-4">
        <div>
          <h1 className="h1 fw-bold mb-1" style={{ letterSpacing: '-0.03em' }}>Item Catalog</h1>
          <p className="text-muted mb-0">Manage items you reuse across different trips.</p>
        </div>
        <div className="d-grid d-sm-flex">
          <button className="btn btn-primary px-4 py-2" onClick={() => setShowForm(true)}>
            + Add New Item
          </button>
        </div>
      </div>

      {itemList.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border-0 shadow-sm">
          <p className="text-muted mb-0 fw-medium">The catalog is empty. Start by adding some essential gear!</p>
        </div>
      ) : (
        <div className="bg-white rounded-4 shadow-sm border-0 overflow-hidden">
          <table className="table mb-0 table-hover">
            <thead className="bg-light bg-opacity-50">
              <tr>
                <th className="px-4 py-3 border-0 fw-bold text-muted small text-uppercase tracking-wider">Item Name</th>
                <th className="px-4 py-3 border-0 fw-bold text-muted small text-uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 border-0 fw-bold text-muted small text-uppercase tracking-wider text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {itemList.map((item) => (
                <tr key={item.id} className="align-middle">
                  <td className="px-4 py-4 fw-bold text-main">{item.name}</td>
                  <td className="px-4 py-4">
                    <span className="badge rounded-pill bg-light text-secondary border-0 px-3 py-2 fw-semibold" style={{ fontSize: '0.75rem' }}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-end">
                    <button
                      className="btn btn-sm btn-light border-0 bg-transparent text-muted fw-bold px-3"
                      onClick={() => {
                        setEditItem(item);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-light border-0 bg-transparent text-danger fw-bold px-3"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EditItemModal
          item={editItem}
          onClose={() => {
            setShowForm(false);
            setEditItem(null);
            loadItems();
          }}
        />
      )}
    </div>
  );
}

function EditItemModal({ item, onClose }) {
  const [name, setName] = useState(item?.name || "");
  const [category, setCategory] = useState(item?.category || "");
  const [error, setError] = useState(null);
  const CATEGORIES = ["Clothes", "Documents", "Health", "Cosmetics", "Electronics", "Other"];

  async function handleSubmit() {
    if (!name || !category) {
      setError("Please fill in all required fields.");
      return;
    }
    const result = item
      ? await FetchHelper.item.update({ id: item.id, name, category })
      : await FetchHelper.item.create({ name, category });

    if (result.ok) {
      onClose();
    } else {
      setError(result.data.message || "Something went wrong.");
    }
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="modal-header px-4 py-3 bg-white border-0">
            <h5 className="modal-title fw-bold text-main">{item ? "Edit Item" : "Create Item"}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="modal-body px-4 pb-4">
            {error && <div className="alert alert-danger py-2 small border-0 bg-danger bg-opacity-10 text-danger fw-medium mb-4">{error}</div>}
            <div className="mb-4">
              <label className="form-label small text-uppercase tracking-wider fw-bold text-muted">Item Name</label>
              <input
                className="form-control form-control-lg border-2 bg-light bg-opacity-50 border-transparent focus-border-primary"
                style={{ borderRadius: '12px', fontSize: '1rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hiking Boots"
              />
            </div>
            <div className="mb-2">
              <label className="form-label small text-uppercase tracking-wider fw-bold text-muted">Category</label>
              <select
                className="form-select form-select-lg border-2 bg-light bg-opacity-50 border-transparent focus-border-primary"
                style={{ borderRadius: '12px', fontSize: '1rem' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer px-4 py-3 bg-light bg-opacity-50 border-0">
            <button type="button" className="btn btn-light bg-transparent border-0 fw-bold text-muted me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary px-4 shadow-sm">
              {item ? "Save Changes" : "Create Item"}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Items;