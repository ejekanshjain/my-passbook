$(document).ready(() => {
    $('.sidenav').sidenav()
    $('select').formSelect()
    $('.datepicker').datepicker({
        autoClose: true,
        format: 'yyyy-mm-dd'
    })
    removeUser()
})

$('form').submit(async e => {
    e.preventDefault()
    $('button').attr('disabled', true)
    if ($('#password').val() !== $('#confirmPassword').val())
        return M.toast({
            html: 'Passwords do not match!',
            displayLength: 3000,
            completeCallback: () => $('button').attr('disabled', false)
        })
    const data = {}
    $(document.querySelector('form').elements).serializeArray().map(item => {
        if (item.name && item.name !== 'confirmPassword') {
            data[item.name] = item.value
        }
    })
    let result = await fetch(`${baseApiUrl}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (result.status === 201)
        return M.toast({
            html: 'Sign Up Successfull!',
            displayLength: 1000,
            completeCallback: () => location = '/signin.html'
        })
    result = await result.json()
    M.toast({
        html: result.message
    })
    $('button').attr('disabled', false)
})