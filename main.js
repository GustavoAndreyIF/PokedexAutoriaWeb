/**
 * 🚀 MAIN.JS - VERSÃO SIMPLES DA POKÉDX
 *
 * Código simples e direto que funciona!
 */

// ========================================
// 📦 IMPORTS
// ========================================

import { PokemonTypes, TextFormatter, DOMUtils } from "./src/utils/index.js";
import PokemonCard from "./src/components/PokemonCard.js";
import { PokemonDetails } from "./src/components/PokemonDetails.js";

// ========================================
// 🌐 CONFIGURAÇÕES DA API
// ========================================

const api_base = "https://pokeapi.co/api/v2";
const pokemon_per_page = 36;
let currentOffset = 0;
let isLoading = false;

// ========================================
// 🏠 PÁGINA HOME - FUNÇÕES SIMPLES
// ========================================

/**
 * 🔍 Busca lista de Pokémon da API
 */
async function fetchPokemonList(offset = 0, limit = pokemon_per_page) {
	try {
		const response = await fetch(
			`${api_base}/pokemon?offset=${offset}&limit=${limit}`
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("❌ Erro ao buscar lista:", error);
		throw error;
	}
}

/**
 * 🔍 Busca detalhes de um Pokémon
 */
async function fetchPokemonDetails(pokemonUrl) {
	try {
		const response = await fetch(pokemonUrl);
		const pokemon = await response.json();
		return {
			id: pokemon.id,
			name: pokemon.name,
			images: {
				front: pokemon.sprites?.front_default,
				official: pokemon.sprites?.other?.["official-artwork"]?.front_default,
			},
			types: pokemon.types?.map((t) => ({ name: t.type.name })) || [],
		};
	} catch (error) {
		console.error("❌ Erro ao buscar detalhes:", error);
		return null;
	}
}

/**
 * 🎨 Cria HTML de um card de Pokémon usando o componente
 */
function createPokemonCard(pokemon) {
	const pokemonCard = new PokemonCard(pokemon);
	return pokemonCard.render();
}

/**
 * 🎨 Renderiza cards no grid
 */
function renderPokemonCards(pokemonList) {
	const grid = DOMUtils.findElement("#pokemon-grid");
	pokemonList.forEach((pokemon) => {
		grid.insertAdjacentHTML("beforeend", createPokemonCard(pokemon));
	});
}

/**
 * ⏳ Mostra/esconde loading
 */
function setLoadingState(show) {
	const loadingIndicator = DOMUtils.findElement("#loading-indicator");
	const loadMoreBtn = DOMUtils.findElement("#load-more-btn");

	if (loadingIndicator) {
		loadingIndicator.style.display = show ? "block" : "none";
	}

	if (loadMoreBtn) {
		loadMoreBtn.disabled = show;
		loadMoreBtn.innerHTML = show
			? '<span class="spinner-border spinner-border-sm me-2"></span>Carregando...'
			: '<i class="fas fa-plus-circle me-2"></i>Carregar Mais Pokémons';
	}
}

/**
 * 🚨 Mostra erro
 */
function showError(message) {
	const errorContainer = DOMUtils.findElement("#error-container");
	if (errorContainer) {
		errorContainer.style.display = "block";
		errorContainer.innerHTML = `
            <strong>Erro!</strong> ${message}
            <button class="btn btn-outline-danger btn-sm ms-2" onclick="location.reload()">
                Tentar Novamente
            </button>
        `;
	}
}

/**
 * 📋 Carrega Pokémon iniciais
 */
async function loadInitialPokemons() {
	try {
		setLoadingState(true);

		const data = await fetchPokemonList(0, pokemon_per_page);
		const pokemonPromises = data.results.map((p) => fetchPokemonDetails(p.url));
		const pokemonList = await Promise.all(pokemonPromises);
		const validPokemons = pokemonList.filter((p) => p !== null);

		renderPokemonCards(validPokemons);
		currentOffset = pokemon_per_page;

		setLoadingState(false);
		console.log(`✅ ${validPokemons.length} Pokémons carregados`);
	} catch (error) {
		setLoadingState(false);
		showError("Não foi possível carregar os Pokémons. Verifique sua conexão.");
		console.error("❌ Erro ao carregar:", error);
	}
}

/**
 * 📋 Carrega mais Pokémons
 */
async function loadMorePokemons() {
	if (isLoading) return;

	try {
		isLoading = true;
		setLoadingState(true);

		const data = await fetchPokemonList(currentOffset, pokemon_per_page);
		const pokemonPromises = data.results.map((p) => fetchPokemonDetails(p.url));
		const pokemonList = await Promise.all(pokemonPromises);
		const validPokemons = pokemonList.filter((p) => p !== null);

		renderPokemonCards(validPokemons);
		currentOffset += pokemon_per_page;

		setLoadingState(false);
		console.log(`✅ ${validPokemons.length} Pokémons adicionais carregados`);
	} catch (error) {
		setLoadingState(false);
		showError("Erro ao carregar mais Pokémons.");
		console.error("❌ Erro ao carregar mais:", error);
	} finally {
		isLoading = false;
	}
}

// ========================================
// 📋 PÁGINA DETALHES - FUNÇÕES SIMPLES
// ========================================

/**
 * 🎨 Renderiza página de detalhes usando PokemonDetails
 */
async function renderPokemonDetailsPage(pokemonId) {
	const container = DOMUtils.findElement("#pokemon-details-container");
	if (!container) return;

	try {
		// ⏳ Loading
		container.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary mb-3"></div>
                <p>Carregando detalhes do Pokémon...</p>
            </div>
        `;

		// Criar instância da classe PokemonDetails
		const pokemonDetails = new PokemonDetails(
			`pokemon-${pokemonId}`,
			`${api_base}/pokemon/${pokemonId}`
		);

		// Carregar dados completos
		await pokemonDetails.fetchDetails();
		await pokemonDetails.fetchSpeciesData();

		// Renderizar página
		pokemonDetails.renderDetailsPage();

		console.log(`✅ Detalhes do Pokémon ${pokemonId} carregados`);
	} catch (error) {
		container.innerHTML = `
            <div class="alert alert-danger text-center m-4">
                <h4>❌ Erro ao carregar Pokémon</h4>
                <p>${error.message}</p>
                <a href="index.html" class="btn btn-primary">Voltar à Home</a>
            </div>
        `;
		console.error("❌ Erro ao carregar detalhes:", error);
	}
}

/**
 * 📋 Inicializa página de detalhes
 */
async function initializeDetailsPage() {
	const urlParams = new URLSearchParams(window.location.search);
	const pokemonId = urlParams.get("id");

	if (!pokemonId) {
		window.location.href = "index.html";
		return;
	}

	await renderPokemonDetailsPage(pokemonId);
}

// ========================================
// 🎯 INICIALIZAÇÃO AUTOMÁTICA
// ========================================

document.addEventListener("DOMContentLoaded", () => {
	console.log("🚀 Pokédex refatorada carregada!");

	const pathname = window.location.pathname;
	const urlParams = new URLSearchParams(window.location.search);
	const pokemonId = urlParams.get("id");

	// 📋 Se é página de detalhes
	if (pathname.includes("detalhes.html") || pokemonId) {
		initializeDetailsPage();
	}
	// 🏠 Se é página home
	else {
		loadInitialPokemons();

		// 🔘 Event listener para botão "Carregar Mais"
		const loadMoreBtn = DOMUtils.findElement("#load-more-btn");
		if (loadMoreBtn) {
			loadMoreBtn.addEventListener("click", loadMorePokemons);
		}

		// 👆 Event listener para cliques nos cards
		document.addEventListener("click", (event) => {
			const card = event.target.closest("[data-pokemon-id]");
			if (card) {
				const pokemonId = card.dataset.pokemonId;
				window.location.href = `detalhes.html?id=${pokemonId}`;
			}
		});
	}
});

// ========================================
// 🌐 FUNÇÕES GLOBAIS
// ========================================

// Disponibilizar globalmente para uso em HTML
window.loadMorePokemons = loadMorePokemons;