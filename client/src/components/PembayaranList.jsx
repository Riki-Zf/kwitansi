import { useState, useMemo } from "react";
import KwitansiPDF from "./KwitansiPDF";
const PembayaranList = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("no_kwitansi"); // Changed default sort to no_kwitansi
  const [sortOrder, setSortOrder] = useState("asc"); // Changed default order to ascending

  // 🔍 Filter + Sort logic
  const filteredData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter((item) => item.nama.toLowerCase().includes(lower) || item.alamat.toLowerCase().includes(lower));
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Jika sorting tanggal
      if (sortBy === "tanggal") {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      // Khusus no_kwitansi - handle numerik dan alfanumerik
      if (sortBy === "no_kwitansi") {
        // Cek apakah keduanya numerik murni
        const isNumericA = /^\d+$/.test(valA);
        const isNumericB = /^\d+$/.test(valB);

        if (isNumericA && isNumericB) {
          // Jika keduanya numerik, bandingkan sebagai angka
          return sortOrder === "asc" ? parseInt(valA) - parseInt(valB) : parseInt(valB) - parseInt(valA);
        }
      }

      // Default comparison
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, searchQuery, sortBy, sortOrder]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  // Helper to show sort indicator
  const getSortIndicator = (column) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <div className="mt-8">
      {/* 🔍 Search bar */}
      <div className="mb-4 flex justify-between items-center">
        <input type="text" placeholder="Cari nama atau alamat..." className="border px-3 py-2 rounded w-full max-w-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-md shadow-sm text-sm">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-2 px-4">No</th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort("nama")}>
                Nama{getSortIndicator("nama")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort("alamat")}>
                Alamat{getSortIndicator("alamat")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort("jumlah")}>
                Jumlah{getSortIndicator("jumlah")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort("tanggal")}>
                Tanggal{getSortIndicator("tanggal")}
              </th>
              <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort("no_kwitansi")}>
                No Kwitansi{getSortIndicator("no_kwitansi")}
              </th>
              <th className="py-2 px-4">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item._id} className="odd:bg-white even:bg-gray-100">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2">{item.nama}</td>
                <td className="px-4 py-2">{item.alamat}</td>
                <td className="px-4 py-2">Rp {item.jumlah.toLocaleString()}</td>
                <td className="px-4 py-2">{new Date(item.tanggal).toLocaleDateString()}</td>
                <td className="px-4 py-2">{item.no_kwitansi}</td>
                <td className="px-4 py-2">{item.keterangan}</td>
                <td className="px-4 py-2 text-center">
                  <KwitansiPDF pembayaran={item} />
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PembayaranList;
