const MyApp = {
    Utils: {
        post: async (url, data) => {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
            });
            return await response.json();
        },
        loadHTML: async (path, containerId = 'formContainer') => {
            const res = await fetch(path);
            document.getElementById(containerId).innerHTML = await res.text();
        },
        fetchAmountAndUpdateButton: async (buttonElement) => {
            try {
                const response = await fetch('faucet-config/config.php?action=amount');
                const data = await response.json();

                const amount = data.amount !== undefined ? data.amount : 0;
                const currency = data.currency !== undefined ? data.currency : 'DGB';

                MyApp.Utils.updateClaimButtonText(buttonElement, amount, currency);
            } catch (error) {
                MyApp.Utils.handleFetchError(buttonElement);
            }
        },
        updateLoginButtonText: (buttonElement) => {
            buttonElement.innerHTML = `<i class="fa-solid fa-user mr-2"></i> LOGIN`;
            buttonElement.disabled = false;
        },
        updateClaimButtonText: (buttonElement, amount, currency) => {
            buttonElement.innerHTML = `
        <i class="fa-solid fa-gift mr-2"></i>
        Claim ${amount} ${currency}
      `;
            buttonElement.disabled = false;
        },
        handleFetchError: (buttonElement) => {
            buttonElement.innerHTML = `<i class="fa-solid fa-exclamation-triangle mr-2"></i> ERROR`;
            buttonElement.disabled = true;
        },

        // ✅ showAlert ahora DENTRO de Utils
        showAlert: function(message, type, containerId) {
            const colorMap = {
                success: 'green',
                error: 'red',
                info: 'yellow',
            };

            const color = colorMap[type] || 'gray';

            // Obtener el contenedor por ID
            const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;

            if (!container) return;

            // Eliminar alertas existentes
            container.innerHTML = '';

            // Crear el elemento de alerta
            const alertDiv = document.createElement('div');
            alertDiv.className = `bg-${color}-500 text-white p-4 rounded-lg text-center shadow-md`;
            alertDiv.innerHTML = message;

            // Añadir al contenedor
            container.appendChild(alertDiv);

            // Ocultar con transición después de 5 segundos
            setTimeout(() => {
                alertDiv.style.transition = 'opacity 0.5s ease-out';
                alertDiv.style.opacity = '0';

                // Eliminar del DOM después de la transición
                setTimeout(() => {
                    if (alertDiv) {
                        alertDiv.remove();
                    }
                }, 500); // Esperar la transición
            }, 5000); // Mostrar durante 5 segundos
        }
    },
    Session: {
        check: async () => {
            const res = await MyApp.Utils.post('auth/auth.php', {
                action: 'check'
            });
            return {
                logged_in: Boolean(res.logged_in),
                email: res.email || null
            };
        },
        logout: async () => {
            const res = await MyApp.Utils.post('auth/auth.php', {
                action: 'logout'
            });
            return {
                logged_in: false,
                email: null
            };
        }
    }
};