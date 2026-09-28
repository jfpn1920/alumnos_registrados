//---------------------------------------//
//--|funcionalidad_alumnos_registrados|--//
//---------------------------------------//
const formulario = document.getElementById("formulario_alumnos");
const nombre_alumno = document.getElementById("nombre_alumno");
const curso_alumno = document.getElementById("curso_alumno");
const lista_alumnos = document.getElementById("lista_alumnos");
const buscar_alumno = document.getElementById("buscar_alumno");
const total_alumnos = document.getElementById("total_alumnos");
const total_destacados = document.getElementById("total_destacados");
const estado_lista = document.getElementById("estado_lista");
const mensaje_lista = document.getElementById("mensaje_lista");
const limpiar_lista = document.getElementById("limpiar_lista");
//-----------------------------------------//
//--|datos_a_guardar_usando_localstorage|--//
//-----------------------------------------//
let alumnos = JSON.parse(localStorage.getItem("alumnos_registrados")) || [];
function guardar_datos() {
    localStorage.setItem("alumnos_registrados", JSON.stringify(alumnos));
}
//---------------------//
//--|mostrar_alumnos|--//
//---------------------//
function mostrar_alumnos(filtro = "") {
    lista_alumnos.innerHTML = "";
    let encontrados = 0;
    alumnos.forEach(
        function(alumno, indice) {
            const nombre = alumno.nombre .toLowerCase();
            const curso = alumno.curso .toLowerCase();
            const coincide = nombre.includes(filtro) || curso.includes(filtro);
            if (!coincide) {
                return;
            }
            encontrados++;
            const tarjeta = document.createElement("article");
            const inicial = alumno.nombre .charAt(0) .toUpperCase();
            tarjeta.className = "tarjeta_alumno";
            tarjeta.innerHTML = `
                <div class="avatar_alumno">
                    ${inicial}
                </div>
                <div class="informacion_alumno">
                    <h3>${alumno.nombre}</h3>
                    <span>Curso: ${alumno.curso}</span>
                </div>
                <div class="acciones_alumno">
                    <button class="boton_destacado ${alumno.destacado ? "activo" : ""}" onclick="destacar_alumno(${indice})" title="Destacar"><i class="fa-solid fa-star"></i></button>
                    <button class="boton_eliminar" onclick="eliminar_alumno(${indice})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            lista_alumnos.appendChild(tarjeta);
        }
    );
    actualizar_resumen(filtro, encontrados);
}
//------------------------//
//--|actualizar_resumen|--//
//------------------------//
function actualizar_resumen(filtro, encontrados) {
    const destacados =
        alumnos.filter(
            function(alumno) {
                return alumno.destacado;
            }
        );
    total_alumnos.textContent = alumnos.length;
    total_destacados.textContent = destacados.length;
    estado_lista.textContent = alumnos.length > 0 ? "Activa" : "Vacía";
    if (alumnos.length === 0) {
        mensaje_lista.innerHTML = `
            <i class="fa-solid fa-user-slash"></i>
            <p>No hay alumnos registrados.</p>
        `;
        mensaje_lista.style.display = "block";
    } else if (encontrados === 0) {
        mensaje_lista.innerHTML = `
            <i class="fa-solid fa-magnifying-glass"></i>
            <p>No se encontraron alumnos.</p>
        `;
        mensaje_lista.style.display = "block";
    } else {
        mensaje_lista.style.display = "none";
    }
}
//----------------------//
//--|registrar_alumno|--//
//----------------------//
formulario.addEventListener(
    "submit",
    function(evento) {
        evento.preventDefault();
        const nombre = nombre_alumno.value .trim();
        const curso = curso_alumno.value .trim();
        if (nombre === "" || curso === "") {
            alert("Completa todos los campos.");
            return;
        }
        const alumno = {
            nombre: nombre,
            curso: curso,
            destacado: false
        };
        alumnos.push(alumno);
        guardar_datos();
        mostrar_alumnos();
        formulario.reset();
        nombre_alumno.focus();
    }
);
//--------------------------//
//--|buscar_a_los_alumnos|--//
//--------------------------//
buscar_alumno.addEventListener(
    "input",
    function() {
        const texto = buscar_alumno.value .toLowerCase() .trim();
        mostrar_alumnos(texto);
    }
);
//---------------------------//
//--|destacar_a_los_alumno|--//
//---------------------------//
function destacar_alumno(indice) {
    alumnos[indice].destacado = !alumnos[indice].destacado;
    guardar_datos();
    mostrar_alumnos(buscar_alumno.value .toLowerCase() .trim());
}
//---------------------------//
//--|eliminar_a_los_alumno|--//
//---------------------------//
function eliminar_alumno(indice) {
    const confirmar = confirm("¿Deseas eliminar este alumno?");
    if (!confirmar) {
        return;
    }
    alumnos.splice(indice, 1);
    guardar_datos();
    mostrar_alumnos(buscar_alumno.value .toLowerCase() .trim());
}
//------------------------------------------//
//--|limpiar_la_lista_usando_localstorage|--//
//------------------------------------------//
limpiar_lista.addEventListener(
    "click",
    function() {
        if (alumnos.length === 0) {
            alert("La lista ya está vacía.");
            return;
        }
        const confirmar = confirm("¿Deseas eliminar todos los alumnos?");
        if (!confirmar) {
            return;
        }
        alumnos = [];
        localStorage.removeItem("alumnos_registrados");
        mostrar_alumnos();
    }
);
mostrar_alumnos();