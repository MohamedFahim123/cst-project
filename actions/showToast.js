export function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  container.innerHTML = "";
  const toast = document.createElement("div");
  toast.className = `toast show ${type}`;
  toast.innerText = message;
  console.log(container)
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
