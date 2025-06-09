const FLOW_CREATE_URL  = 'https://prod-189.westus.logic.azure.com:443/workflows/1b9b4aaf265545c0aa6823862422f203/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=pPk3lA4Fqqo-f01CRRA1PmMPk4SK3IYybLe3US4jUK0';
let contenidoPendiente = null;
// ================================================
// Cargar avance si existe en localStorage
const datosGuardados = localStorage.getItem('progresoParaCargar');
if (datosGuardados) {
  const datos = JSON.parse(datosGuardados);
  contenidoPendiente = JSON.parse(localStorage.getItem('progresoParaCargar'));
localStorage.removeItem('progresoParaCargar');
}
let titles = [
  'CONTEXTO INSTITUCIONAL DE LA UNIVERSIDAD SANTIAGO DE CALI',
  'PROYECTO EDUCATIVO INSTITUCIONAL',
  'Misión',
  'Visión',
  'Principios',
  'PLAN ESTRATÉGICO DE DESARROLLO INSTITUCIONAL',
  '1. DENOMINACIÓN',
  '1.1. ANTECEDENTES DEL PROGRAMA',
  '1.2. CONCEPCIÓN Y NATURALEZA DEL PROGRAMA',
  '1.2.1. Misión del Programa',
  '1.2.2. Visión del Programa',
  '1.2.3. Objetivo General del Programa',
  '1.2.4. Objetivos específicos',
  '1.3. GENERALIDADES DEL PROGRAMA',
  '1.4. RELACIÓN DE LA ESTRUCTURA CURRICULAR CON LA DENOMINACIÓN DEL PROGRAMA',
  '2. JUSTIFICACIÓN',
  '2.1. ESTADO DE LA OFERTA DE EDUCACIÓN DEL ÁREA DEL PROGRAMA',
  '2.1.1. Estado actual a nivel Nacional',
  '2.1.2. Estado actual a nivel internacional',
  '2.2. NECESIDADES DE LA REGIÓN Y EL PAÍS',
  '2.2.1. Pertinencia e Impacto del Programa',
  '2.2.2. Oportunidades de Desempeño y Tendencias del ejercicio profesional',
  '2.2.3. Inscritos, admitidos y matriculados en primer semestre',
  '2.2.4. Matriculados y graduados',
  '2.2.5. Deserción y permanencia',
  '2.2.6. Estímulos y beneficios',
  '2.3. ATRIBUTOS QUE CONSTITUYEN LOS RASGOS DISTINTIVOS DEL PROGRAMA',
  '3. ASPECTOS CURRICULARES',
  '3.1. COMPONENTES FORMATIVOS',
  '3.1.1. Plan general de estudios',
  '3.1.2. Plan de Transición',
  '3.1.3. Resultados de aprendizaje',
  '3.1.4. Perfiles',
  '3.1.5. Estrategias para la formación integral',
  '3.1.6. Estrategias de flexibilización para el desarrollo del programa',
  '3.1.7. Propósitos de Formación',
  '3.2. COMPONENTES PEDAGÓGICOS',
  '3.3. COMPONENTES DE INTERACCIÓN',
  '3.3.1. Resultados de los mecanismos de interacción de estudiantes y profesores',
  '3.3.2. Actividades académicas que favorecen la internacionalización',
  '3.4. CONCEPTUALIZACIÓN TEÓRICA Y EPISTEMOLÓGICA DEL PROGRAMA',
  '3.5. MECANISMOS DE EVALUACIÓN',
  '4. ORGANIZACIÓN DE LAS ACTIVIDADES ACADÉMICAS Y PROCESO FORMATIVO',
  '4.1. DISEÑO Y CONTENIDO CURRICULAR',
  '4.2. PROCESO FORMATIVO',
  '4.3. ESTRATEGIAS DIDÁCTICAS PARA EL DESARROLLO DE ACTIVIDADES ACADÉMICAS',
  '4.3.1. Estrategias y Técnicas Cognitivas',
  '4.3.2. Estrategias y técnicas metacognitivas',
  '4.3.3. Estrategias y Técnicas Integradoras',
  '4.3.4. Recursos Tecnológicos',
  '4.4. REQUISITOS DE TITULACIÓN',
  '5. INVESTIGACIÓN, INNOVACIÓN Y/O CREACIÓN ARTÍSTICA Y CULTURAL',
  '5.1. LA INVESTIGACIÓN EN LA USC',
  '5.1.1. Marco Normativo para la Investigación en la USC',
  '5.1.2. Recursos institucionales para la investigación',
  '5.1.3. Medios para la difusión de los resultados de investigación',
  '5.2. FORMACIÓN EN INVESTIGACIÓN',
  '5.2.1. Áreas, líneas o temáticas de la investigación',
  '5.2.2. Grupos de investigación',
  '5.2.3. Investigadores categorizados',
  '5.2.4. Formación de pensamiento innovador',
  '5.3. INCORPORACIÓN DE LA INVESTIGACIÓN EN EL DESARROLLO DEL CONOCIMIENTO',
  '5.3.1. Desarrollo de productos',
  '5.3.2. Resultados de la investigación en el programa',
  '5.3.2.1. Proyectos de Investigación',
  '5.3.2.2. Publicaciones',
  '5.3.2.3. Ponencias Nacionales e Internacionales',
  '5.3.2.4. Participación en Redes Académicas',
  '5.3.2.5. Programas de Jóvenes Investigadores Santiaguinos (JIS)',
  '5.3.2.6. Semilleros de Investigación',
  '5.3.2.7. Publicaciones de los estudiantes',
  '5.3.2.8. Ponencias de los estudiantes',
  '5.3.2.9. Pasantías de investigación de profesores y estudiantes',
  '5.3.2.10. Estancias posdoctorales',
  '5.3.2.11. Otras',
  '5.4. APORTES DE LA INVESTIGACIÓN AL DESARROLLO DE LOS SECTORES PRODUCTIVOS Y DE SERVICIOS DE LA REGIÓN Y DEL PAÍS',
  '5.5. PLAN PARA EL LOGRO DEL AMBIENTE DE INVESTIGACIÓN EN EL PROGRAMA',
  '6. RELACIÓN CON EL SECTOR EXTERNO',
  '6.1. LA EXTENSIÓN EN LA UNIVERSIDAD SANTIAGO DE CALI',
  '6.2. RELACIÓN DEL PROGRAMA CON EL SECTOR EXTERNO',
  '6.2.1. Vinculación con el Sector Productivo, social, cultural, público y privado',
  '6.3. ARTICULACIÓN DE PROFESORES Y ESTUDIANTES CON DINÁMICA SOCIAL, PRODUCTIVA, CREATIVA Y CULTURAL',
  '6.3.1. Plan de relación con el sector externo',
  '7. PROFESORES',
  '7.1. ESTRUCTURA DE LA ORGANIZACIÓN DOCENTE',
  '7.1.1. Modalidades de contratación docente',
  '7.2. SUFICIENCIA DE LOS PROFESORES',
  '7.2.1. Vinculación de los profesores',
  '7.2.2. Plan de vinculación',
  '7.3. IDONEIDAD DE LOS PROFESORES',
  '7.4. DISPONIBILIDAD DE LOS PROFESORES',
  '7.5. PERMANENCIA Y DESARROLLO DE LOS PROFESORES',
  '7.5.1. Permanencia de los profesores',
  '7.5.1.1. Política de incentivos',
  '7.5.1.2. Becas institucionales para los profesores y beneficiarios',
  '7.5.1.3. Periodos sabáticos',
  '7.5.2. Evaluación de los profesores',
  '7.5.3. Desarrollo de los profesores',
  '7.5.3.1. Becas para estudios de Posgrado en otras instituciones',
  '7.5.3.2. Comisiones de estudio',
  '7.5.3.3. Rutas de Formación Docente',
  '7.5.3.4. Reconocimientos',
  '7.5.3.5. Plan de desarrollo y capacitación de los profesores',
  '8. MEDIOS EDUCATIVOS',
  '8.1. DOTACIÓN DE LOS AMBIENTES FÍSICOS Y/O VIRTUALES',
  '8.1.1. Equipos de cómputo y software',
  '8.1.1.1. Servicios ofrecidos a la comunidad Académica',
  '8.1.1.2. Equipos de cómputo y aplicativos informáticos',
  '8.1.1.3. Salas de Sistemas',
  '8.1.2. Plataformas tecnológicas',
  '8.1.2.1. Sistema Integrado de Gestión SIGUSC',
  '8.1.2.2. Sistema de información para el Aseguramiento de la Calidad SIPAC',
  '8.1.3. Plataforma Tecnológica para ambientes virtuales',
  '8.1.3.1. Uso de la plataforma virtual en el programa',
  '8.1.3.2. Herramientas y funciones de la plataforma virtual',
  '8.1.3.3. Creación de recursos digitales',
  '8.1.3.4. Seguridad de la información',
  '8.1.4. Recursos bibliográficos físicos y digitales',
  '8.1.4.1. Servicios virtuales disponibles',
  '8.1.4.2. Convenios Interbibliotecarios',
  '8.1.4.3. Material bibliográfico existente',
  '8.1.4.4. Bases de datos y recursos digitales',
  '8.1.5. Laboratorios',
  '8.1.5.1. Laboratorios utilizados por el programa',
  '8.1.6. Mantenimiento, actualización y reposición',
  '8.1.7. Disponibilidad y accesibilidad a los medios educativos',
  '8.1.8. Plan de adquisición, construcción o préstamo de los medios educativos',
  '8.2. MECANISMOS DE CAPACITACIÓN Y APROPIACIÓN',
  '8.2.1. Capacitación Biblioteca',
  '8.2.2. Capacitación ambientes virtuales',
  '8.2.3. Capacitación en XXXXX',
  '8.3. ESTRATEGIAS QUE IMPLEMENTA EL PROGRAMA PARA ATENDER LAS BARRERAS DE ACCESO Y CARACTERÍSTICAS DE LA POBLACIÓN',
  '8.4. MEDIOS EDUCATIVOS DISPONIBLES SEGÚN LA MODALIDAD DEL PROGRAMA, EN LOS CENTROS DE TUTORÍA, PRÁCTICAS O TALLERES',
  '8.5. CONVENIOS DE PRÁCTICA',
  '8.6. EVALUACIÓN Y SEGUIMIENTO AL USO, DISPONIBILIDAD Y PERTINENCIA DE LOS MEDIOS EDUCATIVOS A TRAVÉS DE CONVENIOS O CONTRATOS',
  '9. INFRAESTRUCTURA FÍSICA Y TECNOLÓGICA',
  '9.1. INFRAESTRUCTURA DE LA UNIVERSIDAD',
  '9.2. CARACTERÍSTICAS DE LA INFRAESTRUCTURA FÍSICA Y TECNOLÓGICA',
  '9.2.1. Descripción y justificación de la cantidad, calidad y capacidad de espacios',
  '9.2.1.1. Infraestructura de Bienestar',
  '9.2.1.2. Servicios de Bienestar Universitario',
  '9.2.1.3. Proceso de asignación de la infraestructura física y tecnológica',
  '9.2.2. Proyección de la infraestructura física y tecnológica',
  '9.2.2.1. Proyección Financiera',
  '9.3. DISPONIBILIDAD Y ACCESO A LA INFRAESTRUCTURA FÍSICA Y TECNOLÓGICA',
  '9.3.1. Disponibilidad y participación infraestructura de Bienestar',
  '9.3.2. Disponibilidad y uso de audiovisuales, salas de sistemas, laboratorios o salas ZOOM',
  '9.3.3. Disponibilidad y uso de la infraestructura para la Educación Virtual',
  '9.3.4. Planes de mantenimiento de la infraestructura física',
  'CONDICIONES INSTITUCIONALES',
  'REFERENCIAS BIBLIOGRÁFICAS'
  ];
document.addEventListener('DOMContentLoaded', async () => {
  // Verifica si hay un archivo desde OneDrive
const archivoDesdeOneDrive = localStorage.getItem("archivoParaCargar");
if (archivoDesdeOneDrive) {
  try {
    fetch(archivoDesdeOneDrive)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("progresoParaCargar", JSON.stringify(data));
        alert('✅ Avance importado desde OneDrive. Se aplicará al recargar.');
        localStorage.removeItem("archivoParaCargar");
        location.reload();
      })
      .catch(err => {
        console.error("❌ Error al cargar JSON desde OneDrive", err);
        alert("Error al cargar el archivo desde OneDrive.");
      });
  } catch (err) {
    console.error("❌ Error general al importar", err);
  }
}
  async function guardarProgreso() {
    const totalSecciones = 151;
    const body = {};
    for (let i = 0; i < totalSecciones; i++) {
      const editor = $(`#contenido_section_${i}`);
      if (!editor.length) continue;
      const contenido = editor.summernote('code');
      if (contenido && contenido !== '<p><br></p>') {
        const nombreCampo = `Seccion${i.toString().padStart(3, '0')}`;
  body[nombreCampo] = contenido;
      }
    }
    try {
      const payload = {
        nombre: "avance_formulario.json",  // nombre del archivo en OneDrive
        contenido: JSON.stringify(body, null, 2) // se envía como string plano JSON
      };
    
      const res = await fetch(FLOW_CREATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    
      if (!res.ok) {
        const error = await res.text();
        console.error('❌ Error al guardar en OneDrive:', error);
        alert('Hubo un error al guardar el avance.');
        return;
      }
    
      alert('✅ Avance guardado correctamente en OneDrive.');
    } catch (err) {
      console.error('❌ Error de red:', err);
      alert('No se pudo conectar al servidor.');
    }
  }
  window.guardarProgreso = guardarProgreso;
  function actualizarBarraProgreso() {
    const total = steps.length;
    let completadas = 0;
    steps.forEach((seccion, index) => {
      const contenido = $(`#contenido_section_${index}`).summernote('code');
      if (contenido && contenido.trim() !== '' && contenido.trim() !== '<p><br></p>') {
        completadas++;
      }
    });
    const porcentaje = Math.round((completadas / total) * 100);
    const barra = document.getElementById("progressBar");
    barra.style.width = `${porcentaje}%`;
    barra.textContent = `${porcentaje}% completado`;
  }
  async function showStep(idx) {
    // 4.a ocultar/mostrar las secciones
    steps.forEach((sec, i) => sec.classList.toggle('active', i === idx));
    indicator.textContent = `${idx + 1} / ${steps.length}`;
    prevBtn.disabled      = (idx === 0);
    nextBtn.textContent   = (idx === steps.length - 1 ? 'Finalizar' : 'Siguiente');
    actualizarBarraProgreso(); // 👈 Agrega esto aquí
  }
  // =================================================
  // 2) Botones Aprobado / No Aprobado (tu lógica actual)
  const aprobadoBtn   = document.getElementById('aprobadoFinal');
  const noAprobadoBtn = document.getElementById('noAprobadoFinal');
  const resultado     = document.getElementById('resultado_revision');
  aprobadoBtn?.addEventListener('click', () => {
    resultado.textContent = '✅ Documento Aprobado';
    resultado.style.color = '#007a33';
  });
  noAprobadoBtn?.addEventListener('click', () => {
    resultado.textContent = '❌ Documento No Aprobado';
    resultado.style.color = '#a30000';
  });
  // 2) Generación dinámica de 150 secciones
  // Lista de títulos basada en los <a> de la barra lateral de index.html :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
const wizard = document.getElementById('wizard');
const isRevision = window.location.pathname.includes('revision.html');
titles.forEach((texto, i) => {
  const sec = document.createElement('div');
  sec.classList.add('step');
  sec.id = `section_${i}`;
  // Añade un encabezado y el editor Summernote
  sec.innerHTML = `
  <h2>${texto}</h2>
  <div class="summernote" id="contenido_section_${i}" style="width: 100%;"></div>
`;
if (isRevision) {
  const radiosHTML = `
    <div class="opciones-aprobacion">
      <label><input type="radio" name="estado_section_${i}" value="aprobado"> Aprobado</label>
      <label><input type="radio" name="estado_section_${i}" value="no_aprobado"> No aprobado</label>
    </div>
    <textarea id="comentario_section_${i}" name="comentario_section_${i}" placeholder="Comentario del revisor sobre esta sección..." rows="3" style="width:100%; margin-top: 1rem;"></textarea>
  `;
  sec.innerHTML += radiosHTML;
}
  wizard.appendChild(sec);
});
// =================================================
// 5) Inicializa Summernote en cada .summernote
let seccionesRestauradas = 0;
$('.summernote').each(function (index) {
  const $editor = $(this);
  const nombreCampo = `Seccion${index.toString().padStart(3, '0')}`;
  $editor.summernote({
    height: 650,
    toolbar: isRevision ? false : [
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['fontname', 'fontsize', 'color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['insert', ['link', 'picture', 'video','table']],
      ['view', ['fullscreen', 'codeview', 'help']]
    ],
    disableResizeEditor: isRevision,
    airMode: false,
    callbacks: {
      onInit: function () {
        if (contenidoPendiente && contenidoPendiente[nombreCampo]) {
          $editor.summernote('code', contenidoPendiente[nombreCampo]);
          //$(`#section_${index}`).css('outline', '3px solid gold');
          seccionesRestauradas++;
        }
      }
    }
  });
  if (isRevision) {
    $editor.summernote('disable');
  }
});
// =================================================
// 6) Funciones para invocar tus flujos
async function sendSection(sectionIndex, htmlContent) {
  const res = await fetch(FLOW_CREATE_URL, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ sectionIndex, htmlContent })
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
// =================================================
// 7) Wizard: mostrar una sección a la vez
const steps     = Array.from(document.querySelectorAll('.step'));
let   current   = 0;
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const saveBtn   = document.getElementById('saveBtn');
const indicator = document.getElementById('stepIndicator');

prevBtn.addEventListener('click', () => { if (current>0) showStep(--current); });
nextBtn.addEventListener('click', () => {
  if (current < steps.length - 1) {
    showStep(++current);
  } else {
    document.getElementById('documentoMaestroForm').submit();
  }
});
// =================================================
// 8) Listener “Guardar Sección” - ahora envía TODAS las secciones
saveBtn.addEventListener('click', () => {
  guardarProgreso();
  actualizarBarraProgreso();
});
// =================================================
// 9) Barra lateral: saltar a sección
document.querySelectorAll('.sidebar a[href^="#section_"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const idx = parseInt(link.getAttribute('href').split('_')[1],10);
    if (!isNaN(idx) && idx >= 0 && idx < steps.length) {
      current = idx;
      showStep(current);
    }
  });
});
// =================================================
// 11) Arranca en la primera

if (seccionesRestauradas > 0) {
  alert(`✅ Se restauraron ${seccionesRestauradas} secciones con contenido.`);
}
showStep(0);
});
function descargarProgresoComoJSON() {
  const totalSecciones = 151;
  const datos = {};
  for (let i = 0; i < totalSecciones; i++) {
    const editor = $(`#contenido_section_${i}`);
    const contenido = editor.length ? editor.summernote('code') : null;
    if (contenido && contenido !== '<p><br></p>') {
      const nombreCampo = `Seccion${i.toString().padStart(3, '0')}`;
      datos[nombreCampo] = contenido;
    }
  }
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const nombreArchivo = prompt('Escribe el nombre para guardar el avance:', 'Documento_Rev_001');
  if (!nombreArchivo) return;
  a.download = `${nombreArchivo}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
function cargarProgresoDesdeJSON(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const datos = JSON.parse(e.target.result);
      localStorage.setItem('progresoParaCargar', JSON.stringify(datos));
      alert('✅ Progreso cargado en memoria. Se aplicará cuando el formulario esté listo.');
      location.reload();
    } catch (err) {
      console.error('❌ Error al leer JSON:', err);
      alert('El archivo no es válido');
    }
  };
  reader.readAsText(file);
}
async function enviarADocumento() {
  const totalSteps = 151; // o tu número real de secciones
  let contenidoHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Documento generado</title>
    <style>
      body { font-family: Arial; padding: 20px; }
      h2 { color: #005baa; margin-top: 40px; }
      .contenido-seccion { margin-bottom: 30px; }
      img { max-width: 100%; }
    </style>
  </head>
  <body>
  `;

  for (let i = 0; i < totalSteps; i++) {
    const seccion = document.getElementById(`section_${i}`);
    if (seccion) {
      const titulo = document.querySelector(`#navList li:nth-child(${i + 1}) a`)?.textContent || `Sección ${i + 1}`;
      const contenido = $(seccion).find('.summernote').summernote('code');

      if (contenido.trim()) {
        contenidoHTML += `
          <div class="pdf-section">
            <h2>${titulo}</h2>
            <div class="contenido-seccion">${contenido}</div>
          </div>
        `;
      }
    }
  }

  contenidoHTML += `
  </body>
  </html>
  `;

  // Ahora mandas esto al flujo
  const payload = {
    nombre: "documento.html",
    html: contenidoHTML
  };

  const response = await fetch("https://prod-18.westus.logic.azure.com:443/workflows/8151b6338f544255bc3e9cdef8cf09ef/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6BSQJV1i-sXxrQo4U0edb8wPObGPTUWXYjgVlezAXfE", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const resultado = await response.json();
  if (resultado.descarga) {
    window.open(resultado.descarga, "_blank");
  } else {
    alert("No se pudo generar el documento.");
    console.log(resultado);
  }
}

// Recupera todo el contenido en orden
function guardarProgresoComoObjeto() {
  const secciones = {};
  document.querySelectorAll('[id^="section_"]').forEach((seccion, i) => {
    const editor = seccion.querySelector('.summernote');  // 👈 cambia aquí
    if (editor) {
      const contenido = $(`#contenido_section_${i}`).summernote('code');
      secciones[`section_${i}`] = contenido;
    }
  });
  return secciones;
}
// Genera el PDF con html2pdf.js
function limpiarHTML(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  tempDiv.querySelectorAll('*').forEach(el => {
    el.removeAttribute("style");
    el.removeAttribute("class");
  });
  return tempDiv.innerHTML;
}
function generarPDF() {
  // Crear contenedor temporal visible
  const contenedor = document.createElement("div");
  contenedor.id = "contenidoPDF-visible";
  contenedor.style.padding = "2cm";
  contenedor.style.fontFamily = "Arial, sans-serif";
  contenedor.style.color = "#000";
  contenedor.style.lineHeight = "1.6";
  contenedor.style.fontSize = "12pt";
  contenedor.style.width = "100%";
  // Título principal
  const titulo = document.createElement("h1");
  titulo.innerText = `Documento Maestro - ${nombrePrograma}`;
  titulo.style.textAlign = "center";
  titulo.style.fontSize = "18pt";
  titulo.style.marginBottom = "30px";
  titulo.style.color = "#003366";
  contenedor.appendChild(titulo);
  // Recolectar secciones válidas
  const secciones = document.querySelectorAll(".step");
  secciones.forEach((seccion, index) => {
    const rawHTML = seccion.querySelector(".note-editable")?.innerHTML.trim();
    if (!rawHTML || rawHTML === "<p><br></p>") return;
    const bloque = document.createElement("div");
    bloque.className = "pdf-section";
    bloque.style.pageBreakInside = "avoid";
bloque.style.marginBottom = "2cm";
bloque.style.paddingBottom = "1cm";
bloque.style.borderBottom = "1px solid #ccc";

// 🔧 Corrección específica para evitar que el contenido empiece en medio de la página
bloque.style.minHeight = "1px";
bloque.style.paddingTop = "0";
bloque.style.marginTop = "0";
    // Título de sección
    const tituloSeccion = document.querySelector(`#navList li:nth-child(${index + 1}) a`);
    const h2 = document.createElement("h2");
    h2.textContent = tituloSeccion ? tituloSeccion.textContent : `Sección ${index + 1}`;
    h2.style.fontSize = "15pt";
    h2.style.color = "#003366";
    h2.style.marginBottom = "0.75rem";
    bloque.appendChild(h2);
    // Contenido limpio
    const contenido = document.createElement("div");
    contenido.innerHTML = limpiarHTML(rawHTML);
    // ✅ Redimensionar imágenes grandes antes de añadir al bloque
    contenido.querySelectorAll("img").forEach(img => {
      img.style.maxWidth = "100%";
      img.style.maxHeight = "250px";  // límite de altura
      img.style.width = "auto";
      img.style.height = "auto";
      img.style.display = "block";
      img.style.margin = "1rem auto";
    });
    bloque.appendChild(contenido);
    contenedor.appendChild(bloque);
  });
  // Agregar al body temporalmente
  document.body.appendChild(contenedor);
  // Generar PDF
  html2pdf().set({
    margin: [1.5, 1.5],
    filename: `${nombrePrograma}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true
    },
    jsPDF: {
      unit: "cm",
      format: "a4",
      orientation: "portrait"
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  }).from(contenedor).save().then(() => {
    contenedor.remove(); // limpiar después
  });
}
function cargarProgresoDesdeObjeto(objeto) {
  Object.keys(objeto).forEach(key => {
    const match = key.match(/seccion(\d+)/i);
    if (match) {
      const index = match[1];
      $(`#summernote${index}`).summernote('code', objeto[key]);
    }
  });
}

function limpiarHTML(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  // Eliminar clases y estilos
  tempDiv.querySelectorAll('*').forEach(el => {
    el.removeAttribute("style");
    el.removeAttribute("class");
  });
  // Eliminar espacios y saltos innecesarios al principio
  const contenidoLimpio = tempDiv.innerHTML
    .replace(/^(<br\s*\/?>|\s|&nbsp;|<p><br\s*\/?><\/p>)+/gi, '')
    .replace(/(<br\s*\/?>|\s|&nbsp;)+$/gi, '');
  tempDiv.innerHTML = contenidoLimpio;
  return tempDiv.innerHTML;
}

async function exportarComoWordDesdeEditor() {
  const contenido = $('#contenido_section_0').summernote('code'); // O cualquier sección
  const nombreArchivo = prompt("Nombre del archivo:", "documento.pdf");

  if (!contenido || !nombreArchivo) {
    alert("Debes escribir contenido y un nombre de archivo.");
    return;
  }

  const payload = {
    html: contenido,
    nombre: nombreArchivo.endsWith('.html') ? nombreArchivo : nombreArchivo.replace(/\.pdf?$/, '') + '.html'
  };

  try {
    const respuesta = await fetch("https://prod-18.westus.logic.azure.com:443/workflows/8151b6338f544255bc3e9cdef8cf09ef/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6BSQJV1i-sXxrQo4U0edb8wPObGPTUWXYjgVlezAXfE", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const resultado = await respuesta.json();
    alert("✅ Documento generado con éxito");
    console.log("Ruta del archivo convertido:", resultado);
    console.log("🔗 Enlace recibido desde Power Automate:", resultado.descarga);
    if (resultado.descarga && resultado.descarga.startsWith("http")) {
      window.open(resultado.descarga, "_blank");
    } else {
      alert("⚠️ El flujo no devolvió un enlace de descarga. Verifica que la conversión fue exitosa.");
      console.error("No se recibió URL válida:", resultado);
    }
    
 // o comparte el enlace

  } catch (error) {
    console.error("❌ Error al generar el documento:", error);
    alert("Hubo un error. Verifica tu flujo o tu conexión.");
  }
}
