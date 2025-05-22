import { useState, useMemo } from "react";
import KwitansiPDF from "./KwitansiPDF";

const PembayaranList = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("no_kwitansi");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const filteredData = useMemo(() => {
    let result = [...data];
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          (item.nama && item.nama.toLowerCase().includes(lower)) ||
          (item.alamat && item.alamat.toLowerCase().includes(lower)) ||
          (item.no_kwitansi && item.no_kwitansi.toLowerCase().includes(lower)) ||
          (item.idPelanggan && item.idPelanggan.toLowerCase().includes(lower))
      );
    }

    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      // Handle undefined values
      if (valA === undefined) valA = "";
      if (valB === undefined) valB = "";

      if (sortBy === "tanggal") {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      // Sort numerically for number fields
      if (["pararel", "dendah", "jumlahBulan", "jumlahTV", "iuranBulanan", "jumlah"].includes(sortBy)) {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      if (sortBy === "no_kwitansi") {
        const isNumericA = /^\d+$/.test(valA);
        const isNumericB = /^\d+$/.test(valB);
        if (isNumericA && isNumericB) {
          return sortOrder === "asc" ? parseInt(valA) - parseInt(valB) : parseInt(valB) - parseInt(valA);
        }
      }

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

  const getSortIndicator = (column) => (sortBy === column ? (sortOrder === "asc" ? " ▲" : " ▼") : "");

  // Calculate total amount
  const calculateTotal = (item) => {
    const monthly = item.iuranBulanan || 0;
    const months = item.jumlahBulan || 1;
    const parallel = item.pararel || 0;
    const fine = item.dendah || 0;

    return monthly * months + parallel + fine;
  };

  // Function to determine if jumlahTV should be shown based on service type
  const shouldShowTVCount = (layanan) => {
    return layanan === "TV Kabel" || layanan === "Internet + TV Kabel";
  };

  return (
    <div className="mt-4 text-gray-800">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, address, customer ID or receipt number..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="md:hidden flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <span className="mr-1">Filter & Sort</span>
            <span>{isCollapsed ? "▾" : "▴"}</span>
          </button>
        </div>

        <div className={`mt-3 ${isCollapsed ? "hidden" : "block"} md:hidden bg-gray-50 p-4 rounded-md shadow border border-gray-200`}>
          <p className="font-medium text-gray-700 mb-2 text-sm">Sort by:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "nama", label: "Name" },
              { key: "alamat", label: "Address" },
              { key: "no_kwitansi", label: "Receipt No." },
              { key: "idPelanggan", label: "Customer ID" },
              { key: "layanan", label: "Service" },
              { key: "tanggal", label: "Date" },
              { key: "iuranBulanan", label: "Monthly Fee" },
              { key: "jumlahBulan", label: "Months" },
              { key: "jumlahTV", label: "TV Count" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`px-3 py-1.5 text-left text-sm rounded-md ${sortBy === key ? "bg-indigo-100 text-indigo-800 border border-indigo-200" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"} transition`}
              >
                {label}
                {getSortIndicator(key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="hidden md:table min-w-full divide-y divide-gray-200 rounded-md overflow-hidden shadow-sm border border-gray-200">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("tanggal")}>
                Date{getSortIndicator("tanggal")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("nama")}>
                Name{getSortIndicator("nama")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("alamat")}>
                Address{getSortIndicator("alamat")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("idPelanggan")}>
                Customer ID{getSortIndicator("idPelanggan")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("no_kwitansi")}>
                Receipt No.{getSortIndicator("no_kwitansi")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("layanan")}>
                Service{getSortIndicator("layanan")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("iuranBulanan")}>
                Monthly Fee{getSortIndicator("iuranBulanan")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("jumlahBulan")}>
                Months{getSortIndicator("jumlahBulan")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("jumlahTV")}>
                TV Count{getSortIndicator("jumlahTV")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("pararel")}>
                Parallel{getSortIndicator("pararel")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-indigo-700 transition" onClick={() => handleSort("dendah")}>
                Fine{getSortIndicator("dendah")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => {
              const totalAmount = calculateTotal(item);
              return (
                <tr key={item._id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.tanggal).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.alamat}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.idPelanggan || <span className="text-gray-400 italic">None</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{item.no_kwitansi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.layanan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {(item.iuranBulanan || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.jumlahBulan || 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shouldShowTVCount(item.layanan) ? item.jumlahTV || 1 : <span className="text-gray-400 italic">N/A</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"> {(item.pararel || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rp {(item.dendah || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Rp {totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <KwitansiPDF pembayaran={{ ...item, jumlah: totalAmount }} className="text-indigo-600 hover:text-indigo-900" />
                  </td>
                </tr>
              );
            })}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="14" className="px-6 py-4 text-center text-sm text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="md:hidden space-y-3">
          {filteredData.map((item) => {
            const totalAmount = calculateTotal(item);
            return (
              <div key={item._id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.nama}</h3>
                    <p className="text-gray-500 text-sm mt-1">{item.alamat}</p>
                    {item.idPelanggan && <p className="text-gray-500 text-xs mt-1">ID: {item.idPelanggan}</p>}
                  </div>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">#{item.no_kwitansi}</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Date:</p>
                    <p className="text-gray-900">{new Date(item.tanggal).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Service:</p>
                    <p className="text-gray-900">{item.layanan}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Monthly Fee:</p>
                    <p className="text-gray-900">Rp {(item.iuranBulanan || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Months:</p>
                    <p className="text-gray-900">{item.jumlahBulan || 1}</p>
                  </div>
                  {shouldShowTVCount(item.layanan) && (
                    <div>
                      <p className="text-gray-500 text-xs">TV Count:</p>
                      <p className="text-gray-900">{item.jumlahTV || 1}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500 text-xs">Parallel Fee:</p>
                    <p className="text-gray-900">{(item.pararel || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Fine:</p>
                    <p className="text-gray-900">Rp {(item.dendah || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-gray-900 font-medium">
                    <span className="text-xs text-gray-500">Total:</span>
                    <p>Rp {totalAmount.toLocaleString()}</p>
                  </div>
                  <KwitansiPDF pembayaran={{ ...item, jumlah: totalAmount }} className="text-sm font-medium text-indigo-600 hover:text-indigo-800" />
                </div>
              </div>
            );
          })}
          {filteredData.length === 0 && <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">No data found</div>}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredData.length} of {data.length} records
      </div>
    </div>
  );
};

export default PembayaranList;
