let splitPdfDoc = null;

const mergeDropZone = document.getElementById("mergeDropZone");
const mergeInput = document.getElementById("mergeFiles");

const splitDropZone = document.getElementById("splitDropZone");
const splitInput = document.getElementById("splitFile");

const pageList = document.getElementById("pageList");

// ---------------- MERGE DRAG & DROP ----------------
mergeDropZone.addEventListener("click", () => mergeInput.click());

mergeDropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  mergeDropZone.style.background = "#334155";
});

mergeDropZone.addEventListener("dragleave", () => {
  mergeDropZone.style.background = "#1e293b";
});

mergeDropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  mergeInput.files = e.dataTransfer.files;
  mergeDropZone.innerText = `${mergeInput.files.length} file(s) selected`;
});

// ---------------- SPLIT DRAG & DROP ----------------
splitDropZone.addEventListener("click", () => splitInput.click());

splitDropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  splitDropZone.style.background = "#334155";
});

splitDropZone.addEventListener("dragleave", () => {
  splitDropZone.style.background = "#1e293b";
});

splitDropZone.addEventListener("drop", async (e) => {
  e.preventDefault();
  splitInput.files = e.dataTransfer.files;
  await loadSplitPDF(splitInput.files[0]);
});

// ---------------- LOAD SPLIT PDF ----------------
splitInput.addEventListener("change", async () => {
  await loadSplitPDF(splitInput.files[0]);
});

async function loadSplitPDF(file) {
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  splitPdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

  const totalPages = splitPdfDoc.getPageCount();

  pageList.innerHTML = "<h4>Select pages:</h4>";

  for (let i = 0; i < totalPages; i++) {
    pageList.innerHTML += `
      <label>
        <input type="checkbox" class="pageCheck" value="${i}">
        Page ${i + 1}
      </label><br>
    `;
  }
}
// ---------------- MERGE ----------------

window.mergePDFs = async function () {
  const files = mergeInput.files;

  if (files.length < 2) {
    alert("Select at least 2 PDFs");
    return;
  }

  const mergedPdf = await PDFLib.PDFDocument.create();

  for (let file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(arrayBuffer);

    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => mergedPdf.addPage(p));
  }

  const pdfBytes = await mergedPdf.save();
  download(pdfBytes, "merged.pdf");
};

// ---------------- SPLIT ----------------
window.splitPDF = async function () {
  if (!splitPdfDoc) {
    alert("Select a PDF first");
    return;
  }

  const checks = document.querySelectorAll(".pageCheck");
  const selectedPages = [];

  checks.forEach(c => {
    if (c.checked) selectedPages.push(parseInt(c.value));
  });

  if (selectedPages.length === 0) {
    alert("Select at least 1 page");
    return;
  }

  const newPdf = await PDFLib.PDFDocument.create();
  const pages = await newPdf.copyPages(splitPdfDoc, selectedPages);
  pages.forEach(p => newPdf.addPage(p));

  const pdfBytes = await newPdf.save();
  download(pdfBytes, "split.pdf");
}

// ---------------- DOWNLOAD ----------------
function download(pdfBytes, filename) {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
}