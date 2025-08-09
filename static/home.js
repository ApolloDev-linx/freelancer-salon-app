// apollo



// this is our display function it takes the respone data from the backend. E.G data.days data.total data.tips.
function renderEntries(data) {
  const results = document.getElementById('results');
//clearing old DOM.	
  results.textContent = ""; 
// creating an empty object that will act as a container for the workers entries.
  let workerColumns = {};

// looping through the keys of data.days ("Monday","Tuesday") etc.
  for (let day in data.days) {
// here we grab the value of that key which is a list (array) of objects/entries each containing worker,service, amount etc.	  
    const entries = data.days[day];
// here we are looping over every object log in that day.
// and the entry variable is the current object its on. 
    entries.forEach(entry => {
      const { worker, service, amount, tip, id } = entry;
// if the workers name is not in the workerColumns then we assign that key to an empty list
// then add to the array value
      if (!workerColumns[worker]) {
        workerColumns[worker] = [];
      }
      workerColumns[worker].push({ service, amount, day, tip, id });
    });
  }

// grabs the key "worker" in workercolumns and gives us the value which is the name.
  for (let worker in workerColumns) {
    const workerDiv = document.createElement("div");
    workerDiv.classList.add("worker-column");

    const heading = document.createElement("h3");
// using our expresion worker we append that to the heading this is possible becuase
// we are looping the workerColumns keys [worker] but really its [karla] or whatever the input was.
// looping through every name and adding it to its each heading 
    heading.textContent = worker;
    workerDiv.appendChild(heading);
// looping through all the entires of a specific worker 
    workerColumns[worker].forEach(entry => {
// these next lines are essentially creating a p element injecting the entry/object from the array from the worker [karla] = [{obi},{obi},{obi},{obi}]
	    // for each entry there is a new <p> </p> the entry is injected the delete button with the entries id is added for targeting.
	    // finnaly the the paragraph is appended to that workers section.
      const line = document.createElement("p");
      line.innerHTML = `
        ${entry.service} on ${entry.day} for $${entry.amount} | TIPS:$${entry.tip}
        <button class="delete-btn" data-id="${entry.id}">(-_-)</button>
      `;
      workerDiv.appendChild(line);
    });
// insures we get a fallback if null or undifined
    const totalAmount = data.total[worker] ?? 0;
    const totalTips = data.tips[worker] ?? 0;
// this will be the total line the last line below every workers entries
    const totalLine = document.createElement("p");
    totalLine.classList.add("total-line");
// we now inject the workers name and there respectivaly there totals and tips	  
    totalLine.textContent = `Total amount for ${worker}: $${totalAmount.toFixed(2)} | Tips: $${totalTips.toFixed(2)}`;
    workerDiv.appendChild(totalLine);

    results.appendChild(workerDiv);
  }
}

function main(e) {
  e.preventDefault();
// building the payload 	
  let service = document.getElementById("service").value;
  let worker = document.getElementById("worker").value.trim().toLowerCase();
  let amount = parseFloat(document.getElementById("amount").value);
  let tip = parseFloat(document.getElementById("tip").value) || 0;
  let day = document.getElementById("day").value;
// short hand for {worker: worker, service:service, etc}
  let payload = { worker, service, amount, day, tip };

  fetch('/home', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
//once we get the data back from py we use it as argument in our render function we made to make the worker columns and entrie displays	    
      renderEntries(data); // just use payload from server
    })
    .catch(error => {
      console.error("Problems sending data:", error);
    });
}
//
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

