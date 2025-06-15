const LoginHandler = {
    showLoginForm: async () => {
        await MyApp.Utils.loadHTML('auth/login.html');
        const loginButton = document.querySelector('#loginForm button[type="submit"]');
        if (loginButton) {
            MyApp.Utils.updateLoginButtonText(loginButton);

            document.getElementById('loginForm').onsubmit = async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;

                // Desactivar botón mientras se procesa
                loginButton.disabled = true;
                loginButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Cargando...';

                const result = await MyApp.Utils.post('auth/auth.php', {
                    action: 'login',
                    loginEmail: email,
                    uId: LocalId.visitorId,
                });

                if (result.success) {
                    const session = await MyApp.Session.check(); // Solo una vez
                    FormHandler.showClaimForm(session); // Pasar sesión directamente
                    MyApp.Utils.showAlert(`¡Login exitoso ${session.email}`, "success", "alertContainer");
                } else {
                    MyApp.Utils.showAlert(`¡Error: ${(result.error || 'Desconocido')}`, "error", "alertContainer");
                    MyApp.Utils.updateLoginButtonText(loginButton);
                }
            };
        }

        await ButtonHandler.updateSubmitButton();
    }
};