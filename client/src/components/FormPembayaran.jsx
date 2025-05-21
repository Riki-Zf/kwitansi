// FormPembayaran.jsx
import { useState } from "react";
import axios from "axios";

const FormPembayaran = ({ onSuccess }) => {
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split("T")[0], // Default to today's date in YYYY-MM-DD format
    nama: "",
    alamat: "",
    layanan: "TV Kabel",
    pararel: 0,
    dendah: 0,
    jumlahBulan: 1,
    jumlahTV: 1,
    iuranBulanan: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields to numbers only for numeric fields
    const numericFields = ["jumlahBulan", "jumlahTV", "pararel", "dendah", "iuranBulanan"];
    const newValue = numericFields.includes(name) ? parseInt(value) || 0 : value;

    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}api/pembayaran/add`, form);
      onSuccess();
      setForm({
        tanggal: new Date().toISOString().split("T")[0],
        nama: "",
        alamat: "",
        layanan: "TV Kabel",
        pararel: 0,
        dendah: 0,
        jumlahBulan: 1,
        jumlahTV: 1,
        iuranBulanan: 0,
      });
    } catch (err) {
      alert("Failed to add payment");
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    const monthly = parseFloat(form.iuranBulanan) || 0;
    const months = form.jumlahBulan || 1;
    const parallel = parseFloat(form.pararel) || 0;
    const fine = parseFloat(form.dendah) || 0;

    return monthly * months + parallel + fine;
  };

  // Show jumlahTV field only for services that include TV Kabel
  const showTVField = form.layanan === "TV Kabel" || form.layanan === "Internet + TV Kabel";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Tambah Pembayaran Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tanggal - Added as first field */}
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Pembayaran
            </label>
            <input type="date" id="tanggal" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          {/* Nama */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pelanggan
            </label>
            <input type="text" id="nama" name="nama" value={form.nama} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          {/* Alamat */}
          <div>
            <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <input type="text" id="alamat" name="alamat" value={form.alamat} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          {/* Layanan */}
          <div>
            <label htmlFor="layanan" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Layanan
            </label>
            <select id="layanan" name="layanan" value={form.layanan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
              <option value="">Pilih Layanan</option>
              <option value="Internet">Internet</option>
              <option value="TV Kabel">TV Kabel</option>
              <option value="Internet + TV Kabel">Internet + TV Kabel</option>
            </select>
          </div>

          {/* Iuran Bulanan */}
          <div>
            <label htmlFor="iuranBulanan" className="block text-sm font-medium text-gray-700 mb-1">
              Iuran Bulanan (Rp)
            </label>
            <input type="number" id="iuranBulanan" in name="iuranBulanan" value={form.iuranBulanan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          {/* Jumlah Bulan */}
          <div>
            <label htmlFor="jumlahBulan" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Bulan
            </label>
            <input type="number" id="jumlahBulan" name="jumlahBulan" value={form.jumlahBulan} onChange={handleChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          {/* Jumlah TV - Displayed conditionally */}
          {showTVField && (
            <div>
              <label htmlFor="jumlahTV" className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah TV
              </label>
              <input type="number" id="jumlahTV" name="jumlahTV" value={form.jumlahTV} onChange={handleChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
          )}

          {/* Pararel */}
          <div>
            <label htmlFor="pararel" className="block text-sm font-medium text-gray-700 mb-1">
              Pararel
            </label>
            <input type="number" id="pararel" name="pararel" value={form.pararel} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          {/* Denda */}
          <div>
            <label htmlFor="dendah" className="block text-sm font-medium text-gray-700 mb-1">
              Denda (Rp)
            </label>
            <input type="number" id="dendah" name="dendah" value={form.dendah} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        {/* Total Amount Display */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Pembayaran:</span>
            <span className="text-lg font-semibold text-indigo-600">Rp {calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <div>
          <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Simpan Pembayaran
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPembayaran;
