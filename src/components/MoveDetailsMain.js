// ========================================
// MOVE DETAILS MAIN - Renderização do conteúdo principal do movimento
// ========================================

import { DOMUtils, PokemonTypes, TextFormatter } from "../utils/index.js";
import ImageManager from "../utils/ImageManager.js";


export class MoveDetailsMain {
    constructor(moveId, moveUrl) {
        this.moveId = moveId;
        this.moveUrl = moveUrl;
        this.data = null;
    }

    
    async fetchMoveMainData() {
        try {
            const response = await fetch(this.moveUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            this.data = await response.json();
        } catch (error) {
            console.error("Error fetching move main data:", error);
        }
    }

    async render() {
        const mainContainer = document.getElementById("move-main-container");
        if (!mainContainer) {
            console.error("❌ Container move-main-container não encontrado");
            return;
        }
        let moveType = this.data?.type?.name || "normal";

					const typeColor = PokemonTypes.getTypeColor(moveType.toLowerCase());
					const iconPath = PokemonTypes.getIconPath(moveType.toLowerCase());
					const typeBadge = `
					<span class="badge text-white pokemon-type-badge px-2 px-md-3 py-2 rounded-pill me-1 me-md-2 d-flex align-items-center"
						  style="background-color: ${typeColor};">
						<img src="${iconPath}" 
							 alt="${moveType}" 
							 class="pokemon-type-badge__icon"
							 onerror="this.style.display='none'">
						${TextFormatter.capitalize(moveType)}
					</span>`;
				
				

        try {
            await this.fetchMoveMainData();
            if (!this.data) throw new Error("Dados do movimento não carregados");

            mainContainer.innerHTML = `
                <div class="card mb-4">
                    <div class="card-body">
                        <h2 class="card-title text-capitalize">${this.data.name}</h2>
                        <p class="card-text">Power: ${this.data.power ?? 'N/A'}</p>
                        <p class="card-text">Accuracy: ${this.data.accuracy ?? 'N/A'}</p>
                        <p class="card-text">PP: ${this.data.pp ?? 'N/A'}</p>
                        <p class="card-text">Type: 
                            <div class="d-flex justify-content-center gap-1 gap-md-2 flex-wrap">
								${typeBadge}
							</div>
                        </p>
                        <p class="card-text">Effect: ${this.data.effect_entries?.[0]?.effect ?? 'N/A'}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            mainContainer.innerHTML = `
                <div class="alert alert-danger m-4">
                    <h4>❌ Erro ao carregar detalhes do movimento</h4>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}
