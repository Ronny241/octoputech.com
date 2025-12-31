const data = JSON.parse(localStorage.getItem("goals")) || {
  daily: [],
  monthly: [],
  yearly: [],
  lastDay: new Date().toDateString(),
  lastMonth: new Date().getMonth()
};

function save() {
  localStorage.setItem("goals", JSON.stringify(data));
}

function resetIfNeeded() {
  const now = new Date();

  if (data.lastDay !== now.toDateString()) {
    data.daily.forEach(g => g.done = false);
    data.lastDay = now.toDateString();
  }

  if (data.lastMonth !== now.getMonth()) {
    data.monthly.forEach(g => g.done = false);
    data.lastMonth = now.getMonth();
  }

  save();
}

function addGoal(type) {
  const input = document.getElementById(type + "Input");
  if (!input.value) return;

  data[type].push({ text: input.value, done: false });
  input.value = "";
  save();
  render();
}

function render() {
  ["daily", "monthly", "yearly"].forEach(type => {
    const ul = document.getElementById(type + "List");
    ul.innerHTML = "";

    data[type].forEach((goal, index) => {
      const li = document.createElement("li");

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = goal.done;
      cb.onchange = () => {
        goal.done = cb.checked;
        save();
        updateProgress();
      };

      li.append(cb, " " + goal.text);
      ul.appendChild(li);
    });
  });

  updateProgress();
}

function updateProgress() {
  const all = [...data.daily, ...data.monthly, ...data.yearly];
  const done = all.filter(g => g.done).length;
  const percent = all.length ? Math.round((done / all.length) * 100) : 0;

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").innerText = percent + "% completed";
}

resetIfNeeded();
render();
