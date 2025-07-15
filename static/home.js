document.getElementById("submit").addEventListener("click", ()=>{
let worker = document.getElementById("worker").value;
let service = document.getElementById("service").value;
let amount = document.getElementById("amount").value;

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
console.log("test1",data);
})
.catch(error => {
console.error("Problems sending data:", error);
})
});

