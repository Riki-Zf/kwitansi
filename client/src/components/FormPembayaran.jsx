// FormPembayaran.jsx
import { useState } from "react";
import axios from "axios";

const FormPembayaran = ({ onSuccess }) => {
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    layanan: "",
    pararel: 0,
    dendah: 0,
    jumlahBulan: 1,
    iuranBulanan: 0,
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
        pararel: 0,
        dendah: 0,
        jumlahBulan: 1,
        iuranBulanan: 0,
      });
    } catch (err) {
      alert("Failed to add payment");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Tambah Pembayaran Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Iuran Bulanan
            </label>
            <input type="number" id="iuranBulanan" name="iuranBulanan" value={form.iuranBulanan} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          {/* Jumlah Bulan */}
          <div>
            <label htmlFor="jumlahBulan" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Bulan
            </label>
            <input type="number" id="jumlahBulan" name="jumlahBulan" value={form.jumlahBulan} onChange={handleChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
          </div>

          {/* Pararel */}
          <div>
            <label htmlFor="pararel" className="block text-sm font-medium text-gray-700 mb-1">
              Pararel
            </label>
            <input type="number" id="pararel" name="pararel" value={form.pararel} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>

          {/* Denda */}
          <div>
            <label htmlFor="dendah" className="block text-sm font-medium text-gray-700 mb-1">
              Denda
            </label>
            <input type="number" id="dendah" name="dendah" value={form.dendah} onChange={handleChange} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
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
