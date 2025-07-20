/**
 * 🚀 MAIN.JS - VERSÃO SIMPLES DA POKÉDX
 *
 * Código simples e direto que funciona!
 */

// ========================================
// 🌐 CONFIGURAÇÕES DA API
// ========================================

const API_BASE = "https://pokeapi.co/api/v2";
const POKEMON_PER_PAGE = 20;
let currentOffset = 0;
let isLoading = false;

// ========================================
// 🏠 PÁGINA HOME - FUNÇÕES SIMPLES
// ========================================

/**
 * 🔍 Busca lista de Pokémon da API
 */
async function fetchPokemonList(offset = 0, limit = POKEMON_PER_PAGE) {
	try {
		const response = await fetch(
			`${API_BASE}/pokemon?offset=${offset}&limit=${limit}`
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
 * 🎨 Cria HTML de um card de Pokémon
 */
function createPokemonCard(pokemon) {
	const pokemonImage = pokemon.images?.official || pokemon.images?.front || "";
	const formattedId = String(pokemon.id).padStart(3, "0");
	const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

	// 🏷️ Criar badges dos tipos
	const typeBadges = pokemon.types
		.map((type) => {
			const typeName = type.name.charAt(0).toUpperCase() + type.name.slice(1);
			return `<span class="badge bg-primary">${typeName}</span>`;
		})
		.join(" ");

	return `
        <div class="col-md-6 col-lg-4 col-xl-3">
            <div class="card pokemon-card h-100 shadow-sm border-0" 
                 data-pokemon-id="${pokemon.id}" 
                 style="cursor: pointer; transition: transform 0.2s ease;">
                
                <!-- Número da Pokédex -->
                <div class="position-absolute top-0 end-0 p-2">
                    <small class="badge bg-secondary">#${formattedId}</small>
                </div>
                
                <!-- Imagem do Pokémon -->
                <div class="card-img-top d-flex align-items-center justify-content-center bg-light" 
                     style="height: 200px;">
                    ${
						pokemonImage
							? `<img src="${pokemonImage}" alt="${formattedName}" class="img-fluid" style="max-height: 180px;">`
							: `<div class="text-muted fs-1">❓</div>`
					}
                </div>
                
                <!-- Conteúdo do card -->
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-center mb-2">${formattedName}</h5>
                    <div class="d-flex justify-content-center gap-1 flex-wrap mt-auto">
                        ${typeBadges}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 🎨 Renderiza cards no grid
 */
function renderPokemonCards(pokemonList) {
	const grid = document.getElementById("pokemon-grid");
	pokemonList.forEach((pokemon) => {
		grid.insertAdjacentHTML("beforeend", createPokemonCard(pokemon));
	});
}

/**
 * ⏳ Mostra/esconde loading
 */
function setLoadingState(show) {
	const loadingIndicator = document.getElementById("loading-indicator");
	const loadMoreBtn = document.getElementById("load-more-btn");

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
	const errorContainer = document.getElementById("error-container");
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

		const data = await fetchPokemonList(0, POKEMON_PER_PAGE);
		const pokemonPromises = data.results.map((p) => fetchPokemonDetails(p.url));
		const pokemonList = await Promise.all(pokemonPromises);
		const validPokemons = pokemonList.filter((p) => p !== null);

		renderPokemonCards(validPokemons);
		currentOffset = POKEMON_PER_PAGE;

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

		const data = await fetchPokemonList(currentOffset, POKEMON_PER_PAGE);
		const pokemonPromises = data.results.map((p) => fetchPokemonDetails(p.url));
		const pokemonList = await Promise.all(pokemonPromises);
		const validPokemons = pokemonList.filter((p) => p !== null);

		renderPokemonCards(validPokemons);
		currentOffset += POKEMON_PER_PAGE;

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
		const response = await fetch(`${API_BASE}/pokemon/${pokemonId}`);
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
	const container = document.getElementById("pokemon-details-container");
	if (!container) return;

	const formattedId = String(pokemon.id).padStart(3, "0");
	const formattedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
	const pokemonImage = pokemon.images?.official || pokemon.images?.front || "";

	// 🏷️ Tipos
	const typeBadges = pokemon.types
		.map((type) => {
			const typeName = type.name.charAt(0).toUpperCase() + type.name.slice(1);
			return `<span class="badge bg-primary me-1">${typeName}</span>`;
		})
		.join("");

	// 📊 Stats
	const statsList = pokemon.stats
		.map((stat) => {
			const statName = stat.name.charAt(0).toUpperCase() + stat.name.slice(1);
			return `
            <div class="mb-2">
                <div class="d-flex justify-content-between">
                    <small>${statName}</small>
                    <small>${stat.value}</small>
                </div>
                <div class="progress" style="height: 6px;">
                    <div class="progress-bar" style="width: ${Math.min(
						stat.value,
						100
					)}%"></div>
                </div>
            </div>
        `;
		})
		.join("");

	container.innerHTML = `
        <div class="container-fluid bg-primary text-white py-4">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col">
                        <a href="index.html" class="text-white me-3">
                            <i class="fas fa-arrow-left fs-4"></i>
                        </a>
                        <h1 class="d-inline mb-0">${formattedName}</h1>
                        <span class="ms-3 opacity-75">#${formattedId}</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="container py-4">
            <div class="row">
                <!-- Imagem -->
                <div class="col-md-6 text-center">
                    <div class="bg-light rounded-4 p-4 mb-4">
                        ${
							pokemonImage
								? `<img src="${pokemonImage}" alt="${formattedName}" class="img-fluid" style="max-height: 300px; cursor: pointer;" onclick="playPokemonSound(${pokemon.id})">`
								: `<div class="text-muted" style="font-size: 8rem;">❓</div>`
						}
                    </div>
                    <div class="mb-3">${typeBadges}</div>
                    <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                    <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                </div>
                
                <!-- Stats -->
                <div class="col-md-6">
                    <h3>Estatísticas</h3>
                    ${statsList}
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

	const container = document.getElementById("pokemon-details-container");
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
	console.log("🚀 Pokédx carregada!");

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
		const loadMoreBtn = document.getElementById("load-more-btn");
		if (loadMoreBtn) {
			loadMoreBtn.addEventListener("click", loadMorePokemons);
		}

		// 👆 Event listener para cliques nos cards
		document.addEventListener("click", (event) => {
			const card = event.target.closest(".pokemon-card[data-pokemon-id]");
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
