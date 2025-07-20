/**
 * 🏠 HOMEPAGE.JS - PÁGINA PRINCIPAL DA POKÉDEX
 *
 * Gerencia a página inicial com lista de Pokémon.
 * Integra com os componentes e APIs existentes.
 *
 */

import pokemonAPI from "../services/PokemonAPI.js";
import { renderPokemonCards } from "../components/PokemonCard.js";
import { showLoading, showPageLoading } from "../components/LoadingSpinner.js";
import { showError, showNetworkError } from "../components/ErrorMessage.js";
import Utils from "../core/Utils.js";

/**
 * 🏠 Classe da página inicial
 * Responsável por carregar e exibir a lista de Pokémon
 * com paginação e tratamento de erros.
 */
class HomePage {
	constructor() {
		this.pokemonList = []; // 🗂️ Lista de Pokémon carregados
		this.currentOffset = 0; // 📍 Offset atual para paginação
		this.pageSize = 36; // 📄 Tamanho da página (quantidade de Pokémon por vez)
		this.isLoading = false; // ⏳ Indicador de carregamento
		this.hasMore = true; // 🔄 Indica se há mais Pokémon para carregar
		this.loadingSpinner = null; // ⏳ Spinner de carregamento

		// 🔍 Elementos da página
		this.pokemonGrid = null; // 🗂️ Grid onde os cards serão renderizados
		this.loadMoreBtn = null; // 🔘 Botão para carregar mais Pokémon
		this.loadingIndicator = null; // ⏳ Indicador de carregamento
		this.errorContainer = null; // 🚫 Container de erro
		this.endMessage = null; // 📜 Mensagem de fim de lista

		console.log("🏠 HomePage criada");
	}

	/**
	 * 🎯 Inicializa a página
     * @return {Promise<boolean>} Retorna true se a inicialização for bem-sucedida
     * @throws {Error} Se ocorrer um erro durante a inicialização
     * @description
     * Configura os elementos da página, carrega Pokémon iniciais 
	 */
	async init() {
		try {
			console.log("🏠 Inicializando HomePage...");

			// 🔍 Encontrar elementos da página
			this._findPageElements();

			// 👂 Configurar event listeners
			this._setupEventListeners();

			// 📋 Carregar Pokémon iniciais
			await this.loadInitialPokemons();

			console.log("✅ HomePage inicializada com sucesso");
			return true;
		} catch (error) {
			console.error("❌ Erro ao inicializar HomePage:", error);
			this._showError("Erro ao inicializar a página", error.message);
			return false;
		}
	}

	/**
	 * 🔍 Encontra elementos importantes da página
	 * @private
	 */
	_findPageElements() {
		this.pokemonGrid = Utils.findElement("#pokemon-grid");
		this.loadMoreBtn = Utils.findElement("#load-more-btn");
		this.loadingIndicator = Utils.findElement("#loading-indicator");
		this.errorContainer = Utils.findElement("#error-container");
		this.endMessage = Utils.findElement("#end-message");

		if (!this.pokemonGrid) {
			throw new Error("Elemento #pokemon-grid não encontrado");
		}

		console.log("🔍 Elementos da página encontrados");
	}

	/**
	 * 👂 Configura event listeners da página
	 * @private
     * @description
     * Configura o botão "Carregar Mais" e outros eventos necessários
	 */
	_setupEventListeners() {
		// 🔘 Botão "Carregar Mais"
		if (this.loadMoreBtn) {
			this.loadMoreBtn.addEventListener("click", () => {
				this.loadMorePokemons();
			});
		}

		console.log("👂 Event listeners configurados");
	}

	/**
	 * 📋 Carrega Pokémon iniciais
     * @returns {Promise<void>}
     * @throws {Error} Se ocorrer um erro ao carregar os Pokémon
     * @description
     * Busca os primeiros Pokémon e renderiza os cards na grid
	 */
	async loadInitialPokemons() {
		try {
			console.log("📋 Carregando Pokémon iniciais...");

			// ⏳ Mostrar loading de página
			this._showPageLoading("Carregando Pokémon...");

			// 🌐 Buscar dados da API
			const response = await pokemonAPI.getPokemonList(0, this.pageSize);

			// 📊 Processar dados
			const pokemonData = await this._processPokemonData(response.pokemons);

			// 🎨 Renderizar cards
			this._renderPokemonCards(pokemonData);

			// 📊 Atualizar estado
			this.pokemonList = pokemonData;
			this.currentOffset = this.pageSize;
			this.hasMore = response.hasMore;

			// 🧹 Esconder loading
			this._hidePageLoading();

			// 🔘 Mostrar/esconder botão "Carregar Mais"
			this._updateLoadMoreButton();

			console.log(`✅ ${pokemonData.length} Pokémon carregados inicialmente`);
		} catch (error) {
			console.error("❌ Erro ao carregar Pokémon iniciais:", error);
			this._hidePageLoading();
			this._showError("Erro ao carregar Pokémon", error.message);
		}
	}

	/**
	 * 📋 Carrega mais Pokémon (paginação)
     * @returns {Promise<void>}
     * @throws {Error} Se ocorrer um erro ao carregar mais Pokémon
     * @description
     * Busca mais Pokémon a partir do offset atual e renderiza os novos cards
     * Se já estiver carregando ou não houver mais Pokémon, não faz nada.
	 */
	async loadMorePokemons() {
		if (this.isLoading || !this.hasMore) {
			console.log("⚠️ Já carregando ou não há mais Pokémon");
			return;
		}

		try {
			console.log("📋 Carregando mais Pokémon...");
			this.isLoading = true;

			// ⏳ Mostrar loading no botão
			this._showButtonLoading();

			// 🌐 Buscar dados da API
			const response = await pokemonAPI.getPokemonList(
				this.currentOffset,
				this.pageSize
			);

			// 📊 Processar dados
			const pokemonData = await this._processPokemonData(response.pokemons);

			// 🎨 Renderizar novos cards
			this._renderPokemonCards(pokemonData);

			// 📊 Atualizar estado
			this.pokemonList = [...this.pokemonList, ...pokemonData];
			this.currentOffset += this.pageSize;
			this.hasMore = response.hasMore;

			// 🧹 Esconder loading
			this._hideButtonLoading();

			// 🔘 Atualizar botão
			this._updateLoadMoreButton();

			console.log(`✅ ${pokemonData.length} Pokémon adicionais carregados`);
		} catch (error) {
			console.error("❌ Erro ao carregar mais Pokémon:", error);
			this._hideButtonLoading();
			this._showError("Erro ao carregar mais Pokémon", error.message);
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * 📊 Processa dados dos Pokémon (busca detalhes necessários)
	 * @param {Array} pokemonList - Lista básica de Pokémon
	 * @returns {Promise<Array>} Pokémon com detalhes
	 * @private
     * @description
     * Busca detalhes completos de cada Pokémon e formata os dados
     * para renderização. Se falhar ao buscar detalhes, retorna dados básicos.
	 */
	async _processPokemonData(pokemonList) {
        // 🧹 Limpar lista existente
		const promises = pokemonList.map(async (pokemon) => {
			try {
				// 🔍 Buscar detalhes completos
				const details = await pokemonAPI.getPokemonDetails(pokemon.id);
				return details;
			} catch (error) {
				console.warn(`⚠️ Erro ao buscar detalhes de ${pokemon.name}:`, error);
				// 🔄 Retornar dados básicos se falhar
				return {
					id: pokemon.id,
					name: pokemon.name,
					formattedName: Utils.formatPokemonName(pokemon.name),
					images: { front: null, official: null },
					types: [],
				};
			}
		});

		return await Promise.all(promises);
	}

	/**
	 * 🎨 Renderiza cards de Pokémon
	 * @param {Array} pokemonData - Dados dos Pokémon
	 * @private
     * @description
     * Renderiza os cards de Pokémon na grid da página
     * usando o componente de card existente.
	 */
	_renderPokemonCards(pokemonData) {
		renderPokemonCards(pokemonData, this.pokemonGrid);
	}

	/**
	 * ⏳ Mostra loading de página completa
	 * @param {string} message - Mensagem de loading
	 * @private
     * @description
     * Mostra um indicador de carregamento na página
     * e esconde outros elementos enquanto carrega.
	 */
	_showPageLoading(message) {
        // 🧹 Limpar grid existente
		if (this.loadingIndicator) {
			Utils.showElement(this.loadingIndicator);
		} else {
            // 🧹 Criar novo spinner de loading
			this.loadingSpinner = showPageLoading(message);
		}

		// 🙈 Esconder outros elementos
		Utils.hideElement(this.pokemonGrid);
		Utils.hideElement(this.loadMoreBtn);
		Utils.hideElement(this.errorContainer);
	}

	/**
	 * ✅ Esconde loading de página
	 * @private
     * @description
     * Esconde o indicador de carregamento e mostra a grid de Pokémon
	 */
	_hidePageLoading() {
        // 👋 Esconder loading
		if (this.loadingIndicator) {
			Utils.hideElement(this.loadingIndicator);
		}

        // 👀 Mostrar grid
		if (this.loadingSpinner) {
			this.loadingSpinner.remove();
			this.loadingSpinner = null;
		}

		// 👀 Mostrar grid
		Utils.showElement(this.pokemonGrid);
	}

	/**
	 * ⏳ Mostra loading no botão "Carregar Mais"
	 * @private
     * @description
     * Exibe um indicador de carregamento no botão
     * enquanto busca mais Pokémon.
	 */
	_showButtonLoading() {
		if (this.loadMoreBtn) {
			this.loadMoreBtn.disabled = true;
			this.loadMoreBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Carregando...
            `;
		}
	}

	/**
	 * ✅ Esconde loading do botão
	 * @private
     * @description
     * Remove o indicador de carregamento do botão
     * e restaura o texto original.
	 */
	_hideButtonLoading() {
		if (this.loadMoreBtn) {
			this.loadMoreBtn.disabled = false;
			this.loadMoreBtn.innerHTML = `
                <i class="fas fa-plus-circle me-2"></i>
                Carregar Mais Pokémon
            `;
		}
	}

	/**
	 * 🔘 Atualiza estado do botão "Carregar Mais"
	 * @private
     * @description
     * Mostra ou esconde o botão "Carregar Mais"
     * dependendo se há mais Pokémon para carregar.
	 */
	_updateLoadMoreButton() {
        // 🔘 Verifica se o botão existe
		if (!this.loadMoreBtn) return;

        // 🔘 Verifica se há mais Pokémon
		if (this.hasMore) {
            // 🔘 Mostrar botão
			Utils.showElement(this.loadMoreBtn);
			Utils.hideElement(this.endMessage);
		} else {
            // 🔘 Esconder botão
			Utils.hideElement(this.loadMoreBtn);
			Utils.showElement(this.endMessage);
		}
	}

	/**
	 * 🚨 Mostra mensagem de erro
	 * @param {string} title - Título do erro
	 * @param {string} details - Detalhes do erro
	 * @private
     * @description
     * Exibe uma mensagem de erro na UI
     * e permite que o usuário tente novamente.
     * Se não houver container de erro, exibe um erro de rede.
	 */
	_showError(title, details) {
		if (this.errorContainer) {
			Utils.showElement(this.errorContainer);
			showError(this.errorContainer, `${title}: ${details}`);
		} else {
			showNetworkError(this.pokemonGrid, details);
		}
	}

	/**
	 * 📊 Retorna estatísticas da página
	 * @returns {Object} Estatísticas atuais
     * @description
     * Retorna informações sobre o estado atual da página,
     * como total de Pokémon carregados, offset atual e se há mais Pokémon.
	 */
	getStats() {
		return {
			totalLoaded: this.pokemonList.length,
			currentOffset: this.currentOffset,
			hasMore: this.hasMore,
			isLoading: this.isLoading,
			pageSize: this.pageSize,
		};
	}

	/**
	 * 🧹 Limpa a página (usado ao sair)
     * @description
     * Remove todos os elementos de carregamento e limpa a grid de Pokémon.
     * Também remove o spinner de carregamento, se existir.
	 */
	cleanup() {
		if (this.loadingSpinner) {
			this.loadingSpinner.remove();
		}

		// 🧹 Limpar grid
		if (this.pokemonGrid) {
			Utils.clearElement(this.pokemonGrid);
		}

		console.log("🧹 HomePage limpa");
	}
}

// ========================================
// 📤 EXPORTAÇÕES
// ========================================

export { HomePage };
export default HomePage;
