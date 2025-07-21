// ========================================
// LOCATION TAB - Componente para aba de localização
// ========================================

export class LocationTab {
	constructor(pokemonId, pokemonUrl) {
		this.pokemonId = pokemonId;
		this.pokemonUrl = pokemonUrl;
		this.locationData = null;
	}

	// Fetch dos dados de localização
	async fetchData() {
		if (this.locationData) return this.locationData;

		try {
			// Placeholder - implementar chamada para location-area-encounters
			console.log(`🗺️ Buscando localização para ID ${this.pokemonId}...`);

			// Por enquanto retorna dados mock
			this.locationData = [];

			console.log(
				`🗺️ Localização carregada para ID ${this.pokemonId}:`,
				this.locationData
			);
			return this.locationData;
		} catch (error) {
			console.error(`❌ Erro ao carregar localização:`, error);
			throw error;
		}
	}

	// Renderizar conteúdo da aba
	async render(container) {
		try {
			// Carregar dados
			await this.fetchData();

			container.innerHTML = `
				<h5 class="fw-semibold mb-3">🗺️ Localização</h5>
				<div class="text-center">
					<div class="alert alert-info">
						<i class="bi bi-geo-alt me-2"></i>
						Informações de localização em desenvolvimento
					</div>
					<p class="text-muted">
						Os locais onde encontrar o Pokémon #${this.pokemonId} serão exibidos aqui em breve.
					</p>
				</div>
			`;
		} catch (error) {
			container.innerHTML = `
				<div class="alert alert-danger">
					<h6>❌ Erro ao carregar localização</h6>
					<p class="mb-0">${error.message}</p>
				</div>
			`;
		}
	}
}
