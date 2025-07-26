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
	 * 🆔 Formata ID do Pokémon com # e zeros à esquerda
	 */
	formatPokemonId(id) {
		return `#${String(id).padStart(3, "0")}`;
	},

	/**
	 * 🎨 Formata tipo de Pokémon para exibição
	 */
	formatPokemonType(type) {
		return this.capitalize(type);
	},

	/**
	 * 🧹 Limpa e normaliza flavor texts removendo caracteres especiais
	 */
	cleanFlavorText(text) {
		if (!text || typeof text !== "string") return "";
		
		return text
			.replace(/\f/g, " ") // Remove form feed
			.replace(/\n/g, " ") // Remove quebras de linha
			.replace(/\s+/g, " ") // Remove espaços múltiplos
			.trim();
	},
};

export { TextFormatter };
export default TextFormatter;
