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
			const headerBackground = PokemonTypes.getTypeColor(primaryType);

			// Imagem de fundo baseada no tipo primário
			const backgroundImage = `./src/assets/images/backgroundDetails/${primaryType}.png`;

			// Tipos com ícones
			const typeBadges = this.data.types
				.map((type) => {
					const typeColor = PokemonTypes.getTypeColor(type.toLowerCase());
					return `<span class="badge text-white px-2 px-md-3 py-2 rounded-pill me-1 me-md-2 d-flex align-items-center"
						  style="background-color: ${typeColor}; font-size: clamp(0.75rem, 2vw, 0.9rem); width: fit-content;">
						<img src="./src/assets/images/icons/${type.toLowerCase()}.png" 
							 alt="${type}" 
							 style="width: clamp(12px, 3vw, 16px); height: clamp(12px, 3vw, 16px); margin-right: 4px;"
							 onerror="this.style.display='none'">
						${TextFormatter.capitalize(type)}
					</span>`;
				})
				.join("");

			headerContainer.innerHTML = `
				<!-- Container principal responsivo -->
				<div class="text-white py-3 py-md-4" 
					 style="background: url('${backgroundImage}'); 
					        background-size: cover; 
					        background-position: center; 
					        background-repeat: no-repeat;">
					<div class="container-fluid px-3 px-md-4">

						<!-- Nome, id, btn pra voltar -->
						<div class="row align-items-center mb-3 mb-md-4">
							<div class="col">
								<div class="d-flex justify-content-between align-items-center">
									<div class="d-flex align-items-center">
										<a class="text-white me-2 me-md-3 btn p-0 border-0 bg-transparent" 
												href="index.html" 
												style="font-size: 2rem; font-size: clamp(2rem, 5vw, 3rem);"
												title="Voltar">
											<i class="bi bi-x-lg"></i>
										</a>
										<h1 class="mb-0 fw-bold" style="font-size: clamp(1.5rem, 6vw, 2.5rem);">${formattedName}</h1>
									</div>

									<!-- Badge do ID responsivo -->
									<small class="badge acrylic-dark-light acrylic-text fw-bold"
										   style="font-size: clamp(1rem, 3vw, 1.3rem); padding: 0.5rem 0.75rem;">
										${formattedId}
									</small>
								</div>
							</div>
						</div>
						
						<!-- Imagem do Pokémon responsiva -->
						<div class="text-center mb-3 mb-md-4">
							<div class="position-relative d-flex align-items-center justify-content-center">
								
								<!-- Botão Anterior -->
								${
									this.hasPreviousPokemon()
										? `
									<button class="btn btn-outline-light border-0 position-absolute start-0 acrylic-dark-light rounded-circle d-flex align-items-center justify-content-center shadow-lg"
											style="width: clamp(35px, 7vw, 45px); height: clamp(35px, 7vw, 45px); z-index: 2; left: clamp(5px, 2vw, 10px);"
											onclick="pokemonDetailsHeader.navigateToPrevious()"
											title="Pokémon Anterior (#${this.pokemonId - 1})">
										<i class="bi bi-chevron-left" style="font-size: clamp(1rem, 2.5vw, 1.3rem); color: rgba(255, 255, 255, 0.9);"></i>
									</button>
								`
										: ""
								}
								
								<div class="position-relative d-inline-block">
									<!-- Audio Indicator responsivo -->
									<div id="audio-indicator" 
										 class="position-absolute top-0 end-0 rounded-circle d-flex align-items-center justify-content-center shadow-lg"
										 style="width: clamp(35px, 7vw, 45px); height: clamp(35px, 7vw, 45px); z-index: 3; display: none; transform: translate(50%, -50%); opacity: 0; transition: all 0.3s ease;">
										<i id="audio-icon" class="bi bi-volume-up-fill" style="font-size: clamp(0.9rem, 2.2vw, 1.2rem); color: ${headerBackground};"></i>
									</div>
									
									<!-- Sprite responsivo -->
									<img id="pokemon-main-sprite"
										 src="${this.data.sprite}" 
										 alt="${formattedName}" 
										 class="img-fluid mb-3" 
										 style="width: clamp(160px, 40vw, 260px); height: clamp(160px, 40vw, 260px); cursor: pointer; transition: transform 0.3s ease; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));"
										 onclick="pokemonDetailsHeader.playPokemonCry()"
										 onmouseover="this.style.transform='scale(1.05)'"
										 onmouseout="this.style.transform='scale(1)'">
								</div>
								
								<!-- Botão Próximo -->
								${
									this.hasNextPokemon()
										? `
									<button class="btn btn-outline-light border-0 position-absolute end-0 acrylic-dark-light rounded-circle d-flex align-items-center justify-content-center shadow-lg"
											style="width: clamp(35px, 7vw, 45px); height: clamp(35px, 7vw, 45px); z-index: 2; right: clamp(5px, 2vw, 10px);"
											onclick="pokemonDetailsHeader.navigateToNext()"
											title="Próximo Pokémon (#${this.pokemonId + 1})">
										<i class="bi bi-chevron-right" style="font-size: clamp(1rem, 2.5vw, 1.3rem); color: rgba(255, 255, 255, 0.9);"></i>
									</button>
								`
										: ""
								}
								
							</div>
						</div>
						
						<!-- Type badges responsivos -->
						<div class="text-center mb-3 mb-md-4">
							<div class="d-flex justify-content-center gap-1 gap-md-2 flex-wrap">
								${typeBadges}
							</div>
						</div>
						
						<!-- Flavor Text responsivo -->
						<div class="text-center mb-3 mb-md-4 px-2 px-md-3">
							<div class="acrylic-dark-light rounded-3 rounded-md-4 p-3 p-md-4">
								<p class="mb-0 acrylic-text fst-italic" style="font-size: clamp(1.2rem, 3vw, 1.5rem); line-height: 1.4; line-height: clamp(1.4, 1.5vw, 1.6);">
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
		const audioIcon = DOMUtils.findElement("audio-icon");

		if (audioIndicator && audioIcon && this.data) {
			// Obter cor do tipo primário para o ícone (como era antes)
			const primaryType = this.data.types[0]?.toLowerCase() || "normal";
			const typeColor = PokemonTypes.getTypeColor(primaryType);

			// Aplicar cor dinâmica do tipo no ícone com glow sutil
			audioIcon.style.color = typeColor;
			audioIcon.style.filter = `drop-shadow(0 1px 3px rgba(0,0,0,0.8)) drop-shadow(0 0 8px ${typeColor}60)`;

			// Mostrar com animação acrílica
			audioIndicator.style.display = "flex";
			// Força um reflow para garantir que o display seja aplicado antes da opacidade
			audioIndicator.offsetHeight;
			audioIndicator.style.opacity = "1";
			audioIndicator.style.transform = "translate(50%, -50%) scale(1.05)";

			// Adicionar animação de pulso acrílica
			audioIndicator.classList.add("pulse-acrylic");
		}
	}

	// Método para esconder o audio indicator
	hideAudioIndicator() {
		const audioIndicator = DOMUtils.findElement("audio-indicator");
		if (audioIndicator) {
			// Remover animação acrílica
			audioIndicator.classList.remove("pulse-acrylic");

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
