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
        
        await this.fetchMoveMainData();

        let moveType = this.data?.type?.name || "normal";

					const typeColor = PokemonTypes.getTypeColor(moveType.toLowerCase());
					const iconPath = PokemonTypes.getIconPath(moveType.toLowerCase());
                    const metaCategory = this.data?.meta?.category?.name || "unknown";
					const typeBadge = `
					<span class="badge text-white pokemon-type-badge px-2 px-md-3 py-2 rounded-pill d-flex align-items-center"
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
                
                <div class="d-md-flex container mt-3">
                    <div class="card border-0 mb-3 move-details-card">
                        <div class="card-body">
                            <h2 class="text-capitalize">${this.data.name}</h2>
                            <h4 class="text-capitalize">Dados do Movimento</h4>
                            <hr>
                            <div class="d-flex align-items-end justify-content-between mb-3">
                                <div>
                                    <h5 class="card-text">Power:</h5>
                                </div>
                                <h4 class="card-text">${this.data.power ?? 'N/A'}</h4>
                            </div>
                            <hr>
                            <div class="d-flex align-items-end justify-content-between mb-3">
                                <div>
                                    <h5 class="card-text">PP:</h5>
                                </div>
                                <h4 class="card-text">${this.data.pp ?? 'N/A'}</h4>
                            </div>
                            <hr>
                            <div class="d-flex align-items-end justify-content-between mb-3">
                                <div>
                                    <h5 class="card-text">Type:</h5>
                                </div>
                                ${typeBadge}
                            </div>
                            <hr>
                            <div class="d-flex align-items-end justify-content-between mb-3">
                                <div>
                                    <h5 class="card-text">Category:</h5>
                                </div>
                                <h4 class="card-text">${metaCategory}</h4>
                            </div>
                            <hr>
                            <div class="d-flex align-items-end justify-content-between mb-1">
                                <div>
                                    <h5 class="card-text">Accuracy:</h5>
                                </div>
                                <h5 class="card-text px-2 py-1 rounded text-light" style="background-color: ${typeColor}">${this.data.accuracy ?? 'N/A'}</h5>
                            </div>
                            <div class="progress stats-progress" style="height: 8px; border-radius: 4px;">
                                <div class="progress-bar stats-progress-bar stats-progress-bar--${typeColor}" 
                                    role="progressbar" 
                                    style="width: ${this.data.accuracy ?? 0}%; 
                                           background-color: ${typeColor};"
                                    aria-valuenow="${this.data.accuracy ?? 0}"
                                    aria-valuemin="0"
                                    aria-valuemax="100">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card border-0 mb-3 move-details-card-2">
                        <div class="card-body">
                            <div class="flavor-move-text p-2 mb-5 mb-md-2 text-center">
                                <p class="card-text"><i>"${TextFormatter.capitalize(this.data.flavor_text_entries?.[0]?.flavor_text ?? 'N/A')}"</i></p>
                            </div>
                            <h4 class="card-text">Efeitos</h4>
                            <hr>
                            <p class="card-text"><i>"${TextFormatter.capitalize(this.data.effect_entries?.[0]?.effect ?? 'N/A')}"</i></p>
                        </div>
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
