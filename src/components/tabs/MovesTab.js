// ========================================
// MOVES TAB - Componente para aba de movimentos. Apenas exemplo de estrutura modular
// ========================================

import { TextFormatter } from "../../utils/index.js";

export class MovesTab {
	constructor(pokemonId, pokemonUrl) {
		this.pokemonId = pokemonId;
		this.pokemonUrl = pokemonUrl;
		this.movesData = null;
	}

	// Fetch dos dados de movimentos
	async fetchData() {
		if (this.movesData) return this.movesData;

		try {
			const response = await fetch(this.pokemonUrl);
			if (!response.ok) {
				throw new Error(`Erro HTTP: ${response.status}`);
			}

			const pokemonData = await response.json();

			// Pegar apenas os primeiros 40 movimentos para não sobrecarregar
			this.movesData = pokemonData.moves.map((moveInfo) => ({
				name: moveInfo.move.name,
				url: moveInfo.move.url,
				level_learned: moveInfo.version_group_details[0]?.level_learned_at || 1,
				id: moveInfo.move.url.split("/").slice(-2, -1)[0], // Extrai o ID da URL //bruxaria isso aqui
			}));

			console.log(
				`⚔️ Movimentos carregados para ID ${this.pokemonId}:`,
				this.movesData
			);
			return this.movesData;
		} catch (error) {
			console.error(`❌ Erro ao carregar movimentos:`, error);
			throw error;
		}
	}

	// Renderizar conteúdo da aba
	async render(container) {
		try {
			// Carregar dados
			await this.fetchData();

			const movesList = this.movesData
				.map((move) => {
					const moveName = TextFormatter.capitalize(
						move.name.replace("-", " ")
					);
					const levelBadge =
						move.level_learned > 1
							? `<span class="badge bg-primary me-2">Nv. ${move.level_learned}</span>`
							: `<span class="badge bg-secondary me-2">Inicial</span>`;

					return `
					<a href="movedetails.html?moveID=${move.id}" title="Ver detalhes do movimento" class="text-decoration-none">
						<div class="d-flex justify-content-between align-items-center py-2 border-bottom mx-2 mt-2 moveTabElement" >
							
								<div class="mx-2">
									${levelBadge}
									<span class="fw-medium text-dark">${moveName}</span>
								</div>
							
							<small class="text-muted mx-2">
									<i class="bi bi-info-circle"></i>
							</small>
						</div>
					</a>
					`;
				})
				.join("");

			container.innerHTML = `
				<h5 class="fw-semibold mb-3">⚔️ Movimentos</h5>
				<div class="mb-3">
					<small class="text-muted">Exibindo ${this.movesData.length} movimentos</small>
				</div>
				<div class="moves-list overflow-auto">
					${movesList}
				</div>
			`;
		} catch (error) {
			container.innerHTML = `
				<div class="alert alert-danger">
					<h6>❌ Erro ao carregar movimentos</h6>
					<p class="mb-0">${error.message}</p>
				</div>
			`;
		}
	}
}
