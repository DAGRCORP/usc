import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const db = window.db;

document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("listaArchivos");
  lista.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "archivos"));
    snapshot.forEach(docItem => {
      const data = docItem.data();
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${data.nombre}</td>
        <td>—</td>
        <td>📂 <a href="#" onclick="cargar('${docItem.id}')">Cargar</a></td>
        <td><button onclick="eliminar('${docItem.id}')">🗑️ Eliminar</button></td>
      `;

      lista.appendChild(fila);
    });
  } catch (e) {
    console.error("Error al cargar archivos:", e);
  }
});

window.eliminar = async function (id) {
  if (confirm("¿Eliminar documento?")) {
    await deleteDoc(doc(db, "archivos", id));
    alert("Eliminado");
    location.reload();
  }
};

window.cargar = function (id) {
  localStorage.setItem("docFirebaseID", id);
  window.location.href = "index.html";
};
