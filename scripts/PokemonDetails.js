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

			// Configurar URL da espécie
			this.speciesUrl = data.species.url;

			return this;
		} catch (error) {
			console.error(`❌ Erro ao carregar detalhes para ${this.name}:`, error);
			throw error;
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

		if (nameElement) nameElement.textContent = data.name;
		if (idBadge)
			idBadge.textContent = `#${String(data.pokedexnumber).padStart(3, "0")}`;

		// Sprite
		const sprite = document.getElementById("pokemon-main-sprite");
		if (sprite) {
			sprite.src = data.sprite;
			sprite.alt = data.name;
		}

		// Tipos
		const typesContainer = document.getElementById("pokemon-types");
		if (typesContainer) {
			typesContainer.innerHTML = data.types
				.map(
					(type) =>
						`<span class="badge bg-type-${type} text-white px-3 py-2 rounded-pill">${type}</span>`
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
				<li class="mb-2"><strong>Altura:</strong> ${data.height} dm</li>
				<li class="mb-2"><strong>Peso:</strong> ${data.weight} hg</li>
				<li class="mb-2"><strong>Cor:</strong> ${data.color}</li>
				<li class="mb-2"><strong>Habitat:</strong> ${data.habitat}</li>
				<li class="mb-2"><strong>Taxa de Captura:</strong> ${data.captureRate}</li>
				<li class="mb-2"><strong>Felicidade Base:</strong> ${data.baseHappiness}</li>
				<li class="mb-2"><strong>Lendário:</strong> ${data.isLegendary ? "Sim" : "Não"}</li>
				<li class="mb-0"><strong>Mítico:</strong> ${data.isMythical ? "Sim" : "Não"}</li>
			`;
		}

		// Habilidades
		const abilitiesList = document.getElementById("abilities-list");
		if (abilitiesList) {
			abilitiesList.innerHTML = data.abilities
				.map(
					(ability) => `
					<span class="badge ${
						ability.is_hidden ? "bg-danger" : "bg-success"
					} px-3 py-2 rounded-pill"
						  title="${ability.is_hidden ? "Habilidade Oculta" : "Habilidade Normal"}">
						${ability.name}
					</span>
				`
				)
				.join("");
		}

		// Estatísticas base
		const baseStats = document.getElementById("base-stats");
		if (baseStats) {
			baseStats.innerHTML = data.stats
				.map(
					(stat) => `
					<div class="mb-3">
						<div class="d-flex justify-content-between mb-1">
							<span class="fw-bold">${stat.name}</span>
							<span class="badge bg-primary">${stat.value}</span>
						</div>
						<div class="progress" style="height: 20px;">
							<div class="progress-bar" role="progressbar" 
								 style="width: ${(stat.value / 255) * 100}%"
								 aria-valuenow="${stat.value}" aria-valuemin="0" aria-valuemax="255">
							</div>
						</div>
					</div>
				`
				)
				.join("");
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
