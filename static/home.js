function main(e){
	e.preventDefault();
let service = document.getElementById("service").value;
let worker = document.getElementById("worker").value;
let amount = parseInt(document.getElementById("amount").value);
let day = document.getElementById("day").value;

let payload = {
	worker:worker,
	service:service,
	amount:amount,
	day:day
		};
fetch('/home',{
	method: "POST",
	headers:{"Content-type": "application/json"},
	body: JSON.stringify(payload)
		})
.then(res => res.json())
.then(data =>{
 const results = document.getElementById('results');
      results.textContent = ""; // Clear old DOM

      // ✅ Build workerColumns from data.days
      let workerColumns = {};

      for (let day in data.days) {
        const entries = data.days[day];

        entries.forEach(entry => {
          const { worker, service, amount } = entry;

          if (!workerColumns[worker]) {
            workerColumns[worker] = [];
          }

          workerColumns[worker].push({ service, amount, day });
        });
      }

      // ✅ Now render each worker’s column
      for (let worker in workerColumns) {
        const workerDiv = document.createElement("div");
        workerDiv.classList.add("worker-column");

        const heading = document.createElement("h3");
        heading.textContent = worker;
        workerDiv.appendChild(heading);

        workerColumns[worker].forEach(entry => {
          const line = document.createElement("p");
          line.textContent = `${entry.service} on ${entry.day} for $${entry.amount}`;
          workerDiv.appendChild(line);
		        });
	      const totalAmount = data.total[worker];
		const totalLine = document.createElement("p");
		totalLine.classList.add("total-line");
		totalLine.textContent = `Total amount for ${worker}: $${totalAmount.toFixed(2)} `;
		workerDiv.appendChild(totalLine);

        results.appendChild(workerDiv);
      }
	

console.log("test1",data);
})
.catch(error => {
console.error("Problems sending data:", error);
})
}
document.addEventListener('DOMContentLoaded',() =>{
let btn = document.getElementById('submit');
btn.addEventListener('click',(e) => main(e));

let resetBtn = document.getElementById("reset");

resetBtn.addEventListener('click',() =>{
 fetch('/reset',{method: "POST"})
	.then(res => res.json())
	.then(data =>{
		const results = document.getElementById("results");
		results.textContent = "";
		console.log(data.message);


	})
	.catch(error => {console.error("Reset failed",error)});

})

});


