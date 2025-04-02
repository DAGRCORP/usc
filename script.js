// script.js MODIFICADO para validar campos requeridos antes de guardar

const coursesContainer = document.getElementById("coursesContainer");
const planEstudioSection = coursesContainer.closest(".plan-estudio") || coursesContainer.parentElement;
const durationInput = document.getElementById("duracionPrograma");
const globalAddCourseButton = document.getElementById("addCourseButton");
const creditosDisplay = document.createElement("p");

creditosDisplay.id = "totalCreditosDisplay";
creditosDisplay.style.marginTop = "20px";
creditosDisplay.style.fontWeight = "bold";
creditosDisplay.innerHTML = "<strong>Créditos Totales:</strong> 0";

const finishSemesterButton = document.createElement("button");

// Ocultar plan de estudio al inicio
planEstudioSection.style.display = "none";
if (globalAddCourseButton) globalAddCourseButton.style.display = "none";

finishSemesterButton.id = "finishSemesterButton";
finishSemesterButton.textContent = "Finalizar Semestre";
finishSemesterButton.style.backgroundColor = "orange";
finishSemesterButton.style.color = "white";
finishSemesterButton.style.border = "none";
finishSemesterButton.style.padding = "10px 15px";
finishSemesterButton.style.borderRadius = "5px";
finishSemesterButton.style.marginTop = "15px";
finishSemesterButton.style.cursor = "pointer";
finishSemesterButton.style.transition = "transform 0.2s ease-in-out";

let currentSemester = 1;
let totalSemesters = 0;

// Captura la duración total del programa
durationInput.addEventListener("change", () => {
  totalSemesters = parseInt(durationInput.value, 10);
  currentSemester = 1;
  coursesContainer.innerHTML = "";
  planEstudioSection.style.display = "block";
  addSemesterSection();
  coursesContainer.after(finishSemesterButton);
  planEstudioSection.appendChild(creditosDisplay);
});

function addSemesterSection() {
  if (currentSemester > totalSemesters) {
    alert("Has finalizado el ingreso de cursos.");
    finishSemesterButton.style.display = "none";
    return;
  }

  const semesterDiv = document.createElement("div");
  semesterDiv.classList.add("semester");
  semesterDiv.dataset.semester = currentSemester;
  semesterDiv.innerHTML = `<h3>Semestre ${currentSemester}</h3>`;

  const addBtn = document.createElement("button");
  addBtn.textContent = "+ Agregar Curso";
  addBtn.classList.add("add-local-button");
  addBtn.style.backgroundColor = "green";
  addBtn.style.color = "white";
  addBtn.style.border = "none";
  addBtn.style.padding = "10px 15px";
  addBtn.style.borderRadius = "5px";
  addBtn.style.marginTop = "10px";
  addBtn.style.cursor = "pointer";
  addBtn.style.transition = "transform 0.2s ease-in-out";

  addBtn.addEventListener("click", () => {
    addCourseToSemester(semesterDiv);
  });

  semesterDiv.appendChild(addBtn);
  coursesContainer.appendChild(semesterDiv);
}

function addCourseToSemester(semesterDiv) {
  const courseDiv = document.createElement("div");
  courseDiv.classList.add("course");
  courseDiv.innerHTML = `
    <input type="text" name="courseName[]" placeholder="Nombre del Curso" required>
    <input type="number" name="courseCredits[]" placeholder="Créditos" min="1" required>
    <button type="button" class="removeCourseButton">X</button>`;

  const creditInput = courseDiv.querySelector("[name='courseCredits[]']");
  creditInput.addEventListener("input", updateTotalCredits);

  courseDiv.querySelector(".removeCourseButton").addEventListener("click", () => {
    const parentSemesterDiv = courseDiv.closest(".semester");
    courseDiv.remove();
    updateTotalCredits();

    const remainingCourses = parentSemesterDiv.querySelectorAll(".course");

    if (remainingCourses.length === 0) {
      parentSemesterDiv.remove();
      reindexSemesters();
      if (document.querySelectorAll(".semester").length < totalSemesters) {
        finishSemesterButton.style.display = "inline-block";
      }
    }
  });

  semesterDiv.appendChild(courseDiv);
}

function updateTotalCredits() {
  let total = 0;
  document.querySelectorAll("[name='courseCredits[]']").forEach(input => {
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      total += value;
    }
  });
  creditosDisplay.innerHTML = `<strong>Créditos Totales:</strong> ${total}`;
}

finishSemesterButton.addEventListener("click", () => {
  currentSemester++;
  addSemesterSection();
});

function reindexSemesters() {
  const semesterDivs = document.querySelectorAll(".semester");
  currentSemester = semesterDivs.length > 0 ? semesterDivs.length : 1;

  semesterDivs.forEach((div, index) => {
    const newNumber = index + 1;
    div.dataset.semester = newNumber;
    const heading = div.querySelector("h3");
    if (heading) heading.textContent = `Semestre ${newNumber}`;
  });
}

// Enviar formulario con validación de campos requeridos

document.querySelector("button[type='submit']").addEventListener("click", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("NombrePrograma").value.trim();
  const duracion = document.getElementById("duracionPrograma").value.trim();
  const descripcion = document.getElementById("descripcionPrograma").value.trim();
  const justificacion = document.getElementById("Justificacion").value.trim();
  const correo = document.getElementById("recipientEmail").value.trim();
  const destinatario = document.getElementById("recipientName").value.trim();

  if (!nombre || !duracion || !descripcion || !justificacion || !correo || !destinatario) {
    alert("Por favor completa todos los campos requeridos.");
    return;
  }

  const data = {
    id: document.getElementById("documentId").value,
    programa: nombre,
    creditos: creditosDisplay.textContent.replace(/\D/g, ""),
    semestres: duracion,
    descripcion: descripcion,
    destinatario: destinatario,
    correo: correo,
    justificacion: justificacion,
    cursos: []
  };

  document.querySelectorAll(".semester").forEach(semesterDiv => {
    const semestre = semesterDiv.dataset.semester;
    semesterDiv.querySelectorAll(".course").forEach(courseDiv => {
      const nombre = courseDiv.querySelector("[name='courseName[]']").value;
      const creditos = courseDiv.querySelector("[name='courseCredits[]']").value;
      data.cursos.push({ semestre, nombre, creditos });
    });
  });
// Construir texto para PlanEstudio
let planEstudioTexto = "";

data.cursos.forEach(curso => {
  planEstudioTexto += `Semestre ${curso.semestre}: ${curso.nombre} (${curso.creditos} créditos)\n`;
});

  fetch("https://prod-131.westus.logic.azure.com:443/workflows/409d19ff14b640f4bc73b64243dffb41/triggers/manual/paths/invoke?api-version=2016-06-01", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      NombrePrograma: data.programa,
      Justificacion: data.justificacion,
      PlanEstudio: planEstudioTexto,
      correo: data.correo,
      destinatario: data.destinatario
    })
    
  })
  .then(response => {
    if (response.ok) {
      alert("Programa enviado correctamente a Power Automate.");
    } else {
      alert("Error al enviar los datos.");
    }
  })
  .catch(error => {
    console.error("Error al enviar:", error);
    alert("Hubo un error de red al intentar enviar.");
  });

});
