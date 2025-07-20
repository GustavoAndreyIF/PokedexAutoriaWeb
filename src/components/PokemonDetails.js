/**
 * 📱 POKEMONDETAILS.JS - COMPONENTE DE DETALHES DO POKÉMON
 *
 * Componente para renderizar página completa de detalhes do Pokémon.
 * Baseado no HTML existente em detalhes.html.
 *
 */

import Utils from "../core/Utils.js";

/**
 * 📱 Componente de detalhes do Pokémon
 */
class PokemonDetails {
	/**
	 * Construtor do componente
	 * @param {Object} pokemon - Dados completos do Pokémon
	 */
	constructor(pokemon) {
		this.pokemon = pokemon;
		this.element = null;
		this.audioElement = null;
		this.isPlayingAudio = false;
	}

	/**
	 * 🎨 Renderiza o HTML completo dos detalhes
	 * @returns {string} HTML dos detalhes
	 */
	render() {
		const {
			id,
			name,
			formattedName,
			images,
			types,
			height,
			weight,
			stats,
			abilities,
		} = this.pokemon;

        return `
            <div class="pokemon-details-container">
                ${this._renderHeader()}
                ${this._renderMainContent()}
                ${this._renderStatsSection()}
                ${this._renderAbilitiesSection()}
            </div>
        `;
	}

	/**
	 * 🎨 Renderiza o cabeçalho com imagem e informações básicas
	 * @returns {string} HTML do cabeçalho
	 * @private
	 */
	_renderHeader() {
		const { id, formattedName, images, types } = this.pokemon;
		const pokedexNumber = Utils.formatNumber(id, 3);
		const primaryType = types[0]?.name || "normal";
		const typeColor = Utils.getPokemonTypeColor(primaryType);
		const pokemonImage = images?.official || images?.home || images?.front || "";

		return `
            <!-- Header Section -->
            <div class="position-relative overflow-hidden mb-4" 
                 style="background: linear-gradient(135deg, ${typeColor}, ${typeColor}dd); min-height: 300px;">
                
                <!-- Navigation -->
                <div class="container-fluid px-4 py-3">
                    <div class="row align-items-center">
                        <div class="col-8 d-flex align-items-center">
                            <button class="btn text-white me-3 p-0" 
                                    onclick="window.history.back()" 
                                    style="font-size: 2rem;" 
                                    title="Voltar">
                                <i class="bi bi-arrow-left"></i>
                            </button>
                            <h1 class="mb-0 text-white fw-bold">${formattedName}</h1>
                        </div>
                        <div class="col-4 text-end">
                            <span class="badge bg-dark bg-opacity-75 text-white fs-5 px-3 py-2 rounded-pill">
                                #${pokedexNumber}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Pokemon Image and Types -->
                <div class="container-fluid px-4 pb-4">
                    <div class="row align-items-center">
                        <div class="col-md-6 text-center">
                            <!-- Pokemon Image -->
                            <div class="position-relative d-inline-block">
                                ${
									pokemonImage
										? `
                                    <img src="${pokemonImage}" 
                                         alt="${formattedName}"
                                         class="img-fluid pokemon-main-image"
                                         style="max-height: 250px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));"
                                         onclick="this.parentNode.querySelector('.audio-btn').click()">
                                `
										: `
                                    <div class="d-flex align-items-center justify-content-center bg-white bg-opacity-20 rounded-circle" 
                                         style="width: 200px; height: 200px;">
                                        <span style="font-size: 4rem;">❓</span>
                                    </div>
                                `
								}
                                
                                <!-- Audio Button -->
                                <button class="btn btn-light btn-sm rounded-circle position-absolute audio-btn"
                                        style="bottom: 10px; right: 10px; width: 40px; height: 40px;"
                                        onclick="this.closest('.pokemon-details-container').dispatchEvent(new CustomEvent('playAudio'))"
                                        title="Ouvir som do Pokémon">
                                    <i class="bi bi-volume-up"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <!-- Types -->
                            <div class="mb-3">
                                <h5 class="text-white mb-2">Tipos</h5>
                                <div class="d-flex gap-2 flex-wrap">
                                    ${this._renderTypeBadges(types)}
                                </div>
                            </div>
                            
                            <!-- Physical Info -->
                            <div class="row text-white">
                                <div class="col-6">
                                    <div class="bg-white bg-opacity-20 rounded-3 p-3 text-center">
                                        <div class="fw-bold">${(height / 10).toFixed(
											1
										)} m</div>
                                        <small class="opacity-75">Altura</small>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="bg-white bg-opacity-20 rounded-3 p-3 text-center">
                                        <div class="fw-bold">${(weight / 10).toFixed(
											1
										)} kg</div>
                                        <small class="opacity-75">Peso</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
	}

	/**
	 * 🎨 Renderiza o conteúdo principal
	 * @returns {string} HTML do conteúdo principal
	 * @private
	 */
	_renderMainContent() {
		return `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <!-- Navigation tabs seria aqui se necessário -->
                    </div>
                </div>
            </div>
        `;
	}

	/**
	 * 📊 Renderiza seção de estatísticas
	 * @returns {string} HTML das estatísticas
	 * @private
	 */
	_renderStatsSection() {
		const { stats } = this.pokemon;

		if (!stats || stats.length === 0) {
			return '<div class="container"><p class="text-muted">Estatísticas não disponíveis</p></div>';
		}

		const statNames = {
			hp: "HP",
			attack: "Ataque",
			defense: "Defesa",
			"special-attack": "Atq. Esp.",
			"special-defense": "Def. Esp.",
			speed: "Velocidade",
		};

		return `
            <div class="container mb-4">
                <h3 class="mb-3">📊 Estatísticas Base</h3>
                <div class="card">
                    <div class="card-body">
                        ${stats
							.map((stat) => {
								const statName =
									statNames[stat.name] ||
									Utils.formatPokemonName(stat.name);
								const percentage = Math.min(
									(stat.value / 200) * 100,
									100
								);

								return `
                                <div class="mb-3">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <span class="fw-semibold">${statName}</span>
                                        <span class="badge bg-secondary">${stat.value}</span>
                                    </div>
                                    <div class="progress" style="height: 10px;">
                                        <div class="progress-bar bg-primary" 
                                             role="progressbar" 
                                             style="width: ${percentage}%"
                                             aria-valuenow="${stat.value}" 
                                             aria-valuemin="0" 
                                             aria-valuemax="200">
                                        </div>
                                    </div>
                                </div>
                            `;
							})
							.join("")}
                    </div>
                </div>
            </div>
        `;
	}

	/**
	 * 🎯 Renderiza seção de habilidades
	 * @returns {string} HTML das habilidades
	 * @private
	 */
	_renderAbilitiesSection() {
		const { abilities } = this.pokemon;

		if (!abilities || abilities.length === 0) {
			return '<div class="container"><p class="text-muted">Habilidades não disponíveis</p></div>';
		}

		return `
            <div class="container mb-4">
                <h3 class="mb-3">🎯 Habilidades</h3>
                <div class="row g-3">
                    ${abilities
						.map(
							(ability) => `
                        <div class="col-md-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title d-flex align-items-center">
                                        ${ability.formatted}
                                        ${
											ability.isHidden
												? `
                                            <span class="badge bg-warning text-dark ms-2 small">Oculta</span>
                                        `
												: ""
										}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    `
						)
						.join("")}
                </div>
            </div>
        `;
	}

	/**
	 * 🏷️ Renderiza badges dos tipos
	 * @param {Array} types - Array de tipos
	 * @returns {string} HTML dos badges
	 * @private
	 */
	_renderTypeBadges(types) {
		return types
			.map((type) => {
				const typeColor = Utils.getPokemonTypeColor(type.name);
				return `
                <span class="badge px-3 py-2 rounded-pill" 
                      style="background-color: ${typeColor}; color: white; font-weight: 500;">
                    ${type.formatted}
                </span>
            `;
			})
			.join("");
	}

	/**
	 * 🎯 Renderiza o componente em um container
	 * @param {Element|string} container - Container onde renderizar
	 */
	mount(container) {
		const containerElement =
			typeof container === "string" ? Utils.findElement(container) : container;

		if (!containerElement) {
			console.error("❌ Container não encontrado para renderizar detalhes");
			return;
		}

		// 🧹 Limpar container
		Utils.clearElement(containerElement);

		// 🎨 Inserir HTML
		containerElement.innerHTML = this.render();

		// 🔍 Encontrar elemento criado
		this.element = containerElement.querySelector(".pokemon-details-container");

		// 👂 Adicionar event listeners
		this._attachEvents();

		console.log(`✅ Detalhes do ${this.pokemon.formattedName} renderizados`);
	}

	/**
	 * 👂 Adiciona event listeners
	 * @private
	 */
	_attachEvents() {
		if (!this.element) return;

		// 🎵 Event listener para áudio
		this.element.addEventListener("playAudio", () => {
			this._playPokemonCry();
		});
	}

	/**
	 * 🎵 Reproduz o som do Pokémon
	 * @private
	 */
	async _playPokemonCry() {
		if (this.isPlayingAudio) {
			console.log("🎵 Áudio já está sendo reproduzido");
			return;
		}

		try {
			const audioBtn = this.element.querySelector(".audio-btn i");
			const originalClass = audioBtn.className;

			// 🎵 Indicar que está carregando
			audioBtn.className = "bi bi-three-dots";
			this.isPlayingAudio = true;

			// 🌐 Buscar URL do áudio
			const pokemonAPI = window.pokemonAPI;
			if (!pokemonAPI) {
				throw new Error("PokemonAPI não disponível");
			}

			const audioUrl = await pokemonAPI.getPokemonAudio(this.pokemon.id);

			if (!audioUrl) {
				throw new Error("Áudio não encontrado para este Pokémon");
			}

			// 🎵 Reproduzir áudio
			if (this.audioElement) {
				this.audioElement.pause();
			}

			this.audioElement = new Audio(audioUrl);

			// 🎵 Configurar eventos do áudio
			this.audioElement.onplay = () => {
				audioBtn.className = "bi bi-volume-up-fill";
				console.log(`🎵 Reproduzindo som do ${this.pokemon.formattedName}`);
			};

			this.audioElement.onended = () => {
				audioBtn.className = originalClass;
				this.isPlayingAudio = false;
				console.log("🎵 Reprodução finalizada");
			};

			this.audioElement.onerror = () => {
				audioBtn.className = "bi bi-volume-mute";
				this.isPlayingAudio = false;
				console.error("❌ Erro ao reproduzir áudio");
			};

			await this.audioElement.play();
		} catch (error) {
			console.error("❌ Erro ao reproduzir som:", error);

			// 🔄 Resetar botão
			const audioBtn = this.element.querySelector(".audio-btn i");
			if (audioBtn) {
				audioBtn.className = "bi bi-volume-mute";
			}
			this.isPlayingAudio = false;
		}
	}

	/**
	 * 🧹 Remove o componente do DOM
	 */
	unmount() {
		if (this.audioElement) {
			this.audioElement.pause();
			this.audioElement = null;
		}

		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
			this.element = null;
		}

		this.isPlayingAudio = false;
	}

	/**
	 * 📊 Retorna status do componente
	 * @returns {Object} Status atual
	 */
	getStatus() {
		return {
			pokemonId: this.pokemon?.id,
			pokemonName: this.pokemon?.name,
			isMounted: !!this.element,
			isPlayingAudio: this.isPlayingAudio,
			element: this.element,
		};
	}
}

// ========================================
// 📤 EXPORTAÇÕES
// ========================================

export { PokemonDetails };
export default PokemonDetails;
