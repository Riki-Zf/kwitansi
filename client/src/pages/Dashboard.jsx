import { useEffect, useState } from "react";
import axios from "axios";
import FormPembayaran from "../components/FormPembayaran";
import PembayaranList from "../components/PembayaranList";

const Dashboard = () => {
  const [pembayaran, setPembayaran] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/pembayaran/list");
      setPembayaran(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Dashboard Pembayaran WiFi</h1>
      <FormPembayaran onSuccess={fetchData} />
      <PembayaranList data={pembayaran} />
    </div>
  );
};

export default Dashboard;
