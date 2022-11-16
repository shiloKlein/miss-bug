const fs = require('fs')
const bugs = require('../data/bug.json')


module.exports = {
    query,
    getById,
    remove,
    save,
}

const itemsPerPage = 3


function query(filterBy) {
    console.log(filterBy);
    const { title, page } = filterBy
    const regex = new RegExp(title, 'i')
    let filteredBugs = bugs.filter(bug => regex.test(bug.title))

    const startIdx = page * itemsPerPage
    const totalPages =  Math.ceil(filteredBugs.length/itemsPerPage)
    filteredBugs= filteredBugs.slice(startIdx, startIdx+itemsPerPage)

    // return Promise.resolve(filteredBugs)
    return Promise.resolve({totalPages, filteredBugs})
}

function getById(bugId) {
    const bug = bugs.find(bug => {
        return bug._id === bugId
    })
    return Promise.resolve(bug)
}

function save(bug) {
    if (bug._id) {
        console.log('bug server service update', bug);
        const idx = bugs.findIndex(currBug => bug._id === currBug._id)
        bugs[idx] = bug
    } else {
        console.log('bug server service new', bug);
        bug._id = _makeId()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}



function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}