// ========================================
// POKEMON DETAILS HEADER - Renderização do container header (esquerda)
// ========================================

import { DOMUtils, PokemonTypes, TextFormatter } from "../utils/index.js";

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
				types: pokemonData.types.map((typeInfo) => typeInfo.type.name),
				height: pokemonData.height,
				weight: pokemonData.weight,
				speciesUrl: pokemonData.species.url, // URL da species para buscar flavor text
			};

			// Buscar flavor text da species
			await this.fetchFlavorText();

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

			// Buscar flavor text em português ou inglês como fallback
			const flavorTexts = speciesData.flavor_text_entries;
			let flavorText = null;

			// Priorizar português
			const ptEntry = flavorTexts.find((entry) => entry.language.name === "pt");
			if (ptEntry) {
				flavorText = ptEntry.flavor_text;
			} else {
				// Fallback para inglês
				const enEntry = flavorTexts.find(
					(entry) => entry.language.name === "en"
				);
				if (enEntry) {
					flavorText = enEntry.flavor_text;
				}
			}

			// Limpar caracteres especiais do flavor text
			if (flavorText) {
				this.data.flavorText = flavorText
					.replace(/\f/g, " ") // Remove form feed
					.replace(/\n/g, " ") // Remove quebras de linha
					.replace(/\s+/g, " ") // Remove espaços múltiplos
					.trim();

				console.log(
					`📖 Flavor text encontrado para ${this.data.name}:`,
					this.data.flavorText
				);
			} else {
				this.data.flavorText = `${TextFormatter.capitalize(
					this.data.name
				)} é um Pokémon fascinante com habilidades únicas.`;
				console.log(`📖 Usando flavor text padrão para ${this.data.name}`);
			}
		} catch (error) {
			console.error(`❌ Erro ao carregar flavor text:`, error);
			this.data.flavorText = `${TextFormatter.capitalize(
				this.data.name
			)} é um Pokémon fascinante com habilidades únicas.`;
		}
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
			const primaryType = this.data.types[0]?.toLowerCase() || "normal";

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
												title="Voltar">
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
											title="Pokémon Anterior (#${this.pokemonId - 1})"
											aria-label="Pokémon Anterior">
										<i class="pokemon-nav-icon bi bi-chevron-left"></i>
									</button>
								`
										: ""
								}
								
								<div class="position-relative d-inline-block">
									<!-- Audio Indicator - Material Design 3 -->
									<div id="audio-indicator" 
										 class="pokemon-audio-indicator pokemon-audio-indicator-${primaryType} position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center shadow-lg">
										<i id="audio-icon" class="pokemon-audio-icon pokemon-audio-icon-${primaryType} bi bi-volume-up-fill"></i>
									</div>
									
									<!-- Sprite principal - Material Design 3 -->
									<img id="pokemon-main-sprite"
										 src="${this.data.sprite}" 
										 alt="${formattedName}" 
										 class="pokemon-main-sprite img-fluid mb-3" 
										 onclick="pokemonDetailsHeader.playPokemonCry()">
								</div>
								
								<!-- Botão Próximo - Material Design 3 -->
								${
									this.hasNextPokemon()
										? `
									<button class="btn pokemon-nav-button pokemon-nav-button--next nav-${primaryType} position-absolute end-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
											onclick="pokemonDetailsHeader.navigateToNext()"
											title="Próximo Pokémon (#${this.pokemonId + 1})"
											aria-label="Próximo Pokémon">
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
					</div>
				</div>
			`;

			// Disponibilizar globalmente a instância para uso nos event handlers
			window.pokemonDetailsHeader = this;
		} catch (error) {
			headerContainer.innerHTML = `
				<div class="alert alert-danger m-4">
					<h4>❌ Erro ao carregar header</h4>
					<p>${error.message}</p>
				</div>
			`;
		}
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
}
