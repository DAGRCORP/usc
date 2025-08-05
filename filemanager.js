
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabaseUrl = 'https://lxlmoylexavqxnhxdhbz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bG1veWxleGF2cXhuaHhkaGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTAxNzksImV4cCI6MjA2NTc2NjE3OX0.sYqG2AvlrsdRQaC5i4CsTzWwDt1n9AzYsViZelyZDZ4';
const supabase = createClient(supabaseUrl, supabaseKey);
window.verTableroEstado = function(nombrePrograma, nombreJson) {
  const url = `tablero.html?programa=${encodeURIComponent(nombrePrograma)}&json=${encodeURIComponent(nombreJson)}`;
  window.open(url, '_blank');
};
window.abrirTableroUltimoJson = async function(nombreCarpeta) {
  const { data: archivos, error } = await supabase.storage
    .from('documentos')
    .list(`documentos/${nombreCarpeta}/versiones/`, { limit: 100 });

  if (error || !archivos || archivos.length === 0) {
    alert("❌ No se encontraron versiones para mostrar.");
    return;
  }

  const jsons = archivos.filter(a => a.name.endsWith('.json'));

  let jsonMasReciente = null;
  let fechaMasReciente = 0;

  for (const archivo of jsons) {
    try {
      const ruta = `documentos/${nombreCarpeta}/versiones/${archivo.name}`;
      const { data: fileData } = await supabase.storage.from('documentos').download(ruta);
      if (fileData) {
        const texto = await fileData.text();
        const obj = JSON.parse(texto);
        const fecha = new Date(obj.fecha || obj.updated_at || obj.created_at || 0).getTime();
        if (fecha > fechaMasReciente) {
          fechaMasReciente = fecha;
          jsonMasReciente = archivo.name;
        }
      }
    } catch (e) {
      console.warn("Error leyendo archivo JSON:", archivo.name, e);
    }
  }

  // Fallback: si no hay fechas dentro del contenido, toma el último por nombre
  if (!jsonMasReciente && jsons.length > 0) {
    jsonMasReciente = jsons[jsons.length - 1].name;
  }

  if (!jsonMasReciente) {
    alert("❌ No se pudo determinar el último JSON.");
    return;
  }

  const url = `tablero.html?programa=${encodeURIComponent(nombreCarpeta)}&json=${encodeURIComponent(jsonMasReciente)}`;
  window.open(url, '_blank');
};

document.addEventListener('DOMContentLoaded', () => {
  listarCarpetas();
  const btnNuevo = document.getElementById('btnNuevoPrograma');
  btnNuevo?.addEventListener('click', async () => {
    const nombre = prompt("Nombre del programa académico:");
    if (!nombre) return;
    const placeholder = new Blob(['creado'], { type: 'text/plain' });
    // Crear carpeta base y subcarpeta versiones
    await supabase.storage.from('documentos').upload(`documentos/${nombre}/__init__.txt`, placeholder, { upsert: true });
    await supabase.storage.from('documentos').upload(`documentos/${nombre}/versiones/__init__.txt`, placeholder, { upsert: true });
    alert(`✅ Programa '${nombre}' creado con éxito.`);
    listarCarpetas(); // recargar la lista
  });
});
// Vista previa PDF
window.verArchivo = function(ruta) {
  const url = supabase.storage.from('documentos').getPublicUrl(ruta).data.publicUrl;
  const visor = document.getElementById('visorPDF');
  visor.src = url;
  visor.style.display = 'block';
  document.getElementById('visorJSON').style.display = 'none';
  visor.scrollIntoView({behavior: "smooth"});
}
// Vista previa JSON
window.verJSON = async function(ruta) {
  const { data, error } = await supabase.storage.from('documentos').download(ruta);
  if (error) return alert("No se pudo cargar el JSON");
  const json = await data.text();
  const visor = document.getElementById('visorJSON');
  visor.textContent = JSON.stringify(JSON.parse(json), null, 2);
  visor.style.display = 'block';
  document.getElementById('visorPDF').style.display = 'none';
  visor.scrollIntoView({behavior: "smooth"});
}
// Eliminar archivo
window.eliminarArchivo = async function(ruta) {
  if (!confirm('¿Seguro que deseas eliminar este archivo?')) return;
  const { error } = await supabase.storage.from('documentos').remove([ruta]);
  if (!error) {
    alert("Archivo eliminado.");
    // Extrae el nombre de la carpeta
    const partes = ruta.split('/');
    const nombreCarpeta = partes[1];
    mostrarContenidoCarpeta(nombreCarpeta);
  } else {
    alert("No se pudo eliminar.");
  }
}
// Mostrar/ocultar fila detalles
window.toggleDetalles = function(idx) {
  const fila = document.getElementById(`detalles-${idx}`);
  fila.style.display = fila.style.display === 'none' ? '' : 'none';
};
// Listar carpetas raíz
// Lista las carpetas de programas (nivel 1)
async function listarCarpetas() {
  const { data, error } = await supabase.storage.from('documentos').list('documentos/', { limit: 100 });
  const tbody = document.getElementById('listaArchivos');
  tbody.innerHTML = '';
  // Mostrar cada carpeta como fila desplegable
  data?.filter(item => item.name && item.metadata === null).forEach((carpeta, idx) => {
    // Fila principal (la carpeta)
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="cursor:pointer;font-weight:600" onclick="toggleCarpeta(${idx},'${carpeta.name}')">
        📁 ${carpeta.name}
      </td>
      <td colspan="3">--</td>
    `;
    tbody.appendChild(tr);
    // Fila oculta con archivos (por desplegar)
    const trArchivos = document.createElement('tr');
    trArchivos.id = `archivos-carpeta-${idx}`;
    trArchivos.style.display = 'none';
    trArchivos.innerHTML = `<td colspan="4"><div id="contenido-carpeta-${idx}" style="padding-left:2em;"></div></td>`;
    tbody.appendChild(trArchivos);
  });
}
// Al dar click en la carpeta, carga solo PDFs y JSON y despliega el contenido
// Desplegar contenido de carpeta principal
window.toggleCarpeta = async function(idx, nombreCarpeta) {
  // Toma el rol del usuario del localStorage (asegúrate de guardarlo al hacer login)
  const rolUsuario = localStorage.getItem("rolUsuario") || "";

  const tr = document.getElementById(`archivos-carpeta-${idx}`);
  if (tr.style.display === 'none') {
    // Listar archivos y subcarpetas
    const { data, error } = await supabase.storage.from('documentos').list(`documentos/${nombreCarpeta}/`, { limit: 100 });
    const { data: revisionesData } = await supabase.storage.from('documentos').list(`documentos/${nombreCarpeta}/revisiones/`, { limit: 1000 });
    const contenido = document.getElementById(`contenido-carpeta-${idx}`);
    // Prepara mapa de estados por PDF
    let estadoPorPDF = {};
    if (revisionesData) {
      for (const archivo of revisionesData.filter(a => a.name.endsWith('.json'))) {
        try {
          const { data: fileData } = await supabase.storage.from('documentos').download(`documentos/${nombreCarpeta}/revisiones/${archivo.name}`);
          if (fileData) {
            const txt = await fileData.text();
            const obj = JSON.parse(txt);
            if (obj.version && obj.version.endsWith('.json')) {
              const nombrePDF = obj.version.replace(/\.json$/, '.pdf');
              const comentarios = obj.comentarios || {};
              const total = Object.values(comentarios).length;
              const aprobados = Object.values(comentarios).filter(sec => sec.estado === "aprobado").length;
              const todasAprobadas = total > 0 && aprobados === total;
              if (!estadoPorPDF[nombrePDF] || todasAprobadas) {
                estadoPorPDF[nombrePDF] = {
                  aprobados,
                  total,
                  estado: todasAprobadas ? 'aprobado' : 'pendiente'
                };
              }
            }
          }
        } catch (e) {}
      }
    }
    if (!error && data) {
      const carpetas = data.filter(a => a.name === 'versiones' && a.metadata === null);
      const archivos = data.filter(a => a.name.endsWith('.pdf'));
      let html = '';
      if (archivos.length > 0) {
        html += '<table style="width:98%"><tr><th>Archivo</th><th>Tipo</th><th>Fecha</th><th>Acciones</th><th>Estado</th></tr>';
        archivos.forEach(archivo => {
          const ruta = `documentos/${nombreCarpeta}/${archivo.name}`;
          const url = supabase.storage.from('documentos').getPublicUrl(ruta).data.publicUrl;
          const fecha = archivo.metadata?.lastModified ? new Date(archivo.metadata.lastModified).toLocaleString() : '-';
          let estado = '<span style="color:#bbb;" title="Sin revisión">-</span>';
          if (estadoPorPDF[archivo.name]) {
            const { aprobados, total, estado: est } = estadoPorPDF[archivo.name];
            if (est === 'aprobado') {
              estado = `<span style="color:#218738; font-weight:700;" title="Aprobado">✔️</span> <span style="font-size:0.9em;color:#555;">${aprobados}/${total}</span>`;
            } else {
              estado = `<span style="color:#ca0; font-weight:700;" title="Pendiente de aprobación">⏳</span> <span style="font-size:0.9em;color:#555;">${aprobados}/${total}</span>`;
            }
          }
          const nombreJsonRelacionado = archivo.name.replace('.pdf', '.json');
html += `<tr>
  <td>${archivo.name}</td>
  <td>PDF</td>
  <td>${fecha}</td>
  <td>
    <button class="boton-tabla" onclick="verArchivo('${ruta}')">Vista previa</button>
    ${rolUsuario !== "revisor" ? `<a class="boton-tabla" href="${url}" download target="_blank">Descargar</a>` : ''}
    ${rolUsuario !== "revisor" ? `<button class="boton-tabla" onclick="eliminarArchivo('${ruta}')">Eliminar</button>` : ''}
    ${rolUsuario !== "revisor" ? `<button class="boton-tabla" onclick="abrirEditarDocumento('${nombreCarpeta}')">Editar</button>` : ''}
    <button class="boton-tabla" onclick="abrirRevisionDocumento('${nombreCarpeta}')">Revisar</button>
  </td>
  <td style="text-align:center;">
    ${estado}
    <br/><button class="boton-tabla" onclick="abrirTableroUltimoJson('${nombreCarpeta}')">📊</button>
</td>
</tr>`;

        });
        html += '</table>';
      }
      // Si hay subcarpeta 'versiones', agrega fila para desplegarla
      if (carpetas.length > 0) {
        html += `
          <div style="margin-top:1em;">
            <span style="cursor:pointer; font-weight:600; color:#2069b4;"
              onclick="window.lastSpanVersiones=this; toggleVersiones('${nombreCarpeta}', this)">
              ▶️ versiones
            </span>
            <div id="contenido-versiones-${nombreCarpeta}" style="display:none;"></div>
          </div>
        `;
      }
      contenido.innerHTML = html || '<i>No hay archivos PDF en esta carpeta.</i>';
    } else {
      contenido.innerHTML = '<i>Error al cargar archivos.</i>';
    }
    tr.style.display = '';
  } else {
    tr.style.display = 'none';
  }
};
// Desplegar los JSON de la subcarpeta 'versiones'
// Variable global temporal para alternar orden
// Variable global para orden descendente/ascendente
// Global para alternar orden de versiones
window.ordenVersionesDesc = true;
window.toggleVersiones = async function(nombreCarpeta, spanEl) {
  const cont = document.getElementById(`contenido-versiones-${nombreCarpeta}`);
  if (!cont) return;
  if (cont.style.display === "block") {
    cont.style.display = "none";
    spanEl.textContent = "▶️ versiones";
    return;
  }
  spanEl.textContent = "▼ versiones";
  cont.style.display = "block";
  cont.innerHTML = '<i>Cargando versiones...</i>';
  // Carga archivos y revisiones
  const { data, error } = await supabase.storage.from('documentos').list(`documentos/${nombreCarpeta}/versiones/`, { limit: 1000 });
  const { data: revisionesData } = await supabase.storage.from('documentos').list(`documentos/${nombreCarpeta}/revisiones/`, { limit: 1000 });
  if (error) {
    cont.innerHTML = '<i>Error al cargar versiones.</i>';
    return;
  }
  const archivos = data.filter(a => a.name.endsWith('.json'));
  // Estado de revisión por versión
  let estadoPorVersionJson = {};
  if (revisionesData) {
    for (const archivo of revisionesData.filter(a => a.name.endsWith('.json'))) {
      try {
        const { data: fileData } = await supabase.storage.from('documentos').download(`documentos/${nombreCarpeta}/revisiones/${archivo.name}`);
        if (fileData) {
          const txt = await fileData.text();
          const obj = JSON.parse(txt);
          if (obj.version && obj.version.endsWith('.json')) {
            const comentarios = obj.comentarios || {};
            const total = Object.values(comentarios).length;
            const aprobados = Object.values(comentarios).filter(sec => sec.estado === "aprobado").length;
            const todasAprobadas = total > 0 && aprobados === total;
            if (!estadoPorVersionJson[obj.version] || todasAprobadas) {
              estadoPorVersionJson[obj.version] = {
                aprobados,
                total,
                estado: todasAprobadas ? 'aprobado' : 'pendiente'
              };
            }
          }
        }
      } catch (e) {}
    }
  }
  // Guarda para render dinámico
  window.archivosVersiones = archivos;
  window.estadoPorVersionJson = estadoPorVersionJson;
  // Renderiza tabla
  window.renderTablaVersiones(nombreCarpeta, archivos, estadoPorVersionJson);
};
window.renderTablaVersiones = async function(nombreCarpeta, archivos, estadoPorVersionJson) {
  const rolUsuario = localStorage.getItem("rolUsuario") || "";
  let html = `<table class="tabla-archivos"><tr>
      <th>Versión</th>
      <th>
        Fecha
        <button title="Alternar orden" style="margin-left:4px;padding:2px 5px;font-size:1em;cursor:pointer;"
          onclick="window.ordenVersionesDesc = !window.ordenVersionesDesc; window.renderTablaVersiones('${nombreCarpeta}', window.archivosVersiones, window.estadoPorVersionJson);"
        >
          ${window.ordenVersionesDesc ? '⬇️' : '⬆️'}
        </button>
      </th>
      <th>Autor</th>
      <th>Revisores</th>
      <th>Acciones</th>
      <th>Estado</th>
    </tr>`;
  // Ordenar según la variable global
  archivos.sort((a, b) => {
    const numA = parseInt(a.name.match(/(\d+)\.json$/)?.[1] || 0, 10);
    const numB = parseInt(b.name.match(/(\d+)\.json$/)?.[1] || 0, 10);
    return numB - numA;
  });

  for (const archivo of archivos) {
    const ruta = `documentos/${nombreCarpeta}/versiones/${archivo.name}`;
    const url = supabase.storage.from('documentos').getPublicUrl(ruta).data.publicUrl;
    const fecha = archivo.metadata?.lastModified
      ? new Date(archivo.metadata.lastModified).toLocaleString()
      : '-';
    // Estado de revisión
    let estado = '<span style="color:#bbb;" title="Sin revisión">-</span>';
    let aprobadoTotal = false;
    if (estadoPorVersionJson[archivo.name]) {
      const { aprobados, total, estado: est } = estadoPorVersionJson[archivo.name];
      aprobadoTotal = (est === 'aprobado' && aprobados === 151 && total === 151);
      if (est === 'aprobado') {
        estado = `<span style="color:#218738; font-weight:700;" title="Aprobado">✔️</span> <span style="font-size:0.9em;color:#555;">${aprobados}/${total}</span>`;
      } else {
        estado = `<span style="color:#ca0; font-weight:700;" title="Pendiente de aprobación">⏳</span> <span style="font-size:0.9em;color:#555;">${aprobados}/${total}</span>`;
      }
    }
  
    // Leer autor y revisores del JSON (siempre mostrar aunque estén vacíos)
    let autor = "-";
    let revisores = "-";
    try {
      const { data: fileData } = await supabase.storage.from('documentos').download(ruta);
      if (fileData) {
        const txt = await fileData.text();
        const obj = JSON.parse(txt);
        // AUTOR
        autor = obj.autor || "-";
        // REVISOR(ES)
        if (Array.isArray(obj.revisado_por)) {
          revisores = obj.revisado_por.length > 0 ? obj.revisado_por.join(', ') : "-";
        } else if (obj.revisor) {
          revisores = obj.revisor;
        }
      }
    } catch (e) {
      autor = "-";
      revisores = "-";
    }
  
    // Acciones (igual a lo que ya tienes)
    let acciones = `<button class="boton-tabla" onclick="verJSON('${ruta}')">Ver JSON</button>`;
    if (
      rolUsuario === "admin" ||
      (rolUsuario === "editor" && aprobadoTotal)
    ) {
      acciones += `<a class="boton-tabla" href="${url}" download target="_blank">Descargar</a>`;
    }
    if (rolUsuario === "admin") {
      acciones += `<button class="boton-tabla" onclick="eliminarArchivo('${ruta}')">Eliminar</button>`;
      acciones += `<button class="boton-tabla" onclick="abrirEditarJson('${nombreCarpeta}','${archivo.name}')">Editar</button>`;
    }
    if (rolUsuario === "admin" || rolUsuario === "revisor") {
      acciones += `<button class="boton-tabla" onclick="abrirRevisionConBusqueda('${nombreCarpeta}','${archivo.name}')">Revisar</button>`;
    }
  
    html += `<tr>
      <td>${archivo.name}</td>
      <td>${fecha}</td>
      <td>${autor}</td>
      <td>${revisores}</td>
      <td>${acciones}</td>
      <td style="text-align:center;">${estado}</td>
    </tr>`;
  }
  
  html += '</table>';
  document.getElementById(`contenido-versiones-${nombreCarpeta}`).innerHTML = html;
};

window.abrirRevisionConBusqueda = async function(nombreCarpeta, nombreJson) {
  // Buscar revisiones existentes para este avance
  const { data: revisiones, error: err2 } = await supabase.storage
    .from('documentos')
    .list(`documentos/${nombreCarpeta}/revisiones/`, { limit: 1000 });
  let ultimaRevision = null;
  let fechaUltima = 0;
  if (!err2 && revisiones) {
    for (const archivo of revisiones.filter(a => a.name.endsWith('.json'))) {
      try {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('documentos')
          .download(`documentos/${nombreCarpeta}/revisiones/${archivo.name}`);
        if (!fileError && fileData) {
          const txt = await fileData.text();
          const obj = JSON.parse(txt);
          if (obj.version === nombreJson) {
            const fecha = new Date(obj.fecha).getTime() || 0;
            if (fecha > fechaUltima) {
              ultimaRevision = archivo.name;
              fechaUltima = fecha;
            }
          }
        }
      } catch (e) {}
    }
  }
  // Si existe revisión previa, la pasa en la URL
  if (ultimaRevision) {
    window.location.href = `revision.html?programa=${encodeURIComponent(nombreCarpeta)}&json=${encodeURIComponent(nombreJson)}&revision=${encodeURIComponent(ultimaRevision)}`;
    return;
  }
  // Si no hay revisión, solo va con el avance JSON
  window.location.href = `revision.html?programa=${encodeURIComponent(nombreCarpeta)}&json=${encodeURIComponent(nombreJson)}`;
};
// Editar PDF: carga el JSON más reciente
window.abrirEditarDocumento = async function(nombreCarpeta) {
  // Buscar el JSON más reciente en 'versiones'
  const { data, error } = await supabase.storage
    .from('documentos')
    .list(`documentos/${nombreCarpeta}/versiones/`, { limit: 100 });
  if (error) {
    window.location.href = `index.html?programa=${encodeURIComponent(nombreCarpeta)}`;
    return;
  }
  const jsons = data.filter(a => a.name.endsWith('.json'));
  if (!jsons.length) {
    window.location.href = `index.html?programa=${encodeURIComponent(nombreCarpeta)}`;
    return;
  }
  // El más reciente
  jsons.sort((a, b) => (b.metadata.lastModified || 0) - (a.metadata.lastModified || 0));
  const jsonActual = jsons[jsons.length - 1].name;
  window.location.href = `index.html?programa=${encodeURIComponent(nombreCarpeta)}&json=${encodeURIComponent(jsonActual)}`;
};
window.abrirRevisionDocumento = async function(nombreCarpeta) {
  // 1. Busca la última versión JSON (avance)
  const { data: versiones, error: err1 } = await supabase.storage
    .from('documentos')
    .list(`documentos/${nombreCarpeta}/versiones/`, { limit: 1000 });
  if (err1 || !versiones) return;
  // 2. Consigue el JSON más reciente (por fecha)
  const jsons = versiones.filter(a => a.name.endsWith('.json'));
  if (!jsons.length) return;
  jsons.sort((a, b) => (b.metadata.lastModified || 0) - (a.metadata.lastModified || 0));
  const jsonActual = jsons[jsons.length - 1].name;
  // 3. Busca si existe una revisión enlazada a este avance
  const { data: revisiones, error: err2 } = await supabase.storage
    .from('documentos')
    .list(`documentos/${nombreCarpeta}/revisiones/`, { limit: 1000 });
  let ultimaRevision = null;
  let fechaUltima = 0;
  if (!err2 && revisiones) {
    for (const archivo of revisiones.filter(a => a.name.endsWith('.json'))) {
      try {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('documentos')
          .download(`documentos/${nombreCarpeta}/revisiones/${archivo.name}`);
        if (!fileError && fileData) {
          const txt = await fileData.text();
          const obj = JSON.parse(txt);
          if (obj.version === jsonActual) {
            const fecha = new Date(obj.fecha).getTime() || 0;
            if (fecha > fechaUltima) {
              ultimaRevision = archivo.name;
              fechaUltima = fecha;
            }
          }
        }
      } catch (e) {}
    }
  }
  // 4. Redirige con los parámetros necesarios
  if (ultimaRevision) {
    window.location.href = `revision.html?programa=${encodeURIComponent(nombreCarpeta)}&json=${encodeURIComponent(jsonActual)}&revision=${encodeURIComponent(ultimaRevision)}`;
  } else {
    window.location.href = `revision.html?programa=${encodeURIComponent(nombreCarpeta)}&json=${encodeURIComponent(jsonActual)}`;
  }
};
// Editar JSON: carga ese JSON en específico
window.abrirEditarJson = function(nombreCarpeta, nombreJson) {
  window.location.href = `index.html?programa=${encodeURIComponent(nombreCarpeta)}&json=${encodeURIComponent(nombreJson)}`;
};
// Mostrar archivos dentro de carpeta
async function mostrarContenidoCarpeta(nombreCarpeta) {
  const { data, error } = await supabase.storage.from('documentos').list(`documentos/${nombreCarpeta}/`, { limit: 100 });
  document.getElementById('tituloCarpeta').textContent = `📂 ${nombreCarpeta}/`;
  // Limpia visores
  document.getElementById('visorPDF').style.display = 'none';
  document.getElementById('visorJSON').style.display = 'none';
  // Renderiza la tabla de archivos
  renderTablaArchivos(data, nombreCarpeta);
  // Botón para editar el programa
  const contenedor = document.getElementById('archivosEnCarpeta');
  contenedor.innerHTML = '';
  const editarBtn = document.createElement('button');
  editarBtn.textContent = '✏️ Editar programa';
  editarBtn.className = 'btn-crear';
  editarBtn.onclick = () => {
    window.location.href = `index.html?programa=${encodeURIComponent(nombreCarpeta)}`;
  };
  contenedor.appendChild(editarBtn);
  // Botón para crear documento (si no hay PDF)
  const hayPDF = data && data.some(archivo => archivo.name.endsWith('.pdf'));
  if (!hayPDF) {
    const crearBtn = document.createElement('button');
    crearBtn.textContent = '📄 Crear documento';
    crearBtn.className = 'btn-crear';
    crearBtn.onclick = () => {
      const confirmar = confirm(`¿Deseas crear un nuevo documento para el programa "${nombreCarpeta}"?`);
      if (confirmar) {
        window.location.href = `index.html?programa=${encodeURIComponent(nombreCarpeta)}`;
      }
    };
    contenedor.appendChild(crearBtn);
  }
  if (error) {
    console.error("Error al mostrar archivos:", error);
  }
}
// Ahora, muestra la subcarpeta revisiones:
//const revisiones = await supabase.storage.from('documentos').list(`documentos/${nombreCarpeta}/revisiones/`, { limit: 100 });
//if (!revisiones.error && revisiones.data && revisiones.data.length > 0) {
//  html += `<div style="margin-top:1em;">
//    <span style="cursor:pointer; font-weight:600; color:#a85e00;" onclick="toggleRevisiones('${nombreCarpeta}', this)">
//      ▶️ revisiones
//    </span>
//    <div id="contenido-revisiones-${nombreCarpeta}" style="display:none;"></div>
//  </div>`;
//}
window.toggleRevisiones = async function(nombreCarpeta, span) {
  const cont = document.getElementById(`contenido-revisiones-${nombreCarpeta}`);
  if (!cont) return;
  if (cont.style.display === 'none') {
    cont.innerHTML = '<i>Cargando revisiones...</i>';
    // Cargar revisiones
    const { data, error } = await supabase.storage.from('documentos').list(`documentos/${nombreCarpeta}/revisiones/`, { limit: 1000 });
    if (!error && data) {
      let html = `<table class="tabla-archivos">
        <tr>
          <th>Archivo</th>
          <th>Versión vinculada</th>
          <th>Revisores</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>`;
      // Ordena por fecha descendente (más nuevo primero)
      const archivosJson = data.filter(a => a.name.endsWith('.json'));
archivosJson.sort((a, b) => {
  const numA = parseInt(a.name.match(/(\d+)\.json$/)?.[1] || 0, 10);
  const numB = parseInt(b.name.match(/(\d+)\.json$/)?.[1] || 0, 10);
  return numB - numA;
});
      for (const archivo of archivosJson) {
        let versionVinculada = '---';
        let fecha = archivo.metadata?.lastModified
          ? new Date(archivo.metadata.lastModified).toLocaleString()
          : '-';
        let estadoRevision = '<span style="color:#aaa">-</span>';
        let revisores = "-";
        try {
          const { data: fileData, error: fileError } = await supabase.storage.from('documentos').download(`documentos/${nombreCarpeta}/revisiones/${archivo.name}`);
          if (!fileError && fileData) {
            const txt = await fileData.text();
            const obj = JSON.parse(txt);
            versionVinculada = obj.version || '---';
            // Revisores (pueden ser varios)
            if (Array.isArray(obj.revisado_por)) {
              revisores = obj.revisado_por.length > 0 ? obj.revisado_por.join(', ') : "-";
            } else if (obj.revisor) {
              revisores = obj.revisor;
            }
            // Estado: todas aprobadas o no
            const comentarios = obj.comentarios || {};
            const todasAprobadas = Object.values(comentarios).length > 0 &&
              Object.values(comentarios).every(sec => sec.estado === "aprobado");
            estadoRevision = todasAprobadas
              ? '<span style="color:#218738; font-weight:700;">✅ Aprobado</span>'
              : '<span style="color:#ca0; font-weight:700;">⏳ Pendiente</span>';
          }
        } catch (e) {
          versionVinculada = '---';
          revisores = "-";
        }
        // Acciones según rol
        const rolUsuario = localStorage.getItem("rolUsuario") || "";
    let acciones = `<button class="boton-tabla" onclick="abrirRevisionVersion('${nombreCarpeta}', '${versionVinculada}', '${archivo.name}')">Revisar</button>`;
    if (rolUsuario === "admin") {
      acciones += `<button class="boton-tabla" onclick="eliminarArchivo('documentos/${nombreCarpeta}/revisiones/${archivo.name}')">Eliminar</button>`;
    }
    html += `<tr>
      <td>${archivo.name}</td>
      <td>${versionVinculada}</td>
      <td>${revisores}</td>
      <td style="text-align:center;">${estadoRevision}</td>
      <td>${fecha}</td>
      <td>${acciones}</td>
    </tr>`;
  }
  html += '</table>';
  document.getElementById(`contenido-revisiones-${nombreCarpeta}`).innerHTML = html;
    } else {
      cont.innerHTML = '<i>No hay revisiones guardadas.</i>';
    }
    cont.style.display = '';
    span.innerText = '🔽 revisiones';
  } else {
    cont.style.display = 'none';
    span.innerText = '▶️ revisiones';
  }
};

// Abre revision.html con los 3 parámetros
window.abrirRevisionVersion = function(nombreCarpeta, nombreJson, nombreRevision) {
  window.location.href = `revision.html?programa=${encodeURIComponent(nombreCarpeta)}&json=${encodeURIComponent(nombreJson)}&revision=${encodeURIComponent(nombreRevision)}`;
};
// Renderiza todos los archivos en una tabla moderna
function renderTablaArchivos(data, nombreCarpeta) {
  // 🚩 Toma el rol del usuario
  const rolUsuario = localStorage.getItem("rolUsuario") || "";
  let tabla = document.getElementById('tabla-archivos');
  if (!tabla) {
    tabla = document.createElement('table');
    tabla.id = 'tabla-archivos';
    tabla.className = 'tabla-archivos';
    tabla.innerHTML = `
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Cargar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody id="listaArchivos"></tbody>
    `;
    document.getElementById('archivosEnCarpeta').appendChild(tabla);
  }
  const tbody = tabla.querySelector('#listaArchivos');
  tbody.innerHTML = '';
  const archivosOrdenados = [...(data || [])].filter(a => a.name !== '__init__.txt').sort((a, b) => a.name.localeCompare(b.name));
  if (archivosOrdenados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#2369b3;padding:1.5em;text-align:center;">📭 No hay archivos en este programa.</td></tr>`;
    document.getElementById('visorPDF').style.display = 'none';
    document.getElementById('visorJSON').style.display = 'none';
    return;
  }
  archivosOrdenados.forEach((archivo, idx) => {
    const ext = archivo.name.split('.').pop().toLowerCase();
    const tipoIcon = ext === 'pdf' ? '📄 PDF'
      : ext === 'json' ? '📝 JSON'
      : ext === 'txt' ? '📄 TXT'
      : '📁 Otro';
    const ruta = `documentos/${nombreCarpeta}/${archivo.name}`;
    const url = supabase.storage.from('documentos').getPublicUrl(ruta).data.publicUrl;
    const fecha = archivo.metadata?.lastModified
      ? new Date(archivo.metadata.lastModified).toLocaleString()
      : '-';
    // 🚩 BLOQUE DE ACCIONES ADAPTADO POR ROL
    let acciones = `<button class="boton-tabla" onclick="verJSON('${ruta}')">Ver JSON</button>`;
const estadoRevision = estadoPorVersionJson[archivo.name];
const aprobadoTotal = estadoRevision && estadoRevision.estado === 'aprobado' && estadoRevision.aprobados === 151 && estadoRevision.total === 151;

// Solo muestra Descargar si:
// - Es admin, O
// - Es editor y están los 151/151 aprobados.
if (
  rolUsuario === "admin" ||
  (rolUsuario === "editor" && aprobadoTotal)
) {
  acciones += `<a class="boton-tabla" href="${url}" download target="_blank">Descargar</a>`;
}
// Solo admin puede eliminar o editar
if (rolUsuario === "admin") {
  acciones += `<button class="boton-tabla" onclick="eliminarArchivo('${ruta}')">Eliminar</button>`;
  acciones += `<button class="boton-tabla" onclick="abrirEditarJson('${nombreCarpeta}','${archivo.name}')">Editar</button>`;
}
// Solo admin y revisor pueden revisar
if (rolUsuario === "admin" || rolUsuario === "revisor") {
  acciones += `<button class="boton-tabla" onclick="abrirRevisionConBusqueda('${nombreCarpeta}','${archivo.name}')">Revisar</button>`;
}
    // Fila principal
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="cursor:pointer;" onclick="toggleDetalles(${idx})"><b>${archivo.name}</b></td>
      <td>${tipoIcon}</td>
      <td>${fecha}</td>
      <td>${acciones}</td>
      <td>${eliminar}</td>
    `;
    tbody.appendChild(tr);

    // Fila detalles (oculta por defecto)
    const trDetalles = document.createElement('tr');
    trDetalles.className = 'fila-detalles';
    trDetalles.style.display = 'none';
    trDetalles.id = `detalles-${idx}`;
    trDetalles.innerHTML = `<td colspan="5">
      <div><b>Ruta:</b> ${ruta}</div>
      <div><b>Peso:</b> ${archivo.metadata?.size || '-'} bytes</div>
      <div><b>Última modificación:</b> ${fecha}</div>
    </td>`;
    tbody.appendChild(trDetalles);
  });
}
async function abrirEditarDocumento(nombrePrograma) {
  // Lista JSON en la carpeta versiones
  const { data, error } = await supabase.storage
    .from('documentos')
    .list(`documentos/${nombrePrograma}/versiones/`, { limit: 100 });
  if (error) {
    alert('No se pudieron listar versiones.');
    return;
  }
  // Filtrar solo archivos JSON
  const jsons = data.filter(a => a.name.endsWith('.json'));
  if (!jsons.length) {
    // Si no hay JSON, redirige solo con ?programa=...
    window.location.href = `index.html?programa=${encodeURIComponent(nombrePrograma)}`;
    return;
  }
  // Elegir el más reciente por fecha de modificación
  jsons.sort((a, b) => {
    const numA = parseInt(a.name.match(/(\d+)\.json$/)?.[1] || 0, 10);
    const numB = parseInt(b.name.match(/(\d+)\.json$/)?.[1] || 0, 10);
    return numB - numA;
  });
  const jsonActual = jsons[0].name; // el más reciente ahora es el primero
  // Redirigir al formulario con el nombre del JSON más actual (en query string)
  window.location.href = `index.html?programa=${encodeURIComponent(nombrePrograma)}&json=${encodeURIComponent(jsonActual)}`;
  window.verArchivo = function(ruta) { /* ... igual a tu función actual ... */ }
window.verJSON = async function(ruta) { /* ... igual a tu función actual ... */ }
window.eliminarArchivo = async function(ruta) { /* ... igual a tu función actual ... */ }
window.abrirEditarDocumento = async function(nombreCarpeta) { /* ... igual a la de versiones más actual ... */ }
window.abrirRevision = function(nombreCarpeta, nombreJson) {
  window.location.href = `revision.html?programa=${encodeURIComponent(nombreCarpeta)}&json=${encodeURIComponent(nombreJson)}`;
};
const supabase = window.supabase.createClient('https://lxlmoylexavqxnhxdhbz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bG1veWxleGF2cXhuaHhkaGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTAxNzksImV4cCI6MjA2NTc2NjE3OX0.sYqG2AvlrsdRQaC5i4CsTzWwDt1n9AzYsViZelyZDZ4');
supabase.auth.getUser().then(({ data: { user } }) => {
  if (!user) {
    window.location.href = "login.html";
  }
});
}
