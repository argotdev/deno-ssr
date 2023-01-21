let isClient = typeof window !== "undefined";
let isFirstRender = true;

export async function render(document, { dinos }) {
  if (isClient && isFirstRender) {
    isFirstRender = false;
    const jsonResponse = await fetch("http://localhost:8000/data");
    const jsonData = await jsonResponse.json();
    window.dinos = jsonData;
  }
  let html = "<html><ul>";
  for (const item of dinos) {
    html += `<li>${item}</li>`;
  }
  html += "</ul><input>";
  html += "<button>Add</button></html>";
  document.body.innerHTML = html;
}

export function addEventListeners() {
  document.querySelector("button").addEventListener("click", async () => {
    const item = document.querySelector("input").value;
    window.dinos.push(item);
    const response = await fetch("/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item }),
    });
    const status = response.status;
    if (status === 200) {
      render(document, window);
    }
  });
}
