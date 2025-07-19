// ========================================
// HOME MANAGER - Classe para gerenciar a Home
// ========================================

import { PokemonCard } from "./PokemonCard.js";

export class HomeManager {
	constructor() {
		this.pokemons = [];
		this.currentOffset = 0;
		this.limit = 36;
		this.isLoading = false;
		this.hasMore = true;
		this.baseUrl = "https://pokeapi.co/api/v2/pokemon";
	}

	// Fetch genérico para a API
	async makeApiRequest(url) {
		try {
			console.log(`🌐 Fazendo requisição para: ${url}`);

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Erro HTTP: ${response.status}`);
			}

			const data = await response.json();
			console.log(`✅ Resposta da API recebida com sucesso`);

			return data;
		} catch (error) {
			console.error("❌ Erro na requisição da API:", error);
			throw error;
		}
	}

	// Fetch específico para carregar pokemons da home (integrado com front-end)
	async fetchPokemonsForHome() {
		if (this.isLoading) {
			console.log("⏳ Carregamento já em andamento, aguarde...");

			// Atualizar UI se disponível
			this.updateLoadingUI(true);
			return [];
		}

		try {
			this.isLoading = true;
			console.log(
				`🔄 Carregando pokemons para home - offset: ${this.currentOffset}`
			);

			// Atualizar UI de loading
			this.updateLoadingUI(true);

			const url = `${this.baseUrl}?offset=${this.currentOffset}&limit=${this.limit}`;
			const listData = await this.makeApiRequest(url);

			this.hasMore = this.currentOffset + this.limit < listData.count;

			// Buscar detalhes de cada pokemon para mostrar os cards
			const pokemonPromises = listData.results.map(async (item) => {
				const pokemonCard = new PokemonCard(item.name, item.url);
				await pokemonCard.fetchDetails();
				return pokemonCard;
			});

			const newPokemons = await Promise.all(pokemonPromises);

			// Adicionar os novos pokemons à lista
			this.pokemons.push(...newPokemons);
			this.currentOffset += this.limit;

			console.log(`🎉 CARREGAMENTO CONCLUÍDO:`);
			console.log(`📈 ${newPokemons.length} novos pokemons carregados`);
			console.log(`📊 Total de pokemons: ${this.pokemons.length}`);
			console.log(`🔄 Próximo offset: ${this.currentOffset}`);
			console.log(`➡️ Há mais pokemons: ${this.hasMore ? "Sim" : "Não"}`);

			// Renderizar todos os novos cards
			this.renderNewCards(newPokemons);

			// Atualizar estado do botão "Carregar Mais"
			this.updateLoadMoreButton();

			// Remover loading
			this.updateLoadingUI(false);

			return newPokemons;
		} catch (error) {
			console.error("❌ Erro ao carregar pokemons para home:", error);

			// Mostrar erro na UI
			this.showError(error.message);
			throw error;
		} finally {
			this.isLoading = false;
		}
	}

	// Método para atualizar UI de loading
	updateLoadingUI(loading) {
		if (typeof document !== "undefined") {
			const loadingIndicator = document.getElementById("loading-indicator");
			const loadMoreBtn = document.getElementById("load-more-btn");
			const errorContainer = document.getElementById("error-container");

			if (loadingIndicator) {
				loadingIndicator.style.display = loading ? "block" : "none";
			}

			if (loadMoreBtn) {
				if (loading) {
					loadMoreBtn.disabled = true;
					loadMoreBtn.innerHTML =
						'<i class="fas fa-spinner fa-spin me-2"></i>Carregando...';
				} else {
					loadMoreBtn.disabled = false;
					loadMoreBtn.innerHTML =
						'<i class="fas fa-plus-circle me-2"></i>Carregar Mais Pokémons';
				}
			}

			// Esconder erros durante carregamento
			if (loading && errorContainer) {
				errorContainer.style.display = "none";
			}
		}

		// Log para ambientes sem DOM
		console.log(
			`🎨 ATUALIZANDO UI - Estado de carregamento: ${
				loading ? "ATIVO" : "INATIVO"
			}`
		);
	}

	// Método para mostrar erros na UI
	showError(message) {
		if (typeof document !== "undefined") {
			const errorContainer = document.getElementById("error-container");
			if (errorContainer) {
				errorContainer.innerHTML = `
					<div class="d-flex align-items-center">
						<i class="fas fa-exclamation-triangle text-danger me-3"></i>
						<div class="flex-grow-1">
							<h5 class="mb-1">Erro ao carregar pokémons</h5>
							<p class="mb-2">${message}</p>
							<button class="btn btn-outline-danger btn-sm" onclick="homeManager.fetchPokemonsForHome()">
								<i class="fas fa-redo me-1"></i>Tentar Novamente
							</button>
						</div>
					</div>
				`;
				errorContainer.style.display = "block";
			}
		}

		// Log de erro
		console.log(`🚨 EXIBINDO ERRO NA UI: ${message}`);
	}

	// Método para renderizar novos cards na home
	renderNewCards(newPokemons) {
		console.log(`🎨 RENDERIZANDO ${newPokemons.length} NOVOS CARDS:`);

		newPokemons.forEach((pokemon) => {
			pokemon.renderCard();
		});

		console.log(`✅ Todos os cards renderizados na grid da home`);

		// TO DO: Front-end deve implementar a lógica de adicionar à grid
	}

	// Método para atualizar o botão "Carregar Mais" (integrado com front-end)
	updateLoadMoreButton() {
		const canLoadMore = this.hasMore && !this.isLoading;

		console.log(`🎨 ATUALIZANDO BOTÃO "CARREGAR MAIS":`);
		console.log(`Status: ${canLoadMore ? "Habilitado" : "Desabilitado"}`);
		console.log(
			`Texto: ${this.isLoading ? "Carregando..." : "Carregar Mais Pokémons"}`
		);

		// Atualizar UI se disponível
		if (typeof document !== "undefined") {
			const loadMoreBtn = document.getElementById("load-more-btn");
			const endMessage = document.getElementById("end-message");

			if (loadMoreBtn) {
				loadMoreBtn.disabled = !canLoadMore;

				if (!this.hasMore) {
					loadMoreBtn.style.display = "none";
					console.log(
						`🎨 ESCONDENDO BOTÃO - Todos os pokémons foram carregados`
					);

					// Mostrar mensagem de fim
					if (endMessage) {
						endMessage.style.display = "block";
						const endText = endMessage.querySelector("p");
						if (endText) {
							endText.textContent = `Total carregado: ${this.pokemons.length} pokémons`;
						}
					}
				}
			}
		} else {
			// Log para ambientes sem DOM
			if (!this.hasMore) {
				console.log(`🎨 ESCONDENDO BOTÃO - Todos os pokémons foram carregados`);
				console.log(`<!-- Esconder botão ou mostrar mensagem de fim -->`);
			}
		}
	}

	// Método para obter dados de um pokemon por ID
	getPokemonById(pokemonId) {
		return this.pokemons.find((pokemon) => pokemon.id === pokemonId);
	}

	// Método para obter todos os dados dos cards
	getAllCardData() {
		return this.pokemons.map((pokemon) => pokemon.getCardData());
	}

	// Método para verificar se pode carregar mais
	canLoadMore() {
		return this.hasMore && !this.isLoading;
	}

	// Método para obter status atual
	getStatus() {
		return {
			totalLoaded: this.pokemons.length,
			currentOffset: this.currentOffset,
			isLoading: this.isLoading,
			hasMore: this.hasMore,
			canLoadMore: this.canLoadMore(),
		};
	}
}
