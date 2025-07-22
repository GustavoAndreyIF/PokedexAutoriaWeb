// ========================================
// MOVES DETAILS HEADER - Renderização do container header (esquerda)
// ========================================
import { PokemonTypes, TextFormatter } from "../utils/index.js";

class MoveDetails {
    constructor(moveId, moveUrl) {
        this.moveId = moveId;
        this.moveUrl = moveUrl;
        this.data = null;
    }

    async fetchData() {
        try {
            const response = await fetch(this.moveUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            this.data = await response.json();
        } catch (error) {
            console.error("Error fetching move data:", error);
        }
    }

    async render() {
        const headerContainer = document.getElementById(
			"move-header-container"
		);
		if (!headerContainer) {
			console.error(
				"❌ Container move-header-container não encontrado"
			);
			return;
		}
    }
}