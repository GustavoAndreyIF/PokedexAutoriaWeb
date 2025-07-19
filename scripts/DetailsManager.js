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
				return null;
			}

			this.setLoadingState(true);

			// Verificar se existe na home primeiro (otimização)
			const existingCard = this.findPokemonInHome(pokemonId);

			if (existingCard) {
				this.currentPokemon = PokemonDetails.fromPokemonCard(existingCard);
			} else {
				this.currentPokemon = new PokemonDetails(
					`pokemon-${pokemonId}`, // name temporário
					`https://pokeapi.co/api/v2/pokemon/${pokemonId}` // url correto
				);
				await this.currentPokemon.fetchDetails();
			}

			await this.currentPokemon.fetchSpeciesData();
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
	}

	// Gerenciar estado de erro
	setErrorState(hasError, message = "") {
		this.isError = hasError;
		this.errorMessage = message;
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
	}
}
