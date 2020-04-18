$(document).ready(() => {
    $('.sidenav').sidenav()
    removeUser()
})

$('form').submit(async e => {
    e.preventDefault()
    $('button').attr('disabled', true)
    const data = {}
    $(document.querySelector('form').elements).serializeArray().map(item => {
        if (item.name) {
            data[item.name] = item.value
        }
    })
    let result = await fetch(`${baseApiUrl}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    result = await result.json()
    if (result.status !== 200)
        return M.toast({
            html: result.message,
            completeCallback: () => $('button').attr('disabled', false)
        })
    setUser(result.user._id, result.user.name, result.user.email, result.accessToken)
    M.toast({
        html: result.message,
        displayLength: 500,
        completeCallback: () => location = '/'
    })
})