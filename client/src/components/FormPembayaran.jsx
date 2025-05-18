import { useState } from "react";
import axios from "axios";

const FormPembayaran = ({ onSuccess }) => {
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
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
      await axios.post("http://localhost:5000/api/pembayaran/add", form);
      onSuccess();
      setForm({ nama: "", alamat: "", jumlah: "", tanggal: "", keterangan: "" });
    } catch (err) {
      alert("Gagal menambahkan pembayaran");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md space-y-4 mb-6">
      <h2 className="text-xl font-semibold">Tambah Pembayaran</h2>
      <input type="text" name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
      <input type="text" name="alamat" placeholder="Alamat" value={form.alamat} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
      <input type="number" name="jumlah" placeholder="Jumlah Pembayaran" value={form.jumlah} onChange={handleChange} className="w-full border rounded px-4 py-2" required />
      <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full border rounded px-4 py-2" />
      <input type="text" name="keterangan" placeholder="Keterangan" value={form.keterangan} onChange={handleChange} className="w-full border rounded px-4 py-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Simpan
      </button>
    </form>
  );
};

export default FormPembayaran;
