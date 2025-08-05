const SUPABASE_URL = 'https://lxlmoylexavqxnhxdhbz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bG1veWxleGF2cXhuaHhkaGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTAxNzksImV4cCI6MjA2NTc2NjE3OX0.sYqG2AvlrsdRQaC5i4CsTzWwDt1n9AzYsViZelyZDZ4';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("registroForm").addEventListener("submit", async function(e){
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const correo = document.getElementById("correo").value.trim().toLowerCase();
  const rol = document.getElementById("rol").value;
  const password = document.getElementById("password").value;
  const mensajeDiv = document.getElementById("mensaje");

  mensajeDiv.textContent = "Procesando...";

  // 1. Crea el usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: correo,
    password: password
  });

  if (authError) {
    mensajeDiv.textContent = "❌ Error creando usuario (Auth): " + authError.message;
    return;
  }

  // 2. Inserta los datos en la tabla usuarios
  const { data, error } = await supabase
    .from("usuarios")
    .insert([{
      nombre,
      apellido,
      correo,
      rol
    }]);

  if (error) {
    mensajeDiv.textContent = "❌ Error guardando datos en la base: " + error.message;
  } else {
    mensajeDiv.textContent = "✅ Usuario creado exitosamente. Revisa tu correo para activar la cuenta.";
    document.getElementById("registroForm").reset();
  }
});
