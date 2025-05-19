// FormPembayaran.jsx
import { useState } from "react";
import axios from "axios";

const FormPembayaran = ({ onSuccess }) => {
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    layanan: "",
    jumlah: "",
    tanggal: "",
    keterangan: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}api/pembayaran/add`, form);
      onSuccess();
      setForm({
        nama: "",
        alamat: "",
        layanan: "",
        jumlah: "",
        tanggal: "",
        keterangan: "",
      });
    } catch (err) {
      alert("Failed to add payment");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            placeholder="Customer name"
            value={form.nama}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="alamat"
            name="alamat"
            placeholder="Customer address"
            value={form.alamat}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="layanan" className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <select id="layanan" name="layanan" onChange={handleChange} value={form.layanan} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
            <option value="">-- Select Service --</option>
            <option value="Internet">Internet</option>
            <option value="TV Kabel">Cable TV</option>
            <option value="Internet + TV Kabel">Internet + Cable TV</option>
          </select>
        </div>

        <div>
          <label htmlFor="jumlah" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="jumlah"
            name="jumlah"
            placeholder="Payment amount"
            value={form.jumlah}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="tanggal"
            name="tanggal"
            value={form.tanggal}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <input
            type="text"
            id="keterangan"
            name="keterangan"
            placeholder="Additional notes"
            value={form.keterangan}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Payment
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPembayaran;
