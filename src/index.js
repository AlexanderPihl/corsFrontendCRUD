import 'bootstrap/dist/css/bootstrap.css'



const tb = document.getElementById('tb');
const url = 'https://cphper.dk/cors/api/person/';

getAll();

/*
Get all users
*/
function getAll() {
    fetch(url + "all")
        .then(res => fetchWithErrorCheck(res))
        .then((data) => {
            const trs = data.all.map((user) => {
                return `<tr><td>${user.id}</td><td>${user.firstName}</td><td>${user.lastName}</td><td>${user.phone}</td>
            <td>
            <button class="btn btn-warning btn-sm" id="${user.id}" value="btn_editPerson" data-toggle="modal" data-target="#editPersonModal">
            <i class="material-icons align-middle iconfix">edit</i>edit</button>&nbsp;
            <button class="btn btn-danger btn-sm" id="${user.id}" value="btn_deletePerson" data-toggle="modal" data-target="#deleteModal">
            <i class="material-icons align-middle iconfix">delete</i>delete</button>
            </td></tr>`;
            });
            const trStr = trs.join('');
            tb.innerHTML = trStr;
        });
}

/*
Error check
*/
function fetchWithErrorCheck(res) {
    if (!res.ok) {
        return Promise.reject({ status: res.status, fullError: res.json() })
    }
    return res.json();
}


/*
Function for POST, PUT and DELETE
*/
function makeOptions(method, body) {
    const opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }
    if (body) {
        opts.body = JSON.stringify(body);
    }
    return opts;
}

/*
Reload site
*/
document.getElementById("btn_reload").onclick = () => {
    location.reload();
}

/*
Clear fields AddPerson
*/
document.getElementById("btn_clearFields").onclick = (e) => {
    e.preventDefault();
    document.getElementById('fName').value = '';
    document.getElementById('lName').value = '';
    document.getElementById('phone').value = '';
}

/*
Clear error message
*/
document.getElementById("btn_addPersonModal").onclick = (e) => {
    e.preventDefault();
    document.getElementById('errorMsg').innerHTML = '';
}

/*
Insert user
*/
document.getElementById('btn_addperson').onclick = () => {
    const fname = document.getElementById('fName').value;
    const lname = document.getElementById('lName').value;
    const phone = document.getElementById('phone').value;
// validate if fname and lname is empty
    const data = {
        firstName: fname,
        lastName: lname,
        phone: phone

    };
    const options = makeOptions("POST", data);
    fetch(url, options)
        .then(res => fetchWithErrorCheck(res))
        .then(resp => {
            getAll();
        })
        .catch(err => {
            if (err.status) {
                err.fullError.then(e => document.getElementById('errorMsg').innerHTML = e.message) // console.log(e.detail)
            }
            else { console.log("Network error"); }
        })

};



/*
Click handler for Delete and Edit
*/
const outer = document.getElementById("tb");
outer.onclick = function (e) {
    const target = e.target;
    document.getElementById('errorMsg').innerHTML = ''; // Clear error message

    /*
    Delete user
    */
    if (target.value == "btn_deletePerson") {
        document.getElementById("btn_delete").onclick = function () {
            console.log("delete");
            console.log(target.id);

            const options = makeOptions("DELETE");
            fetch(`${url}delete/${target.id}`, options)
                .then(res => fetchWithErrorCheck(res))
                .then(resp => {
                    getAll();
                })
                .catch(err => {
                    if (err.status) {
                        err.fullError.then(e => console.log(e.detail))
                    }
                    else { console.log("Network error"); }
                })
        }
    }

    /*
    Edit user
    */
    if (target.value == "btn_editPerson") {

        console.log("edit");
        console.log(target.id);
        const id = target.id;

        // reset inputfields
        document.getElementById('efName').value = '';
        document.getElementById('elName').value = '';
        document.getElementById('ephone').value = '';

        // fetch uservalues from id and add to inputfield
        fetch(url + id)
            .then(res => fetchWithErrorCheck(res))
            .then(user => {

                document.getElementById('efName').value = user.firstName;
                document.getElementById('elName').value = user.lastName;
                document.getElementById('ephone').value = user.phone;

            })
            .catch(err => {
                if (err.status) {
                    err.fullError.then(e => console.log(e.detail))
                }
                else { console.log("Network error"); }
            })

        // If 'save changes' button in modal is clicked 
        document.getElementById('btn_edit').onclick = function () {

            const efname = document.getElementById('efName').value;
            const elname = document.getElementById('elName').value;
            const ephone = document.getElementById('ephone').value;
            // validate if efname and elname is empty
            // onclick will close modal??
            const data = {
                firstName: efname,
                lastName: elname,
                phone: ephone
            };
            const options = makeOptions("PUT", data);
            fetch(`${url}update/${id}`, options)
                .then(res => fetchWithErrorCheck(res))
                .then(resp => {
                    getAll();
                })
                .catch(err => {
                    if (err.status) {
                        err.fullError.then(e => document.getElementById('errorMsg').innerHTML = e.message) // console.log(e.detail)
                    }
                    else { console.log("Network error"); }
                })
        };
    }



};




