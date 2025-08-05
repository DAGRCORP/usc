let nombreArchivoPDF = null;
let contenidoPendiente = null;
let ultimaVersionActiva = {}; // contiene la edición más reciente enviada por cualquier usuario

const contenidoRecibidoEnTiempoReal = {};
const contenidoInicial = {}; // ← contenido base del JSON
const datosGuardados = localStorage.getItem('progresoParaCargar');
if (datosGuardados) {
  contenidoPendiente = JSON.parse(datosGuardados);
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
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient(
  'https://lxlmoylexavqxnhxdhbz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bG1veWxleGF2cXhuaHhkaGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTAxNzksImV4cCI6MjA2NTc2NjE3OX0.sYqG2AvlrsdRQaC5i4CsTzWwDt1n9AzYsViZelyZDZ4'
);

// ============== Parámetro del programa ===============
const params = new URLSearchParams(window.location.search);
const programa = params.get('programa');
let canalColaborativo = null;

async function obtenerNombrePDF(programa) {
  // Lista archivos en la carpeta del programa
  const { data, error } = await supabase.storage.from('documentos').list(`documentos/${programa}/`, { limit: 100 });
  if (error) return null;
  const pdf = data?.find(a => a.name.endsWith('.pdf'));
  if (pdf) {
    // Ya existe PDF, usa el mismo nombre para reemplazar
    return `documentos/${programa}/${pdf.name}`;
  } else {
    // No hay PDF, pregunta nombre SOLO UNA VEZ
    let nombreArchivoPDF = prompt("Nombre del archivo PDF (sin .pdf):");
    if (!nombreArchivoPDF) return null;
    const nombreLimpio = nombreArchivoPDF.replace(/\.pdf$/i, '');
    return `documentos/${programa}/${nombreLimpio}.pdf`;
  }
}
document.addEventListener('DOMContentLoaded', async () => {
  canalColaborativo = supabase
  .channel(`colaboracion_${programa}`)
  .on(
    'broadcast',
    { event: /^update_Seccion\d{3}$/ },
    ({ event, payload }) => {
      const campo = event.split('update_')[1];
      if (campo && window.editoresJodit[campo]) {
        const editor = window.editoresJodit[campo];
        const actual = editor.value?.trim();
        const recibido = payload.html?.trim();
        if (recibido && recibido !== actual) {
          editor.value = recibido;
          console.log(`🔄 Campo ${campo} sincronizado desde otro usuario (${payload.user})`);
        }
      }
    }
  )
  .subscribe();
  if (!programa) {
    alert('❌ No se detectó el programa. Regresa al gestor de archivos.');
    window.location.href = 'archivosguardados.html';
  }
  console.log("🧩 Programa actual:", programa);
  if (!programa) {
    console.warn("⚠️ No se puede crear canal colaborativo: 'programa' no está definido.");
  } else {
  }
  
  // ✅ Obtener contenido más reciente de Supabase (última versión persistente)
const { data: ultimaVersion, error: errorUltima } = await supabase
.from('versiones_documentos')
.select('*')
.eq('programa', programa)
.order('fecha', { ascending: false })
.limit(1)
.single();

if (ultimaVersion && ultimaVersion.contenido) {
try {
  const contenidoReciente = JSON.parse(ultimaVersion.contenido);
  aplicarContenidoDesdeJSON(contenidoReciente);
  console.log('🟢 Aplicado contenido persistente más reciente.');
} catch (err) {
  console.warn('⚠️ No se pudo aplicar contenido persistente:', err);
}
}
// ✅ Solo después de eso inicializa Jodit
setTimeout(() => {
  console.log("🔧 Inicializando editores...");
  inicializarTodosLosEditors();
}, 200);
// ⏱️ 2. Espera unos milisegundos para que lleguen los broadcasts
await new Promise(res => setTimeout(res, 500));

// ✅ 3. Luego carga el JSON (ahora se respetan los flags recibidos)
const json = params.get('json');
if (json) {
  const ruta = `documentos/${programa}/versiones/${json}`;
  const { data, error } = await supabase.storage.from('documentos').download(ruta);
  if (!error) {
    const datos = await data.text();
    try {
      const progreso = JSON.parse(datos);
      let intentos = 0;
const esperarEditoresYAplicar = () => {
  const $todos = $('.summernote');
  const listos = $todos.filter(function () {
    return $(this).next('.note-editor').length > 0;
  });

  if (listos.length < titles.length && intentos < 20) {
    intentos++;
    return setTimeout(esperarEditoresYAplicar, 200);
  }

  aplicarContenidoDesdeJSON(progreso);
};
esperarEditoresYAplicar();
    } catch (e) {
      alert('❌ Error al leer el JSON de avance');
    }
  }
}

  
  document.getElementById('btnGenerarPDF')?.addEventListener('click', async (e) => {
    e.preventDefault();
  const filename = await obtenerNombrePDF(programa);
  if (!filename) return;
  // Genera y sube el PDF
  const html = generarDocumentoHTML();
  await enviarADocumentoConNombre(filename, html);
  // GUARDA EL JSON de avance automáticamente:
  await guardarProgresoComoJsonAutomatica();
});
  const steps = [];
  let current = 0;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const saveBtn = document.getElementById('saveBtn');
  const indicator = document.getElementById('stepIndicator');
  const wizard = document.getElementById('wizard');
  const isRevision = window.location.pathname.includes('revision.html');
  
  titles.forEach((texto, i) => {
    const sec = document.createElement('div');
    sec.classList.add('step');
    sec.id = `section_${i}`;
    sec.innerHTML = `
  <h2>${texto}</h2>
  <textarea id="contenido_section_${i}" data-index="${i}" data-nombre="Seccion${i.toString().padStart(3, '0')}" style="width: 100%;"></textarea>
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
    steps.push(sec);
  });
  // ✅ Espera unos milisegundos y luego inicializa los editores
setTimeout(() => {
  console.log("🔧 Inicializando Summernote...");
  inicializarTodosLosEditors();
}, 200);
setTimeout(() => {
  console.log("📦 Aplicando edición activa más reciente...");
  for (let campo in ultimaVersionActiva) {
    if (
      window.editoresJodit[campo] &&
      typeof ultimaVersionActiva[campo] === 'string'
    ) {
      const editor = window.editoresJodit[campo];
      const actual = editor.value?.trim();
      const nuevo = ultimaVersionActiva[campo]?.trim();
      if (!actual || actual === '<p><br></p>' || actual !== nuevo) {
        editor.value = nuevo;
        contenidoInicial[campo] = nuevo;
        console.log(`⚡ Sección ${campo} actualizada desde memoria compartida`);
      }
    }
  }
}, 1200); // espera un poco más para que los editores estén listos

  // === Inicializa canal de colaboración en Supabase Realtime ===
  async function mostrarRevisionDeVersion(programa, json) {
    const { data, error } = await supabase.storage.from('documentos')
      .list(`documentos/${programa}/revisiones/`, { limit: 1000 });
    if (error || !data) return;
    // Filtra solo revisiones para esta versión
    let revisionSeleccionada = null;
    let fechaSeleccionada = 0;
    for (const archivo of data.filter(a => a.name.match(/^rev_\d{3}\.json$/))) {
      const ruta = `documentos/${programa}/revisiones/${archivo.name}`;
      const { data: archivoJson, error: err } = await supabase.storage.from('documentos').download(ruta);
      if (err || !archivoJson) continue;
      const texto = await archivoJson.text();
      try {
        const revObj = JSON.parse(texto);
        if (revObj.version === json) {
          const fechaRev = new Date(revObj.fecha).getTime();
          if (fechaRev > fechaSeleccionada) {
            revisionSeleccionada = revObj;
            fechaSeleccionada = fechaRev;
          }
        }
      } catch (e) { continue; }
    }
    if (!revisionSeleccionada) return;
  
    for (let i = 0; i < titles.length; i++) {
      const seccion = revisionSeleccionada.comentarios[`Seccion${i.toString().padStart(3, '0')}`];
      if (seccion) {
        $(`#contenido_section_${i}`).after(`
          <div class="comentario-revisor" style="border:1px solid #ca0; background:#fffbe6; padding:0.8em; margin:0.5em 0;">
            <b>Revisor:</b> ${seccion.estado === "aprobado" ? "✅ Aprobado" : "❌ No aprobado"}<br>
            <b>Comentario:</b><div>${seccion.comentario}</div>
          </div>
        `);
      }
    }
  }
  function showStep(idx) {
    steps.forEach((sec, i) => sec.classList.toggle('active', i === idx));
    indicator.textContent = `${idx + 1} / ${steps.length}`;
    prevBtn.disabled = idx === 0;
    nextBtn.textContent = (idx === steps.length - 1) ? "Finalizar" : "Siguiente";
  }
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
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => { if (current > 0) showStep(--current); });
    nextBtn.addEventListener('click', () => {
      if (current < steps.length - 1) {
        showStep(++current);
      } else {
        document.getElementById('documentoMaestroForm').submit();
      }
    });
  }
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      guardarProgreso();
      actualizarBarraProgreso();
    });
  }
  document.querySelectorAll('.sidebar a[href^="#section_"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const idx = parseInt(link.getAttribute('href').split('_')[1], 10);
      if (!isNaN(idx) && idx >= 0 && idx < steps.length) {
        current = idx;
        showStep(current);
      }
    });
  });
  const aprobadoBtn = document.getElementById('aprobadoFinal');
  const noAprobadoBtn = document.getElementById('noAprobadoFinal');
  const resultado = document.getElementById('resultado_revision');
  aprobadoBtn?.addEventListener('click', () => {
    resultado.textContent = '✅ Documento Aprobado';
    resultado.style.color = '#007a33';
  });
  noAprobadoBtn?.addEventListener('click', () => {
    resultado.textContent = '❌ Documento No Aprobado';
    resultado.style.color = '#a30000';
  });
  const btnSubir = document.getElementById('btnSubir');
  if (btnSubir) {
    btnSubir.addEventListener('click', subirArchivo);
  }
  showStep(0);
  //document.getElementById('btnVistaPreviaPDF').addEventListener('click', async function () {
    // Arma el HTML igual que para generar PDF, pero solo para vista previa
    //let contenido = '';
  //  for (let i = 0; i < titles.length; i++) {
    //  const titulo = titles[i];
      //const html = $(`#contenido_section_${i}`).summernote('code');
     // if (html && html !== '<p><br></p>') {
     //   contenido += `<h2>${titulo}</h2>${html}`;
     // }
    //}
    //const htmlFinal = `
      //<!DOCTYPE html>
      //<html lang="es">
      //<head>
        //<meta charset="UTF-8">
        //<title>Vista Previa PDF</title>
        //<style>
          //body { font-family: Arial, Helvetica, sans-serif; padding: 2rem; }
          //h2 { color: #003366; margin-top: 2rem; }
          //img { max-width: 100%; height: auto; }
          //table { border-collapse: collapse; width: 100%; }
          //th, td { border: 1px solid #333; padding: 0.7em 1em; }
        //</style>
      //</head>
      //<body>${contenido}</body>
      //</html>
    //`;
    // Envia al backend temporal que responde solo el PDF en memoria
    //const response = await fetch('http://localhost:3000/vista-previa-pdf', {
    //  method: 'POST',
    //  headers: { 'Content-Type': 'application/json' },
    //  body: JSON.stringify({ html: htmlFinal })
    //});
    /*
    if (response.ok) {
      const blob = await response.blob();
      const pdfURL = URL.createObjectURL(blob);
      window.open(pdfURL, '_blank');
      setTimeout(() => URL.revokeObjectURL(pdfURL), 60000); // Limpia después de 1 minuto
    } else {
      alert('No se pudo generar la vista previa PDF.');
    }
      */
  });
//});
function inicializarTodosLosEditors() {
  window.editoresJodit = {};

  for (let i = 0; i < titles.length; i++) {
    const nombreCampo = `Seccion${i.toString().padStart(3, '0')}`;
    const textarea = document.getElementById(`contenido_section_${i}`);
    if (!textarea) continue;

    const editor = new Jodit(textarea, {
      height: 650,
      toolbarSticky: false,
      toolbarAdaptive: false,
      buttons: [
        'bold', 'italic', 'underline', '|',
        'ul', 'ol', '|',
        'fontsize', 'font', '|',
        'brush', 'paragraph', '|',
        'table', 'image', 'file', '|',
        'align', 'outdent', 'indent', '|',
        'undo', 'redo', '|',
        'hr', 'eraser', 'source'
      ],
      uploader: {
        insertImageAsBase64URI: true
      }
    });

    window.editoresJodit[nombreCampo] = editor;

    // ✅ Solo si el editor está correctamente inicializado
    if (editor && editor.events && typeof editor.events.on === 'function') {
      editor.events?.on?.('change', debounce(async () => {
        const contents = editor.value;
        const base = contenidoInicial[nombreCampo]?.trim() ?? '';
        const limpio = contents.trim();
    
        if (
          limpio !== '' &&
          limpio !== '<p><br></p>' &&
          limpio !== base &&
          !window.location.pathname.includes('revision.html')
        ) {
          // 🔄 Enviar por canal colaborativo
          canalColaborativo.send({
            type: 'broadcast',
            event: `update_${nombreCampo}`,
            payload: {
              html: contents,
              user: localStorage.getItem("nombreUsuarioCorto") || "Anónimo"
            }
          });
          ultimaVersionActiva[nombreCampo] = contents;

          // 💾 Guardar versión persistente en Supabase
          await supabase
            .from('versiones_documentos')
            .upsert([
              {
                programa,
                contenido: JSON.stringify(guardarProgresoComoJsonAutomatica()),
                fecha: new Date().toISOString()
              }
            ], { onConflict: ['programa'] });
        }
      }, 250));
    } else {
      console.warn(`⚠️ No se pudo inicializar evento 'change' en ${nombreCampo}`);
    }
  }
}
setTimeout(() => {
  titles.forEach((titulo, i) => {
    const nombreCampo = `Seccion${i.toString().padStart(3, '0')}`;
    // 🔁 Listener manejado dentro de .from(...).on(...)
  });
}, 1500); // Espera a que los editores estén inicializados
function aplicarContenidoDesdeJSON(progreso) {
  for (let i = 0; i < titles.length; i++) {
    const nombreCampo = `Seccion${i.toString().padStart(3, '0')}`;
    if (progreso[nombreCampo] && window.editoresJodit[nombreCampo]) {
      contenidoInicial[nombreCampo] = progreso[nombreCampo];
      window.editoresJodit[nombreCampo].value = progreso[nombreCampo];
      contenidoRecibidoEnTiempoReal[nombreCampo] = true;
    }
  }
}


function guardarProgreso() {
  const datos = {};
  for (let i = 0; i < titles.length; i++) {
    const nombreCampo = `Seccion${i.toString().padStart(3, '0')}`;
    const contenido = window.editoresJodit[nombreCampo]?.value || '';
    if (contenido && contenido !== '<p><br></p>') {
      datos[nombreCampo] = contenido;
    }
  }
  // 🔵 Añade autor
  datos.autor = localStorage.getItem("nombreUsuarioCorto") || localStorage.getItem("usuarioCorreo") || "";

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
  async function subirArchivo() {
    const file = document.getElementById('fileInput').files[0];
    if (!file) return alert('Selecciona un archivo PDF');
    let nombreArchivoPDF = prompt("Nombre del archivo PDF (sin .pdf):");
    if (!nombreArchivoPDF) return;
    const nombreLimpio = nombreArchivoPDF.replace(/\.pdf$/i, '');
    const ruta = `documentos/${programa}/${nombreLimpio}.pdf`;
    const { error } = await supabase.storage.from('documentos').upload(ruta, file, {
      cacheControl: '3600', upsert: true
    });
    if (error) {
      console.error(error);
      alert("❌ Error al subir");
    } else {
      const { data } = supabase.storage.from('documentos').getPublicUrl(ruta);
      document.getElementById('visorPDF').src = data.publicUrl;
      alert("✅ PDF subido correctamente");
    }
  }
  function generarDocumentoHTML() {
    let contenido = '';
    for (let i = 0; i < titles.length; i++) {
      const nombreCampo = `Seccion${i.toString().padStart(3, '0')}`;
      const html = window.editoresJodit[nombreCampo]?.value || '';
      contenido += `<h2>${titles[i]}</h2>\n${html}\n<hr>\n`;
    }
    return contenido;
  }

  async function guardarProgresoComoJson(datos) {
    const nombreArchivo = prompt('Nombre del archivo JSON (sin .json):');
    if (!nombreArchivo) return;
    const nombreLimpio = nombreArchivo.replace(/\.json$/i, '');
    const ruta = `documentos/${programa}/versiones/${nombreLimpio}.json`;
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const { error } = await supabase.storage.from('documentos').upload(ruta, blob, {
      cacheControl: '3600', upsert: true
    });
    if (error) {
      console.error(error);
      alert("❌ Error al guardar JSON");
    } else {
      alert("✅ JSON guardado correctamente");
    }
  } 
  function guardarProgresoComoJsonAutomatica() {
    const datos = {};
    for (let i = 0; i < titles.length; i++) {
      const nombreCampo = `Seccion${i.toString().padStart(3, '0')}`;
      const contenido = window.editoresJodit[nombreCampo]?.value || '';
      datos[nombreCampo] = contenido;
    }
    datos.autor = localStorage.getItem("nombreUsuarioCorto") || localStorage.getItem("usuarioCorreo") || "";
    return datos;
  }
  function registrarEventosDeColaboracion() {
    if (!canalColaborativo || typeof canalColaborativo.on !== 'function') {
      console.warn('⚠️ Canal no inicializado. Se omite registro de presencia.');
      return;
    }
  
    // 🔁 Listener manejado dentro de .from(...).on(...)
  }
  
    // 🔁 Listener manejado dentro de .from(...).on(...)
  
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  