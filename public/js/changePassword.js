let user

$(document).ready(() => {
    user = getUser()
})

$('form').submit(async e => {
    e.preventDefault()
    $('button').attr('disabled', true)
    let data = {}
    $(document.querySelector('form').elements).serializeArray().map(item => {
        if (item.name) {
            data[item.name] = item.value
        }
    })
    if (data.newPassword !== data.confirmPassword) return M.toast({
        html: 'Passwords do not match!',
        displayLength: 1000,
        completeCallback: () => $('button').attr('disabled', false)
    })
    data = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
    }
    const result = await fetch(`${baseApiUrl}/changepassword`, {
        method: 'PATCH',
        headers: {
            Authorization: user.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const json = await result.json()
    if (result.status === 400) return M.toast({
        html: json.message,
        displayLength: 2000,
        completeCallback: () => $('button').attr('disabled', false)
    })
    if (result.status === 200)
        M.toast({
            html: json.message,
            displayLength: 1000,
            completeCallback: () => location = '/profile.html'
        })
    else
        return location = '/signin.html'
})