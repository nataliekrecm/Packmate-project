import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FetchHelper from "../fetch-helper";
import Loading from "../common/loading";
import Error from "../common/error";
import AddItemModal from "./add-item-modal";
import TripForm from "./trip-form";

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [itemCatalog, setItemCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showEditTrip, setShowEditTrip] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    const [tripResult, itemResult] = await Promise.all([
      FetchHelper.trip.get({ id }),
      FetchHelper.item.list(),
    ]);
    if (tripResult.ok) {
      setTrip(tripResult.data);
    } else {
      setError("Failed to load trip.");
    }
    if (itemResult.ok) {
      setItemCatalog(itemResult.data.itemList);
    }
    setLoading(false);
  }

  async function handleTogglePacked(itemId, currentStatus) {
    await FetchHelper.trip.updateItemStatus({
      tripId: id,
      itemId,
      isPacked: !currentStatus,
    });
    loadData();
  }

  async function handleRemoveItem(itemId) {
    await FetchHelper.trip.removeItem({ tripId: id, itemId });
    loadData();
  }

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!trip) return null;

  const categories = [...new Set(
    trip.packingList?.map((p) => {
      const item = itemCatalog.find((i) => i.id === p.itemId);
      return item?.category;
    }).filter(Boolean)
  )];

  const totalItems = trip.packingList?.length || 0;
  const packedItems = trip.packingList?.filter(item => item.isPacked).length || 0;
  return (
    <div className="pb-5">
      <div className="mb-5 pt-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-4">
          <button className="btn btn-light bg-white border shadow-sm p-3 d-flex align-items-center justify-content-center" style={{ borderRadius: '15px', width: '48px', height: '48px' }} onClick={() => navigate("/")}>
            ←
          </button>
          <div>
            <h1 className="h2 fw-bold mb-1" style={{ letterSpacing: '-0.02em' }}>{trip.name}</h1>
            <p className="text-muted small mb-0 fw-medium">
              📍 {trip.destination} • {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </p>
            {trip.description && (
              <p className="text-muted small mb-0 mt-1">{trip.description}</p>
            )}
          </div>
        </div>
        <div className="d-grid d-sm-flex gap-2">
          <button className="btn btn-outline px-4 py-2" onClick={() => setShowEditTrip(true)}>
            Edit Trip
          </button>
          <button className="btn btn-primary px-4 py-2" onClick={() => setShowAddItem(true)}>
            Add Item
          </button>
        </div>
      </div>

      {!trip.packingList || trip.packingList.length === 0 ? (
        <div className="text-center py-5 bg-white border-0 shadow-sm rounded-4">
          <p className="text-muted mb-0">Your packing list is empty. Time to gear up!</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <h2 className="h5 mb-4 fw-bold">My Packing List</h2>
            {categories.map((category) => (
              <CategorySection
                key={category}
                category={category}
                packingList={trip.packingList}
                itemCatalog={itemCatalog}
                onToggle={handleTogglePacked}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
        </div>
      )}

      {showAddItem && (
        <AddItemModal
          tripId={id}
          itemCatalog={itemCatalog}
          packingList={trip.packingList || []}
          onClose={() => {
            setShowAddItem(false);
            loadData();
          }}
        />
      )}

      {showEditTrip && (
        <TripForm
          trip={trip}
          onClose={() => {
            setShowEditTrip(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function CategorySection({ category, packingList, itemCatalog, onToggle, onRemove }) {
  const [collapsed, setCollapsed] = useState(false);

  const categoryIcons = {
    Clothes: "👕",
    Documents: "📄",
    Health: "💊",
    Cosmetics: "💄",
    Electronics: "🔌",
    Other: "📦",
  };

  const icon = categoryIcons[category] || "📦";

  const items = packingList.filter((p) => {
    const item = itemCatalog.find((i) => i.id === p.itemId);
    return item?.category === category;
  });
  
  const categoryPacked = items.filter(i => i.isPacked).length;

  return (
    <div className="category-card mb-4 border-0 shadow-sm">
      <div
        className="category-header bg-white"
        onClick={() => setCollapsed(!collapsed)}
        style={{ padding: '1.25rem 1.5rem' }}
      >
        <div className="d-flex align-items-center gap-3">
          <div className="icon-container" style={{ width: '44px', height: '44px', fontSize: '1.3rem' }}>
            {icon}
          </div>
          <div>
            <span className="fw-bold d-block" style={{ fontSize: '1.05rem' }}>{category}</span>
            <span className="text-muted small fw-medium">{categoryPacked} of {items.length} items packed</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3">
           <span className="text-muted" style={{ fontSize: "0.8rem", fontWeight: '600' }}>
            {collapsed ? "Expand" : "Collapse"}
          </span>
          <span className="text-muted" style={{ fontSize: '0.7rem' }}>{collapsed ? '▼' : '▲'}</span>
        </div>
      </div>
      {!collapsed && (
        <div className="bg-white px-2 pb-2">
          {items.map((p) => {
            const item = itemCatalog.find((i) => i.id === p.itemId);
            return (
              <div key={p.itemId} className="item-row mx-2 rounded-3 border-0">
                <div className="d-flex align-items-center flex-grow-1 py-1">
                  <div className="form-check d-flex align-items-center mb-0">
                    <input
                      type="checkbox"
                      className="form-check-input me-3"
                      checked={p.isPacked}
                      onChange={() => onToggle(p.itemId, p.isPacked)}
                      id={`check-${p.itemId}`}
                    />
                    <label 
                      className={`form-check-label fw-semibold ${p.isPacked ? "text-decoration-line-through text-muted" : "text-main"}`}
                      style={{ cursor: "pointer", transition: 'all 0.2s' }}
                      htmlFor={`check-${p.itemId}`}
                    >
                      {item?.name}
                    </label>
                  </div>
                </div>
                <button
                  className="btn btn-sm text-danger opacity-50 hover-opacity-100 border-0 bg-transparent p-2"
                  onClick={() => onRemove(p.itemId)}
                  title="Remove item"
                >
                   ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TripDetail;