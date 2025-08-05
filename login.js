// Inicializa Supabase (pon tu URL y KEY)
const supabase = window.supabase.createClient('https://lxlmoylexavqxnhxdhbz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bG1veWxleGF2cXhuaHhkaGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTAxNzksImV4cCI6MjA2NTc2NjE3OX0.sYqG2AvlrsdRQaC5i4CsTzWwDt1n9AzYsViZelyZDZ4');
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const loginMsg = document.getElementById('loginMsg');
  loginMsg.textContent = "";
  if (!email || !password) {
    loginMsg.textContent = "Por favor completa ambos campos.";
    return;
  }
  // Intenta el login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    loginMsg.textContent = "Correo o contraseña incorrectos.";
    return;
  }
  const correo = data.user.email;
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select('nombre, apellido, apellido2, correo, rol')
    .eq('correo', correo)
    .single();
  
  if (errorUsuario || !usuario) {
    loginMsg.textContent = "No se pudo obtener la información del usuario.";
    return;
  }
  // Guarda el rol y nombre corto en localStorage
  localStorage.setItem("rolUsuario", usuario.rol);
  const nombreUsuarioCorto = `${(usuario.nombre || '').split(' ')[0]} ${usuario.apellido || ''} ${usuario.apellido2 || ''}`.trim();
  localStorage.setItem("nombreUsuarioCorto", nombreUsuarioCorto);
  localStorage.setItem("usuarioCorreo", usuario.correo || "");
  window.location.href = "archivosguardados.html";
  
});
document.getElementById('recuperarLink').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const loginMsg = document.getElementById('loginMsg');
  if (!email) {
    loginMsg.textContent = "Primero escribe tu correo en el campo Correo electrónico.";
    return;
  }
  // Envía el correo de recuperación
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/reset.html'
  });
  if (error) {
    loginMsg.textContent = "No se pudo enviar el correo de recuperación. Verifica el correo.";
  } else {
    loginMsg.style.color = "green";
    loginMsg.textContent = "Correo de recuperación enviado. Revisa tu bandeja de entrada.";
  }
});
