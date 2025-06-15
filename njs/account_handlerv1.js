const AccountHandler = {
    showAccountInfoIfLoggedIn: (session) => {
        const accountContainer = document.getElementById('accountInfoContainer');
        const accountEmail = document.getElementById('accountEmail');

        // Si no existe el contenedor, salir
        if (!accountContainer) return;

        if (session && session.logged_in && session.email) {
            // Mostrar correo
            if (accountEmail) {
                accountEmail.textContent = `Account: ${session.email}`;
            }
            // Mostrar contenedor quitando 'hidden'
            accountContainer.classList.remove('hidden');
        } else {
            // Ocultar contenedor si no hay sesión
            accountContainer.classList.add('hidden');
        }
    }
};