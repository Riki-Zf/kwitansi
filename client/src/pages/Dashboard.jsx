import { useEffect, useState } from "react";
import axios from "axios";
import FormPembayaran from "../components/FormPembayaran";
import PembayaranList from "../components/PembayaranList";

const Dashboard = () => {
  const [pembayaran, setPembayaran] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/pembayaran/list");
      setPembayaran(res.data);
    } catch (err) {
      console.error("Failed to fetch payment data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Professional Header - Isolated styling */}
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/40?text=LOGO";
                }}
              />
              <div>
                <h1 className="text-xl font-bold">WiFi Solutions</h1>
                <p className="text-indigo-100 text-sm">Professional Network Services</p>
              </div>
            </div>

            <div className="mt-3 md:mt-0 text-center md:text-right">
              <div className="text-sm text-indigo-100">
                <p className="flex items-center justify-center md:justify-end">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Jl. Contoh No. 123, Kota Contoh
                </p>
                <p className="flex items-center justify-center md:justify-end">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  0812-3456-7890
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Minimal container styling */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Neutral container that won't affect children */}
        <div className="space-y-6">
          <FormPembayaran onSuccess={fetchData} />
          <PembayaranList data={pembayaran} isLoading={isLoading} />
        </div>
      </main>

      {/* Footer - Isolated styling */}
      <footer className="bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-gray-500 text-sm">&copy; {new Date().getFullYear()} WiFi Solutions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
