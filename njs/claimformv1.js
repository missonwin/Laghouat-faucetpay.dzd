const FormHandler = {
    showClaimForm: async (session) => {
        await MyApp.Utils.loadHTML('auth/claim.html');

        const form = document.getElementById('claimForm');
        const logoutButton = document.getElementById('logoutButton');
        const alertContainer = document.getElementById('alertContainer');

        // === Manejo del formulario ===
        if (form) {
            form.onsubmit = async (e) => {
                e.preventDefault();

                const cryptoTypeInput = document.getElementById("cryptoType");
                if (!cryptoTypeInput) {
                    MyApp.Utils.showAlert("Campo 'Moneda' no encontrado.", "error", "alertContainer");
                    return;
                }

                const cryptoType = cryptoTypeInput.value.trim();

                if (!cryptoType) {
                    MyApp.Utils.showAlert("Por favor, selecciona una moneda.", "info", "alertContainer");
                    return;
                }

                LinksModule.resetVisitedLinks();

                // Generar enlaces y enviar recompensa con el valor guardado
                LinksModule.generateLinks(() => {
                    MyApp.Utils.showAlert("Processing your transaction...", "info", "alertContainer");
                    setTimeout(() => {
                        RewardHandler.submitClaimFormWith(cryptoType);

                    }, 5000); // Mostrar durante 5 segundos

                });
            };
        }

        // === Botón de logout ===
        if (logoutButton && !logoutButton.dataset.listener) {
            logoutButton.addEventListener('click', async () => {
                try {
                    await MyApp.Session.logout();
                    location.reload(); // Recargar para mostrar login nuevamente
                } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                }
            });
            logoutButton.dataset.listener = 'true'; // Evitar múltiples listeners
        }

        // === Actualizar botón dinámico ===
        await ButtonHandler.updateSubmitButton();

        // === Mostrar info de cuenta ===
        AccountHandler.showAccountInfoIfLoggedIn(session);
    }
};