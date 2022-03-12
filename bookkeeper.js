function add_column() {
    let vat = document.getElementsByTagName('td')[0].innerText
    let table = document.getElementById('subscriptions')
    let header = table.tHead.rows[0]
    let saveHeader = document.createElement('th')
    saveHeader.innerText = 'Αποθήκευση'
    header.appendChild(saveHeader)
    let saveIcon = document.createElement('i')
    saveIcon.className = 'fa fa-floppy-o'
    for (let row of table.tBodies[0].rows) {
        let saveBtn = document.createElement('td')
        saveBtn.appendChild(saveIcon)
        saveBtn.addEventListener('click', _ => {
            chrome.storage.sync.get({passwords: []}, memory => {
                let msg = {
                    subscriptionKey: row.cells[0].innerText, userName: row.cells[1].innerText, vatNumber: vat
                }
                let msgjson = JSON.stringify(msg)
                console.log('start')
                console.log(msgjson)
                for (let qwerty of memory.passwords) {
                    console.log(JSON.stringify(qwerty) !== msgjson, JSON.stringify(qwerty))
                }
                console.log('end')

                function snackmsg(text) {
                    let snackbar = document.createElement('div')
                    snackbar.className = 'snackbar'
                    snackbar.innerText = text
                    document.body.appendChild(snackbar)
                    setTimeout(_ => snackbar.remove(), 3000)
                }

                if (memory.passwords.every(pwd => JSON.stringify(pwd) !== msgjson)) {
                    memory.passwords.push(msg)
                    chrome.storage.sync.set(memory).then(_ => snackmsg(`Stored "${msg.userName}" successfully.`))
                } else {
                    snackmsg(`"${msg.userName}" already stored.`)
                }
            })
        })
        row.appendChild(saveBtn)
    }
}

const observer = new MutationObserver(async (mutations, obs) => {
    if (document.getElementById('subscriptions')) {
        obs.disconnect()
        add_column()
    } else {
        console.log('not yet')
    }
});

observer.observe(document, {childList: true, subtree: true})
