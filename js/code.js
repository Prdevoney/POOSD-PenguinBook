const urlBase = 'http://penguinbook.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = []
let selectedContactId = null;

var editMode = {};
var originalValues = {};

function doLogin() {
    event.preventDefault();
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
    console.log(document.cookie);
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addContact() {
    event.preventDefault();
    readCookie();

    let first = document.getElementById("contactTextFirst").value;
    let last = document.getElementById("contactTextLast").value;
    let phone = document.getElementById("contactTextNumber").value;
    let email = document.getElementById("contactTextEmail").value;

    document.getElementById('addContactForm').reset();
    var modalElement = document.getElementById('addContactModal');
    var modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    let tmp = {
        firstName: first,
        lastName: last,
        phone: phone,
        email: email,
        userId: userId
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                searchContact();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        console.log(err);
    }
}

function searchContact() {
    readCookie();
    if (document.getElementById("searchText").value == "") {
        text = "";
        document.getElementById("tbody").innerHTML = text;
        return;
    };
    let srch = document.getElementById("searchText").value;

    var jsonPayload = JSON.stringify({ userId: userId, search: srch });

    var url = urlBase + '/SearchContacts.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.results == undefined) {
                    let text = "";
                    document.getElementById("tbody").innerHTML = text;
                    return;
                }
                var results = jsonObject.results;

                let text = '<table class="table table-hover contact-table" border="1">';

                text += "<tr id='row'>"
                text += "<th></th>"
                text += "<th>First&nbsp;Name&nbsp;&nbsp;</th>"
                text += "<th>Last&nbsp;Name&nbsp;&nbsp;</th>"
                text += "<th>&nbsp;Email&nbsp;&nbsp;</th>"
                text += "<th>&nbsp;Phone&nbsp;</th>"
                text += "<tr/>"

                for (let i = 0; i < results.length; i++) {
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "'>";
                   
                    text += "<td>" +
                            "<button type='button' id='edit_button" + i + "' class='btn btn-success btn-sm contact-btn' onclick='edit_row(" + i + ")'>" +
                            "Edit" +
                            "</button> " +
                            "<button type='button' id='save_button" + i + "' class='btn btn-primary btn-sm contact-btn' onclick='save_row(" + i + ")' disabled>" +
                            "Save" +
                            "</button> " +
                            "<button type='button' onclick='delete_row(" + i + ")' class='btn btn-danger btn-sm contact-btn'>" +
                            "Delete" +
                            "</button>" +
                            "</td>";
                    text += "<td id='first_Name" + i + "'><span>" + results[i].FirstName + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + results[i].EmailAddress + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + results[i].PhoneNumber + "</span></td>";
                    text += "</tr>";
                }
                text += "</table>";

                document.getElementById("tbody").innerHTML = text;
            }
        }
        xhr.send(jsonPayload);
    }
    catch (err) {
        console.log(err);
    }
}

function edit_row(id) {
    var editBtn = document.getElementById("edit_button" + id);
    var saveBtn = document.getElementById("save_button" + id);

    if (editMode[id]) {
        document.getElementById("first_Name" + id).innerHTML = "<span>" + originalValues[id].namef + "</span>";
        document.getElementById("last_Name" + id).innerHTML = "<span>" + originalValues[id].namel + "</span>";
        document.getElementById("email" + id).innerHTML = "<span>" + originalValues[id].email + "</span>";
        document.getElementById("phone" + id).innerHTML = "<span>" + originalValues[id].phone + "</span>";
        
        saveBtn.disabled = true;
        editBtn.innerText = "Edit";
    } else {
        originalValues[id] = {
            namef: document.getElementById("first_Name" + id).innerText,
            namel: document.getElementById("last_Name" + id).innerText,
            email: document.getElementById("email" + id).innerText,
            phone: document.getElementById("phone" + id).innerText
        };

        var namef_data = originalValues[id].namef;
        var namel_data = originalValues[id].namel;
        var email_data = originalValues[id].email;
        var phone_data = originalValues[id].phone;

        document.getElementById("first_Name" + id).innerHTML = "<input type='text' id='namef_text" + id + "' value='" + namef_data + "' style='width: 100%;'>";
        document.getElementById("last_Name" + id).innerHTML = "<input type='text' id='namel_text" + id + "' value='" + namel_data + "' style='width: 100%;'>";
        document.getElementById("email" + id).innerHTML = "<input type='text' id='email_text" + id + "' value='" + email_data + "' style='width: 100%;'>";
        document.getElementById("phone" + id).innerHTML = "<input type='text' id='phone_text" + id + "' value='" + phone_data + "' style='width: 100%;'>";
        
        saveBtn.disabled = false;
        editBtn.innerText = "Undo";
    }
    editMode[id] = !editMode[id];
}

function save_row(no) {
    event.preventDefault();
    readCookie();
    var namef_val = document.getElementById("namef_text" + no).value;
    var namel_val = document.getElementById("namel_text" + no).value;
    var email_val = document.getElementById("email_text" + no).value;
    var phone_val = document.getElementById("phone_text" + no).value;
    var id_val = ids[no];
    var editBtn = document.getElementById("edit_button" + no);

    document.getElementById("first_Name" + no).innerHTML = namef_val;
    document.getElementById("last_Name" + no).innerHTML = namel_val;
    document.getElementById("email" + no).innerHTML = email_val;
    document.getElementById("phone" + no).innerHTML = phone_val;

    let tmp = {
        phone: phone_val,
        email: email_val,
        firstName: namef_val,
        lastName: namel_val,
        contactId: id_val
    };


    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }

    delete originalValues[no];
    document.getElementById("save_button" + no).disabled = true;
    editBtn.innerText = "Edit";
    editMode[no] = false;
}

function delete_row(no) {
    var namef_val = document.getElementById("first_Name" + no).innerText;
    var namel_val = document.getElementById("last_Name" + no).innerText;

    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);

    let check = confirm('Confirm deletion of contact: ' + nameOne + ' ' + nameTwo);
    if (check === true) {
        document.getElementById("row" + no + "").outerHTML = "";
        let tmp = {
            firstName: nameOne,
            lastName: nameTwo,
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("Contact has been deleted");
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }
    };
}

function register() {
    event.preventDefault();

    let password = document.getElementById("signPassword").value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    let errors = false;

    if (password !== confirmPassword) {
        document.getElementById('matchWarning').classList.add('text-danger');
        errors = true;
    } else {
        document.getElementById('matchWarning').classList.remove('text-danger');
    }

    if (password.length < 8 || password.length > 20) {
        document.getElementById('lengthWarning').classList.add('text-danger');
        errors = true;
    } else {
        document.getElementById('lengthWarning').classList.remove('text-danger');
    }

    const hasLettersAndNumbers = /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasLettersAndNumbers || !hasSymbols) {
        document.getElementById('contentWarning').classList.add('text-danger');
        errors = true;
    } else {
        document.getElementById('contentWarning').classList.remove('text-danger');
    }
    
    if (errors) return;

    let login = document.getElementById("signUserName").value;
    let firstName = document.getElementById("signFirst").value;
    let lastName = document.getElementById("signLast").value;

    let url = urlBase + '/Register.' + extension;

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: password
    };

    let jsonPayload = JSON.stringify(tmp);
    console.log(jsonPayload);
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                doLoginAfterRegister(login, password);
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("signLoginResult").innerHTML = err.message;
    }
}

function doLoginAfterRegister(login, password) {
    document.getElementById("loginName").value = login;
    document.getElementById("loginPassword").value = password;

    doLogin();
}
