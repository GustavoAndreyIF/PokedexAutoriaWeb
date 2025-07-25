// ========================================
// EVOLUTION TAB - Componente para aba de evolução
// ========================================

import { TextFormatter } from "../../utils/index.js";

export class EvolutionTab {
	constructor(pokemonId, pokemonUrl) {
		this.pokemonId = pokemonId;
		this.pokemonUrl = pokemonUrl;
		this.evolutionData = null;
		this.nextEvolutions = [];
	}

	// Método recursivo para encontrar o estágio atual
	findCurrentStage(chain, currentName) {
		if (chain.species.name === currentName) {
			return chain;
		}
		for (const evo of chain.evolves_to) {
			const found = this.findCurrentStage(evo, currentName);
			if (found) return found;
		}
		return null;
	}

	// Fetch dos dados de evolução
	async fetchData() {
		if (this.evolutionData) return this.evolutionData;

		try {
			// 1. Buscar species do Pokémon
			const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${this.pokemonId}/`;
			const speciesRes = await fetch(speciesUrl);
			const speciesData = await speciesRes.json();

			// 2. Obter URL da cadeia evolutiva
			const evolutionChainUrl = speciesData.evolution_chain.url;

			// 3. Buscar cadeia evolutiva
			const evoRes = await fetch(evolutionChainUrl);
			const evoData = await evoRes.json();

			this.evolutionData = evoData;

			// 4. Encontrar estágio atual e próximas evoluções
			const speciesName = speciesData.name;
			const currentStage = this.findCurrentStage(this.evolutionData.chain, speciesName);
			this.nextEvolutions = currentStage ? currentStage.evolves_to : [];

			const evoIds = this.nextEvolutions.map(evo => TextFormatter.capitalize(evo.species.name)).join(', ');
			console.log(`🔄 Evoluções encontradas para ${speciesName}: ${evoIds}`);

			console.log(
				`🔄 Evolução carregada para ID ${this.pokemonId}:`,
				this.evolutionData
			);
			return this.evolutionData;
		} catch (error) {
			console.error(`❌ Erro ao carregar evolução:`, error);
			throw error;
		}
	}

	// Renderizar conteúdo da aba
	async render(container) {
		try {
			// Carregar dados
			await this.fetchData();

			container.innerHTML = `
				<h5 class="fw-semibold mb-3">🔄 Cadeia Evolutiva</h5>
				<div class="text-center">
					<div class="alert alert-info">
						<i class="bi bi-info-circle me-2"></i>
						Informações de evolução em desenvolvimento
					</div>
					<p class="text-muted">
						Próximas evoluções: ${this.nextEvolutions.length > 0 ? this.nextEvolutions.map(evo => TextFormatter.capitalize(evo.species.name)).join(', ') : 'Nenhuma evolução conhecida'}
					<p>
					<p class="text-muted">
						A cadeia evolutiva do Pokémon #${this.pokemonId} será exibida aqui em breve.
					</p>
				</div>
			`;
		} catch (error) {
			container.innerHTML = `
				<div class="alert alert-danger">
					<h6>❌ Erro ao carregar evolução</h6>
					<p class="mb-0">${error.message}</p>
				</div>
			`;
		}
	}
}
