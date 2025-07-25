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

			// Buscar dados das próximas evoluções (species)
			const evoUrls = this.nextEvolutions.map(evo => evo.species.url);
			const nextEvoData = await Promise.all(
    			evoUrls.map(async url => {
        			const res = await fetch(url);
        			return res.json();
    			})
			);

			// Formatar cards de evolução
			this.evoCards = nextEvoData.map(evo => {
				const name = TextFormatter.capitalize(evo.name);
				const id = evo.id;
				const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`;
				return `
				<div class="col-12 col-md-4 d-flex justify-content-center mb-4">
					<a href="detalhes.html?id=${id}" class="text-decoration-none w-100" style="max-width: 260px;">
						<div class="pokemon-card text-center p-3">
							<img width="140" src="${imageUrl}" alt="${name}" class="img-fluid">
							<h6 class="mt-2">${name} <span class="text-muted">#${id}</span></h6>
						</div>
					</a>
					</div>
				`;
			}).join("");
			if (this.evoCards === "") {
				this.evoCards = `<p class="text-muted">Nenhuma evolução encontrada.</p>`;
			}

			console.log(
				`🔄 Evolução carregada para ID ${this.pokemonId}:`,
				nextEvoData
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
    <div class="row justify-content-center">
        ${this.evoCards}
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
