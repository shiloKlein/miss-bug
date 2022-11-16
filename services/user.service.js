const gUsers = require('../data/user.json')

const fs = require('fs')
const Cryptr = require('cryptr')
const { serialize } = require('v8')
const cryptr = new Cryptr(process.env.PUKI_SOD)

module.exports = {
    checkLogin,
    save,
    getLoginToken,
    validateToken,
    query,
}

function query(filterBy) {
    return Promise.resolve(gUsers)
}


function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))

}

function save(user) {
    if (user._id) {
        const idx = gUsers.findIndex(currUser => currUser._id === user._id)
        gUsers[idx = user]
    } else {
        user._id = _makeId()
        gUsers.unshift(user)
    }
    return _saveUsersToFile()
        .then(() => ({ _id: user._id, fullname: user.fullname }))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

function checkLogin({ username, password }) {
    let user = gUsers.find(user => user.username === username)
    if (user) {
        user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    }
    return Promise.resolve(user)
}




function _makeId(length = 5) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gUsers, null, 2)

        fs.writeFile('data/user.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
