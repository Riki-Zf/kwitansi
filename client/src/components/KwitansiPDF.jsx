import jsPDF from "jspdf";

const KwitansiPDF = ({ pembayaran }) => {
  // Default values for pembayaran
  const defaults = {
    idPelanggan: "M219",
    nama: "Nama Pelanggan",
    alamat: "Alamat Pelanggan",
    iuranBulanan: 30000,
    jumlahTV: 1,
    pararel: 0,
    dendah: 0,
    jumlahBulan: 1,
    no_kwitansi: "receipt",
  };

  const data = { ...defaults, ...pembayaran };

  const generatePDF = () => {
    // Initialize document with custom settings
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 150],
    });

    // Document styles
    const styles = {
      header: { size: 10, style: "bold", align: "center" },
      company: { size: 12, style: "bold", align: "center" },
      label: { size: 10, style: "normal" },
      value: { size: 10, style: "bold" },
      total: { size: 12, style: "bold" },
      footer: { size: 8, style: "normal", align: "center" },
    };

    // Layout constants
    const layout = {
      margin: 10,
      lineWidth: 0.2,
      lineY: 18,
      colonAlign: 38, // Position for aligned colons
      valueAlign: 40, // Position for values after colon
      rightAlign: 65, // Position for right-aligned values
      lineSpacing: 7,
      sectionSpacing: 5,
    };

    // Set default styles
    doc.setFont("helvetica");
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(layout.lineWidth);

    // Header section
    doc.setFontSize(styles.header.size);
    doc.setFont("helvetica", styles.header.style);
    doc.text("Kwitansi iuran bulanan", 40, 10, { align: styles.header.align });

    doc.setFontSize(styles.company.size);
    doc.text("STARVISION TV KABEL", 40, 15, { align: styles.company.align });

    // Divider line
    doc.line(layout.margin, layout.lineY, 70, layout.lineY);

    // Customer information section
    let currentY = 25;

    // ID Pelanggan
    doc.setFontSize(styles.value.size);
    doc.setFont("helvetica", styles.value.style);
    doc.text(`ID: ${data.idPelanggan}`, layout.margin, currentY);
    currentY += layout.lineSpacing;

    // Format date
    const formatDate = (dateString) => {
      const date = new Date(dateString || new Date());
      const [day, month, year] = date.toLocaleDateString("id-ID").split("/");
      const months = ["", "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI", "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"];
      return `${day.padStart(2, "0")} ${months[parseInt(month)]} ${year}`;
    };

    // Function to add aligned row
    const addAlignedRow = (label, value, rightAligned = false) => {
      doc.setFont("helvetica", styles.label.style);
      doc.text(label, layout.margin, currentY);
      doc.text(":", layout.colonAlign, currentY);

      doc.setFont("helvetica", styles.value.style);
      if (rightAligned) {
        doc.text(value, layout.rightAlign, currentY, { align: "right" });
      } else {
        doc.text(value, layout.valueAlign, currentY);
      }
      currentY += layout.lineSpacing;
    };

    // Customer information with aligned colons
    addAlignedRow("Tanggal", formatDate(data.tanggal), true);
    addAlignedRow("Nama", data.nama, true);
    addAlignedRow("Alamat", data.alamat, true);

    // Payment details section with aligned colons
    const tableData = [
      { label: "Iuran Bulanan", value: `Rp ${data.iuranBulanan.toLocaleString("id-ID")}` },
      { label: "Jumlah TV", value: data.jumlahTV.toString() },
      { label: "Pararel / Bulanan", value: `${data.pararel.toLocaleString("id-ID")}` },
      { label: "Denda / Bulan", value: `Rp ${data.dendah.toLocaleString("id-ID")}` },
      { label: "Jumlah Bulan", value: data.jumlahBulan.toString() },
    ];

    tableData.forEach((item) => {
      addAlignedRow(item.label, item.value, true);
    });

    // Calculate total
    const calculateTotal = () => {
      return data.iuranBulanan * data.jumlahBulan + data.pararel + data.dendah;
    };

    // Total Bayar section
    currentY += layout.sectionSpacing;
    const totalAmount = data.jumlah || calculateTotal();

    doc.setFontSize(styles.total.size);
    doc.setFont("helvetica", styles.total.style);
    doc.text("TOTAL BAYAR", layout.margin, currentY);
    doc.text(":", 42, currentY); // Positioned appropriately for total section
    doc.text(`Rp ${totalAmount.toLocaleString("id-ID")}`, layout.rightAlign, currentY, { align: "right" });
    currentY += layout.lineSpacing + 3;

    // Customer service section - aligned and cleaned up
    doc.setFontSize(styles.label.size);
    doc.setFont("helvetica", styles.label.style);
    doc.text("Customer Service", layout.margin, currentY);
    doc.text(":", layout.colonAlign, currentY);

    doc.setFont("helvetica", styles.value.style);
    doc.text("0853 3333 8047", layout.rightAlign, currentY, { align: "right" });
    currentY += layout.lineSpacing + 2;

    // Footer section
    doc.setFontSize(styles.footer.size);
    doc.setFont("helvetica", styles.footer.style);
    const printDate = new Date().toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    doc.text(`terbit pada ${printDate}`, 40, currentY, { align: styles.footer.align });

    // Save the document
    doc.save(`kwitansi-${data.no_kwitansi}.pdf`);
  };

  return (
    <button onClick={generatePDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition duration-300 shadow-md" aria-label="Cetak Kwitansi">
      Cetak Kwitansi
    </button>
  );
};

export default KwitansiPDF;
