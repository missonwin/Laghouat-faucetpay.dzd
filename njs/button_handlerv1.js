const ButtonHandler = {
    updateSubmitButton: async () => {
        const loginForm = document.getElementById('loginForm');
        const claimForm = document.getElementById('claimForm');

        const button = document.querySelector('button[type="submit"]');
        if (!button) return;

        // Desactivar temporalmente mientras se decide qué mostrar
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Cargando...';

        if (loginForm) {
            MyApp.Utils.updateLoginButtonText(button);
        } else if (claimForm) {
            await MyApp.Utils.fetchAmountAndUpdateButton(button);
        } else {
            MyApp.Utils.handleFetchError(button);
        }
    }
};