// ========================================
// DETAILS MANAGER - Classe para gerenciar a página de detalhes
// ========================================

import { PokemonDetails } from "./PokemonDetails.js";

export class DetailsManager {
	constructor(homeManager) {
		this.homeManager = homeManager;
		this.currentPokemon = null;
		this.isLoading = false;
		this.isError = false;
		this.errorMessage = "";
	}

	// Método para carregar detalhes completos de um Pokemon
	async loadPokemonDetails(pokemonId) {
		try {
			if (this.isLoading) {
				console.log("⚠️ Carregamento já em andamento...");
				return null;
			}

			this.setLoadingState(true);
			console.log(`🚀 CARREGANDO DETALHES DO POKEMON ID: ${pokemonId}`);

			// Verificar se existe na home primeiro (otimização)
			const existingCard = this.findPokemonInHome(pokemonId);

			if (existingCard) {
				console.log(
					`🎯 Pokemon encontrado na home, convertendo ${existingCard.name}...`
				);
				this.currentPokemon = PokemonDetails.fromPokemonCard(existingCard);
			} else {
				console.log(`📡 Pokemon não encontrado na home, criando novo...`);
				this.currentPokemon = new PokemonDetails({
					url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
				});

				// Carregar dados básicos
				await this.currentPokemon.fetchDetails();
			}

			// Carregar dados de espécie
			console.log(
				`📖 Carregando dados de espécie para ${this.currentPokemon.name}...`
			);
			await this.currentPokemon.fetchSpeciesData();

			console.log(
				`✅ DETALHES CARREGADOS COM SUCESSO: ${this.currentPokemon.name}`
			);
			this.setLoadingState(false);

			return this.currentPokemon;
		} catch (error) {
			console.error(
				`❌ ERRO AO CARREGAR DETALHES DO POKEMON ${pokemonId}:`,
				error
			);
			this.setErrorState(true, `Erro ao carregar Pokemon: ${error.message}`);
			throw error;
		}
	}

	// Encontrar pokemon na home por ID
	findPokemonInHome(pokemonId) {
		return this.homeManager.getPokemonById(parseInt(pokemonId));
	}

	// Gerenciar estado de loading
	setLoadingState(loading) {
		this.isLoading = loading;

		console.log(
			`🔄 ALTERANDO ESTADO DE LOADING: ${loading ? "INICIANDO" : "FINALIZANDO"}`
		);
		console.log(`🎨 ATUALIZANDO INTERFACE DE LOADING:`);
		console.log(`
		<!-- Estado de loading -->
		<div class="loading-container" style="display: ${loading ? "block" : "none"};">
			<div class="loading-spinner">
				<div class="spinner"></div>
				<p>Carregando detalhes do Pokémon...</p>
			</div>
		</div>
		`);

		// TO DO: Front-end deve implementar:
		// const loadingContainer = document.querySelector('.loading-container');
		// loadingContainer.style.display = loading ? 'block' : 'none';
	}

	// Gerenciar estado de erro
	setErrorState(hasError, message = "") {
		this.isError = hasError;
		this.errorMessage = message;

		if (hasError) {
			console.log(`🚨 EXIBINDO ERRO:`);
			console.log(`
			<!-- Estado de erro -->
			<div class="error-container" style="display: block;">
				<div class="error-message">
					<h2>Ops! Algo deu errado</h2>
					<p>${message}</p>
					<div class="error-actions">
						<button onclick="retryLoadPokemon()" class="retry-btn">
							Tentar Novamente
						</button>
						<button onclick="goBackToHome()" class="back-btn">
							Voltar para Home
						</button>
					</div>
				</div>
			</div>
			`);

			// TO DO: Front-end deve implementar:
			// const errorContainer = document.querySelector('.error-container');
			// errorContainer.innerHTML = [HTML do erro acima];
			// errorContainer.style.display = 'block';
		} else {
			console.log(`✅ REMOVENDO ESTADO DE ERRO`);

			// TODO: Front-end deve implementar:
			// const errorContainer = document.querySelector('.error-container');
			// errorContainer.style.display = 'none';
		}
	}

	// Obter status atual do gerenciador
	getStatus() {
		return {
			isLoading: this.isLoading,
			isError: this.isError,
			errorMessage: this.errorMessage,
			hasCurrentPokemon: !!this.currentPokemon,
			currentPokemonId: this.currentPokemon?.getCardData()?.id || null,
			currentPokemonName: this.currentPokemon?.name || null,
		};
	}

	// Método para verificar se pode carregar (não está loading nem em erro)
	canLoad() {
		return !this.isLoading && !this.isError;
	}

	// Limpar estado atual
	clear() {
		this.currentPokemon = null;
		this.isLoading = false;
		this.isError = false;
		this.errorMessage = "";

		console.log("🧹 Estado do DetailsManager limpo");
	}
}
