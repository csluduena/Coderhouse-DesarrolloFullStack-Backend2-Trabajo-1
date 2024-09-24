// document.addEventListener('DOMContentLoaded', () => {
//     const token = localStorage.getItem('token'); // Asegúrate de usar 'token'

//     if (token) {
//         fetch('/carts', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//             .then(response => {
//                 if (response.ok) {
//                     return response.json(); // Procesar la respuesta
//                 } else {
//                     throw new Error('Unauthorized');
//                 }
//             })
//             .then(data => {
//                 console.log('Carrito:', data);
//                 // Aquí puedes manejar los datos y renderizarlos en la vista
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//             });
//     } else {
//         console.log('No hay token disponible. Usuario no autenticado.');
//     }
// });



// // Ejemplo de código para almacenar el token en localStorage al hacer login
// async function loginUser(email, password) {
//     const response = await fetch('/api/sessions/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();
//     if (response.ok) {
//         localStorage.setItem('token', data.token); // Almacenar token
//         // Redirigir o hacer otra lógica
//     } else {
//         console.error(data.error);
//     }
// }

// // Ejemplo de código para eliminar el token al hacer logout
// function logout() {
//     localStorage.removeItem('token'); // Eliminar token
//     window.location.href = '/'; // Redirigir a la página de inicio
// }

// // Llama a esta función cuando necesites comprobar si el usuario está logueado
// function checkUserSession() {
//     const token = localStorage.getItem('token');
//     const loginLink = document.querySelector('.login-link');
//     const registerLink = document.querySelector('.register-link');
//     const logoutButton = document.querySelector('.button-container01 .main-button01[onclick="logout()"]');

//     if (token) {
//         // Verificar si el token es válido
//         verifyToken(token)
//             .then(() => {
//                 loginLink.style.display = 'none';
//                 registerLink.style.display = 'none';
//                 logoutButton.style.display = 'inline-block';
//             })
//             .catch(() => {
//                 // Token no es válido, mostrar solo el enlace de inicio de sesión
//                 loginLink.style.display = 'inline-block';
//                 registerLink.style.display = 'inline-block';
//                 logoutButton.style.display = 'none';
//             });
//     } else {
//         // No hay token, mostrar solo el enlace de inicio de sesión
//         loginLink.style.display = 'inline-block';
//         registerLink.style.display = 'inline-block';
//         logoutButton.style.display = 'none';
//     }
// }

// async function verifyToken(token) {
//     try {
//         const response = await fetch('/api/sessions/validate', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });

//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Token no válido');
//         }
//     } catch (error) {
//         throw error;
//     }
// }


// async function addToCart(productId) {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         console.error('No token found');
//         return;
//     }

//     try {
//         const response = await fetch(`/api/carts/${productId}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//         });

//         if (response.ok) {
//             // Actualiza la interfaz de usuario para mostrar el producto agregado al carrito
//         } else {
//             console.error('Error adding product to cart:', await response.json());
//         }
//     } catch (error) {
//         console.error('Error fetching carts:', error);
//     }
// }