import jsPDF from "jspdf";

const KwitansiPDF = ({ pembayaran }) => {
  const generatePDF = async () => {
    // Initialize document with proper dimensions
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 150], // Smaller receipt-like format
    });

    // Set default styles
    doc.setFont("helvetica");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);

    // Header
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Kwitansi iuran bulanan", 40, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text("STARVISION TV KABEL", 40, 15, { align: "center" });

    // Horizontal line separator
    doc.line(10, 18, 70, 18);

    // Left-aligned customer information
    const leftMargin = 10;
    let currentY = 25;

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Tanggal", leftMargin, currentY);
    doc.setFont("helvetica", "bold");
    const tanggalParts = new Date(pembayaran.tanggal).toLocaleDateString("id-ID").split("/");
    const bulanIndo = ["", "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
    const bulanText = bulanIndo[parseInt(tanggalParts[1])];
    doc.text(`${tanggalParts[0].padStart(2, "0")}    ${bulanText}    ${tanggalParts[2]}`, leftMargin + 20, currentY);
    currentY += 7;

    // Name
    doc.setFont("helvetica", "normal");
    doc.text("Nama", leftMargin, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(pembayaran.no_kwitansi || "F3/12", leftMargin + 20, currentY);
    currentY += 7;

    // Address
    doc.setFont("helvetica", "normal");
    doc.text("Alamat", leftMargin, currentY);
    doc.setFont("helvetica", "bold");
    doc.text(pembayaran.nama || "SAWITA HIJAU", leftMargin + 20, currentY);
    currentY += 7;

    // Customer service (empty line before)
    currentY += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Customer service", leftMargin + 20, currentY);
    currentY += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Tlp. 0853 3333 8047", leftMargin + 20, currentY);
    currentY += 10;

    // ID Box (right-aligned)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`ID: ${pembayaran.idPelanggan || "M219"}`, 60, currentY, { align: "right" });
    currentY += 10;

    // Payment details table
    const tableData = [
      { label: "Iuran Bulanan", value: (pembayaran.iuranBulanan || 30000).toLocaleString("id-ID") },
      { label: "Jumlah TV", value: (pembayaran.jumlahTV || 1).toString() },
      { label: "Pararel / Bulanan", value: (pembayaran.pararel || 0).toString() },
      { label: "Dendah / Bulan", value: (pembayaran.dendah || 0).toString() },
      { label: "Jumlah Bulan", value: (pembayaran.jumlahBulan || 1).toString() },
    ];

    // Draw table
    tableData.forEach((item) => {
      doc.setFont("helvetica", "normal");
      doc.text(item.label, leftMargin, currentY);
      doc.setFont("helvetica", "bold");
      doc.text(item.value, 60, currentY, { align: "right" });
      currentY += 7;
    });

    // Total Payment
    currentY += 5;
    const totalAmount = pembayaran.jumlah || calculateTotal(pembayaran);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL BAYAR :", leftMargin, currentY);
    doc.text(totalAmount.toLocaleString("id-ID"), 60, currentY, { align: "right" });
    currentY += 10;

    // Footer - Issued date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const printDate = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    doc.text(`terbit pada ${printDate}`, 40, currentY, { align: "center" });

    // Save the PDF
    doc.save(`kwitansi-${pembayaran.no_kwitansi || "receipt"}.pdf`);
  };

  // Calculate total payment
  const calculateTotal = (item) => {
    const monthly = item.iuranBulanan || 0;
    const months = item.jumlahBulan || 1;
    const parallel = item.pararel || 0;
    const fine = item.dendah || 0;
    return monthly * months + parallel + fine;
  };

  return (
    <button onClick={generatePDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition duration-300 shadow-md">
      Cetak Kwitansi
    </button>
  );
};

export default KwitansiPDF;
