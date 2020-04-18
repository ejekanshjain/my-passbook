let user

const getAndSetProfile = async token => {
    let result = await fetch(`${baseApiUrl}/profile`, {
        method: 'GET',
        headers: {
            Authorization: token
        }
    })
    if (result.status !== 200) return location = '/signin.html'
    let userProfile = await result.json()
    userProfile = userProfile.userProfile
    $('#name').val(userProfile.name)
    $('#email').val(userProfile.email)
    $('.gender-select').append(`
        <select name="gender" id="gender" required>
            <option value="male" ${userProfile.gender === 'male' ? 'selected' : ''}>Man</option>
            <option value="female" ${userProfile.gender === 'female' ? 'selected' : ''}>Woman</option>
            <option value="other" ${userProfile.gender === 'other' ? 'selected' : ''}>Other</option>
        </select>
        <label for="gender">Gender</label>
    `)
    $('select').formSelect()
    $('#dateOfBirth').val(userProfile.dateOfBirth.split('T')[0])
    $('.last-updated').append(`<p class="grey-text">Last Updated: ${new Date(userProfile.updatedAt).toUTCString()}</p>`)
    $('.progress').fadeOut()
    $('button').attr('disabled', false)
}

$(document).ready(() => {
    $('.sidenav').sidenav()
    $('.modal').modal()
    $('.datepicker').datepicker({
        autoClose: true,
        format: 'yyyy-mm-dd'
    })
    user = getUser()
    $('button').attr('disabled', true)
    getAndSetProfile(user.accessToken)
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
    const result = await fetch(`${baseApiUrl}/profile`, {
        method: 'PATCH',
        headers: {
            Authorization: user.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (result.status !== 200) return location = '/signin.html'
    const json = await result.json()
    M.toast({
        html: json.message,
        displayLength: 2500,
        completeCallback: () => $('button').attr('disabled', false)
    })
})