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

  // State untuk menangani status submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert numeric fields to numbers only for numeric fields
    const numericFields = ["jumlahBulan", "jumlahTV", "pararel", "dendah", "iuranBulanan"];
    const newValue = numericFields.includes(name) ? parseInt(value) || 0 : value;

    setForm({ ...form, [name]: newValue });

    // Clear status messages when user starts typing
    if (submitStatus) {
      setSubmitStatus(null);
      setStatusMessage("");
    }
  };

  const resetForm = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setStatusMessage("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}api/pembayaran/add`, form);

      // Tampilkan pesan sukses
      setSubmitStatus("success");
      setStatusMessage(`Pembayaran untuk ${form.nama} berhasil ditambahkan!`);

      // Reset form
      resetForm();

      // Panggil callback onSuccess jika ada
      if (onSuccess) {
        onSuccess();
      }

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setStatusMessage("");
      }, 5000);
    } catch (err) {
      // Tampilkan pesan error
      setSubmitStatus("error");
      setStatusMessage("Gagal menambahkan pembayaran. Silakan coba lagi.");

      // Auto-hide error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
        setStatusMessage("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
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

      {/* Status Message */}
      {submitStatus && (
        <div className={`mb-4 p-4 rounded-md border ${submitStatus === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <div className="flex items-center">
            {submitStatus === "success" ? (
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{statusMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tanggal - Added as first field */}
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Pembayaran
            </label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Nama */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pelanggan
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Alamat */}
          <div>
            <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-1">
              Alamat
            </label>
            <input
              type="text"
              id="alamat"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Layanan */}
          <div>
            <label htmlFor="layanan" className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Layanan
            </label>
            <select
              id="layanan"
              name="layanan"
              value={form.layanan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isSubmitting}
            >
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
            <input
              type="number"
              id="iuranBulanan"
              name="iuranBulanan"
              value={form.iuranBulanan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Jumlah Bulan */}
          <div>
            <label htmlFor="jumlahBulan" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Bulan
            </label>
            <input
              type="number"
              id="jumlahBulan"
              name="jumlahBulan"
              value={form.jumlahBulan}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Jumlah TV - Displayed conditionally */}
          {showTVField && (
            <div>
              <label htmlFor="jumlahTV" className="block text-sm font-medium text-gray-700 mb-1">
                Jumlah TV
              </label>
              <input
                type="number"
                id="jumlahTV"
                name="jumlahTV"
                value={form.jumlahTV}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* Pararel */}
          <div>
            <label htmlFor="pararel" className="block text-sm font-medium text-gray-700 mb-1">
              Pararel
            </label>
            <input
              type="number"
              id="pararel"
              name="pararel"
              value={form.pararel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Denda */}
          <div>
            <label htmlFor="dendah" className="block text-sm font-medium text-gray-700 mb-1">
              Denda (Rp)
            </label>
            <input
              type="number"
              id="dendah"
              name="dendah"
              value={form.dendah}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isSubmitting}
            />
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
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </div>
            ) : (
              "Simpan Pembayaran"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPembayaran;
