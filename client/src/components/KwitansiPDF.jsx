import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImage from "../assets/logo.png";

const KwitansiPDF = ({ pembayaran }) => {
  const generatePDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);
    doc.setLineWidth(0.2);
    doc.rect(12, 12, 186, 273);

    const logo = new Image();
    logo.src = logoImage;
    doc.addImage(logo, "PNG", 15, 15, 25, 25);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 100, 0);
    doc.text("KWITANSI PEMBAYARAN WIFI", 105, 25, null, null, "center");

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Internet & TV Cable Billing System", 105, 32, null, null, "center");

    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.5);
    doc.line(15, 40, 195, 40);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("INFORMASI PEMBAYARAN", 15, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text("No. Kwitansi", 15, 55);
    doc.text("Tanggal", 15, 62);
    doc.text("Nama Pelanggan", 15, 69);
    doc.text("Alamat", 15, 76);
    doc.text("Layanan", 15, 83);

    doc.text(":", 50, 55);
    doc.text(":", 50, 62);
    doc.text(":", 50, 69);
    doc.text(":", 50, 76);
    doc.text(":", 50, 83);

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
    const splitAlamat = doc.splitTextToSize(pembayaran.alamat, 130);
    doc.text(splitAlamat, 55, 76);
    doc.text(`${pembayaran.layanan}`, 55, 83);

    const lastLineY = 83 + (splitAlamat.length - 1) * 7;

    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.2);
    doc.line(15, lastLineY + 10, 195, lastLineY + 10);

    autoTable(doc, {
      startY: lastLineY + 15,
      margin: { left: 15, right: 15 },
      headStyles: {
        fillColor: [0, 100, 0],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      head: [["Layanan", "Periode", "Deskripsi", "Jumlah"]],
      body: [[pembayaran.layanan, pembayaran.periode || "1 Bulan", pembayaran.keterangan || "Pembayaran Layanan", `Rp ${pembayaran.jumlah.toLocaleString("id-ID")}`]],
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: [240, 248, 240] },
    });

    let tableEndY = doc.lastAutoTable?.finalY || lastLineY + 45;

    doc.setFillColor(240, 248, 240);
    doc.rect(95, tableEndY + 5, 100, 12, "F");
    doc.setDrawColor(0, 100, 0);
    doc.rect(95, tableEndY + 5, 100, 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total Pembayaran:", 100, tableEndY + 12);
    doc.text(`Rp ${pembayaran.jumlah.toLocaleString("id-ID")}`, 190, tableEndY + 12, null, null, "right");

    const terbilang = angkaTerbilang(pembayaran.jumlah);
    const terbilangY = tableEndY + 25;
    doc.setFillColor(240, 248, 240);
    doc.rect(15, terbilangY, 180, 12, "F");
    doc.setDrawColor(0, 100, 0);
    doc.rect(15, terbilangY, 180, 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Terbilang:", 20, terbilangY + 8);
    doc.setFont("helvetica", "italic");
    const splitTerbilang = doc.splitTextToSize(`${terbilang} rupiah`, 140);
    doc.text(splitTerbilang, 55, terbilangY + 8);

    const lunasY = terbilangY + 35;
    doc.setFillColor(240, 255, 240);
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.5);
    doc.rect(15, lunasY - 15, 80, 30, "F");
    doc.rect(15, lunasY - 15, 80, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 100, 0);
    doc.text("LUNAS", 55, lunasY, null, null, "center");

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 100, 0);
    doc.setLineWidth(0.2);
    doc.rect(120, lunasY - 15, 75, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Tanda tangan & Cap", 158, lunasY - 5, null, null, "center");
    doc.line(130, lunasY + 20, 185, lunasY + 20);
    doc.text("Pihak Admin", 158, lunasY + 30, null, null, "center");

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
    doc.setFont("helvetica", "normal");
    doc.text("Kwitansi ini adalah bukti pembayaran yang sah.", 105, 287, null, null, "center");

    doc.save(`kwitansi-${pembayaran.no_kwitansi}.pdf`);
  };

  const angkaTerbilang = (angka) => {
    const bilangan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    if (angka < 12) return bilangan[angka];
    else if (angka < 20) return bilangan[angka - 10] + " Belas";
    else if (angka < 100) return bilangan[Math.floor(angka / 10)] + " Puluh " + bilangan[angka % 10];
    else if (angka < 200) return "Seratus " + angkaTerbilang(angka - 100);
    else if (angka < 1000) return bilangan[Math.floor(angka / 100)] + " Ratus " + angkaTerbilang(angka % 100);
    else if (angka < 2000) return "Seribu " + angkaTerbilang(angka - 1000);
    else if (angka < 1000000) return angkaTerbilang(Math.floor(angka / 1000)) + " Ribu " + angkaTerbilang(angka % 1000);
    else if (angka < 1000000000) return angkaTerbilang(Math.floor(angka / 1000000)) + " Juta " + angkaTerbilang(angka % 1000000);
    else return angkaTerbilang(Math.floor(angka / 1000000000)) + " Miliar " + angkaTerbilang(angka % 1000000000);
  };

  return (
    <button onClick={generatePDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition duration-300 shadow-md">
      Cetak Kwitansi
    </button>
  );
};

export default KwitansiPDF;
