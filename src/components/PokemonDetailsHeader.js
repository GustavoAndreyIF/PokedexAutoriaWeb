// ========================================
// POKEMON DETAILS HEADER - Renderização do container header (esquerda)
// ========================================

import { PokemonTypes, TextFormatter } from "../utils/index.js";

export class PokemonDetailsHeader {
	constructor(pokemonId, pokemonUrl) {
		this.pokemonId = pokemonId;
		this.pokemonUrl = pokemonUrl;
		this.data = null;
		this.audioUrl = null;
		this.isPlayingAudio = false;
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
			};

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

	// Método para renderizar o header container (coluna da esquerda)
	async render() {
		const headerContainer = document.getElementById(
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

			// Tipos com ícones
			const typeBadges = this.data.types
				.map((type) => {
					const typeColor = PokemonTypes.getTypeColor(type.toLowerCase());
					return `<span class="badge text-white px-3 py-2 rounded-pill me-2 d-flex align-items-center"
						  style="background-color: ${typeColor}; font-size: 0.9rem; width: fit-content;">
						<img src="./src/assets/images/icons/${type.toLowerCase()}.png" 
							 alt="${type}" 
							 style="width: 16px; height: 16px; margin-right: 6px;"
							 onerror="this.style.display='none'">
						${TextFormatter.capitalize(type)}
					</span>`;
				})
				.join("");

			headerContainer.innerHTML = `
				<div class="position-relative text-white py-4" style="background: linear-gradient(135deg, ${headerBackground}, ${headerBackground}dd); min-height: 100vh;">
					<div class="container-fluid px-4">
						<div class="row align-items-center mb-4">
							<div class="col">
								<a class="text-white me-3 btn p-0 border-0 bg-transparent" 
										href="index.html" 
										style="font-size: 2rem;"
										title="Voltar">
									<i class="bi bi-x-lg"></i>
								</a>
								<h1 class="d-inline mb-0 fw-bold">${formattedName}</h1>
								<span class="ms-3 opacity-75 fs-5">${formattedId}</span>
							</div>
						</div>
						
						<div class="text-center mb-4">
							<div class="position-relative d-inline-block">
								<div id="audio-indicator" 
									 class="position-absolute top-0 end-0 bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
									 style="width: 40px; height: 40px; z-index: 3; display: none; transform: translate(50%, -50%);">
									<i class="bi bi-volume-up-fill"></i>
								</div>
								
								<img id="pokemon-main-sprite"
									 src="${this.data.sprite}" 
									 alt="${formattedName}" 
									 class="img-fluid mb-3" 
									 style="width: 300px; height: 300px; cursor: pointer; transition: transform 0.3s ease; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));"
									 onclick="pokemonDetailsHeader.playPokemonCry()"
									 onmouseover="this.style.transform='scale(1.05)'"
									 onmouseout="this.style.transform='scale(1)'">
							</div>
						</div>
						
						<div class="text-center mb-4">
							<div class="d-flex justify-content-center gap-2 flex-wrap">
								${typeBadges}
							</div>
						</div>
						
						<div class="row text-center">
							<div class="col-6 mb-3">
								<div class="bg-white bg-opacity-20 rounded-4 p-3">
									<h4 class="mb-0">${(this.data.height / 10).toFixed(1)} m</h4>
									<small class="opacity-75">Altura</small>
								</div>
							</div>
							<div class="col-6 mb-3">
								<div class="bg-white bg-opacity-20 rounded-4 p-3">
									<h4 class="mb-0">${(this.data.weight / 10).toFixed(1)} kg</h4>
									<small class="opacity-75">Peso</small>
								</div>
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

		const audioIndicator = document.getElementById("audio-indicator");
		const sprite = document.getElementById("pokemon-main-sprite");

		try {
			// Marcar como tocando
			this.isPlayingAudio = true;
			console.log(`🔊 Tocando áudio de ${this.data.name}:`, this.audioUrl);

			// Mostrar indicador visual
			if (audioIndicator) {
				audioIndicator.style.display = "block";
				audioIndicator.classList.add("pulse");
			}

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
					// Esconder indicador quando áudio termina
					if (audioIndicator) {
						audioIndicator.style.display = "none";
						audioIndicator.classList.remove("pulse");
					}
					// Remover classe de áudio tocando do sprite
					if (sprite) {
						sprite.classList.remove("audio-playing");
					}
					this.isPlayingAudio = false;
					resolve();
				};

				audio.onerror = (error) => {
					console.error(
						`❌ Erro ao tocar áudio de ${this.data.name}:`,
						error
					);
					// Esconder indicador em caso de erro
					if (audioIndicator) {
						audioIndicator.style.display = "none";
						audioIndicator.classList.remove("pulse");
					}
					// Remover classe de áudio tocando do sprite
					if (sprite) {
						sprite.classList.remove("audio-playing");
					}
					this.isPlayingAudio = false;
					reject(error);
				};

				// Iniciar reprodução
				audio.play().catch(reject);
			});

			return true;
		} catch (error) {
			console.error(`❌ Erro ao reproduzir áudio de ${this.data.name}:`, error);

			// Limpar estados em caso de erro
			if (audioIndicator) {
				audioIndicator.style.display = "none";
				audioIndicator.classList.remove("pulse");
			}
			if (sprite) {
				sprite.classList.remove("audio-playing");
			}
			this.isPlayingAudio = false;

			return false;
		}
	}
}
