/**
 * 📋 DETAILSPAGE.JS - PÁGINA DE DETALHES DO POKÉMON
 *
 * Gerencia a página de detalhes individual do Pokémon.
 * Integra com os componentes e APIs existentes.
 *
 * @author Gustavo
 * @version 1.0.0
 */

import pokemonAPI from "../services/PokemonAPI.js";
import PokemonDetails from "../components/PokemonDetails.js";
import { showPageLoading } from "../components/LoadingSpinner.js";
import { showError, showPokemonNotFound } from "../components/ErrorMessage.js";
import { DOMUtils } from "../utils/index.js";

/**
 * 📋 Classe da página de detalhes
 */
class DetailsPage {
	constructor() {
		this.pokemonId = null;
		this.pokemonData = null;
		this.pokemonDetailsComponent = null;
		this.loadingSpinner = null;

		// 🔍 Elementos da página
		this.detailsContainer = null;
		this.backButton = null;
		this.errorContainer = null;

		console.log("📋 DetailsPage criada");
	}

	/**
	 * 🎯 Inicializa a página
	 */
	async init() {
		try {
			console.log("📋 Inicializando DetailsPage...");

			// 🔍 Obter ID do Pokémon da URL
			this.pokemonId = this._getPokemonIdFromUrl();

			if (!this.pokemonId) {
				throw new Error("ID do Pokémon não encontrado na URL");
			}

			// 🔍 Encontrar elementos da página
			this._findPageElements();

			// 👂 Configurar event listeners
			this._setupEventListeners();

			// 📋 Carregar dados do Pokémon
			await this.loadPokemonDetails();

			console.log("✅ DetailsPage inicializada com sucesso");
			return true;
		} catch (error) {
			console.error("❌ Erro ao inicializar DetailsPage:", error);
			this._showError("Erro ao carregar detalhes", error.message);
			return false;
		}
	}

	/**
	 * 🔍 Obtém ID do Pokémon da URL
	 * @returns {number|null} ID do Pokémon
	 * @private
	 */
	_getPokemonIdFromUrl() {
		const urlParams = new URLSearchParams(window.location.search);
		const idParam = urlParams.get("id");

		if (idParam) {
			const id = parseInt(idParam, 10);
			if (!isNaN(id) && id > 0) {
				console.log(`🔍 ID do Pokémon encontrado: ${id}`);
				return id;
			}
		}

		console.warn("⚠️ ID do Pokémon inválido ou não encontrado na URL");
		return null;
	}

	/**
	 * 🔍 Encontra elementos importantes da página
	 * @private
	 */
	_findPageElements() {
		this.detailsContainer = DOMUtils.findElement(
			"#pokemon-details, .pokemon-details, .details-container"
		);
		this.backButton = DOMUtils.findElement("#back-btn, .back-button");
		this.errorContainer = DOMUtils.findElement("#error-container");

		if (!this.detailsContainer) {
			// 📝 Criar container se não existir
			this.detailsContainer = document.body;
			console.log("⚠️ Container de detalhes não encontrado, usando body");
		}

		console.log("🔍 Elementos da página encontrados");
	}

	/**
	 * 👂 Configura event listeners da página
	 * @private
	 */
	_setupEventListeners() {
		// 🔙 Botão voltar
		if (this.backButton) {
			this.backButton.addEventListener("click", () => {
				this.goBack();
			});
		}

		// ⌨️ Tecla ESC para voltar
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				this.goBack();
			}
		});

		console.log("👂 Event listeners configurados");
	}

	/**
	 * 📋 Carrega detalhes do Pokémon
	 */
	async loadPokemonDetails() {
		try {
			console.log(`📋 Carregando detalhes do Pokémon #${this.pokemonId}...`);

			// ⏳ Mostrar loading
			this._showPageLoading("Carregando detalhes do Pokémon...");

			// 🌐 Buscar dados da API
			this.pokemonData = await pokemonAPI.getPokemonDetails(this.pokemonId);

			// 🎨 Renderizar componente de detalhes
			await this._renderPokemonDetails();

			// 🧹 Esconder loading
			this._hidePageLoading();

			console.log(`✅ Detalhes do ${this.pokemonData.name} carregados`);
		} catch (error) {
			console.error("❌ Erro ao carregar detalhes:", error);
			this._hidePageLoading();

			// 🔍 Verificar se é erro de Pokémon não encontrado
			if (error.message.includes("404") || error.message.includes("not found")) {
				this._showPokemonNotFound();
			} else {
				this._showError("Erro ao carregar detalhes", error.message);
			}
		}
	}

	/**
	 * 🎨 Renderiza componente de detalhes do Pokémon
	 * @private
	 */
	async _renderPokemonDetails() {
		// 🧹 Limpar container
		DOMUtils.clearElement(this.detailsContainer);

		// 🎨 Criar componente
		this.pokemonDetailsComponent = new PokemonDetails(this.pokemonData);

		// 📝 Renderizar
		await this.pokemonDetailsComponent.mount(this.detailsContainer);

		console.log("🎨 Componente de detalhes renderizado");
	}

	/**
	 * ⏳ Mostra loading de página
	 * @param {string} message - Mensagem de loading
	 * @private
	 */
	_showPageLoading(message) {
		// 🧹 Limpar container
		DOMUtils.clearElement(this.detailsContainer);

		// ⏳ Mostrar spinner
		this.loadingSpinner = showPageLoading(message);
		this.detailsContainer.appendChild(this.loadingSpinner);
	}

	/**
	 * ✅ Esconde loading de página
	 * @private
	 */
	_hidePageLoading() {
		if (this.loadingSpinner) {
			this.loadingSpinner.remove();
			this.loadingSpinner = null;
		}
	}

	/**
	 * 🚨 Mostra erro genérico
	 * @param {string} title - Título do erro
	 * @param {string} details - Detalhes do erro
	 * @private
	 */
	_showError(title, details) {
		DOMUtils.clearElement(this.detailsContainer);

		const errorElement = showError(
			this.detailsContainer,
			`${title}: ${details}`,
			() => this.loadPokemonDetails()
		);

		// 🔙 Adicionar botão voltar
		this._addBackButtonToError(errorElement);
	}

	/**
	 * 🔍 Mostra erro de Pokémon não encontrado
	 * @private
	 */
	_showPokemonNotFound() {
		DOMUtils.clearElement(this.detailsContainer);

		const errorElement = showPokemonNotFound(
			this.detailsContainer,
			this.pokemonId,
			() => this.loadPokemonDetails()
		);

		// 🔙 Adicionar botão voltar
		this._addBackButtonToError(errorElement);
	}

	/**
	 * 🔙 Adiciona botão voltar ao erro
	 * @param {Element} errorElement - Elemento de erro
	 * @private
	 */
	_addBackButtonToError(errorElement) {
		const backButtonHtml = `
            <div class="mt-3">
                <button class="btn btn-outline-primary" onclick="window.history.back()">
                    <i class="fas fa-arrow-left me-2"></i>
                    Voltar
                </button>
            </div>
        `;

		errorElement.insertAdjacentHTML("beforeend", backButtonHtml);
	}

	/**
	 * 🔙 Volta para página anterior
	 */
	goBack() {
		// 🎯 Usar função global se disponível
		if (window.pokeDexApp && window.pokeDexApp.goToHome) {
			console.log("🏠 Voltando via App");
			window.pokeDexApp.goToHome();
		} else if (window.history.length > 1) {
			console.log("🔙 Voltando via history");
			window.history.back();
		} else {
			console.log("🏠 Redirecionando para home");
			window.location.href = "index.html";
		}
	}

	/**
	 * 🔄 Recarrega detalhes do Pokémon atual
	 */
	async reload() {
		if (this.pokemonId) {
			await this.loadPokemonDetails();
		}
	}

	/**
	 * 🎯 Navega para outro Pokémon
	 * @param {number} newPokemonId - ID do novo Pokémon
	 */
	async navigateToPokemon(newPokemonId) {
		if (newPokemonId === this.pokemonId) {
			console.log("⚠️ Já está exibindo este Pokémon");
			return;
		}

		this.pokemonId = newPokemonId;

		// 🌐 Atualizar URL
		const newUrl = `${window.location.pathname}?id=${newPokemonId}`;
		window.history.pushState({ pokemonId: newPokemonId }, "", newUrl);

		// 🔄 Recarregar detalhes
		await this.loadPokemonDetails();

		console.log(`🎯 Navegado para Pokémon #${newPokemonId}`);
	}

	/**
	 * 📊 Retorna informações da página
	 * @returns {Object} Status atual da página
	 */
	getStatus() {
		return {
			pokemonId: this.pokemonId,
			pokemonName: this.pokemonData?.name || null,
			isLoaded: !!this.pokemonData,
			hasComponent: !!this.pokemonDetailsComponent,
			isLoading: !!this.loadingSpinner,
		};
	}

	/**
	 * 🧹 Limpa a página (usado ao sair)
	 */
	cleanup() {
		// 🧹 Limpar componente
		if (this.pokemonDetailsComponent) {
			this.pokemonDetailsComponent.unmount();
			this.pokemonDetailsComponent = null;
		}

		// 🧹 Remover loading
		if (this.loadingSpinner) {
			this.loadingSpinner.remove();
			this.loadingSpinner = null;
		}

		// 🧹 Limpar container
		if (this.detailsContainer) {
			DOMUtils.clearElement(this.detailsContainer);
		}

		console.log("🧹 DetailsPage limpa");
	}
}

// ========================================
// 📤 EXPORTAÇÕES
// ========================================

export { DetailsPage };
export default DetailsPage;
