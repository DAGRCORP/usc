document.addEventListener('DOMContentLoaded', function() {
  loadFolders();
  });
  const folderList = document.getElementById('folderList');
  const folderView = document.getElementById('folderView');
  let fileSystem = [];
  // 1) Cargar las carpetas desde tu flujo Power Automate
  async function loadFolders(path = '/Documentos/Formularios') {
    try {
      const res = await fetch('https://prod-103.westus.logic.azure.com:443/workflows/223f2f41a9124b349bd876609a0ca948/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_3QpIG2JSEFkuNXvFXjKp5fOP3S8UnOIv4jjexuUPcI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath: path })
      });
      if (!res.ok) throw new Error(res.statusText);
      const archivos = await res.json();
      const items = Array.isArray(archivos.archivos) ? archivos.archivos.flat() : [];

if (!Array.isArray(items) || !items.length) {
  console.error("Respuesta inesperada del flujo:", archivos);
  throw new Error("El flujo no devolvió archivos válidos.");
}
      const agrupado = {};
      items.forEach(item => {
        const folderName = (item.path || '').split('/').filter(p => p).slice(-1)[0] || item.name || "Desconocido";
        if (!agrupado[folderName]) {
          agrupado[folderName] = {
            name: folderName,
            files: []
          };
        }
        agrupado[folderName].files.push({
          name: item.name || 'Archivo',
  createdBy: item.lastModifiedBy?.user?.displayName || '—',
  createdAt: item.created || '—',
  modifiedAt: item.lastModified || '—',
  url: item.webUrl || '#'
        });
      });
      fileSystem = Object.values(agrupado);
      console.log("Respuesta del flujo:", fileSystem);
if (fileSystem.length === 0) {
  folderView.innerHTML = '<p>No se encontraron carpetas con archivos.</p>';
  folderList.innerHTML = '<li style="color: gray;">(Sin carpetas disponibles)</li>';
} else {
  renderFolderList();
  renderizarListaArchivos();
  showFolder(0);
}
    } catch (err) {
      console.error('Error cargando carpetas:', err);
      folderView.innerHTML = `<p style="color:red;">Error al cargar carpetas.</p>`;
    }
  }
  // 2) Pinta la lista de carpetas
  function renderFolderList() {
    folderList.innerHTML = '';
    fileSystem.forEach((folder, idx) => {
      const li = document.createElement('li');
      li.textContent = folder.name || '(Sin nombre)';
      li.addEventListener('click', () => showFolder(idx));
      folderList.appendChild(li);
    });
  }
  // 3) Pinta el contenido de una carpeta
  function showFolder(index) {
    const folder = fileSystem[index];
    const archivos = folder.files || [];
    let tableBody = '';
  
    if (archivos.length === 0) {
      tableBody = `<tr><td colspan="4" style="text-align:center; color: gray;">📂 Esta carpeta no contiene archivos</td></tr>`;
    } else {
      tableBody = archivos.map(file => `
        <tr>
          <td>${file.name}</td>
          <td>${file.createdBy || '—'}</td>
          <td>${file.createdAt || '—'}</td>
          <td>${file.modifiedAt || '—'}</td>
        </tr>
      `).join('');
    }
  
    folderView.innerHTML = `
      <p class="folder-title">${folder.name || 'Desconocido'}</p>
      <table>
        <thead>
          <tr>
            <th>Nombre de Archivo</th>
            <th>Creado Por</th>
            <th>Fecha Creación</th>
            <th>Fecha Modificación</th>
          </tr>
        </thead>
        <tbody>${tableBody}</tbody>
      </table>
    `;
  }
  
  
  // 4) Arranca todo al cargar la página
  function renderizarListaArchivos() {
    const tabla = document.getElementById("listaArchivos");
    if (!tabla) return;
  
    tabla.innerHTML = '';
  
    // Si no hay carpetas en absoluto
    if (fileSystem.length === 0) {
      const fila = document.createElement("tr");
      fila.innerHTML = `<td colspan="4" style="text-align: center; color: gray;">No hay carpetas para mostrar</td>`;
      tabla.appendChild(fila);
      return;
    }
  
    fileSystem.forEach(folder => {
      const archivos = Array.isArray(folder.files) ? folder.files : [];
      const docx = archivos.find(file => file.name && file.name.endsWith(".docx"));
      const json = archivos.find(file => file.name && file.name.endsWith(".json"));
  
      const fila = document.createElement("tr");
  
      if (!docx && !json) {
        fila.innerHTML = `
          <td>${folder.name}</td>
          <td colspan="3" style="text-align:center; color: gray;">📂 Esta carpeta no contiene archivos .docx ni .json</td>
        `;
      } else {
        fila.innerHTML = `
          <td>${folder.name}</td>
          <td>${docx ? `<a href="${docx.url}" download>📥 Descargar</a>` : '—'}</td>
          <td>${json ? `<a href="${json.url}" download>📂 Descargar</a>` : '—'}</td>
          <td>
            ${json ? `<button onclick="abrirFormulario('${json.url}')">✏️ Editar</button>` : '—'}
          </td>
        `;
      }
  
      tabla.appendChild(fila);
    });
  }
  
  function abrirFormulario(rutaJson) {
    localStorage.setItem("archivoParaCargar", rutaJson);
    window.location.href = "index.html"; // o revision.html según tu flujo
}
async function crearNuevaCarpeta() {
  const nombre = prompt("Nombre del nuevo programa (carpeta):");
  if (!nombre) return;

  try {
    const res = await fetch('https://<TU-FLUJO-CREAR-CARPETA>', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderName: nombre })
    });

    if (!res.ok) throw new Error("No se pudo crear la carpeta");
    alert("Carpeta creada con éxito");
    loadFolders(); // recarga vista
  } catch (err) {
    console.error("Error creando carpeta:", err);
    alert("Error al crear carpeta");
  }
}
