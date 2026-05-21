const apiBaseUrl = (window.APP_CONFIG?.API_BASE_URL || "https://tarea-app-cloud.onrender.com").replace(
  /\/$/,
  ""
);

const statusEl = document.querySelector("#status");
const listEl = document.querySelector("#task-list");
const formEl = document.querySelector("#task-form");
const inputEl = document.querySelector("#task-input");
const descEl = document.querySelector("#task-desc");
const detailEmptyEl = document.querySelector("#detail-empty");
const detailContentEl = document.querySelector("#detail-content");
const detailTitleEl = document.querySelector("#detail-title");
const detailDescEl = document.querySelector("#detail-desc");

let selectedTaskId = null;

statusEl.textContent = `Conectando a ${apiBaseUrl}`;

const showDetail = (task) => {
  if (!task) {
    selectedTaskId = null;
    detailEmptyEl.hidden = false;
    detailContentEl.hidden = true;
    detailTitleEl.textContent = "";
    detailDescEl.textContent = "";
    return;
  }

  selectedTaskId = task.id;
  detailTitleEl.textContent = task.title;
  detailDescEl.textContent = task.description;
  detailEmptyEl.hidden = true;
  detailContentEl.hidden = false;
};

const renderTasks = (tasks) => {
  listEl.innerHTML = "";

  if (!tasks.length) {
    const empty = document.createElement("li");
    empty.className = "muted";
    empty.textContent = "Sin tareas aún.";
    listEl.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement("li");
    if (task.id === selectedTaskId) {
      item.classList.add("selected");
    }
    const text = document.createElement("span");
    text.textContent = task.title;

    const button = document.createElement("button");
    button.textContent = "Eliminar";
    button.className = "danger";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteTask(task.id);
    });

    item.appendChild(text);
    item.appendChild(button);
    item.addEventListener("click", () => showDetail(task));
    listEl.appendChild(item);
  });
};

const loadTasks = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/tasks`);
    if (!response.ok) {
      throw new Error("No se pudo cargar la lista");
    }
    const data = await response.json();
    renderTasks(data);
    if (selectedTaskId) {
      const selected = data.find((task) => task.id === selectedTaskId);
      showDetail(selected || null);
    } else {
      showDetail(null);
    }
    statusEl.textContent = `API OK (${data.length} tareas)`;
  } catch (error) {
    statusEl.textContent = "Error conectando con el backend.";
  }
};

const createTask = async (title, description) => {
  const response = await fetch(`${apiBaseUrl}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });

  if (!response.ok) {
    throw new Error("No se pudo crear la tarea");
  }

  return response.json();
};

const deleteTask = async (id) => {
  const response = await fetch(`${apiBaseUrl}/api/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("No se pudo eliminar la tarea");
  }

  await loadTasks();
};

formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = inputEl.value.trim();
  const description = descEl.value.trim();
  if (!title || !description) {
    return;
  }

  try {
    await createTask(title, description);
    inputEl.value = "";
    descEl.value = "";
    await loadTasks();
  } catch (error) {
    statusEl.textContent = "Error guardando la tarea.";
  }
});

loadTasks();
