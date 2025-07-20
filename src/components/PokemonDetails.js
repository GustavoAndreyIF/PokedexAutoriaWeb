// ========================================
// POKEMON DETAILS - Classe para representar um Pokemon com detalhes completos
// ========================================

export class PokemonDetails {
	constructor(name, url) {
		this.name = name;
		this.url = url;
		this.id = null;
		this.sprite = null;
		this.types = [];
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

	// Obter dados básicos do card (método que estava sendo herdado)
	getCardData() {
		return {
			id: this.id,
			name: this.name,
			sprite: this.sprite,
			types: this.types,
			url: this.url,
		};
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

		// Renderizar HTML no container
		const container = document.getElementById("pokemon-details-container");
		if (!container) {
			console.error("❌ Container pokemon-details-container não encontrado");
			return;
		}

		// Popular container com HTML estruturado
		this.populatePageContainer(container, data);

		return data;
	}

	// Método para popular o container principal
	populatePageContainer(container, data) {
		const formattedId = `#${String(data.id).padStart(3, "0")}`;
		const formattedName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
		const primaryType = data.types[0]?.toLowerCase() || "normal";
		const headerBackground = this.getTypeColor(primaryType);

		// Tipos com ícones
		const typeBadges = data.types
			.map((type) => {
				const typeColor = this.getTypeColor(type.toLowerCase());
				return `<span class="badge text-white px-3 py-2 rounded-pill me-2 d-flex align-items-center"
					  style="background-color: ${typeColor}; font-size: 0.9rem; width: fit-content;">
					<img src="./src/assets/images/icons/${type.toLowerCase()}.png" 
						 alt="${type}" 
						 style="width: 16px; height: 16px; margin-right: 6px;"
						 onerror="this.style.display='none'">
					${type}
				</span>`;
			})
			.join("");

		// Stats com barras coloridas
		const statsList = data.stats
			.map((stat) => {
				const statName =
					stat.name.charAt(0).toUpperCase() +
					stat.name.slice(1).replace("-", " ");
				const percentage = Math.min((stat.value / 180) * 100, 100);

				return `<div class="mb-3">
					<div class="d-flex justify-content-between mb-1">
						<small class="fw-bold">${statName}</small>
						<small class="badge bg-secondary">${stat.value}</small>
					</div>
					<div class="progress" style="height: 8px; border-radius: 4px;">
						<div class="progress-bar" 
							 style="width: ${percentage}%; background: linear-gradient(90deg, ${headerBackground}66, ${headerBackground});"
							 role="progressbar"></div>
					</div>
				</div>`;
			})
			.join("");

		container.innerHTML = `
			<div class="row g-0">
				<!-- Coluna da Esquerda: Header + Imagem + Info Básica -->
				<div class="col-lg-6">
					<!-- Header com Background -->
					<div class="position-relative text-white py-4" style="background: linear-gradient(135deg, ${headerBackground}, ${headerBackground}cc); min-height: 100vh;">
						<!-- Navigation -->
						<div class="container-fluid px-4">
							<div class="row align-items-center mb-4">
								<div class="col">
									<button class="text-white me-3 btn p-0 border-0 bg-transparent" 
											onclick="window.history.back()" 
											style="font-size: 2rem;"
											title="Voltar">
										<i class="bi bi-x-lg"></i>
									</button>
									<h1 class="d-inline mb-0 fw-bold">${formattedName}</h1>
									<span class="ms-3 opacity-75 fs-5">${formattedId}</span>
								</div>
							</div>
							
							<!-- Pokemon Image -->
							<div class="text-center mb-4">
								<div class="position-relative d-inline-block">
									<!-- Audio Indicator (escondido inicialmente) -->
									<div id="audio-indicator" 
										 class="position-absolute top-0 end-0 bg-white text-primary rounded-circle d-flex align-items-center justify-content-center"
										 style="width: 40px; height: 40px; z-index: 3; display: none; transform: translate(50%, -50%);">
										<i class="bi bi-volume-up-fill"></i>
									</div>
									
									<img src="${data.sprite}" 
										 alt="${formattedName}" 
										 class="img-fluid mb-3" 
										 style="max-height: 300px; cursor: pointer; transition: transform 0.3s ease; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));"
										 onclick="pokemonDetails.playPokemonCry()"
										 onmouseover="this.style.transform='scale(1.05)'"
										 onmouseout="this.style.transform='scale(1)'">
								</div>
							</div>
							
							<!-- Tipos -->
							<div class="text-center mb-4">
								<div class="d-flex justify-content-center gap-2 flex-wrap">
									${typeBadges}
								</div>
							</div>
							
							<!-- Informações Físicas -->
							<div class="row text-center">
								<div class="col-6 mb-3">
									<div class="bg-white bg-opacity-20 rounded-4 p-3">
										<h4 class="mb-0">${(data.height / 10).toFixed(1)} m</h4>
										<small class="opacity-75">Altura</small>
									</div>
								</div>
								<div class="col-6 mb-3">
									<div class="bg-white bg-opacity-20 rounded-4 p-3">
										<h4 class="mb-0">${(data.weight / 10).toFixed(1)} kg</h4>
										<small class="opacity-75">Peso</small>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Coluna da Direita: Conteúdo com Abas -->
				<div class="col-lg-6">
					<div class="h-100 bg-light">
						<!-- Navigation Tabs -->
						<div class="p-4">
							<div class="card border-0 shadow-sm rounded-4">
								<div class="card-header bg-white border-0 rounded-top-4 p-4">
									<div class="btn-group w-100" role="group">
										<button type="button" class="btn btn-outline-primary active" onclick="switchTab('stats')">
											<i class="bi bi-bar-chart-fill me-2"></i>Stats
										</button>
										<button type="button" class="btn btn-outline-primary" onclick="switchTab('evolution')">
											<i class="bi bi-arrow-repeat me-2"></i>Evolution
										</button>
										<button type="button" class="btn btn-outline-primary" onclick="switchTab('moves')">
											<i class="bi bi-lightning-fill me-2"></i>Moves
										</button>
										<button type="button" class="btn btn-outline-primary" onclick="switchTab('location')">
											<i class="bi bi-geo-alt-fill me-2"></i>Location
										</button>
									</div>
								</div>
								
								<!-- Tab Content -->
								<div class="card-body p-4">
									<!-- Stats Tab (Ativo por padrão) -->
									<div id="stats-content" class="tab-content-section">
										<h5 class="fw-semibold mb-3">⚡ Estatísticas Base</h5>
										${statsList}
									</div>
									
									<!-- Evolution Tab -->
									<div id="evolution-content" class="tab-content-section d-none">
										<h5 class="fw-semibold mb-3">🔄 Cadeia Evolutiva</h5>
										<p class="text-muted">Informações de evolução serão exibidas aqui.</p>
									</div>
									
									<!-- Moves Tab -->
									<div id="moves-content" class="tab-content-section d-none">
										<h5 class="fw-semibold mb-3">⚔️ Movimentos</h5>
										<p class="text-muted">Lista de movimentos será exibidas aqui.</p>
									</div>
									
									<!-- Location Tab -->
									<div id="location-content" class="tab-content-section d-none">
										<h5 class="fw-semibold mb-3">🗺️ Localização</h5>
										<p class="text-muted">Informações de localização serão exibidas aqui.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;

		// Disponibilizar globalmente a instância para uso nos event handlers
		window.pokemonDetails = this;
		window.switchTab = this.switchTab;
	}

	// Método para obter cor do tipo
	getTypeColor(type) {
		const colors = {
			normal: "#9199a1",
			fire: "#ff9d55",
			water: "#4d91d7",
			electric: "#f3d33c",
			grass: "#61bb59",
			ice: "#71cfbe",
			fighting: "#cf4069",
			poison: "#aa6ac7",
			ground: "#db7645",
			flying: "#8ea9df",
			psychic: "#fb7075",
			bug: "#91c22e",
			rock: "#c7b78a",
			ghost: "#5568aa",
			dragon: "#0a6dc8",
			dark: "#595265",
			steel: "#598fa2",
			fairy: "#ef8fe7",
		};
		return colors[type] || colors.normal;
	}

	// Método para alternar abas
	switchTab(tabName) {
		// Remove active de todos os botões
		document.querySelectorAll(".btn-group button").forEach((btn) => {
			btn.classList.remove("active");
		});

		// Adiciona active ao botão que corresponde à aba
		const activeButton = document.querySelector(
			`button[onclick="switchTab('${tabName}')"]`
		);
		if (activeButton) {
			activeButton.classList.add("active");
		}

		// Esconde todas as seções
		document.querySelectorAll(".tab-content-section").forEach((section) => {
			section.classList.add("d-none");
		});

		// Mostra a seção correspondente
		const targetSection = document.getElementById(`${tabName}-content`);
		if (targetSection) {
			targetSection.classList.remove("d-none");
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
