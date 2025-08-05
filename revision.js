// revision.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://lxlmoylexavqxnhxdhbz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bG1veWxleGF2cXhuaHhkaGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxOTAxNzksImV4cCI6MjA2NTc2NjE3OX0.sYqG2AvlrsdRQaC5i4CsTzWwDt1n9AzYsViZelyZDZ4'); // Usa tu key real

// Lista de títulos/secciones (usa la MISMA que en tu editor)
const titles = [
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
  const params = new URLSearchParams(window.location.search);
  const programa = params.get('programa');
  const json = params.get('json');
  const wizard = document.getElementById('wizard');
  let pasos = [];

  // 1. Genera todas las secciones igual que en el editor
  titles.forEach((titulo, i) => {
    const sec = document.createElement('div');
    sec.classList.add('step');
    sec.id = `section_${i}`;
    sec.innerHTML = `
      <h2>${titulo}</h2>
      <textarea id="contenido_section_${i}" style="width: 100%;"></textarea>
      <div class="opciones-aprobacion" style="margin-top:1rem;">
        <label><input type="radio" name="estado_section_${i}" value="aprobado"> Aprobado</label>
        <label><input type="radio" name="estado_section_${i}" value="no_aprobado"> No aprobado</label>
        <button type="button" class="ver-pdf-btn" data-seccion="${i}">Ver en PDF</button>
      </div>
      <textarea id="comentario_section_${i}" name="comentario_section_${i}" style="width:100%;"></textarea>
    `;
    wizard.appendChild(sec);
    pasos.push(sec);
  });
  new Jodit(`#comentario_section_${i}`, {
    height: 200,
    buttons: ['bold', 'italic', 'ul', 'ol', 'link'],
  });
  
if (json) {
    const ruta = `documentos/${programa}/versiones/${json}`;
    const { data, error } = await supabase.storage.from('documentos').download(ruta);
    if (!error) {
      const datos = await data.text();
      try {
        const progreso = JSON.parse(datos);
        for (let i = 0; i < titles.length; i++) {
          const nombreCampo = `Seccion${i.toString().padStart(3, '0')}`;
          if (progreso[nombreCampo]) {
            document.getElementById(`contenido_section_${i}`).value = progreso[nombreCampo];
          }
        }
      } catch (e) {
        alert('❌ Error al leer el JSON de avance');
      }
    }
  }
  

  // 4. Navegación tipo wizard
  let current = 0;
  function showStep(idx) {
    pasos.forEach((sec, i) => sec.classList.toggle('active', i === idx));
    document.getElementById('stepIndicator').textContent = `${idx + 1} / ${pasos.length}`;
    document.getElementById('prevBtn').disabled = idx === 0;
    document.getElementById('nextBtn').textContent = (idx === pasos.length - 1) ? "Finalizar" : "Siguiente";
  }
  showStep(0);
  document.getElementById('prevBtn').addEventListener('click', () => { if (current > 0) showStep(--current); });
  document.getElementById('nextBtn').addEventListener('click', () => { if (current < pasos.length - 1) showStep(++current); });

  // 5. Al guardar revisión: verifica si todo está aprobado y guarda comentarios
  document.getElementById('saveBtn').addEventListener('click', async () => {
    await guardarRevisionNumerada(programa, json, titles);
  });
  async function guardarRevisionNumerada(programa, json, titles) {
    // 1. Listar revisiones ya guardadas para numerar
    const { data, error } = await supabase.storage
      .from('documentos')
      .list(`documentos/${programa}/revisiones/`, { limit: 1000 });
  
    let siguienteNumero = 0;
    if (!error && Array.isArray(data)) {
      const nums = data
        .map(f => {
          const match = f.name.match(/^rev_(\d{3})\.json$/);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter(n => n !== null)
        .sort((a, b) => b - a);
      if (nums.length > 0) {
        siguienteNumero = nums[0] + 1;
      }
    }
    const nombreRevision = `rev_${siguienteNumero.toString().padStart(3, '0')}.json`;
    const rutaRevision = `documentos/${programa}/revisiones/${nombreRevision}`;
  
    // 2. Construir el JSON de revisión ENLAZADO al avance
    const nombreUsuarioCorto = localStorage.getItem("nombreUsuarioCorto") || localStorage.getItem("usuarioCorreo") || "";
let revision = {
  version: json,
  revisado_por: [nombreUsuarioCorto],
  fecha: new Date().toISOString(),
  comentarios: {}
};
    for (let i = 0; i < titles.length; i++) {
      const estado = $(`input[name="estado_section_${i}"]:checked`).val();
      const comentario = document.getElementById(`comentario_section_${i}`).value;
      revision.comentarios[`Seccion${i.toString().padStart(3, '0')}`] = {
        estado: estado || "",
        comentario: comentario || ""
      };
    }
  
    // 3. Subir el JSON de revisión a Supabase
    const blob = new Blob([JSON.stringify(revision, null, 2)], { type: 'application/json' });
    const { error: uploadError } = await supabase.storage.from('documentos').upload(rutaRevision, blob, {
      cacheControl: '3600', upsert: false // No sobrescribe, siempre añade una nueva
    });
    if (uploadError) {
      alert('❌ Error al guardar revisión');
    } else {
      alert('✅ Revisión guardada como ' + nombreRevision);
  
      // ✅ Refresca la tabla de versiones en el gestor para que el contador se actualice
      if (window.opener && window.opener.toggleVersiones && window.opener.lastSpanVersiones) {
        window.opener.toggleVersiones(programa, window.opener.lastSpanVersiones);
      } else if (window.toggleVersiones && window.lastSpanVersiones) {
        window.toggleVersiones(programa, window.lastSpanVersiones);
      }
      // Opcional: window.close();
    }
  }
  
  const revisionJson = params.get('revision');
if (revisionJson) {
  const rutaRevision = `documentos/${programa}/revisiones/${revisionJson}`;
  const { data: revData, error: revErr } = await supabase.storage.from('documentos').download(rutaRevision);
  if (!revErr && revData) {
    const revText = await revData.text();
    try {
      const revision = JSON.parse(revText);
      // Rellena estados y comentarios desde la revisión
      for (let i = 0; i < titles.length; i++) {
        const seccion = revision.comentarios[`Seccion${i.toString().padStart(3, '0')}`];
        if (seccion) {
          $(`input[name="estado_section_${i}"][value="${seccion.estado}"]`).prop("checked", true);
          $(`#comentario_section_${i}`).summernote('code', seccion.comentario || '');
        }
      }
    } catch (e) {
      alert('❌ Error al leer el JSON de revisión');
    }
  }
}
  document.querySelectorAll('.ver-pdf-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      // Arma el HTML de todas las secciones (igual que generarDocumentoHTML, pero solo para previsualizar)
      let contenido = '';
      for (let i = 0; i < titles.length; i++) {
        const titulo = titles[i];
        const html = document.getElementById(`contenido_section_${i}`).value;
        contenido += `<h2>${titulo}</h2>${html}`;
      }
      const htmlFinal = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Vista Previa PDF</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 2rem; }
            h2 { color: #003366; margin-top: 2rem; }
            img { max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #333; padding: 0.7em 1em; }
          </style>
        </head>
        <body>${contenido}</body>
        </html>
      `;
    });
  });
});
