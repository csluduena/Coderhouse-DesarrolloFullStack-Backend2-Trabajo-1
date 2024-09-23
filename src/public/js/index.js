// document.getElementById('loginForm').addEventListener('submit', function (e) {
//     e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     axios.post('/login', { email, password })
//         .then(response => {
//             console.log('Respuesta del servidor recibida:', response.data);
//             localStorage.setItem('token', response.data.token); // Guardar el token en localStorage
//             window.location.href = '/'; // Redirigir a la página principal
//         })
//         .catch(error => {
//             console.log('Error al iniciar sesión:', error);
//         });
// });