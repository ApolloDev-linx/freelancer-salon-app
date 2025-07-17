function main(e){
	e.preventDefault();
let service = document.getElementById("service").value;
let worker = document.getElementById("worker").value;
let amount = parseInt(document.getElementById("amount").value);

let payload = {
	worker:worker,
	service:service,
	amount:amount
		};
fetch('/home',{
	method: "POST",
	headers:{"Content-type": "application/json"},
	body: JSON.stringify(payload)
		})
.then(res => res.json())
.then(data =>{
const results = document.getElementById('results');
	//data is is from our promise chain. holding what py sent us back in json.
	// to acces specific info use . whatever you used in py file. so worker comes from py file. data.worker
	results.textContent = "";
	data.totals.forEach(entry => {
	const {worker,amount} = entry;
	results.textContent += ` ${worker} has earned $${amount} \n`;
	});
	

console.log("test1",data);
})
.catch(error => {
console.error("Problems sending data:", error);
})
}
document.addEventListener('DOMContentLoaded',() =>{
let btn = document.getElementById('submit');
	btn.addEventListener('click',(e) => main(e));
});


