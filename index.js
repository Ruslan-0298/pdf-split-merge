
const { PDFDocument } = PDFLib;

document.getElementById("splitButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("pdfFile");
  if (fileInput.files.length === 0) {
    alert("Please upload a PDF file.");
    return;
  }

  const file = fileInput.files[0];
  const arrayBuffer = await file.arrayBuffer();

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);

    const pdfBytes = await newPdf.save();
    downloadPDF(pdfBytes, `Page_${i + 1}.pdf`);
  }
});

document.getElementById("mergeButton").addEventListener("click", async () => {
  const fileInput = document.getElementById("pdfFile");
  if (fileInput.files.length === 0) {
    alert("Please upload at least two PDF files.");
    return;
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of fileInput.files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  downloadPDF(mergedPdfBytes, "Merged_Document.pdf");
});

function downloadPDF(pdfBytes, filename) {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
