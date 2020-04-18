// const baseApiUrl = 'http://localhost:5000/api'
const baseApiUrl = 'https://my-passbook.herokuapp.com/api'
const localStorageKey = 'FQgbyF2BRg6jLYGtNyk4Qv46zJEyiGwo'
const expTime = 1000 * 59 * 59

const getUser = () => {
    const user = JSON.parse(localStorage.getItem(localStorageKey))
    if (user)
        if (user.expAt <= Date.now()) {
            localStorage.removeItem(localStorageKey)
            M.toast({
                html: 'Sign In again to Continue!',
                displayLength: 1500,
                completeCallback: () => location = '/signin.html'
            })
        } else {
            return user
        }
    location = '/signin.html'
}

const setUser = (_id, name, email, accessToken) => {
    const user = {
        _id,
        name,
        email,
        accessToken,
        expAt: Date.now() + expTime
    }
    localStorage.setItem(localStorageKey, JSON.stringify(user))
}

const removeUser = () => {
    localStorage.removeItem(localStorageKey)
}