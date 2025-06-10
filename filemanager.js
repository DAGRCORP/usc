document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("listaArchivos");
  lista.innerHTML = "";

  try {
    const snapshot = await db.collection("archivos").orderBy("fecha", "desc").get();

    snapshot.forEach(doc => {
      const data = doc.data();
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${data.nombre}</td>
        <td>—</td>
        <td>📂 <a href="#" onclick="cargar('${doc.id}')">Cargar</a></td>
        <td><button onclick="eliminar('${doc.id}')">🗑️ Eliminar</button></td>
      `;

      lista.appendChild(fila);
    });
  } catch (error) {
    console.error("Error cargando archivos:", error);
  }
});

function cargar(id) {
  localStorage.setItem("docFirebaseID", id);
  window.location.href = "index.html"; // o revision.html
}

function eliminar(id) {
  if (confirm("¿Seguro que deseas eliminar este archivo?")) {
    db.collection("archivos").doc(id).delete().then(() => {
      alert("Archivo eliminado");
      location.reload();
    });
  }
}
