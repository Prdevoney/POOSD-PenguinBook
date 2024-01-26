const urlBase = 'http://penguinbook.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() 
{
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    //var hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
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
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
	console.log(document.cookie); 
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	readCookie(); 

    let first = document.getElementById("firstName").value;
    let last = document.getElementById("lastName").value;
    let phone = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;

    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {
		firstName:first,
		lastName:last,
		phone:phone,
		email:email,
		userId:userId
	};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				loadContacts();
				showTable();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function showTable() {
    var x = document.getElementById("contactAddResult");
    var contacts = document.getElementById("contactsTable")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } else {
        x.style.display = "none";
        contacts.style.display = "block";
    }
}


function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}


function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].userId
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='firstName" + i + "'><span>" + jsonObject.results[i].firstName + "</span></td>";
                    text += "<td id='lastName" + i + "'><span>" + jsonObject.results[i].lastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].phone + "</span></td>";
                    text += "<tr/>"
                }
                text += "</table>"
                document.getElementById("tbody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

async function updateContact()
{
    let firstName = document.getElementbyId("firstName").value;
    let lastName = document.getElementbyId("lastName").value;
    let phone = document.getElementbyId("phone").value;
    let email = document.getElementbyId("email").value;
    
    document.getElementById("editError").innerHTML = "";
    
    const [status, responseJson] = await putData(
        window.urlBase + '/contacts/UpdateContact' + window.extension,
        {
            firstName:firstName,
            lastName:lastName,
            email:email, 
            phone:phone,
        });
    
    if (this.status == 200){
        localStorage.setItem("contactUpdateResult", JSON.stringify(responseJson.data));
    } else {
       // document.getElementById
    }	
}

function register()
{
	let login = document.getElementById("signUserName").value;
    let password = document.getElementById("signPassword").value;
	let firstName = document.getElementById("signFirst").value;
	let lastName = document.getElementById("signLast").value;
	//let email = document.getElementById("newEmail").value;

	let url = urlBase + '/Register.' + extension;

	let tmp = {
		firstName:firstName,
		lastName:lastName,
		login:login,
		password:password
	};
	let jsonPayload = JSON.stringify( tmp );
	console.log(jsonPayload);
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				doLoginAfterRegister(login, password);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("signLoginResult").innerHTML = err.message;
	}
}

function doLoginAfterRegister(login, password)
{
	document.getElementById("loginName").value = login; 
	document.getElementById("loginPassword").value = password;

	doLogin();
}

function deleteContact()
{
	var namef_val = document.getElementById("firstName" + no).innerText;
	var namel_val = document.getElementById("lastName" + no).innerText;
	nameOne = namef_val.substring(0, namef_val.length);
	nameTwo = namel_val.substring(0, namel_val.length);

		document.getElementById("row" + no + "").outerHTML = "";
		let tmp = {
			firstName: nameOne,
			lastName: nameTwo,
			userId: userId
		}

		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/DeleteContacts.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {

					console.log("Contact has been deleted");
					loadContacts();
				}
			};
			xhr.send(jsonPayload);
		} catch (err) {
			console.log(err.message);
		}

	};

