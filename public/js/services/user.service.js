const KEY = 'userDB'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'


// signup({fullname: 'Muki Ba', username: 'muki', password: 'secret'})

export const userService = {
    getLoggedInUser,
    login,
    logout,
    query,
}


function query() {
    return axios.get('/api/users/')
        .then(res => res.data)
        .catch(console.log)
}

function getLoggedInUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

// login( {username:'koby', password: 'fullname' })
function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            return _setLoggedinUser(user)
        })
        .catch(err => console.log)
}

// function signup({ username, password, fullname }) {
//     const user = { username, password, fullname }
//     return axios.post('/api/auth/signup', user)
//         .then(res => res.data)
//         .then(user => {
//             return _setLoggedinUser(user)
//         })
// }


function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
        })
        .catch(err => console.log)
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(userToSave))
    return userToSave
}