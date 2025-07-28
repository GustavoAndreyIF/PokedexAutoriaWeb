// ========================================
// POKEMON DETAILS HEADER - Renderização do container header (esquerda)
// ========================================

import { DOMUtils, PokemonTypes, TextFormatter } from "../utils/index.js";
import ImageManager from "../utils/ImageManager.js";
import { TooltipsHeader } from "./detailsHeader/TooltipsHeader.js";
import { NavigateHeader } from "./detailsHeader/NavigateHeader.js";
import { AudioHeader } from "./detailsHeader/AudioHeader.js";
import { AbilityHeader } from "./detailsHeader/AbilityHeader.js";

export class PokemonDetailsHeader {
	constructor(pokemonId, pokemonUrl) {
		this.pokemonId = pokemonId;
		this.pokemonUrl = pokemonUrl;
		this.data = null;
		this.audioUrl = null;
		this.isPlayingAudio = false;
		this.maxPokemonId = 1025; // Limite atual da PokéAPI
	}

	// Verificar se há Pokémon anterior - usando módulo NavigateHeader
	hasPreviousPokemon() {
		return NavigateHeader.hasPreviousPokemon(this.pokemonId);
	}

	// Verificar se há próximo Pokémon - usando módulo NavigateHeader
	hasNextPokemon() {
		return NavigateHeader.hasNextPokemon(this.pokemonId, this.maxPokemonId);
	}

	// Navegar para o Pokémon anterior - usando módulo NavigateHeader
	navigateToPrevious() {
		NavigateHeader.navigateToPrevious(this.pokemonId);
	}

	// Navegar para o próximo Pokémon - usando módulo NavigateHeader
	navigateToNext() {
		NavigateHeader.navigateToNext(this.pokemonId, this.maxPokemonId);
	}

	// Fetch dos dados necessários para o header
	async fetchHeaderData() {
		try {
			const response = await fetch(this.pokemonUrl);
			if (!response.ok) {
				throw new Error(`Erro HTTP: ${response.status}`);
			}

			const pokemonData = await response.json();

			// Extrair apenas dados necessários para o header
			this.data = {
				id: pokemonData.id,
				name: pokemonData.name,
				sprite: pokemonData.sprites?.other?.["official-artwork"]?.front_default,
				// Sprite online GIF do GitHub para a seção de navegação
				localSprite: `https://raw.githubusercontent.com/wellrccity/pokedex-html-js/refs/heads/master/assets/img/pokemons/poke_${pokemonData.id}.gif`,
				types: pokemonData.types.map((typeInfo) => typeInfo.type.name),
				height: pokemonData.height,
				weight: pokemonData.weight,
				speciesUrl: pokemonData.species.url, // URL da species para buscar flavor text
				abilities: pokemonData.abilities, // Habilidades do Pokémon
			};

			// Buscar flavor text da species e detalhes das habilidades
			await Promise.all([this.fetchFlavorText(), this.fetchAbilitiesDetails()]);

			// Extrair áudio do Pokémon (cries)
			this.audioUrl = null;
			if (pokemonData.cries) {
				this.audioUrl =
					pokemonData.cries.latest || pokemonData.cries.legacy || null;
				console.log(
					`🔊 Áudio detectado para ${this.data.name}:`,
					this.audioUrl
				);
			}

			return this.data;
		} catch (error) {
			console.error(`❌ Erro ao carregar dados do header:`, error);
			throw error;
		}
	}

	// Método para buscar o flavor text da species
	async fetchFlavorText() {
		try {
			const response = await fetch(this.data.speciesUrl);
			if (!response.ok) {
				throw new Error(`Erro HTTP: ${response.status}`);
			}

			const speciesData = await response.json();

			// Buscar flavor text em inglês
			const englishFlavor = speciesData.flavor_text_entries.find(
				(entry) => entry.language.name === "en"
			);

			if (englishFlavor) {
				// Limpar e formatar o flavor text
				this.data.flavorText = TextFormatter.cleanFlavorText(
					englishFlavor.flavor_text
				);
				console.log(
					`📖 Flavor text encontrado para ${this.data.name}:`,
					this.data.flavorText
				);
			} else {
				// Texto padrão de fallback
				this.data.flavorText = `${TextFormatter.capitalize(
					this.data.name
				)} is a fascinating Pokémon with unique abilities.`;
				console.log(`📖 Usando flavor text padrão para ${this.data.name}`);
			}
		} catch (error) {
			console.error(`❌ Erro ao carregar flavor text:`, error);
			this.data.flavorText = `${TextFormatter.capitalize(
				this.data.name
			)} is a fascinating Pokémon with unique abilities.`;
		}
	}

	// Método para buscar os detalhes das habilidades - delegado para AbilityHeader
	async fetchAbilitiesDetails() {
		this.data.abilitiesDetails = await AbilityHeader.fetchAbilitiesDetails(
			this.data
		);
	}

	// Método para renderizar o header container (coluna da esquerda)
	async render() {
		const headerContainer = DOMUtils.findElement(
			"pokemon-details-header-container"
		);
		if (!headerContainer) {
			console.error(
				"❌ Container pokemon-details-header-container não encontrado"
			);
			return;
		}

		try {
			// Fetch dos dados
			await this.fetchHeaderData();

			const formattedId = TextFormatter.formatPokemonId(this.data.id);
			const formattedName = TextFormatter.capitalize(this.data.name);
			const primaryType = this.data.types[0]?.toLowerCase() || "unknown";

			// Imagem de fundo baseada no tipo primário
			const backgroundImage = `./src/assets/images/backgroundDetails/${primaryType}.png`;

			// Tipos com ícones - Material Design 3
			const typeBadges = this.data.types
				.map((type) => {
					const typeColor = PokemonTypes.getTypeColor(type.toLowerCase());
					const iconPath = PokemonTypes.getIconPath(type.toLowerCase());
					return `
					<span class="badge text-white pokemon-type-badge px-2 px-md-3 py-2 rounded-pill me-1 me-md-2 d-flex align-items-center"
						  style="background-color: ${typeColor};">
						<img src="${iconPath}" 
							 alt="${type}" 
							 class="pokemon-type-badge__icon"
							 onerror="this.style.display='none'">
						${TextFormatter.capitalize(type)}
					</span>`;
				})
				.join("");

			headerContainer.innerHTML = `
				<!-- Container principal responsivo - Material Design 3 -->
				<div class="text-white py-3 py-md-4 pokemon-header-container" 
					 style="background-image: url('${backgroundImage}');">
					<div class="container-fluid px-3 px-md-4">

						<!-- Header top bar - Nome, ID e botão voltar -->
						<div class="row align-items-center mb-3 mb-md-4">
							<div class="col">
								<div class="d-flex justify-content-between align-items-center">
									<div class="d-flex align-items-center">
										<a class="pokemon-back-button back-${primaryType} me-2 me-md-3 btn p-0 border-0 bg-transparent" 
												href="index.html" 
												data-bs-toggle="tooltip" 
												data-bs-placement="bottom"
												data-bs-custom-class="tooltip-${primaryType}"
												title="Back to Home">
											<i class="bi bi-x-lg"></i>
										</a>
										<h1 class="pokemon-name-title mb-0">${formattedName}</h1>
									</div>

									<!-- Badge do ID - Material Design 3 -->
									<small class="badge pokemon-id-badge pokedex-number-details pokemon-type-${primaryType} fw-bold">
										${formattedId}
									</small>
								</div>
							</div>
						</div>
						
						<!-- Seção da imagem do Pokémon com navegação - Material Design 3 -->
						<div class="text-center mb-3 mb-md-4">
							<div class="position-relative d-flex align-items-center justify-content-center">
								
								<!-- Botão Anterior - Material Design 3 -->
								${
									this.hasPreviousPokemon()
										? `
									<button class="btn pokemon-nav-button pokemon-nav-button--previous nav-${primaryType} position-absolute start-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
											onclick="pokemonDetailsHeader.navigateToPrevious()"
											data-bs-toggle="tooltip" 
											data-bs-placement="left"
											data-bs-custom-class="tooltip-${primaryType}"
											title="Previous Pokémon (#${this.pokemonId - 1})"
											aria-label="Previous Pokémon">
										<i class="pokemon-nav-icon bi bi-chevron-left"></i>
									</button>
								`
										: ""
								}
								
								<div class="position-relative d-inline-block">
									<!-- Audio Indicator - Material Design 3 -->
									<div id="audio-indicator" 
										 class="pokemon-audio-indicator audio-${primaryType} position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center shadow-lg">
										<i id="audio-icon" class="pokemon-audio-icon audio-${primaryType} bi bi-volume-up-fill"></i>
									</div>
									
									<!-- Sprite principal online GIF - Material Design 3 -->
									<img id="pokemon-main-sprite"
										 src="${this.data.localSprite}" 
										 alt="${formattedName}" 
										 class="pokemon-main-sprite img-fluid mb-3" 
										 onclick="pokemonDetailsHeader.playPokemonCry()"
										 onerror="this.src='${
												this.data.sprite
											}'; console.warn('Fallback para sprite original do Pokémon #${
				this.data.id
			}');">
								</div>
								
								<!-- Botão Próximo - Material Design 3 -->
								${
									this.hasNextPokemon()
										? `
									<button class="btn pokemon-nav-button pokemon-nav-button--next nav-${primaryType} position-absolute end-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
											onclick="pokemonDetailsHeader.navigateToNext()"
											data-bs-toggle="tooltip" 
											data-bs-placement="right"
											data-bs-custom-class="tooltip-${primaryType}"
											title="Next Pokémon (#${this.pokemonId + 1})"
											aria-label="Next Pokémon">
										<i class="pokemon-nav-icon bi bi-chevron-right"></i>
									</button>
								`
										: ""
								}
								
							</div>
						</div>
						
						<!-- Type badges - Material Design 3 -->
						<div class="text-center mb-3 mb-md-4">
							<div class="d-flex justify-content-center gap-1 gap-md-2 flex-wrap">
								${typeBadges}
							</div>
						</div>
						
						<!-- Flavor Text - Material Design 3 -->
						<div class="text-center mb-3 mb-md-4 px-2 px-md-3">
							<div class="pokemon-flavor-card flavor-${primaryType}">
								<p class="pokemon-flavor-text mb-0">
									"${this.data.flavorText}"
								</p>
							</div>
						</div>
						
						<!-- Abilities Section - Material Design 3 -->
						<div class="text-center mb-3 mb-md-4 px-2 px-md-3">
							<h6 class="text-white mb-2 fw-bold" style="	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
								<i class="bi bi-stars me-1"></i>
								Abilities
							</h6>
							<div class="d-flex justify-content-center gap-2 flex-wrap">
								${this.renderAbilities(primaryType)}
							</div>
						</div>
					</div>
				</div>
				
				<!-- Ability Modals - Material Design 3 -->
				${this.renderAbilityModals(primaryType)}
			`;

			// Disponibilizar globalmente a instância para uso nos event handlers
			window.pokemonDetailsHeader = this;

			// Inicializar tooltips do Bootstrap usando o módulo
			TooltipsHeader.initialize();
		} catch (error) {
			headerContainer.innerHTML = `
				<div class="alert alert-danger m-4">
					<h4>❌ Erro ao carregar header</h4>
					<p>${error.message}</p>
				</div>
			`;
		}
	}

	// Método para renderizar os botões das habilidades - delegado para AbilityHeader
	renderAbilities(primaryType) {
		return AbilityHeader.renderAbilities(this.data.abilitiesDetails, primaryType);
	}

	// Método para renderizar os modais das habilidades - delegado para AbilityHeader
	renderAbilityModals(primaryType) {
		return AbilityHeader.renderAbilityModals(
			this.data.abilitiesDetails,
			primaryType
		);
	}

	// Método para mostrar o audio indicator com animação - usando módulo AudioHeader
	showAudioIndicator() {
		AudioHeader.showAudioIndicator(this.data);
	}

	// Método para esconder o audio indicator - usando módulo AudioHeader
	hideAudioIndicator() {
		AudioHeader.hideAudioIndicator(this.isPlayingAudio);
	}

	// Método para tocar o áudio do Pokémon - usando módulo AudioHeader
	async playPokemonCry() {
		return await AudioHeader.playPokemonCry(
			{
				isPlayingAudio: this.isPlayingAudio,
				audioUrl: this.audioUrl,
				data: this.data,
			},
			(newState) => {
				this.isPlayingAudio = newState;
			}
		);
	}
}
