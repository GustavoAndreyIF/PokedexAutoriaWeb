/**
 * 📋 DETAILSPAGE.JS - PÁGINA DE DETALHES DO POKÉMON
 *
 * Gerencia a página de detalhes individual do Pokémon.
 * Integra com os componentes e APIs existentes.
 *
 */

import { PokemonDetailsHeader } from "../components/PokemonDetailsHeader.js";
import { PokemonDetailsMain } from "../components/PokemonDetailsMain.js";
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
		this.pokemonUrl = null;

		// Componentes de renderização integrados
		this.headerComponent = null;
		this.mainComponent = null;
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
			// 📝 Usar body como container principal
			this.detailsContainer = document.body;
			console.log("⚠️ Container de detalhes não encontrado, usando body");
		}

		console.log("🔍 Elementos da página encontrados");
	}

	/**
	 * 📝 Cria layout básico da página
	 * @private
	 */
	_createPageLayout() {
		// Verificar se os containers já existem
		const headerContainer = document.getElementById(
			"pokemon-details-header-container"
		);
		const mainContainer = document.getElementById("pokemon-details-main-container");

		if (headerContainer && mainContainer) {
			console.log("📝 Layout já existe, reutilizando containers");
			return;
		}

		// Criar estrutura base no container principal
		this.detailsContainer.innerHTML = `
			<div class="container-fluid p-0">
				<div class="row g-0">
					<div class="col-lg-6" id="pokemon-details-header-container">
						<!-- Header será renderizado aqui -->
					</div>
					<div class="col-lg-6" id="pokemon-details-main-container">
						<!-- Main será renderizado aqui -->
					</div>
				</div>
			</div>
		`;

		console.log("📝 Layout da página criado");
	}

	/**
	 * 📋 Carrega detalhes do Pokémon
	 */
	async loadPokemonDetails() {
		try {
			console.log(`📋 Carregando detalhes do Pokémon #${this.pokemonId}...`);

			// ⏳ Mostrar loading
			this._showPageLoading("Carregando detalhes do Pokémon...");

			// 🌐 Construir URL da API
			this.pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${this.pokemonId}`;

			// 🎨 Renderizar componentes diretamente
			await this._renderPokemonDetails();

			// 🧹 Esconder loading
			this._hidePageLoading();

			console.log(`✅ Detalhes do Pokémon #${this.pokemonId} carregados`);
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
	 * 🎨 Renderiza componentes de detalhes do Pokémon diretamente
	 * @private
	 */
	async _renderPokemonDetails() {
		// 🧹 Limpar container
		DOMUtils.clearElement(this.detailsContainer);

		// 🏗️ Criar layout dos containers PRIMEIRO
		this._createPageLayout();

		// 🎨 Criar componentes independentes
		this.headerComponent = new PokemonDetailsHeader(
			this.pokemonId,
			this.pokemonUrl
		);
		this.mainComponent = new PokemonDetailsMain(this.pokemonId, this.pokemonUrl);

		// 📝 Renderizar componentes independentemente (cada um faz seu próprio fetch)
		await Promise.all([this.headerComponent.render(), this.mainComponent.render()]);

		console.log("🎨 Componentes de detalhes renderizados");
	}

	/**
	 * ⏳ Mostra loading de página
	 * @param {string} message - Mensagem de loading
	 * @private
	 */
	_showPageLoading(message) {
		// 🧹 Limpar container
		DOMUtils.clearElement(this.detailsContainer);

		// ⏳ Criar e mostrar spinner diretamente
		this.detailsContainer.innerHTML = `
			<div class="d-flex justify-content-center align-items-center" style="min-height: 100vh;">
				<div class="text-center">
					<div class="spinner-border text-primary mb-3" role="status">
						<span class="visually-hidden">Carregando...</span>
					</div>
					<p class="text-muted">${message || "Carregando..."}</p>
				</div>
			</div>
		`;
	}

	/**
	 * ✅ Esconde loading de página
	 * @private
	 */
	_hidePageLoading() {
		// Loading é limpo automaticamente quando renderizamos os componentes
		this.loadingSpinner = null;
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
			pokemonUrl: this.pokemonUrl,
			isLoaded: !!(this.headerComponent && this.mainComponent),
			hasHeaderComponent: !!this.headerComponent,
			hasMainComponent: !!this.mainComponent,
			isLoading: !!this.loadingSpinner,
		};
	}

	/**
	 * 🧹 Limpa a página (usado ao sair)
	 */
	cleanup() {
		// 🧹 Limpar componentes
		if (this.headerComponent) {
			this.headerComponent = null;
		}

		if (this.mainComponent) {
			this.mainComponent = null;
		}

		// 🧹 Limpar loading
		this.loadingSpinner = null;

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
