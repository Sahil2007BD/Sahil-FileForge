window.openTab = function(tab) {
  const view = document.getElementById("view");

  const routes = {
    merge: "function/merge.html",
    split: "function/split.html",
    sign: "function/sign.html"
  };

  view.src = routes[tab];
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

