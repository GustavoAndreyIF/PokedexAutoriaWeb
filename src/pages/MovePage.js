
import { MoveDetailsHeader } from "../components/MoveDetailsHeader";
import { render } from MoveDetailsHeader;
import { DOMUtils } from "../utils/index.js";
import { showPageLoading } from "../components/LoadingSpinner.js";


export class MovePage {
    constructor() {
        this.moveID = null;
        this.moveURL = null;

        // componentes integrados sla
        this.headerComponent = null;

        // elementos página
        this.headerContainer = null;
    }

    _findPageElements() {
		this.moveHeader = DOMUtils.findElement("#pokemon-grid");

		if (!this.pokemonGrid) {
			throw new Error("Elemento #pokemon-grid não encontrado");
		}

		console.log("🔍 Elementos da página encontrados");
	}
}