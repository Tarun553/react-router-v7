import { Link, Outlet } from "react-router";
import FileUploadButton from "../components/FileUploadButton";
import UploadManager from "../components/UploadManager";
import NotificationToaster from "../components/NotificationToaster";
import SendNotificationButton from "../components/SendNotificationButton";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans antialiased">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            RRv7 Products Manager
          </h1>
          <nav className="flex items-center gap-6">
            <Link
              to="/products"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Products
            </Link>
            <div className="flex items-center gap-3">
              <SendNotificationButton />
              <FileUploadButton />
            </div>
          </nav>
        </header>

        <hr className="border-slate-200 mb-8" />

        <main>
          <Outlet />
        </main>
      </div>

      {/* Upload Manager - Fixed position bottom right */}
      <UploadManager />

      {/* Notification Toaster - Fixed position top right */}
      <NotificationToaster />
    </div>
  );
}
