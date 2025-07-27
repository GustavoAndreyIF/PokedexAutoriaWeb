// ========================================
// POKEMON DETAILS HEADER - Renderização do container header (esquerda)
// ========================================

import { DOMUtils, PokemonTypes, TextFormatter } from "../utils/index.js";
import ImageManager from "../utils/ImageManager.js";

export class PokemonDetailsHeader {
	constructor(pokemonId, pokemonUrl) {
		this.pokemonId = pokemonId;
		this.pokemonUrl = pokemonUrl;
		this.data = null;
		this.audioUrl = null;
		this.isPlayingAudio = false;
		this.maxPokemonId = 1025; // Limite atual da PokéAPI
	}

	// Verificar se há Pokémon anterior
	hasPreviousPokemon() {
		return this.pokemonId > 1;
	}

	// Verificar se há próximo Pokémon
	hasNextPokemon() {
		return this.pokemonId < this.maxPokemonId;
	}

	// Navegar para o Pokémon anterior
	navigateToPrevious() {
		if (this.hasPreviousPokemon()) {
			const previousId = this.pokemonId - 1;
			window.location.href = `detalhes.html?id=${previousId}`;
		}
	}

	// Navegar para o próximo Pokémon
	navigateToNext() {
		if (this.hasNextPokemon()) {
			const nextId = this.pokemonId + 1;
			window.location.href = `detalhes.html?id=${nextId}`;
		}
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

	// Método para buscar os detalhes das habilidades
	async fetchAbilitiesDetails() {
		try {
			this.data.abilitiesDetails = [];

			for (const abilityInfo of this.data.abilities) {
				const response = await fetch(abilityInfo.ability.url);
				if (!response.ok) {
					throw new Error(`Erro HTTP: ${response.status}`);
				}

				const abilityData = await response.json();

				// Buscar nome em inglês (fallback para nome formatado da API)
				const englishName = abilityData.names.find(
					(name) => name.language.name === "en"
				);
				const abilityName = englishName
					? englishName.name
					: TextFormatter.capitalize(abilityInfo.ability.name);

				// Buscar descrição em inglês (flavor text)
				const englishFlavor = abilityData.flavor_text_entries.find(
					(entry) => entry.language.name === "en"
				);
				const abilityDescription = englishFlavor
					? TextFormatter.cleanFlavorText(englishFlavor.flavor_text)
					: "Description not available.";

				// Buscar efeito detalhado em inglês
				const englishEffect = abilityData.effect_entries.find(
					(entry) => entry.language.name === "en"
				);
				const abilityEffect = englishEffect
					? TextFormatter.cleanFlavorText(englishEffect.effect)
					: null;

				// Buscar informações da geração
				const generation = abilityData.generation;
				const generationNumber = generation
					? generation.name.replace("generation-", "").toUpperCase()
					: "UNKNOWN";

				// Buscar Pokémon que possuem essa habilidade (limitando a 6 para não sobrecarregar)
				const pokemonList = await Promise.all(
					abilityData.pokemon.slice(0, 6).map(async (pokemonInfo) => {
						const pokemonId = this.extractPokemonIdFromUrl(
							pokemonInfo.pokemon.url
						);

						try {
							// Buscar tipos do Pokémon
							const pokemonResponse = await fetch(
								pokemonInfo.pokemon.url
							);
							if (pokemonResponse.ok) {
								const pokemonData = await pokemonResponse.json();
								const types = pokemonData.types.map(
									(typeInfo) => typeInfo.type.name
								);

								return {
									name: pokemonInfo.pokemon.name,
									url: pokemonInfo.pokemon.url,
									isHidden: pokemonInfo.is_hidden,
									slot: pokemonInfo.slot,
									id: pokemonId,
									types: types,
								};
							} else {
								// Fallback se não conseguir buscar os tipos
								return {
									name: pokemonInfo.pokemon.name,
									url: pokemonInfo.pokemon.url,
									isHidden: pokemonInfo.is_hidden,
									slot: pokemonInfo.slot,
									id: pokemonId,
									types: ["normal"], // Tipo padrão
								};
							}
						} catch (fetchError) {
							console.warn(
								`⚠️ Erro ao buscar tipos do Pokémon ${pokemonInfo.pokemon.name}:`,
								fetchError
							);
							// Fallback em caso de erro
							return {
								name: pokemonInfo.pokemon.name,
								url: pokemonInfo.pokemon.url,
								isHidden: pokemonInfo.is_hidden,
								slot: pokemonInfo.slot,
								id: pokemonId,
								types: ["normal"], // Tipo padrão
							};
						}
					})
				);

				// Adicionar aos detalhes das habilidades
				this.data.abilitiesDetails.push({
					id: abilityData.id,
					name: abilityName,
					description: abilityDescription,
					effect: abilityEffect,
					generation: generationNumber,
					pokemonList: pokemonList,
					isHidden: abilityInfo.is_hidden,
					slot: abilityInfo.slot,
					originalName: abilityInfo.ability.name,
				});

				console.log(
					`🎯 Habilidade encontrada para ${this.data.name}:`,
					abilityName,
					abilityInfo.is_hidden ? "(Oculta)" : ""
				);
			}
		} catch (error) {
			console.error(`❌ Erro ao carregar detalhes das habilidades:`, error);
			this.data.abilitiesDetails = [];
		}
	}

	// Método auxiliar para extrair ID do Pokémon da URL
	extractPokemonIdFromUrl(url) {
		const matches = url.match(/\/pokemon\/(\d+)\//);
		return matches ? parseInt(matches[1]) : null;
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

			// Inicializar tooltips do Bootstrap
			this.initializeTooltips();
		} catch (error) {
			headerContainer.innerHTML = `
				<div class="alert alert-danger m-4">
					<h4>❌ Erro ao carregar header</h4>
					<p>${error.message}</p>
				</div>
			`;
		}
	}

	// Método para renderizar os botões das habilidades
	renderAbilities(primaryType) {
		if (!this.data.abilitiesDetails || this.data.abilitiesDetails.length === 0) {
			return '<span class="text-white-50 small">No abilities available</span>';
		}

		return this.data.abilitiesDetails
			.map((ability) => {
				const hiddenBadge = ability.isHidden
					? '<i class="bi bi-eye-slash-fill ms-1" title="Hidden Ability"></i>'
					: "";
				return `
					<button type="button" 
							class="btn btn-light btn-sm pokemon-ability-btn ability-${primaryType}" 
							data-bs-toggle="modal" 
							data-bs-target="#abilityModal-${ability.id}"
							title="${ability.description}">
						<i class="bi bi-star-fill me-1"></i>
						${ability.name}
						${hiddenBadge}
					</button>
				`;
			})
			.join("");
	}

	// Método para renderizar os modais das habilidades
	renderAbilityModals(primaryType) {
		if (!this.data.abilitiesDetails || this.data.abilitiesDetails.length === 0) {
			return "";
		}

		return this.data.abilitiesDetails
			.map((ability) => {
				const modalId = `abilityModal-${ability.id}`;
				const hiddenBadge = ability.isHidden
					? '<span class="badge bg-white text-dark ms-2 hidden-ability-badge"><i class="bi bi-eye-slash-fill me-1"></i>Hidden</span>'
					: "";

				// Renderizar lista de Pokémon
				const pokemonCards = ability.pokemonList
					.map((pokemon) => {
						const pokemonId = TextFormatter.formatNumber(pokemon.id, 3);
						const formattedName = TextFormatter.formatPokemonName(
							pokemon.name
						);

						// Tipo principal (assumir normal se não disponível por enquanto)
						const primaryType = pokemon.types ? pokemon.types[0] : "normal";

						// Background baseado no tipo
						const backgroundInfo =
							ImageManager.getTypeBackgroundImage(primaryType);

						// Badges dos tipos (se disponível)
						const typeBadges = pokemon.types
							? pokemon.types
									.map((type) => {
										const typeColor = PokemonTypes.getColor(type);
										const iconPath = PokemonTypes.getIconPath(type);
										const displayName =
											TextFormatter.capitalize(type);

										return `
									<span class="pokemon-type-badge" style="background-color: ${typeColor};">
										<img src="${iconPath}" 
											 alt="${type}" 
											 class="pokemon-type-badge__icon"
											 onerror="this.style.display='none';">
										${displayName}
									</span>
								`;
									})
									.join("")
							: "";

						// Hidden badge
						const hiddenBadge = pokemon.isHidden
							? '<span class="ability-pokemon-card__hidden-badge"><i class="bi bi-eye-slash-fill me-1"></i>Hidden</span>'
							: "";

						return `
						<div class="col-6 col-md-4">
							<a href="detalhes.html?id=${pokemon.id}" class="text-decoration-none">
								<div class="ability-pokemon-card h-100 pokemon-type-${primaryType}">
									<!-- Fundo baseado no tipo -->
									<div class="ability-pokemon-card__background"
										 style="background-image: url('${backgroundInfo.imagePath}');"></div>
									
									<div class="ability-pokemon-card__body">
										<div class="ability-pokemon-card__info">
											<!-- ID da Pokédex -->
											<div class="ability-pokemon-card__id">
												#${pokemonId}${hiddenBadge}
											</div>
											
											<!-- Nome do Pokémon -->
											<h6 class="ability-pokemon-card__name">
												${formattedName}
											</h6>
											
											<!-- Tipos (se disponível) -->
											${typeBadges ? `<div class="ability-pokemon-card__types">${typeBadges}</div>` : ""}
										</div>
										
										<!-- Sprite do Pokémon -->
										<div class="ability-pokemon-card__sprite-container">
											<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
												pokemon.id
											}.png" 
												 alt="${formattedName}" 
												 class="ability-pokemon-card__sprite"
												 onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
														pokemon.id
													}.png'; if(this.src.includes('official-artwork')) this.style.display='none'; this.nextElementSibling.style.display='flex';">
											<div class="ability-pokemon-card__sprite-fallback" style="display: none;">❓</div>
										</div>
									</div>
								</div>
							</a>
						</div>
					`;
					})
					.join("");

				return `
					<!-- Modal Aprimorado para ${ability.name} -->
					<div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered modal-lg">
							<div class="modal-content ability-modal-${primaryType}">
								<div class="modal-header border-0 pb-2">
									<div class="d-flex align-items-center w-100">
										<div class="flex-grow-1">
											<h4 class="modal-title d-flex align-items-center mb-1" id="${modalId}Label">
												<i class="bi bi-star-fill me-2"></i>
												${ability.name}
												${hiddenBadge}
											</h4>
											<div class="ability-meta d-flex align-items-center gap-3">
												<small class="text-white">
													<i class="bi bi-layers me-1 text-light"></i>
													Generation: ${ability.generation}
												</small>
												<small class="text-white">
													<i class="bi bi-hash me-1 text-light"></i>
													ID: ${ability.id}
												</small>
												<small class="text-white">
													<i class="bi bi-award me-1 text-light"></i>
													Slot: ${ability.slot}
												</small>
											</div>
										</div>
										<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
									</div>
								</div>
								
								<div class="modal-body pt-1">
									<!-- Descrição do Flavor Text -->
									<div class="ability-flavor-section mt-3">
										<h6 class="ability-section-title mb-1">
											<i class="bi bi-quote me-1"></i>
											Description
										</h6>
										<div class="ability-flavor-card p-2 rounded-3">
											<p class="ability-description-text mb-0">${ability.description}</p>
										</div>
									</div>

									${
										ability.effect
											? `
									<!-- Efeito Detalhado -->
									<div class="ability-effect-section">
										<h6 class="ability-section-title mb-1 mt-3">
											<i class="bi bi-gear me-1"></i>
											Detailed Effect
										</h6>
										<div class="ability-effect-card p-2 rounded-3">
											<p class="ability-effect-text mb-0">${ability.effect}</p>
										</div>
									</div>
									`
											: ""
									}

									<!-- Pokémon que possuem esta habilidade -->
									<div class="ability-pokemon-section mt-3">
										<h6 class="ability-section-title mb-1 d-flex align-items-center justify-content-between">
											<span>
												<i class="bi bi-collection me-1"></i>
												Pokémon with this ability
											</span>
											<small class="ability-pokemon-count">(first ${ability.pokemonList.length})</small>
										</h6>
										<div class="row g-2">
											${pokemonCards}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				`;
			})
			.join("");
	}

	// Método para mostrar o audio indicator com animação
	showAudioIndicator() {
		const audioIndicator = DOMUtils.findElement("audio-indicator");

		if (audioIndicator && this.data) {
			audioIndicator.style.opacity = "1";
		}
	}

	// Método para esconder o audio indicator
	hideAudioIndicator() {
		const audioIndicator = DOMUtils.findElement("audio-indicator");
		if (audioIndicator) {
			// Esconder com transição
			audioIndicator.style.opacity = "0";
			audioIndicator.style.transform = "translate(50%, -50%) scale(1)";

			// Esconder completamente após a transição
			setTimeout(() => {
				if (audioIndicator && !this.isPlayingAudio) {
					audioIndicator.style.display = "none";
				}
			}, 300);
		}
	}

	// Método para tocar o áudio do Pokémon
	async playPokemonCry() {
		// Verificar se áudio já está tocando
		if (this.isPlayingAudio) {
			console.log(
				`🔊 Áudio de ${this.data.name} já está tocando, ignorando nova tentativa`
			);
			return false;
		}

		if (!this.audioUrl) {
			console.log(`🔇 Nenhum áudio disponível para ${this.data.name}`);
			return false;
		}

		const sprite = DOMUtils.findElement("pokemon-main-sprite");

		try {
			// Marcar como tocando ANTES de mostrar o indicator
			this.isPlayingAudio = true;
			console.log(`🔊 Tocando áudio de ${this.data.name}:`, this.audioUrl);

			// Mostrar indicador visual imediatamente
			this.showAudioIndicator();

			// Adicionar classe de áudio tocando no sprite
			if (sprite) {
				sprite.classList.add("audio-playing");
			}

			// Criar e tocar áudio
			const audio = new Audio(this.audioUrl);
			audio.volume = 0.6; // Volume moderado

			// Promise para aguardar o áudio terminar
			await new Promise((resolve, reject) => {
				audio.onended = () => {
					console.log(`✅ Áudio de ${this.data.name} finalizado`);

					// Marcar como não tocando ANTES de esconder
					this.isPlayingAudio = false;

					// Esconder indicador imediatamente quando áudio termina
					this.hideAudioIndicator();

					// Remover classe de áudio tocando do sprite
					if (sprite) {
						sprite.classList.remove("audio-playing");
					}

					resolve();
				};

				audio.onerror = (error) => {
					console.error(
						`❌ Erro ao tocar áudio de ${this.data.name}:`,
						error
					);

					// Marcar como não tocando ANTES de esconder
					this.isPlayingAudio = false;

					// Esconder indicador em caso de erro
					this.hideAudioIndicator();

					// Remover classe de áudio tocando do sprite
					if (sprite) {
						sprite.classList.remove("audio-playing");
					}

					reject(error);
				};

				// Iniciar reprodução
				audio.play().catch(reject);
			});

			return true;
		} catch (error) {
			console.error(`❌ Erro ao reproduzir áudio de ${this.data.name}:`, error);

			// Limpar estados em caso de erro
			this.isPlayingAudio = false;
			this.hideAudioIndicator();

			if (sprite) {
				sprite.classList.remove("audio-playing");
			}

			return false;
		}
	}

	// Método para inicializar tooltips do Bootstrap
	initializeTooltips() {
		// Aguardar um pequeno delay para garantir que o DOM foi renderizado
		setTimeout(() => {
			// Selecionar todos os elementos com data-bs-toggle="tooltip"
			const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
			
			// Inicializar tooltips do Bootstrap
			const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => {
				return new bootstrap.Tooltip(tooltipTriggerEl, {
					// Configurações customizadas
					delay: { show: 300, hide: 100 },
					animation: true,
					html: false
				});
			});

			console.log(`✅ ${tooltipList.length} tooltips inicializados no header`);
		}, 100);
	}
}
