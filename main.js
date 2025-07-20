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
 * 🔍 Busca detalhes completos de um Pokémon
 */
async function fetchFullPokemonDetails(pokemonId) {
	try {
		const response = await fetch(`${api_base}/pokemon/${pokemonId}`);
		if (!response.ok) {
			throw new Error("Pokémon não encontrado");
		}

		const pokemon = await response.json();
		return {
			id: pokemon.id,
			name: pokemon.name,
			height: pokemon.height,
			weight: pokemon.weight,
			images: {
				front: pokemon.sprites?.front_default,
				back: pokemon.sprites?.back_default,
				official: pokemon.sprites?.other?.["official-artwork"]?.front_default,
			},
			types: pokemon.types?.map((t) => ({ name: t.type.name })) || [],
			stats:
				pokemon.stats?.map((s) => ({
					name: s.stat.name,
					value: s.base_stat,
				})) || [],
			abilities:
				pokemon.abilities?.map((a) => ({
					name: a.ability.name,
					isHidden: a.is_hidden,
				})) || [],
		};
	} catch (error) {
		console.error("❌ Erro ao buscar detalhes completos:", error);
		throw error;
	}
}

/**
 * 🎨 Renderiza página de detalhes
 */
function renderPokemonDetails(pokemon) {
	const container = DOMUtils.findElement("#pokemon-details-container");
	if (!container) return;

	const formattedId = TextFormatter.formatNumber(pokemon.id, 3);
	const formattedName = TextFormatter.capitalize(pokemon.name);
	const pokemonImage = pokemon.images?.official || pokemon.images?.front || "";

	// 🎨 Tipo principal para background
	const primaryType = pokemon.types[0]?.name || "normal";
	const primaryTypeColor = PokemonTypes.getColor(primaryType);

	// 🏷️ Tipos com design elegante
	const typeBadges = pokemon.types
		.map((type) => {
			const typeName = type.name;
			const typeColor = PokemonTypes.getColor(typeName);
			const emoji = PokemonTypes.getEmoji(typeName);
			const displayName = TextFormatter.capitalize(typeName);

			return `
			<span class="badge text-white px-3 py-2 rounded-pill me-2"
				  style="background-color: ${typeColor}; font-size: 0.9rem;">
				<span style="font-size: 1rem;">${emoji}</span>
				${displayName}
			</span>
		`;
		})
		.join("");

	// 📊 Stats com barras coloridas
	const statsList = pokemon.stats
		.map((stat) => {
			const statName = TextFormatter.capitalize(stat.name);
			const percentage = Math.min((stat.value / 180) * 100, 100);

			return `
			<div class="mb-3">
				<div class="d-flex justify-content-between mb-1">
					<small class="fw-bold">${statName}</small>
					<small class="badge bg-secondary">${stat.value}</small>
				</div>
				<div class="progress" style="height: 8px; border-radius: 4px;">
					<div class="progress-bar" 
						 style="width: ${percentage}%; background: linear-gradient(90deg, ${primaryTypeColor}66, ${primaryTypeColor});"
						 role="progressbar"></div>
				</div>
			</div>
		`;
		})
		.join("");

	// 🎨 Background do header
	const headerBackground = `linear-gradient(135deg, ${primaryTypeColor}, ${primaryTypeColor}cc)`;

	container.innerHTML = `
		<div class="container-fluid text-white py-4" style="background: ${headerBackground};">
			<div class="container">
				<div class="row align-items-center">
					<div class="col">
						<a href="index.html" class="text-white me-3 text-decoration-none">
							<i class="fas fa-arrow-left fs-4"></i>
						</a>
						<h1 class="d-inline mb-0 fw-bold">${formattedName}</h1>
						<span class="ms-3 opacity-75 fs-5">#${formattedId}</span>
					</div>
				</div>
			</div>
		</div>
		
		<div class="container py-4">
			<div class="row">
				<!-- Imagem e informações básicas -->
				<div class="col-md-6 text-center">
					<div class="position-relative bg-light rounded-4 p-4 mb-4 overflow-hidden" 
						 style="min-height: 300px;">
						<!-- Background decorativo -->
						<div class="position-absolute top-0 end-0 w-100 h-100"
							 style="background: ${headerBackground}; opacity: 0.1; z-index: 1;"></div>
							 
						<div class="position-relative" style="z-index: 2;">
							${
								pokemonImage
									? `<img src="${pokemonImage}" 
										alt="${formattedName}" 
										class="img-fluid mb-3" 
										style="max-height: 250px; cursor: pointer; transition: transform 0.3s ease;"
										onclick="playPokemonSound(${pokemon.id})"
										onmouseover="this.style.transform='scale(1.1)'"
										onmouseout="this.style.transform='scale(1)'">`
									: `<div class="d-flex align-items-center justify-content-center text-muted" 
										style="height: 250px; font-size: 6rem;">❓</div>`
							}
						</div>
					</div>
					
					<!-- Tipos -->
					<div class="mb-4">
						${typeBadges}
					</div>
					
					<!-- Informações físicas -->
					<div class="row text-center">
						<div class="col-6">
							<div class="card h-100 border-0 shadow-sm">
								<div class="card-body">
									<h6 class="card-title text-muted">Altura</h6>
									<h4 class="mb-0">${pokemon.height / 10} m</h4>
								</div>
							</div>
						</div>
						<div class="col-6">
							<div class="card h-100 border-0 shadow-sm">
								<div class="card-body">
									<h6 class="card-title text-muted">Peso</h6>
									<h4 class="mb-0">${pokemon.weight / 10} kg</h4>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Estatísticas -->
				<div class="col-md-6">
					<div class="card border-0 shadow-sm">
						<div class="card-header bg-transparent border-0 py-3">
							<h3 class="mb-0 fw-bold">⚡ Estatísticas Base</h3>
						</div>
						<div class="card-body">
							${statsList}
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
}

/**
 * 🔊 Tenta tocar som do Pokémon (opcional)
 */
function playPokemonSound(pokemonId) {
	try {
		const audioUrl = `https://pokemoncries.com/cries/${pokemonId}.mp3`;
		const audio = new Audio(audioUrl);
		audio.play().catch((err) => {
			console.log("🔇 Audio não disponível para este Pokémon");
		});
	} catch (error) {
		console.log("🔇 Erro ao tentar tocar áudio");
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

		const pokemon = await fetchFullPokemonDetails(pokemonId);
		renderPokemonDetails(pokemon);
	} catch (error) {
		container.innerHTML = `
            <div class="alert alert-danger text-center m-4">
                <h4>❌ Erro ao carregar Pokémon</h4>
                <p>${error.message}</p>
                <a href="index.html" class="btn btn-primary">Voltar à Home</a>
            </div>
        `;
	}
}

// ========================================
// 🎯 INICIALIZAÇÃO AUTOMÁTICA
// ========================================

document.addEventListener("DOMContentLoaded", () => {
	console.log("🚀 Pokédx refatorada carregada!");

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
window.playPokemonSound = playPokemonSound;
