

import { MoveDetailsHeader } from "../components/MoveDetailsHeader.js";
import { MoveDetailsMain } from "../components/MoveDetailsMain.js";
import { DOMUtils } from "../utils/index.js";


export class MovePage {
    constructor(moveID, moveURL) {
        this.moveID = moveID;
        this.moveURL = moveURL;
        this.headerComponent = null;
        this.mainComponent = null;
    }

    async init() {
        try {
            // Limpa containers
            const headerContainer = document.getElementById("move-header-container");
            const mainContainer = document.getElementById("move-main-container");
            if (headerContainer) headerContainer.innerHTML = "";
            if (mainContainer) mainContainer.innerHTML = "";

            // Cria componentes
            this.headerComponent = new MoveDetailsHeader(this.moveID, this.moveURL);
            this.mainComponent = new MoveDetailsMain(this.moveID, this.moveURL);

            // Renderiza
            await Promise.all([
                this.headerComponent.render(),
                this.mainComponent.render()
            ]);
            return true;
        } catch (error) {
            console.error("❌ Erro ao inicializar MovePage:", error);
            const mainContainer = document.getElementById("move-main-container") || document.body;
            mainContainer.innerHTML = `<div class="alert alert-danger m-4"><h4>❌ Erro ao carregar detalhes do movimento</h4><p>${error.message}</p></div>`;
            return false;
        }
    }
}
