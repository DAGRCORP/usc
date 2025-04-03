const coursesContainer = document.getElementById("coursesContainer");
const planEstudio = coursesContainer.closest(".plan-estudio") || coursesContainer.parentElement;
const duracionInput = document.getElementById("duracionPrograma");
const addCourseBtn = document.getElementById("addCourseButton");
const creditosDisplay = Object.assign(document.createElement("p"), {
  id: "totalCreditosDisplay",
  style: "margin-top:20px;font-weight:bold",
  innerHTML: "<strong>Créditos Totales:</strong> 0"
});
const finishBtn = Object.assign(document.createElement("button"), {
  id: "finishSemesterButton",
  textContent: "Finalizar Semestre",
  style: "background:orange;color:white;border:none;padding:10px 15px;border-radius:5px;margin-top:15px;cursor:pointer;transition:transform .2s ease-in-out"
});

let total = 0;

planEstudio.style.display = "none";
if (addCourseBtn) addCourseBtn.style.display = "none";

duracionInput.addEventListener("change", () => {
  const nuevaCantidad = parseInt(duracionInput.value, 10);
  const actuales = document.querySelectorAll(".semester").length;

  planEstudio.style.display = "block";
  if (!document.getElementById("finishSemesterButton")) {
    coursesContainer.after(finishBtn);
    planEstudio.appendChild(creditosDisplay);
  }

  if (actuales > nuevaCantidad) {
    for (let i = actuales; i > nuevaCantidad; i--) {
      const sem = document.querySelector(`.semester[data-semester="${i}"]`);
      if (sem) sem.remove();
    }
  }

  if (actuales < nuevaCantidad) {
    for (let i = actuales + 1; i <= nuevaCantidad; i++) {
      addSemester(i);
    }
  }

  total = nuevaCantidad;
});

function addSemester(num) {
  if (!num || isNaN(num)) return;

  const semDiv = document.createElement("div");
  semDiv.className = "semester";
  semDiv.dataset.semester = num;
  semDiv.innerHTML = `<h3>Semestre ${num}</h3>`;

  const btn = document.createElement("button");
  btn.textContent = "+ Agregar Curso";
  btn.className = "add-local-button";
  btn.style = "background:green;color:white;border:none;padding:10px 15px;border-radius:5px;margin-top:10px;cursor:pointer;transition:transform .2s ease-in-out";
  btn.onclick = () => addCourse(semDiv);

  semDiv.appendChild(btn);
  coursesContainer.appendChild(semDiv);
}

function addCourse(semDiv) {
  const courseDiv = document.createElement("div");
  courseDiv.className = "course";
  courseDiv.innerHTML = `
    <input type="text" name="courseName[]" placeholder="Nombre del Curso" required>
    <input type="number" name="courseCredits[]" placeholder="Créditos" min="1" required>
    <button type="button" class="removeCourseButton">X</button>`;

  const creditInput = courseDiv.querySelector("[name='courseCredits[]']");
  creditInput.addEventListener("input", updateCreditos);

  courseDiv.querySelector(".removeCourseButton").onclick = () => {
    const parent = courseDiv.closest(".semester");
    courseDiv.remove();
    updateCreditos();

    if (!parent.querySelectorAll(".course").length) {
      parent.remove();
      reindexSemesters();
      const totalActuales = document.querySelectorAll(".semester").length;
      if (totalActuales < total) finishBtn.style.display = "inline-block";
    }
  };

  semDiv.appendChild(courseDiv);
}

function updateCreditos() {
  let suma = 0;
  document.querySelectorAll("[name='courseCredits[]']").forEach(input => {
    const val = parseInt(input.value, 10);
    if (!isNaN(val)) suma += val;
  });
  creditosDisplay.innerHTML = `<strong>Créditos Totales:</strong> ${suma}`;
}

finishBtn.onclick = () => {
  const actuales = document.querySelectorAll(".semester").length;
  const siguiente = actuales + 1;
  if (siguiente <= total) {
    addSemester(siguiente);
  } else {
    alert("Ya has ingresado todos los semestres permitidos.");
    finishBtn.style.display = "none";
  }
};

function reindexSemesters() {
  const semDivs = document.querySelectorAll(".semester");
  semDivs.forEach((div, i) => {
    div.dataset.semester = i + 1;
    const h3 = div.querySelector("h3");
    if (h3) h3.textContent = `Semestre ${i + 1}`;
  });
}

document.getElementById("submitButton").addEventListener("click", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("NombrePrograma").value.trim(),
        duracion = document.getElementById("duracionPrograma").value.trim(),
        descripcion = document.getElementById("descripcionPrograma").value.trim(),
        justificacion = document.getElementById("Justificacion").value.trim(),
        correo = document.getElementById("recipientEmail").value.trim(),
        destinatario = document.getElementById("recipientName").value.trim();

  if (!nombre || !duracion || !descripcion || !justificacion || !correo || !destinatario) {
    alert("Por favor completa todos los campos requeridos.");
    return;
  }

  const data = {
    programa: nombre,
    creditos: document.getElementById("totalCreditosDisplay").textContent.replace(/\D/g, ""),
    semestres: duracion,
    descripcion,
    destinatario,
    correo,
    justificacion,
    cursos: []
  };

  document.querySelectorAll(".semester").forEach(sem => {
    const s = sem.dataset.semester;
    sem.querySelectorAll(".course").forEach(c => {
      data.cursos.push({
        semestre: s,
        nombre: c.querySelector("[name='courseName[]']").value,
        creditos: c.querySelector("[name='courseCredits[]']").value
      });
    });
  });

  let plan = "";
  data.cursos.forEach(c => {
    plan += `Semestre ${c.semestre}: ${c.nombre} (${c.creditos} créditos)\n`;
  });

  fetch("https://prod-131.westus.logic.azure.com:443/workflows/409d19ff14b640f4bc73b64243dffb41/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZJ8e0B_yVHiCDZ9gEVqcDXnUV9kapTgLXYqmh6UT8VM", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      NombrePrograma: data.programa,
      Justificacion: data.justificacion,
      PlanEstudio: plan,
      correo: data.correo,
      destinatario: data.destinatario
    })
  })
  .then(res => {
    alert(res.ok ? "Programa enviado correctamente a Power Automate." : "Error al enviar los datos.");
  })
  .catch(err => {
    console.error("Error al enviar:", err);
    alert("Hubo un error de red al intentar enviar.");
  });
});
