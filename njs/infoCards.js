const InfoCards = {
    init: async function() {
        const container = document.getElementById("containerInfo");
        if (!container) return;

        try {
            // Cargar datos del JSON
            const response = await fetch("faucet-config/infoCards.json");
            const data = await response.json();

            // Generar cada card con los datos
            const usuariosCard = createUsuariosCard(data.totalUsers);
            const pagosCard = createPagosCard(data.totalPayouts);

            // Insertar contenido
            container.innerHTML = usuariosCard + pagosCard;
        } catch (error) {
            console.error("Error al cargar o procesar los datos:", error);
        }
    },
};

// Funciones independientes para generar las cards
function createUsuariosCard(totalUsers) {
    return `
    <div class="bg-gradient-to-br from-purple-500 to-blue-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
      <div class="text-white w-12 h-12 mb-4 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
        <i class="fa-solid fa-users text-3xl"></i>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">Total users</h3>
      <p class="text-gray-200">${totalUsers}</p>
    </div>
  `;
}

function createPagosCard(totalPayouts) {
    return `
    <div class="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
      <div class="text-white w-12 h-12 mb-4 flex items-center justify-center bg-white bg-opacity-20 rounded-full">
        <i class="fa-solid fa-wallet text-3xl"></i>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">Total payouts</h3>
      <p class="text-gray-200">${totalPayouts}</p>
    </div>
  `;
}