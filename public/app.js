const botones = document.querySelector('#botones')
const nombusuario = document.querySelector('#nombUsuario')
const contenidoestable = document.querySelector('#contenidoestable')
const espacioChat = document.querySelector('#espacioChat')
const texto = document.querySelector('#texto')

firebase.auth().onAuthStateChanged( user => {
    if (user) {
        console.log(user)
        botones.innerHTML = /*html*/ `
        <button class="btn btn-outline-danger" id='btnCerrar'>Cerrar</button>
        `
        cerrar()
        nombusuario.innerHTML = user.displayName
        espacioChat.classList = 'input-group py-3 fixed-bottom container'
        contenidoChat(user)
        
    } else{
        console.log('No existe el usuario');
        botones.innerHTML = /*html*/`
            <button class="btn btn-outline-success" id='btnAcceder'>Acceder</button>
        `
        acceder()
        nombusuario.innerHTML = 'CHAT'
        contenidoestable.innerHTML = /*html*/`
        <p class="text-center lead mt-5">¿Te gustaria iniciar el chat?
        Pues... Ingresa de manera facil con tu cuenta de Google :)</p>
        `
        espacioChat.classList = 'input-group py-3 fixed-bottom container d-none'
        }

});    

const contenidoChat = (user) => {
    
    espacioChat.addEventListener('submit', (e) => {
        e.preventDefault()
        console.log(texto.value)
       
        if (!texto.value.trim()) {
            console.log('texto vacio')
            return
        }

        firebase.firestore().collection('chat').add({
            texto: texto.value,
            uid: user.uid,
            fecha: Date.now()
        })
        .then(res => {console.log('texto guardado')})
        
        texto.value = ''
    })

    firebase.firestore().collection('chat').orderBy('fecha')
    .onSnapshot(query => {
        //console.log(query)
        contenidoestable.innerHTML =''
        query.forEach(doc=>{
            console.log(doc.data())
            if (doc.data().uid === user.uid) {
                contenidoestable.innerHTML += /*html*/`
                <div class="d-flex d-flex justify-content-end">
                    <span class="badge badge-pill badge-primary">${doc.data().texto}</span>
                </div>
                `
            }else{
                contenidoestable.innerHTML += /*html*/`
                <div class="d-flex d-flex justify-content-start">
                    <span class="badge badge-pill badge-secondary">${doc.data().texto}</span>
                </div>
                `
            }
            contenidoestable.scrollTop = contenidoestable.scrollHeight
        })
    }) 
}

const acceder = () => {
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click', async() => {
    //console.log('entro')

        try {
            const provider = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithPopup(provider)
        } catch (error) {
            console.log(error)
        }
    })     
} 

const cerrar = () => {
    const btnCerrar = document.querySelector('#btnCerrar')
    btnCerrar.addEventListener('click', () => {
        firebase.auth().signOut()
        })
} 

