window.openTab = function(tab) {
  const view = document.getElementById("view");

  if (!view) return;

  if (tab === "merge") {
    view.src = "function/merge.html";
  }

  if (tab === "split") {
    view.src = "function/split.html";
  }

  if (tab === "sign") {
    view.src = "function/sign.html";
  }
};

function download(bytes, name) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();

  URL.revokeObjectURL(url);
}