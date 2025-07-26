// ========================================
// VARIANTS TAB - Componente para aba de variações
// ========================================

import { TextFormatter } from "../../utils/index.js";

export class VariantsTab {
    constructor(pokemonId, pokemonUrl) {
        this.pokemonId = pokemonId;
        this.pokemonUrl = pokemonUrl;
        this.variantsData = null;
        this.varNames = [];
    }

    // Fetch dos dados de variações
    async fetchData() {
        if (this.variantsData) return this.variantsData;

        try {
            const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${this.pokemonId}/`;
			const speciesRes = await fetch(speciesUrl);
			const speciesData = await speciesRes.json();

            // Placeholder - implementar chamada para buscar variações
            console.log(`🔀 Buscando variações para ID ${this.pokemonId}...`);

            this.variantsData = speciesData.varieties;

            // Buscar dados de variações
			const varUrls = this.variantsData.map(variant => variant.pokemon.url);
			const detailedVarData = await Promise.all(
    			varUrls.map(async url => {
        			const res = await fetch(url);
        			return res.json();
    			})
			);

            // Formatar cards de variação
			this.varCards = detailedVarData.map(variant => {
                const name = TextFormatter.capitalize(variant.name);
                const id = variant.id;
                const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
                return `
                    <div class="col-12 col-md-3 mb-4 d-flex justify-content-center">
                        <a href="detalhes.html?id=${id}" class="text-decoration-none w-100" style="max-width: 220px;">
                            <div class="pokemon-card var-card text-center p-3 mx-1">
                                <img width="100" src="${imageUrl}" alt="${name}" class="img-fluid">
                                <h6 class="mt-2">${name}</h6>
                                <h6><span class="text-muted">#${id}</span></h6>
                            </div>
                        </a>
                    </div>
                `;
            }).join("");

            console.log(
                `🔀 Variações carregadas para ID ${this.pokemonId}:`,
                this.variantsData
            );
            return this.variantsData;
        } catch (error) {
            console.error(`❌ Erro ao carregar variações:`, error);
            throw error;
        }
    }

    // Renderizar conteúdo da aba
    async render(container) {
        try {
            // Carregar dados
            await this.fetchData();

            container.innerHTML = `
                <h5 class="fw-semibold mb-3 stats-title"><i class="bi bi-shuffle me-2"></i>Variants</h5>
                <div class="variants-scroll-container overflow-auto" style="max-height: 480px;">
                    <div class="row w-100">
                        ${this.varCards}
                    </div>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `
                <div class="alert alert-danger">
                    <h6>❌ Erro ao carregar variações</h6>
                    <p class="mb-0">${error.message}</p>
                </div>
            `;
        }
    }
}
