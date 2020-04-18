let user

const getAndSetPasswords = async token => {
    let result = await fetch(`${baseApiUrl}/passwords`, {
        method: 'GET',
        headers: {
            Authorization: token
        }
    })
    if (result.status !== 200) return location = '/signin.html'
    result = await result.json()
    let passwordstemplate = ''
    result.passwords.forEach(p => {
        passwordstemplate += `
            <li class="collection-item">
                <div>
                    ${p.name}
                    <a href="#" class="secondary-content" onclick="deletePassword('${p._id}')">
                        <i class="material-icons red-text">delete_forever</i>
                    </a>
                    <a href="#" class="secondary-content"
                        onclick="openPasswordUpdateModal({_id: '${p._id}', name: '${p.name}', username: '${p.username}', pass: '${p.pass}'})">
                        <i class="material-icons indigo-text">create</i>
                    </a>
                    <a href="#" class="secondary-content"
                        onclick="openPasswordViewModal({name: '${p.name}', username: '${p.username}', pass: '${p.pass}'})">
                        <i class="material-icons">remove_red_eye</i>
                    </a>
                </div>
            </li>
        `
    })
    $('.passwords').append(passwordstemplate)
    $('.progress').remove()
}

$(document).ready(() => {
    $('.sidenav').sidenav()
    $('.modal').modal()
    $('.fixed-action-btn').floatingActionButton()
    $('.tooltipped').tooltip()
    $('.modal').modal()
    user = getUser()
    getAndSetPasswords(user.accessToken)
})

$('.addPassword').submit(async e => {
    e.preventDefault()
    $('#addPasswordModal').modal('close')
    const data = {}
    $(document.querySelector('.addPassword').elements).serializeArray().map(item => {
        if (item.name) {
            data[item.name] = item.value
        }
    })
    const result = await fetch(`${baseApiUrl}/passwords`, {
        method: 'POST',
        headers: {
            Authorization: user.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (result.status !== 201) return location = '/signin.html'
    let json = await result.json()
    if (result.status === 201) {
        M.toast({ html: json.message, displayLength: 750, completeCallback: () => location = '/' })
    }
})

const deletePassword = async id => {
    const result = await fetch(`${baseApiUrl}/passwords/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: user.accessToken
        }
    })
    if (result.status !== 200) return location = '/signin.html'
    const json = await result.json()
    if (result.status === 200) {
        M.toast({ html: json.message, displayLength: 750, completeCallback: () => location = '/' })
    }
}

const openPasswordViewModal = ({ name, username, pass }) => {
    $('#passwordViewModal').modal('open')
    $('#name2').val(name)
    $('#username2').val(username)
    $('#pass2').val(pass)
}

const openPasswordUpdateModal = ({ _id, name, username, pass }) => {
    $('#passwordUpdateModal').modal('open')
    $('#_id3').val(_id)
    $('#name3').val(name)
    $('#username3').val(username)
    $('#pass3').val(pass)
}

$('.updatePassword').submit(async e => {
    e.preventDefault()
    $('#passwordUpdateModal').modal('close')
    const data = {}
    $(document.querySelector('.updatePassword').elements).serializeArray().map(item => {
        if (item.name) {
            data[item.name] = item.value
        }
    })
    const result = await fetch(`${baseApiUrl}/passwords`, {
        method: 'PATCH',
        headers: {
            Authorization: user.accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (result.status !== 200) return location = '/signin.html'
    let json = await result.json()
    if (result.status === 200) {
        M.toast({ html: json.message, displayLength: 750, completeCallback: () => location = '/' })
    }
})