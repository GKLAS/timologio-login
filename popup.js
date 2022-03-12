let passwordsTable = document.createElement("table")
document.body.appendChild(passwordsTable)

chrome.storage.sync.get({passwords: []}, memory => {
    if (memory.passwords.length === 0) {
        passwordsTable.innerText = 'Nothing stored.'
    }
    for (const password of memory.passwords) {
        document.body.className = 'slim'
        const tr = document.createElement("tr")
        const deleteBtn = document.createElement("input")
        deleteBtn.type = "button"
        deleteBtn.value = "Delete"
        deleteBtn.addEventListener("click", _ => {
            chrome.storage.sync.get({passwords: []}, newMemory => {
                let pwdjson = JSON.stringify(password)
                const updatedPasswords = newMemory.passwords.filter(pwd => JSON.stringify(pwd) !== pwdjson)
                chrome.storage.sync.set({passwords: updatedPasswords}, _ => {
                    tr.remove()
                })
            })
        })
        let userName = document.createElement('td')
        userName.innerText = password.userName
        let vatNumber = document.createElement('td')
        vatNumber.innerText = password.vatNumber
        let subscriptionKey = document.createElement('td')
        subscriptionKey.innerText = password.subscriptionKey
        tr.append(userName, vatNumber, subscriptionKey, deleteBtn)
        tr.addEventListener('click', e => {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                if (e.target === deleteBtn) return
                const msg = {
                    userName: password.userName,
                    vatNumber: password.vatNumber,
                    subscriptionKey: password.subscriptionKey
                }
                chrome.tabs.sendMessage(tabs[0].id, msg)
            })
        })

        passwordsTable.appendChild(tr)
    }
})
