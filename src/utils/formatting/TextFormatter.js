/**
 * 📝 TEXTFORMATTER.JS - UTILITÁRIOS DE FORMATAÇÃO DE TEXTO
 *
 * Funções para formatação e manipulação de strings
 */

const TextFormatter = {
	/**
	 * ✨ Capitaliza a primeira letra de uma string
	 */
	capitalize(text) {
		if (!text || typeof text !== "string") return "";
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
	},

	/**
	 * 🎯 Formata o nome de um Pokémon
	 */
	formatPokemonName(name) {
		if (!name) return "";

		// Substituir hífens por espaços e capitalizar cada palavra
		return name
			.split("-")
			.map((word) => this.capitalize(word))
			.join(" ");
	},

	/**
	 * 🔢 Formata um número com zeros à esquerda
	 */
	formatNumber(num, digits = 3) {
		return String(num).padStart(digits, "0");
	},

	/**
	 * 🎨 Formata tipo de Pokémon para exibição
	 */
	formatPokemonType(type) {
		return this.capitalize(type);
	},
};

export default TextFormatter;
