total = {}



def work(worker_name, job_done, amount):
    complete = f"{worker_name} has done {job_done} Cost:{amount}"


    return complete


def show_totals(totalD):
    return{
            "totals":[{"worker":worker, "amount": round(amount,2)}
                      for worker, amount in totalD.items()]}






