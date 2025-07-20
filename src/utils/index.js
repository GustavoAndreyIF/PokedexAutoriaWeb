/**
 * 📦 INDEX.JS - EXPORTAÇÕES CENTRALIZADAS DOS UTILITÁRIOS
 *
 * Ponto central para importar todos os utilitários modulares
 */

// Importar todos os módulos
import DOMUtils from "./dom/DOMUtils.js";
import TextFormatter from "./formatting/TextFormatter.js";
import PokemonTypes from "./pokemon/PokemonTypes.js";
import UIStates from "./ui/UIStates.js";
import GeneralHelpers from "./helpers/GeneralHelpers.js";

// Exportar individualmente para uso específico
export { DOMUtils, TextFormatter, PokemonTypes, UIStates, GeneralHelpers };

// Exportar como objeto unificado para compatibilidade
export const Utils = {
	// DOM
	...DOMUtils,

	// Formatação
	...TextFormatter,

	// Pokémon Types (com prefixos para evitar conflitos)
	getPokemonTypeColor: PokemonTypes.getColor,
	getPokemonTypeEmoji: PokemonTypes.getEmoji,
	getPokemonTypeIcon: PokemonTypes.getIconPath,
	getPokemonTypeVariable: PokemonTypes.getCSSVariable,
	isValidPokemonType: PokemonTypes.isValidType,

	// UI States
	...UIStates,

	// General Helpers
	...GeneralHelpers,
};

// Exportar como default para compatibilidade com código existente
export default Utils;
