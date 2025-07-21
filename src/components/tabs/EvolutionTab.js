// ========================================
// EVOLUTION TAB - Componente para aba de evolução
// ========================================

import { TextFormatter } from "../../utils/index.js";

export class EvolutionTab {
	constructor(pokemonId, pokemonUrl) {
		this.pokemonId = pokemonId;
		this.pokemonUrl = pokemonUrl;
		this.evolutionData = null;
	}

	// Fetch dos dados de evolução
	async fetchData() {
		if (this.evolutionData) return this.evolutionData;

		try {
			// Placeholder - implementar chamada para species e evolution chain
			console.log(`🔄 Buscando evolução para ID ${this.pokemonId}...`);

			// Por enquanto retorna dados mock
			this.evolutionData = {
				evolution_chain: [],
				evolution_trigger: null,
			};

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
