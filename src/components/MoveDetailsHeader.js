// ========================================
// MOVES DETAILS HEADER - Renderização do container header (esquerda)
// ========================================
import { PokemonTypes, TextFormatter } from "../utils/index.js";

export class MoveDetailsHeader {
    constructor(moveId, moveUrl) {
        this.moveId = moveId;
        this.moveUrl = moveUrl;
        this.primary = null;
    }

    // eisso aq faz fetch do json enorme dos moves e pega só o type
    async fetchMoveHeaderData() {
        try {
            const response = await fetch(this.moveUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            let data = await response.json();
            this.primary = data.type[0]?.toLowerCase() || "normal";

        } catch (error) {
            console.error("Error fetching move data:", error);
        }
    }

    // Renderiza o header
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
        try {
            await this.fetchMoveHeaderData();

            headerContainer.innerHTML = `
            <header class="position-relative overflow-hidden mb-4" style=" 
            background-color: var(--color-${this.primary}-dark">
                <div class="container py-4">
                    <div class="row align-items-center">
                        <!-- Logo e título -->
                        <div class="col-md-4">
                            <div class="d-flex align-items-center">
                                <!-- Ícone do Pikachu -->
                                <div class="me-2">
                                    <img
                                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
                                        alt="Pikachu"
                                        class="header-pokemon-icon"
                                        style="
                                            width: 64px;
                                            height: 64px;
                                            filter: drop-shadow(
                                                0 2px 8px rgba(0, 0, 0, 0.3)
                                            );
                                        "
                                    />
                                </div>
                                <!-- Texto do header -->
                                <div class="text-white">
                                    <h1
                                        class="mb-1 fw-bold"
                                        style="
                                            font-size: 2rem;
                                            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                                        "
                                    >
                                        <i class="fas fa-bolt me-2 text-warning"></i>Pokédex
                                    </h1>
                                    <p class="lead mb-0 opacity-90" style="font-size: 1rem">
                                        Descubra todos os pokémons e suas habilidades
                                        incríveis!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            `
        }
        catch(error) {
            headerContainer.innerHTML = `
				<div class="alert alert-danger m-4">
					<h4>❌ Erro ao carregar header</h4>
					<p>${error.message}</p>
				</div>
			`;
        }
    }
}