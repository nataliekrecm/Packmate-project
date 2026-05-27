import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Dashboard from "./trips/dashboard";
import TripDetail from "./trips/trip-detail";
import Items from "./items/items";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/items" element={<Items />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;