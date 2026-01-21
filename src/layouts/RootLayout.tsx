import { Link, Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0 }}>RRv7 Products Manager</h1>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/products">Products</Link>
        </nav>
      </header>
      <hr />
      <Outlet />
    </div>
  );
}
