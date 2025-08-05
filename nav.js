import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(
  'https://lxlmoylexavqxnhxdhbz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bG1veWxleGF2cXhuaHhkaGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTAxNzksImV4cCI6MjA2NTc2NjE3OX0.sYqG2AvlrsdRQaC5i4CsTzWwDt1n9AzYsViZelyZDZ4'
);

document.addEventListener('DOMContentLoaded', async () => {
  // Primero, carga el nav.html
  await fetch('nav.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('nav-placeholder').innerHTML = html;
    })
    .catch(err => console.error('Error cargando nav:', err));

  // AHORA sí existe usuario-box
  let box = document.getElementById('usuario-box');
  if (!box) return;

  // (El resto igual: insertar botón, dropdown, eventos, etc.)
  box.innerHTML = `
    <button id="usuario-btn" style="
    background: #2069b4; color: #fff; border: none; border-radius: 17px;
    padding: 7px 15px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 7px;">
    <span style="font-size:1.35em; line-height: 1;">👤</span> Mi cuenta ▼
  </button>
    <div id="usuario-dropdown" style="
      display: none; background: #fff; border-radius: 12px; min-width: 220px; margin-top: 5px; box-shadow: 0 2px 14px #0002;
      padding: 1.2em 1.3em; color: #1d2e46; font-size:1.02em; position:absolute; right:0; top:35px; z-index:100;">
      <div><b>Nombre:</b> <span id="userNombre"></span></div>
      <div><b>Correo:</b> <span id="userEmail"></span></div>
      <div><b>Rol:</b> <span id="userRol"></span></div>
      <hr>
      <button id="cerrarSesionBtn" style="
        background: #ba2e1d; color: #fff; border: none; border-radius: 7px;
        padding: 7px 14px; margin-top: 7px; font-size: 1em; cursor: pointer;">Cerrar sesión</button>
    </div>
  `;
  // Mostrar/ocultar el dropdown
  document.getElementById('usuario-btn').addEventListener('click', function() {
    const dd = document.getElementById('usuario-dropdown');
    dd.style.display = dd.style.display === 'block' ? 'none' : 'block';
  });

  // Cerrar el dropdown al hacer clic fuera
  document.addEventListener('click', function(event) {
    if (box && !box.contains(event.target)) {
      document.getElementById('usuario-dropdown').style.display = 'none';
    }
  });

  // Llenar datos usuario
  if (typeof supabase === "undefined") {
    alert("Supabase no está cargado.");
    return;
  }
  if (!window.supabase || !window.supabase.auth) {
  console.warn('⚠️ Supabase no está cargado aún.');
  return;
}
const { data: { user } } = await window.supabase.auth.getUser();
  if (user) {
    // Consulta la tabla usuarios para traer nombre y apellido
    const { data, error } = await supabase
      .from('usuarios')
      .select('nombre, nombre2, apellido, apellido2, rol')
      .eq('user_id', user.id)
      .single();

    let nombreCompleto = "";
if (data) {
  nombreCompleto = [data.nombre, data.nombre2, data.apellido, data.apellido2]
    .filter(Boolean).join(' ');
  document.getElementById('userNombre').textContent = nombreCompleto || "(Sin nombre)";
  document.getElementById('userRol').textContent = data.rol || "(Sin rol)";
} else {
  document.getElementById('userNombre').textContent = "(Sin nombre)";
  document.getElementById('userRol').textContent = "(Sin rol)";
}
    document.getElementById('userEmail').textContent = user.email || "(Sin correo)";
  }
  // Logout
  document.getElementById('cerrarSesionBtn').addEventListener('click', () => {
    supabase.auth.signOut();
    localStorage.clear();
    window.location.href = 'login.html';
  });
});
