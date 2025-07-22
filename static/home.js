function renderEntries(data) {
  const results = document.getElementById('results');
  results.textContent = ""; // Clear old DOM

  let workerColumns = {};

  // group by worker
  for (let day in data.days) {
    const entries = data.days[day];
    entries.forEach(entry => {
      const { worker, service, amount, tip, id } = entry;
      if (!workerColumns[worker]) {
        workerColumns[worker] = [];
      }
      workerColumns[worker].push({ service, amount, day, tip, id });
    });
  }

  // render per worker
  for (let worker in workerColumns) {
    const workerDiv = document.createElement("div");
    workerDiv.classList.add("worker-column");

    const heading = document.createElement("h3");
    heading.textContent = worker;
    workerDiv.appendChild(heading);

    workerColumns[worker].forEach(entry => {
      const line = document.createElement("p");
      line.innerHTML = `
        ${entry.service} on ${entry.day} for $${entry.amount} | TIPS:$${entry.tip}
        <button class="delete-btn" data-id="${entry.id}">(-_-)</button>
      `;
      workerDiv.appendChild(line);
    });

    const totalAmount = data.total[worker] ?? 0;
    const totalTips = data.tips[worker] ?? 0;

    const totalLine = document.createElement("p");
    totalLine.classList.add("total-line");
    totalLine.textContent = `Total amount for ${worker}: $${totalAmount.toFixed(2)} | Tips: $${totalTips.toFixed(2)}`;
    workerDiv.appendChild(totalLine);

    results.appendChild(workerDiv);
  }
}

function main(e) {
  e.preventDefault();
  let service = document.getElementById("service").value;
  let worker = document.getElementById("worker").value.trim().toLowerCase();
  let amount = parseFloat(document.getElementById("amount").value);
  let tip = parseFloat(document.getElementById("tip").value) || 0;
  let day = document.getElementById("day").value;

  let payload = { worker, service, amount, day, tip };

  fetch('/home', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      renderEntries(data); // just use payload from server
    })
    .catch(error => {
      console.error("Problems sending data:", error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('submit').addEventListener('click', main);

  document.getElementById("reset").addEventListener('click', () => {
    if (!confirm("Reset week? This clears everything.")) return;

    fetch('/reset', { method: "POST" })
      .then(res => res.json())
      .then(data => {
        renderEntries(data);
      })
      .catch(error => { console.error("Reset failed", error); });
  });
});

// global delete listener
document.addEventListener('click', function (e) {
  if (e.target.classList.contains("delete-btn")) {
    const idToDelete = e.target.dataset.id;

    fetch('/deleteEntry', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: idToDelete })
    })
      .then(res => res.json())
      .then(data => {
        renderEntries(data); // server returns full updated data now
      })
      .catch(error => {
        console.error("Error deleting entry:", error);
      });
  }
});

