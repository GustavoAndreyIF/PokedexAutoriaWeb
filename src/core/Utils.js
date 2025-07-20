/**
 * 🛠️ UTILS.JS - UTILITÁRIOS ESSENCIAIS (VERSÃO MODULAR)
 *
 * Ponto de entrada principal para todos os utilitários.
 * Importa e re-exporta os módulos especializados.
 */

// Importar todos os utilitários modulares
import { Utils as ModularUtils } from "./utils/index.js";

// Re-exportar como Utils principal para compatibilidade
const Utils = ModularUtils;

// Disponibilizar globalmente para compatibilidade
window.Utils = Utils;

// Exportar como default
export default Utils;

// Exportar utilitários específicos para uso direto
export {
	DOMUtils,
	TextFormatter,
	PokemonTypes,
	UIStates,
	GeneralHelpers
} from "./utils/index.js";
