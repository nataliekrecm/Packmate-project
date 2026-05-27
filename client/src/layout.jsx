import { Outlet } from "react-router-dom";
import Navigation from "./navigation";

function Layout() {
  return (
    <div className="min-vh-100">
      <header className="app-header">
        <Navigation />
      </header>
      <main className="main-content container">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;