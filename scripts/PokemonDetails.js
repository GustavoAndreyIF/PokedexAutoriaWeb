// ========================================
// POKEMON DETAILS - Classe para representar um Pokemon com detalhes completos
// ========================================

import { PokemonCard } from "./PokemonCard.js";

export class PokemonDetails extends PokemonCard {
	constructor(pokemonData) {
		super(pokemonData);
		this.species = null;
		this.isSpeciesLoaded = false;
	}

	// Carregar dados específicos do pokemon-species
	async fetchSpeciesData() {
		try {
			if (this.isSpeciesLoaded) {
				console.log(`🔄 Dados de espécie já carregados para ${this.name}`);
				return this.species;
			}

			console.log(`📡 Carregando dados de espécie para ${this.name}...`);

			const response = await fetch(this.speciesUrl);
			if (!response.ok) {
				throw new Error(`Erro ao buscar espécie: ${response.status}`);
			}

			this.species = await response.json();
			this.isSpeciesLoaded = true;

			console.log(`✅ Dados de espécie carregados para ${this.name}`);
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

	// Obter dados completos dos detalhes
	getDetailsData() {
		return {
			// Dados básicos (herdados)
			...this.getCardData(),

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

		console.log(`🎨 RENDERIZANDO PÁGINA DE DETALHES:`);
		console.log(`
		<!-- Estrutura da página de detalhes -->
		<div class="details-container">
			<header class="details-header">
				<button class="back-button" onclick="goBackToHome()">
					← Voltar para Home
				</button>
				
				<h1 class="pokemon-title">
					${data.name} <span class="pokedex-number">#${data.pokedexnumber}</span>
				</h1>
			</header>
			
			<main class="details-content">
				<div class="pokemon-main-info">
					<div class="pokemon-image-section">
						<img src="${data.sprite}" alt="${data.name}" class="pokemon-sprite-large">
						
						<div class="pokemon-types">
							${data.types
								.map(
									(type) =>
										`<span class="type-badge type-${type}">${type}</span>`
								)
								.join("")}
						</div>
					</div>
					
					<div class="pokemon-description">
						<h2>Descrição</h2>
						<p class="flavor-text">${data.flavorText}</p>
					</div>
				</div>
				
				<div class="pokemon-stats-grid">
					<div class="stat-card">
						<h3>Informações Básicas</h3>
						<ul>
							<li><strong>Altura:</strong> ${data.height} dm</li>
							<li><strong>Peso:</strong> ${data.weight} hg</li>
							<li><strong>Cor:</strong> ${data.color}</li>
							<li><strong>Habitat:</strong> ${data.habitat}</li>
						</ul>
					</div>
					
					<div class="stat-card">
						<h3>Status de Captura</h3>
						<ul>
							<li><strong>Taxa de Captura:</strong> ${data.captureRate}</li>
							<li><strong>Felicidade Base:</strong> ${data.baseHappiness}</li>
							<li><strong>Lendário:</strong> ${data.isLegendary ? "Sim" : "Não"}</li>
							<li><strong>Mítico:</strong> ${data.isMythical ? "Sim" : "Não"}</li>
						</ul>
					</div>
					
					<div class="stat-card">
						<h3>Atributos de Batalha</h3>
						<div class="base-stats">
							${data.stats
								.map(
									(stat) => `
								<div class="stat-row">
									<span class="stat-name">${stat.name}:</span>
									<span class="stat-value">${stat.value}</span>
									<div class="stat-bar">
										<div class="stat-fill" style="width: ${(stat.value / 255) * 100}%"></div>
									</div>
								</div>
							`
								)
								.join("")}
						</div>
					</div>
					
					<div class="stat-card">
						<h3>Habilidades</h3>
						<div class="abilities-list">
							${data.abilities
								.map(
									(ability) => `
								<span class="ability-badge ${ability.is_hidden ? "hidden-ability" : ""}"
								      title="${ability.is_hidden ? "Habilidade Oculta" : "Habilidade Normal"}">
									${ability.name}
								</span>
							`
								)
								.join("")}
						</div>
					</div>
				</div>
			</main>
		</div>
		`);

		// TO DO: Front-end deve implementar:
		// const detailsContainer = document.querySelector('.details-container');
		// detailsContainer.innerHTML = [HTML da estrutura acima];

		console.log(
			`✅ PÁGINA DE DETALHES RENDERIZADA PARA: ${data.name} (#${data.pokedexnumber})`
		);
		console.log(
			`📊 Status de carregamento: Básico=${data.detailsLoaded}, Espécie=${data.speciesLoaded}`
		);

		return data;
	}

	// Converter de PokemonCard para PokemonDetails (reutilizar dados já carregados)
	static fromPokemonCard(pokemonCard) {
		const pokemonDetails = new PokemonDetails(pokemonCard.originalData);

		// Copiar dados já carregados
		pokemonDetails.details = pokemonCard.details;
		pokemonDetails.isDetailsLoaded = pokemonCard.isDetailsLoaded;

		console.log(
			`🔄 Convertido PokemonCard para PokemonDetails: ${pokemonDetails.name}`
		);
		console.log(
			`📦 Dados de detalhes básicos preservados: ${
				pokemonDetails.isDetailsLoaded ? "Sim" : "Não"
			}`
		);

		return pokemonDetails;
	}
}
