// ========================================
// MAIN.JS - POKÉDEX APPLICATION MODULAR
// ========================================

import { PokemonCard } from "./scripts/PokemonCard.js";
import { HomeManager } from "./scripts/HomeManager.js";
import { PokemonDetails } from "./scripts/PokemonDetails.js";
import { DetailsManager } from "./scripts/DetailsManager.js";

// ========================================
// INSTÂNCIAS GLOBAIS
// ========================================

// Instância global do gerenciador da home
const homeManager = new HomeManager();

// Instância global do gerenciador de detalhes
const detailsManager = new DetailsManager(homeManager);

// ========================================
// FUNÇÕES DA HOME
// ========================================

// Função para inicializar a home
async function initializeHome() {
	try {
		const initialPokemons = await homeManager.fetchPokemonsForHome();

		return {
			success: true,
			pokemonsLoaded: initialPokemons.length,
			totalPokemons: homeManager.pokemons.length,
			hasMore: homeManager.hasMore,
		};
	} catch (error) {
		console.error("❌ ERRO NA INICIALIZAÇÃO DA HOME:", error);
		throw error;
	}
}

// Função para carregar mais pokemons (conectada ao botão "Carregar Mais")
async function loadMorePokemons() {
	try {
		if (!homeManager.canLoadMore()) {
			if (!homeManager.hasMore) {
				return {
					success: false,
					reason: "no_more",
					message: "Todos os pokémons carregados",
				};
			}

			return {
				success: false,
				reason: homeManager.isLoading ? "loading" : "no_more",
				message: homeManager.isLoading
					? "Carregamento em andamento"
					: "Todos os pokémons carregados",
			};
		}

		const newPokemons = await homeManager.fetchPokemonsForHome();

		return {
			success: true,
			pokemonsLoaded: newPokemons.length,
			totalPokemons: homeManager.pokemons.length,
			hasMore: homeManager.hasMore,
		};
	} catch (error) {
		console.error("❌ ERRO AO CARREGAR MAIS POKÉMONS:", error);
		return {
			success: false,
			error: error.message,
		};
	}
}

// Função para navegar para detalhes de um pokemon
function navigateToPokemonDetails(pokemonId) {
	const pokemon = homeManager.getPokemonById(pokemonId);
	if (pokemon) {
		return {
			success: true,
			pokemonId: pokemonId,
			pokemonName: pokemon.name,
			templateUrl: `/detalhes.html?id=${pokemonId}`,
		};
	} else {
		console.error(`❌ Pokemon ID ${pokemonId} não encontrado na home`);
		return {
			success: false,
			error: "Pokemon não encontrado",
		};
	}
}

// ========================================
// FUNÇÕES DOS DETALHES
// ========================================

// Função para inicializar página de detalhes
async function initializePokemonDetails(pokemonId) {
	try {
		const numericId = parseInt(pokemonId);
		if (isNaN(numericId) || numericId < 1) {
			throw new Error(`ID de Pokemon inválido: ${pokemonId}`);
		}

		const pokemon = await detailsManager.loadPokemonDetails(numericId);

		if (pokemon) {
			const detailsData = pokemon.renderDetailsPage();

			return {
				success: true,
				pokemon: detailsData,
				loadTime: performance.now(),
			};
		}

		throw new Error("Falha ao carregar dados do Pokemon");
	} catch (error) {
		console.error("❌ ERRO NA INICIALIZAÇÃO DA PÁGINA DE DETALHES:", error);

		detailsManager.setErrorState(true, error.message);

		return {
			success: false,
			error: error.message,
			pokemonId: pokemonId,
		};
	}
}

// Função para voltar à home
function goBackToHome() {
	detailsManager.clear();

	return {
		success: true,
		redirectUrl: "/index.html",
		action: "back_to_home",
	};
}

// Função para retry do carregamento
function retryLoadPokemon() {
	const status = detailsManager.getStatus();
	if (status.currentPokemonId) {
		detailsManager.setErrorState(false);
		return initializePokemonDetails(status.currentPokemonId);
	} else {
		return goBackToHome();
	}
}

// ========================================
// EVENT LISTENERS
// ========================================

// Event listeners para a home (prontos para o front-end)
function setupHomeEventListeners() {
	// Event listeners serão implementados pelo front-end
}

// Event listeners para a página de detalhes
function setupDetailsEventListeners() {
	// Event listeners serão implementados pelo front-end
}

// ========================================
// INICIALIZAÇÃO
// ========================================

// Auto-inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
	setupHomeEventListeners();
	setupDetailsEventListeners();

	const urlParams = new URLSearchParams(window.location.search);
	const pokemonId = urlParams.get("id") || urlParams.get("pokemon");

	if (pokemonId) {
		initializePokemonDetails(pokemonId).catch((error) => {
			console.error("💥 Falha crítica na inicialização dos detalhes:", error);
		});
	} else {
		initializeHome().catch((error) => {
			console.error("💥 Falha crítica na inicialização:", error);
		});
	}
});

// Disponibilizar funções globalmente para uso em HTML onclick, etc.
window.homeManager = homeManager;
window.detailsManager = detailsManager;
window.loadMorePokemons = loadMorePokemons;
window.navigateToPokemonDetails = navigateToPokemonDetails;
window.initializePokemonDetails = initializePokemonDetails;
window.goBackToHome = goBackToHome;
window.retryLoadPokemon = retryLoadPokemon;
