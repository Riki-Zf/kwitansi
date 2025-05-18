import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImage from "../assets/logo.png";

const KwitansiPDF = ({ pembayaran }) => {
  const generatePDF = async () => {
    // Konfigurasi dokumen
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Menambahkan warna border
    doc.setDrawColor(0, 100, 0); // Warna hijau untuk border
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277); // Border utama
    doc.setLineWidth(0.2);
    doc.rect(12, 12, 186, 273); // Border kedua (inner border)

    // Header dengan logo
    const logo = new Image();
    logo.src = logoImage;
    doc.addImage(logo, "PNG", 15, 15, 25, 25);

    // Judul kwitansi
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 100, 0); // Warna hijau
    doc.text("KWITANSI PEMBAYARAN WIFI", 105, 25, null, null, "center");

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Internet Service Provider", 105, 32, null, null, "center");

    // Garis pemisah header
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.5);
    doc.line(15, 40, 195, 40);

    // Informasi kwitansi
    doc.setTextColor(0, 0, 0); // Reset ke warna hitam
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("INFORMASI PEMBAYARAN", 15, 48);

    // Data kwitansi
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    // Kolom kiri
    doc.text("No. Kwitansi", 15, 55);
    doc.text("Tanggal", 15, 62);
    doc.text("Nama Pelanggan", 15, 69);
    doc.text("Alamat", 15, 76);

    // Kolom titik dua
    doc.text(":", 50, 55);
    doc.text(":", 50, 62);
    doc.text(":", 50, 69);
    doc.text(":", 50, 76);

    // Kolom nilai
    doc.setFont("helvetica", "bold");
    doc.text(`${pembayaran.no_kwitansi}`, 55, 55);
    doc.text(
      `${new Date(pembayaran.tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`,
      55,
      62
    );
    doc.text(`${pembayaran.nama}`, 55, 69);

    // Alamat bisa lebih dari satu baris
    const splitAlamat = doc.splitTextToSize(pembayaran.alamat, 130);
    doc.text(splitAlamat, 55, 76);

    // Tinggi baris terakhir dari alamat untuk menentukan posisi berikutnya
    const lastLineY = 76 + (splitAlamat.length - 1) * 7;

    // Garis pemisah informasi dan tabel
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.2);
    doc.line(15, lastLineY + 10, 195, lastLineY + 10);

    // Tabel detail pembayaran
    autoTable(doc, {
      startY: lastLineY + 15,
      margin: { left: 15, right: 15 },
      headStyles: {
        fillColor: [0, 100, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      head: [["Item", "Periode", "Deskripsi", "Jumlah"]],
      body: [["Layanan Internet", pembayaran.periode || "1 Bulan", pembayaran.keterangan || "Pembayaran WiFi", `Rp ${pembayaran.jumlah.toLocaleString("id-ID")}`]],
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [240, 248, 240] },
    });

    // Total Pembayaran - Menggunakan auto-table dan mengakses finalY dengan aman
    let tableEndY;
    try {
      tableEndY = doc.lastAutoTable.finalY + 10;
    } catch (e) {
      // Fallback jika lastAutoTable tidak tersedia
      tableEndY = lastLineY + 45; // Perkiraan posisi setelah tabel
    }

    // Kotak untuk total pembayaran
    doc.setFillColor(240, 248, 240);
    doc.rect(95, tableEndY, 100, 12, "F");
    doc.setLineWidth(0.2);
    doc.setDrawColor(0, 100, 0);
    doc.rect(95, tableEndY, 100, 12); // Tambah border

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total Pembayaran:", 100, tableEndY + 8);
    doc.text(`Rp ${pembayaran.jumlah.toLocaleString("id-ID")}`, 190, tableEndY + 8, null, null, "right");

    // Terbilang dengan layout yang lebih baik
    const terbilang = angkaTerbilang(pembayaran.jumlah);

    const terbilangY = tableEndY + 20;
    doc.setFillColor(240, 248, 240);
    doc.rect(15, terbilangY, 180, 12, "F");
    doc.setLineWidth(0.2);
    doc.setDrawColor(0, 100, 0);
    doc.rect(15, terbilangY, 180, 12); // Tambah border untuk terbilang

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Terbilang:", 20, terbilangY + 8);
    doc.setFont("helvetica", "italic");
    const splitTerbilang = doc.splitTextToSize(`${terbilang} rupiah`, 140);
    doc.text(splitTerbilang, 55, terbilangY + 8);

    // Status LUNAS yang lebih rapi
    const lunasY = terbilangY + 35;

    // Kotak untuk status LUNAS
    doc.setFillColor(240, 255, 240);
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.5);
    doc.rect(15, lunasY - 15, 80, 30, "F");
    doc.rect(15, lunasY - 15, 80, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 100, 0);
    doc.text("LUNAS", 55, lunasY, null, null, "center");

    // Area tanda tangan di sebelah kanan
    // Buat kotak untuk area tanda tangan
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.2);
    doc.rect(120, lunasY - 15, 75, 55);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Tanda tangan & Cap", 158, lunasY - 5, null, null, "center");

    // Garis untuk tanda tangan
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(130, lunasY + 20, 185, lunasY + 20);

    doc.text("Pihak Admin", 158, lunasY + 30, null, null, "center");

    // Tanggal dan jam cetak
    const currentDate = new Date();
    const printDate = currentDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const printTime = currentDate.toLocaleTimeString("id-ID");

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(`Dicetak pada: ${printDate} ${printTime}`, 15, 280);

    // Catatan kaki
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Kwitansi ini adalah bukti pembayaran yang sah.", 105, 287, null, null, "center");

    doc.save(`kwitansi-${pembayaran.no_kwitansi}.pdf`);
  };

  // Fungsi untuk mengkonversi angka ke terbilang
  const angkaTerbilang = (angka) => {
    const bilangan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];

    if (angka < 12) {
      return bilangan[angka];
    } else if (angka < 20) {
      return bilangan[angka - 10] + " Belas";
    } else if (angka < 100) {
      return bilangan[Math.floor(angka / 10)] + " Puluh " + bilangan[angka % 10];
    } else if (angka < 200) {
      return "Seratus " + angkaTerbilang(angka - 100);
    } else if (angka < 1000) {
      return bilangan[Math.floor(angka / 100)] + " Ratus " + angkaTerbilang(angka % 100);
    } else if (angka < 2000) {
      return "Seribu " + angkaTerbilang(angka - 1000);
    } else if (angka < 1000000) {
      return angkaTerbilang(Math.floor(angka / 1000)) + " Ribu " + angkaTerbilang(angka % 1000);
    } else if (angka < 1000000000) {
      return angkaTerbilang(Math.floor(angka / 1000000)) + " Juta " + angkaTerbilang(angka % 1000000);
    } else {
      return angkaTerbilang(Math.floor(angka / 1000000000)) + " Miliar " + angkaTerbilang(angka % 1000000000);
    }
  };

  return (
    <button onClick={generatePDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition duration-300 shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293V6.5z" />
        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
      </svg>
      Cetak Kwitansi
    </button>
  );
};

export default KwitansiPDF;
