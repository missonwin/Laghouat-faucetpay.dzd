// links_handler.js

const LinksModule = {
    linksData: [],
    visitedLinks: {},

    async loadLinksFromJSON() {
        try {
            const response = await fetch("njs/links.json");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new TypeError("La respuesta no es un JSON válido.");
            }

            this.linksData = await response.json();
            console.log("✅ Enlaces cargados:", this.linksData);
        } catch (err) {
            console.error("❌ Error al cargar los enlaces:", err);
        }
    },

    /**
     * OPTIMIZADO: Genera los enlaces usando innerHTML y delegación de eventos.
     * @param {function} onAllLinksVisitedCallback - Callback para cuando se completen todos los enlaces.
     */
    generateLinks(onAllLinksVisitedCallback) {
        const container = document.getElementById("links-container");
        if (!container) {
            console.error("El contenedor 'links-container' no fue encontrado.");
            return;
        }

        // 1. Generar el HTML de todos los enlaces usando map y join.
        // Se añade una clase 'dynamic-link' para identificarlos y un atributo 'data-url'.
        const linksHTML = this.linksData
            .map(({
                url,
                label
            }) => `
                <a href="${url}" 
                   class="block text-white hover:text-red-600 underline transition-colors duration-300 cursor-pointer dynamic-link" 
                   data-url="${url}"
                   rel="noopener noreferrer" 
                   target="_blank">
                    Link - ${label}
                </a>
            `)
            .join('');

        // 2. Construir la estructura completa en una sola cadena de texto.
        const fullHTML = `
            <div class="bg-gradient-to-br from-[#100B19] to-[#2C1B47] rounded-3xl p-6 shadow-lg space-y-4 mt-6 border-4 border-white" id="links-wrapper">
                <p class="text-white text-center font-medium">Steps: Click on all of the links below.</p>
                ${linksHTML}
            </div>
        `;

        // 3. Insertar todo el HTML en el DOM de una sola vez.
        container.innerHTML = fullHTML;
        container.classList.remove('hidden');

        // 4. Delegación de Eventos: Añadir UN SOLO listener al contenedor.
        const wrapper = document.getElementById('links-wrapper');
        if (!wrapper) return;

        // Usamos una función de flecha para que 'this' se refiera a LinksModule
        wrapper.addEventListener('click', (event) => {
            // Identificar si el clic fue en un enlace que nos interesa
            const clickedLink = event.target.closest('.dynamic-link');

            // Si no se hizo clic en un enlace, no hacer nada.
            if (!clickedLink) {
                return;
            }

            // Si el clic fue en un enlace, manejarlo.
            event.preventDefault();

            const url = clickedLink.dataset.url;

            // Evitar procesar un enlace ya visitado
            if (this.visitedLinks[url]) return;

            // Marcar como visitado
            this.visitedLinks[url] = true;

            // Ocultar el enlace
            clickedLink.style.display = 'none';

            // Comprobar si ya se completaron todos
            if (this.checkAllLinksVisited()) {
                if (onAllLinksVisitedCallback) {
                    onAllLinksVisitedCallback();
                }
                this.hideLinksContainer();
            }

            // Abrir el enlace en una nueva pestaña
            window.open(url, '_blank');
        });
    },

    hideLinksContainer() {
        const container = document.getElementById("links-container");
        if (container && !container.classList.contains('hidden')) {
            container.classList.add('hidden');
        }
    },

    checkAllLinksVisited() {
        if (this.linksData.length === 0) return false;
        return this.linksData.every(({
            url
        }) => this.visitedLinks[url]);
    },

    resetVisitedLinks() {
        this.visitedLinks = {};
        console.log("🔄 Estado de enlaces reiniciado.");
        // Para que los enlaces vuelvan a aparecer, se debe redibujar la interfaz.
        // La forma más fácil es llamar a generateLinks de nuevo desde donde se llame a reset.
        const container = document.getElementById("links-container");
        if (container) container.innerHTML = '';
    }
};

// Asignar el objeto constante a window para hacerlo global.
window.LinksModule = LinksModule;