//Control de usuarios
//José Pablo Peñaloza Cobos
//NOV-2020

////VARIABLES///
//elementos del html
const signUp = document.getElementById("signUp-form");//Forma del signUP
const signIn = document.getElementById("signIn-form");//Forma del signIn
const logOut = document.getElementById("LogOutBtn");//Forma del signIn
const userNavBar = document.getElementById("userNav");//Texto del navbar del usuario loggeado

const onGetUsuarios = (callback) => db.collection('Usuarios').onSnapshot(callback);
const getUser = (id) => db.collection('Usuarios').doc(id).get();


//Eventos
signUp.onsubmit = async e => { //Función que se ejecuta cuando se sube la forma de añadir un ususario
    e.preventDefault();
    const email = document.getElementById("signup-email").value;//Valor del correo que se sube
    const password = document.getElementById("signup-password").value;//Valor de la nueva contraseña

    auth
        .createUserWithEmailAndPassword(email, password)//Se registra el usuario
        .then(userCredential => {//Recibe las credenciales del usuario
            signUp.reset();//Reseta el form
            $('#SignUpModal').modal('hide')//Busca el modal y lo esconde
            console.log('Correo registrado')
        })

    salvarUsuario(email, password);
}
signIn.addEventListener('submit', (e) => {//Evento que se ejecuta cuando se sube en sign in
    e.preventDefault();//Evita que la página se recarge al subir el form

    const email = document.getElementById("Login-email").value;//Valor del correo que se sube
    const password = document.getElementById("Login-password").value;//Valor de la contraseña

    auth
        .signInWithEmailAndPassword(email, password)//Se loggea el usuario
        .then(userCredential => {//Recibe las credenciales del usuario
            signIn.reset();//Reseta el form
            $('#SignInModal').modal('hide')//Busca el modal y lo esconde
            console.log('Loggeo')

        })
        
})
logOut.addEventListener('click', (e) => {//Evento que se ejecuta cuando se hace clik en el boton de log out.
    e.preventDefault();
    auth.signOut().then(() => {
        console.log("Ya no estas loggeado");
    })
})
auth.onAuthStateChanged(async(user) => {//Evento que se ejecuta cada que hay un 
    const CRUDBTn = document.getElementById("Info");//Botón del navbar del CRUD
    if (user) {
        console.log("loggeado", user.email)
        userNavBar.innerHTML = `${user.email}`;
        let boolisAdmin = await isAdmin(user.email);  
        if(boolisAdmin){
            userNavBar.innerHTML += "👑";
            CRUDBTn.style.display = "block";
        }
        else
            CRUDBTn.style.display = "none";

    }
    else {
        console.log("no estas loggeado")
        CRUDBTn.style.display = "none";
    }
})



//Funciones
const salvarUsuario = (correo, contraseña) => {//Guarda lo escrito en la forma en la base de datos 
    db.collection('Usuarios').doc(correo).set({ //Acceder a la base de datos puede tardar. Le indicamos que espere a que se ejecute
        correo: correo,
        contraseña: contraseña,
        isAdmin: false
    });

    console.log("subido")
}

async function isAdmin(id){
    const usuario = await getUser(id);
    console.log(usuario.data().isAdmin)
    if(usuario.data().isAdmin)
        return true;
    else
        return false;
}

