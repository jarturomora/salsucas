// Control de visibilidad
const SHOW_LANDING = false; // Cambia a true para mostrar landing y bloquear envíos
const GAS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzlJtZCIDmwmfT-9AO_Xipi-bAxjCZj3dL2oFZG06--22x7ftGS8sgkf83iT1bTWERbZQ/exec";

const form = document.getElementById("pedidoForm");
const landing = document.getElementById("landing");
const submitBtn = document.getElementById("submitBtn");

// Inicializa UI
(function initGate(){
  if (SHOW_LANDING){
    landing.hidden = false;
    form.hidden = true;
    if (submitBtn){
      submitBtn.disabled = true;
      submitBtn.classList.add("btn-disabled");
      submitBtn.title = "Pedidos temporalmente cerrados";
      submitBtn.setAttribute("aria-disabled","true");
    }
  } else {
    landing.hidden = true;
    form.hidden = false;
    if (submitBtn){
      submitBtn.disabled = false;
      submitBtn.classList.remove("btn-disabled");
      submitBtn.removeAttribute("aria-disabled");
      submitBtn.removeAttribute("title");
    }
  }
})();

// Validación: al menos un producto > 0
function hasAtLeastOneItem(formEl){
  const data = new FormData(formEl);
  for (const [key, value] of data.entries()){
    if (key === "nombre" || key === "email") continue;
    const qty = parseInt(value, 10) || 0;
    if (qty > 0) return true;
  }
  return false;
}

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  if (SHOW_LANDING){
    alert("Los pedidos están temporalmente cerrados. ¡Volveremos pronto! 🌶️");
    return;
  }
  if (!hasAtLeastOneItem(form)){
    alert("Debes seleccionar al menos un producto antes de enviar el pedido.");
    return;
  }
  const data = new FormData(form);
  const body = new URLSearchParams(data);
  try {
    const res = await fetch(GAS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body
    });
    const json = await res.json();
    if (json.ok){ alert("¡Pedido enviado! Gracias 🙌"); form.reset(); }
    else { alert("Error al guardar el pedido: " + (json.error || "desconocido")); }
  } catch (e){
    console.error(e);
    alert("No se pudo enviar el pedido. Revisa tu conexión o vuelve a intentar.");
  }
});
