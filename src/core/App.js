/**
 * 🏗️ APP.JS - GERENCIADOR PRINCIPAL DA POKÉDX
 *
 * Simples gerenciador que detecta se estamos na home ou detalhes
 * e inicializa a página apropriada.
 */

class App {
	constructor() {
		this.currentPage = null; // Página atual (home, detalhes ou outra)
		this.isInitialized = false; // Indica se a aplicação já foi inicializada
		console.log("🚀 App criada");
	}

	/**
	 * 🎯 Inicializa a aplicação
	 * @returns {Promise<boolean>} Retorna true se a inicialização for bem-sucedida
	 * @description
	 * Inicia a aplicação detectando a página atual e inicializando-a.
	 */
	async init() {
		try {
			console.log("🏁 Iniciando App...");

			// 🔍 Detectar página atual
			const currentPageType = this._detectCurrentPage();
			console.log(`📄 Página: ${currentPageType}`);

			// 🎬 Inicializar página
			await this._initializePage(currentPageType);

			this.isInitialized = true;
			console.log("✅ App inicializada!");
			return true;
		} catch (error) {
			console.error("💥 Erro na inicialização:", error);
			return false;
		}
	}

	/**
	 * 🔍 Detecta qual página estamos
	 * @returns {string} Tipo da página ("home" ou "details")
	 * @description
	 * Verifica o pathname e os parâmetros da URL para determinar se estamos na página home ou detalhes.
	 * Se houver um ID de Pokémon na URL, assume que estamos na página de detalhes.
	 */
	_detectCurrentPage() {
		const pathname = window.location.pathname; // Caminho atual da URL
		const urlParams = new URLSearchParams(window.location.search); // Parâmetros da URL
		const pokemonId = urlParams.get("id"); // ID do Pokémon na URL
		// const moveID = urlParams.get("idmove");

		// 📋 Se tem ID ou está em detalhes.html = página de detalhes
		if (pokemonId || pathname.includes("detalhes.html")) {
			return "details";
		}

		/* 
		if (moveID || pathname.includes("detalhes_move.html")) {
			return "details_move";
		}
		*/

		// 🏠 Caso contrário = página home
		return "home";
	}

	/**
	 * 🎬 Inicializa a página detectada
	 * @param {string} pageType - Tipo da página ("home" ou "details")
	 * @throws {Error} Se a página não for reconhecida
	 * @description
	 * Chama o método apropriado para inicializar a página com base no tipo detectado
	 */
	async _initializePage(pageType) {
		try {
			if (pageType === "home") {
				await this._initHomePage();
			} else if (pageType === "details") {
				await this._initDetailsPage();
			} /* else if (pageType === "details_move") {
				await this._initDetailsMovePage();
			}
			
			*/
		} catch (error) {
			console.error(`💥 Erro ao inicializar página ${pageType}:`, error);
			throw error;
		}
	}

	/**
	 * 🏠 Inicializa página home
	 * @description
	 * Carrega a HomePage e chama seu método init.
	 */
	async _initHomePage() {
		console.log("🏠 Inicializando HomePage...");

		const { HomePage } = await import("../pages/HomePage.js"); // Importa a classe HomePage
		this.currentPage = new HomePage();
		await this.currentPage.init();

		console.log("✅ HomePage inicializada");
	}

	/**
	 * 📋 Inicializa página de detalhes
	 * @description
	 * Carrega a DetailsPage e chama seu método init.
	 */
	async _initDetailsPage() {
		console.log("📋 Inicializando DetailsPage...");

		const { DetailsPage } = await import("../pages/DetailsPage.js"); // Importa a classe DetailsPage
		this.currentPage = new DetailsPage();
		await this.currentPage.init();

		console.log("✅ DetailsPage inicializada");
	}

	/**
	 * 🎯 Navegação para detalhes
	 * @param {number} pokemonId - ID do Pokémon a ser exibido
	 * @description
	 * Redireciona para a página de detalhes do Pokémon com o ID fornecido.
	 */
	goToDetails(pokemonId) {
		window.location.href = `detalhes.html?id=${pokemonId}`;
	}

	/**
	 * 🏠 Navegação para home
	 * @description
	 * Redireciona para a página inicial da Pokédex.
	 */
	goToHome() {
		window.location.href = "index.html";
	}

	/**
	 * 📊 Status da aplicação
	 * @returns {Object} Status da aplicação
	 * @description
	 * Retorna informações sobre a página atual e se a aplicação foi inicializada.
	 */
	getStatus() {
		return {
			currentPage: this.currentPage,
			isInitialized: this.isInitialized,
		};
	}
}

export { App };
export default App;
