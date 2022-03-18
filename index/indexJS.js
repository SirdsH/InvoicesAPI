window.onload = () => {
    redraw()
}

const redraw = () => {
    let writeOut = document.getElementById('writeOut')
    writeOut.innerHTML = ""
    let createBtn = document.getElementById('createBtn')
    let trueOrNot = document.getElementById('trueOrNot')
    trueOrNot.innerHTML = ""

    let textWrapper = document.querySelector('.ml11 .letters');
    textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: true})
        .add({
            targets: '.ml11 .line',
            scaleY: [0,1],
            opacity: [0.5,1],
            easing: "easeOutExpo",
            duration: 700
        })
        .add({
            targets: '.ml11 .line',
            translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
            easing: "easeOutExpo",
            duration: 700,
            delay: 100
        }).add({
        targets: '.ml11 .letter',
        opacity: [0,1],
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=775',
        delay: (el, i) => 34 * (i+1)
    }).add({
        targets: '.ml11',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
    });


    fetch('http://164.92.142.211/9f7c75e9-6dfa-44f0-be35-456e466ce394/Invoices', {
        method: 'GET'
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data)

            const sum = data.filter(i => i.paid).reduce((a, b) => a + b.amount, 0)
            const sum2 = data.filter(i => !i.paid).reduce((a, b) => a + b.amount, 0)


            console.log(sum)
            let div = document.createElement('div')
            div.className = 'text-success'

            let div2 = document.createElement('div')
            div2.className = 'text-danger'

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
