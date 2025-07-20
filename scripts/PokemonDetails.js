// ========================================
// POKEMON DETAILS - Classe para representar um Pokemon com detalhes completos
// ========================================

import { PokemonCard } from "./PokemonCard.js";

export class PokemonDetails extends PokemonCard {
	constructor(name, url) {
		super(name, url);
		this.species = null;
		this.isSpeciesLoaded = false;
		this.isDetailsLoaded = false;
		this.details = null;
		this.speciesUrl = null;
		this.audioUrl = null; // URL do áudio do Pokémon
		this.isPlayingAudio = false; // Flag para controlar se áudio está tocando
	}

	// Override do fetchDetails para salvar dados completos
	async fetchDetails() {
		try {
			const response = await fetch(this.url);
			if (!response.ok) {
				throw new Error(`Erro HTTP: ${response.status}`);
			}

			const data = await response.json();

			// Salvar dados completos
			this.details = data;
			this.isDetailsLoaded = true;

			// Extrair informações básicas (herdado do PokemonCard)
			this.id = data.id;
			this.name = data.name;
			this.sprite = data.sprites.front_default;
			this.types = data.types.map((typeInfo) => typeInfo.type.name);

			// Extrair áudio do Pokémon (cries)
			this.audioUrl = null;
			if (data.cries) {
				// Priorizar latest, depois legacy
				this.audioUrl = data.cries.latest || data.cries.legacy || null;
				console.log(`🔊 Áudio detectado para ${this.name}:`, this.audioUrl);
			} else {
				console.log(`🔇 Nenhum cries encontrado para ${this.name}`);
			}

			// Configurar URL da espécie
			this.speciesUrl = data.species.url;

			return this;
		} catch (error) {
			console.error(`❌ Erro ao carregar detalhes para ${this.name}:`, error);
			throw error;
		}
	}

	// Método para tocar o áudio do Pokémon
	async playPokemonCry() {
		// Verificar se áudio já está tocando
		if (this.isPlayingAudio) {
			console.log(
				`🔊 Áudio de ${this.name} já está tocando, ignorando nova tentativa`
			);
			return false;
		}

		if (!this.audioUrl) {
			console.log(`🔇 Nenhum áudio disponível para ${this.name}`);
			return false;
		}

		const audioIndicator = document.getElementById("audio-indicator");
		const sprite = document.getElementById("pokemon-main-sprite");

		try {
			// Marcar como tocando
			this.isPlayingAudio = true;
			console.log(`🔊 Tocando áudio de ${this.name}:`, this.audioUrl);

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
					console.log(`✅ Áudio de ${this.name} finalizado`);
					// Esconder indicador quando áudio termina
					if (audioIndicator) {
						audioIndicator.style.display = "none";
						audioIndicator.classList.remove("pulse");
					}
					// Remover classe de áudio tocando do sprite
					if (sprite) {
						sprite.classList.remove("audio-playing");
					}
					// Liberar flag de áudio
					this.isPlayingAudio = false;
					resolve();
				};

				audio.onerror = (error) => {
					console.error(`❌ Erro ao tocar áudio de ${this.name}:`, error);
					// Esconder indicador em caso de erro
					if (audioIndicator) {
						audioIndicator.style.display = "none";
						audioIndicator.classList.remove("pulse");
					}
					// Remover classe de áudio tocando do sprite
					if (sprite) {
						sprite.classList.remove("audio-playing");
					}
					// Liberar flag de áudio
					this.isPlayingAudio = false;
					reject(error);
				};

				audio.play().catch(reject);
			});

			return true;
		} catch (error) {
			console.error(`❌ Erro ao reproduzir áudio de ${this.name}:`, error);
			// Esconder indicador em caso de erro
			if (audioIndicator) {
				audioIndicator.style.display = "none";
				audioIndicator.classList.remove("pulse");
			}
			// Remover classe de áudio tocando do sprite
			if (sprite) {
				sprite.classList.remove("audio-playing");
			}
			// Liberar flag de áudio
			this.isPlayingAudio = false;
			return false;
		}
	}

	// Carregar dados específicos do pokemon-species
	async fetchSpeciesData() {
		try {
			if (this.isSpeciesLoaded) {
				return this.species;
			}

			// Se não tem URL da espécie, construir baseado no ID
			if (!this.speciesUrl && this.id) {
				this.speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${this.id}`;
			}

			if (!this.speciesUrl) {
				throw new Error("URL da espécie não disponível");
			}

			const response = await fetch(this.speciesUrl);
			if (!response.ok) {
				throw new Error(`Erro ao buscar espécie: ${response.status}`);
			}

			this.species = await response.json();
			this.isSpeciesLoaded = true;

			return this.species;
		} catch (error) {
			console.error(`❌ Erro ao carregar espécie para ${this.name}:`, error);
			throw error;
		}
	}

	// Obter o primeiro flavor_text em inglês
	getFlavorText() {
		if (!this.species || !this.species.flavor_text_entries) {
			return "Descrição não disponível";
		}

		const englishFlavor = this.species.flavor_text_entries.find(
			(entry) => entry.language.name === "en"
		);

		if (englishFlavor) {
			// Limpar caracteres especiais (\n, \f) e normalizar espaços
			return englishFlavor.flavor_text
				.replace(/\n/g, " ")
				.replace(/\f/g, " ")
				.replace(/\s+/g, " ")
				.trim();
		}

		return "Descrição não disponível";
	}

	// Obter cor da espécie
	getSpeciesColor() {
		return this.species?.color?.name || "unknown";
	}

	// Obter habitat
	getHabitat() {
		return this.species?.habitat?.name || "unknown";
	}

	// Obter taxa de captura
	getCaptureRate() {
		return this.species?.capture_rate || 0;
	}

	// Obter taxa de felicidade base
	getBaseHappiness() {
		return this.species?.base_happiness || 0;
	}

	// Obter se é pokemon lendário
	isLegendary() {
		return this.species?.is_legendary || false;
	}

	// Obter se é pokemon mítico
	isMythical() {
		return this.species?.is_mythical || false;
	}

	// Obter altura
	getHeight() {
		return this.details?.height || 0;
	}

	// Obter peso
	getWeight() {
		return this.details?.weight || 0;
	}

	// Obter estatísticas base
	getStats() {
		if (!this.details?.stats) return [];

		return this.details.stats.map((stat) => ({
			name: stat.stat.name,
			value: stat.base_stat,
		}));
	}

	// Obter habilidades
	getAbilities() {
		if (!this.details?.abilities) return [];

		return this.details.abilities.map((ability) => ({
			name: ability.ability.name,
			is_hidden: ability.is_hidden,
		}));
	}

	// Obter dados completos dos detalhes
	getDetailsData() {
		return {
			// Dados básicos (herdados)
			...this.getCardData(),

			// Dados de detalhes completos
			height: this.getHeight(),
			weight: this.getWeight(),
			stats: this.getStats(),
			abilities: this.getAbilities(),

			// Dados específicos da espécie
			flavorText: this.getFlavorText(),
			color: this.getSpeciesColor(),
			habitat: this.getHabitat(),
			captureRate: this.getCaptureRate(),
			baseHappiness: this.getBaseHappiness(),
			isLegendary: this.isLegendary(),
			isMythical: this.isMythical(),

			// Informações de status
			speciesLoaded: this.isSpeciesLoaded,
			detailsLoaded: this.isDetailsLoaded,
		};
	}

	// Método para renderizar toda a página de detalhes
	renderDetailsPage() {
		const data = this.getDetailsData();

		// Função para mostrar o conteúdo e esconder loading/error
		const showContent = () => {
			const loadingState = document.getElementById("loading-state");
			const errorState = document.getElementById("error-state");
			const pokemonDetails = document.getElementById("pokemon-details");

			if (loadingState) loadingState.style.display = "none";
			if (errorState) errorState.style.display = "none";
			if (pokemonDetails) pokemonDetails.style.display = "block";
		};

		// Popular elementos da página
		this.populatePageElements(data);

		// Mostrar conteúdo
		showContent();

		return data;
	}

	// Método para popular os elementos da página
	populatePageElements(data) {
		// Nome e ID
		const nameElement = document.getElementById("pokemon-name");
		const idBadge = document.getElementById("pokemon-id-badge");

		console.log(`🏷️ Populando elementos: ID=${data.id}, Nome=${data.name}`);

		if (nameElement) {
			nameElement.textContent = data.name;
			console.log(`✅ Nome definido: ${data.name}`);
		}
		if (idBadge) {
			const formattedId = `#${String(data.id).padStart(3, "0")}`;
			idBadge.textContent = formattedId;
			console.log(`✅ Badge ID definido: ${formattedId}`);
		}

		// Sprite
		const sprite = document.getElementById("pokemon-main-sprite");
		if (sprite) {
			sprite.src = data.sprite;
			sprite.alt = data.name;
		}

		// Background baseado no tipo primário (usando apenas PNG, sem gradiente)
		const background = document.getElementById("pokemon-background");
		if (background && data.types.length > 0) {
			const primaryType = data.types[0].toLowerCase();
			const backgroundUrl = `img/backgrounds/${primaryType}.png`;

			// Limpa qualquer estilo anterior
			background.style.background = "";

			// Aplica o background PNG específico do tipo
			background.style.backgroundImage = `url('${backgroundUrl}')`;
			background.style.backgroundSize = "cover";
			background.style.backgroundPosition = "center";
			background.style.backgroundRepeat = "no-repeat";

			console.log(`🎨 Background aplicado: url('${backgroundUrl}')`);
			console.log(`🔍 Tipo primário: ${primaryType}`);

			// Verificar se a imagem carrega corretamente
			const testImg = new Image();
			testImg.onload = () => {
				console.log(
					`✅ Background PNG carregado com sucesso: ${backgroundUrl}`
				);
			};
			testImg.onerror = () => {
				console.error(`❌ Erro ao carregar background PNG: ${backgroundUrl}`);
			};
			testImg.src = backgroundUrl;
		}

		// Tipos
		const typesContainer = document.getElementById("pokemon-types");
		if (typesContainer) {
			typesContainer.innerHTML = data.types
				.map(
					(type) =>
						`<span class="badge type-${type.toLowerCase()} text-white px-3 py-2 rounded-pill me-1 shadow">
							<img src="img/icons/${type.toLowerCase()}.png" alt="${type}" style="width: 16px; height: 16px;" class="me-1">
							${type}
						</span>`
				)
				.join("");
		}

		// Descrição
		const descriptionElement = document.getElementById("pokemon-description");
		if (descriptionElement) {
			descriptionElement.textContent = data.flavorText;
		}

		// Informações básicas
		const basicInfo = document.getElementById("basic-info");
		if (basicInfo) {
			basicInfo.innerHTML = `
				<li class="mb-2"><strong>Height:</strong> <span class="text-muted">${(
					data.height / 10
				).toFixed(1)} m</span></li>
				<li class="mb-2"><strong>Weight:</strong> <span class="text-muted">${(
					data.weight / 10
				).toFixed(1)} kg</span></li>
				<li class="mb-2"><strong>Color:</strong> <span class="text-muted text-capitalize">${
					data.color
				}</span></li>
				<li class="mb-0"><strong>Habitat:</strong> <span class="text-muted text-capitalize">${
					data.habitat
				}</span></li>
			`;
		}

		// Habilidades
		const abilitiesList = document.getElementById("abilities-list");
		if (abilitiesList) {
			abilitiesList.innerHTML = data.abilities
				.map(
					(ability) => `
					<span class="badge ${
						ability.is_hidden ? "bg-warning text-dark" : "bg-primary"
					} px-3 py-2 rounded-pill"
						  title="${ability.is_hidden ? "Hidden Ability" : "Normal Ability"}">
						${
							ability.is_hidden
								? '<i class="bi bi-eye-slash me-1"></i>'
								: '<i class="bi bi-star-fill me-1"></i>'
						}
						${ability.name.charAt(0).toUpperCase() + ability.name.slice(1).replace("-", " ")}
					</span>
				`
				)
				.join("");
		}

		// Estatísticas base
		const baseStats = document.getElementById("base-stats");
		if (baseStats) {
			const statNames = {
				hp: "HP",
				attack: "Attack",
				defense: "Defense",
				"special-attack": "Sp. Attack",
				"special-defense": "Sp. Defense",
				speed: "Speed",
			};

			baseStats.innerHTML = data.stats
				.map(
					(stat) => `
					<div class="mb-3">
						<div class="d-flex justify-content-between align-items-center mb-2">
							<span class="fw-semibold">${statNames[stat.name] || stat.name}</span>
							<span class="badge bg-primary fs-6">${stat.value}</span>
						</div>
						<div class="progress" style="height: 8px;">
							<div class="progress-bar bg-gradient" 
								 role="progressbar" 
								 style="width: ${Math.min(
										(stat.value / 255) * 100,
										100
									)}%; background: linear-gradient(90deg, #28a745 0%, #ffc107 50%, #dc3545 100%);"
								 aria-valuenow="${stat.value}" 
								 aria-valuemin="0" 
								 aria-valuemax="255">
							</div>
						</div>
					</div>
				`
				)
				.join("");
		}

		// Configurar botões de navegação
		const prevBtn = document.getElementById("prev-pokemon-btn");
		const nextBtn = document.getElementById("next-pokemon-btn");

		// Botão Anterior - só aparecer se não for o primeiro Pokémon
		if (prevBtn) {
			if (data.id > 1) {
				prevBtn.style.display = "block";
				prevBtn.onclick = () => {
					window.location.href = `detalhes.html?id=${data.id - 1}`;
				};
			} else {
				prevBtn.style.display = "none";
			}
		}

		// Botão Próximo - só aparecer se não for o último Pokémon
		if (nextBtn) {
			if (data.id < 1010) {
				// Limite aproximado da Pokédex
				nextBtn.style.display = "block";
				nextBtn.onclick = () => {
					window.location.href = `detalhes.html?id=${data.id + 1}`;
				};
			} else {
				nextBtn.style.display = "none";
			}
		}
	}

	// Converter de PokemonCard para PokemonDetails (reutilizar dados já carregados)
	static fromPokemonCard(pokemonCard) {
		const pokemonDetails = new PokemonDetails(pokemonCard.name, pokemonCard.url);

		// Copiar dados já carregados do card
		pokemonDetails.id = pokemonCard.id;
		pokemonDetails.sprite = pokemonCard.sprite;
		pokemonDetails.types = pokemonCard.types;

		// Marcar como básico já carregado se o card tem os dados
		if (pokemonCard.id && pokemonCard.sprite && pokemonCard.types.length > 0) {
			pokemonDetails.isDetailsLoaded = true;
			// Construir URL da espécie baseada no ID
			pokemonDetails.speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonCard.id}`;
		}

		return pokemonDetails;
	}
}
