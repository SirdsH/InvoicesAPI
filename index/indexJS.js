window.onload = () => {
    redraw()
}

const redraw = () => {
    let writeOut = document.getElementById('writeOut')
    writeOut.innerHTML = ""
    let createBtn = document.getElementById('createBtn')
    let trueOrNot = document.getElementById('trueOrNot')
    trueOrNot.innerHTML = ""


    fetch('http://164.92.142.211/9f7c75e9-6dfa-44f0-be35-456e466ce394/Invoices', {
        method: 'GET'
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)

            const sum = data.filter(i => i.paid).reduce((a,b) => a + b.amount, 0)
            const sum2 = data.filter(i => !i.paid).reduce((a,b) => a + b.amount, 0)
            console.log(sum)
            let div = document.createElement('div')
            let div2 = document.createElement('div')
            div.innerHTML = `<strong>Paid Invoices:</strong> ${sum}`
            div2.innerHTML = `<strong>Not Paid Invoices:</strong> ${sum2}`
            trueOrNot.appendChild(div)
            trueOrNot.appendChild(div2)


            for (let i = 0; i < data.length; i++) {

                let li = document.createElement("li")
                li.className = "d-flex justify-content-between list-group-item"
                li.innerHTML = `${data[i].to}`


                let deleteIcon = document.createElement('i')
                deleteIcon.className = "fa-solid fa-trash"

                deleteIcon.addEventListener('click', () => {
                    console.log("delete")
                    fetch('http://164.92.142.211/9f7c75e9-6dfa-44f0-be35-456e466ce394/Invoices/' + data[i].id, {
                        method: 'DELETE'
                    })
                        .then((response) => location.reload())
                })

                let amount = document.createElement("span")
                amount.classList.add('pe-2')
                amount.innerHTML = data[i].amount

                let paid = document.createElement("i")
                paid.className = 'fa-solid fa-xmark ps-2'
                if (data[i].paid === true) {
                    paid.classList.add('text-success')
                } else {
                    paid.classList.add('text-danger')
                }


                paid.addEventListener('click', () => {
                    fetch('http://164.92.142.211/9f7c75e9-6dfa-44f0-be35-456e466ce394/Invoices/' + data[i].id + "/Paid", {
                        method: 'POST'
                    })
                        .then((response) => {
                            redraw()
                        })
                })

                let icons = document.createElement("span")
                icons.appendChild(amount)
                icons.appendChild(deleteIcon)
                icons.appendChild(paid)


                li.appendChild(icons)
                writeOut.appendChild(li)


            }
        })

    createBtn.addEventListener("click", write)

    function write() {
        let inputCompany = document.getElementById('inputCompany')
        let inputAmount = document.getElementById('inputAmount')
        const data = {
            to: inputCompany.value,
            amount: inputAmount.value
        }

        fetch('http://164.92.142.211/9f7c75e9-6dfa-44f0-be35-456e466ce394/Invoices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
            .then(response => window.location.reload())
    }

}
