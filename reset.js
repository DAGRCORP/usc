const supabase = window.supabase.createClient('https://lxlmoylexavqxnhxdhbz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bG1veWxleGF2cXhuaHhkaGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTAxNzksImV4cCI6MjA2NTc2NjE3OX0.sYqG2AvlrsdRQaC5i4CsTzWwDt1n9AzYsViZelyZDZ4');

document.getElementById('resetBtn').addEventListener('click', async () => {
  const clave = document.getElementById('nuevaClave').value.trim();
  const confirma = document.getElementById('confirmaClave').value.trim();
  const msg = document.getElementById('resetMsg');
  msg.textContent = "";

  if (!clave || !confirma) {
    msg.textContent = "Completa ambos campos.";
    return;
  }
  if (clave !== confirma) {
    msg.textContent = "Las contraseñas no coinciden.";
    return;
  }
  if (clave.length < 8) {
    msg.textContent = "La contraseña debe tener al menos 8 caracteres.";
    return;
  }

  // Supabase detecta el link de recuperación en la URL, así que solo debes actualizar:
  const { data, error } = await supabase.auth.updateUser({
    password: clave
  });

  if (error) {
    msg.textContent = "Error al actualizar la contraseña: " + error.message;
  } else {
    msg.style.color = "green";
    msg.textContent = "Contraseña cambiada con éxito. Puedes iniciar sesión.";
    setTimeout(() => window.location.href = 'login.html', 2500);
  }
});
