/**
 * 🎨 POKEMONTYPES.JS - UTILITÁRIOS DOS TIPOS DE POKÉMON
 *
 * Cores, ícones e emojis dos tipos de Pokémon
 */

const PokemonTypes = {
	/**
	 * 🎨 Mapeamento de cores por tipo
	 */
	colors: {
		normal: "#9199a1",
		fire: "#ff9d55",
		water: "#4d91d7",
		electric: "#f3d33c",
		grass: "#61bb59",
		ice: "#71cfbe",
		fighting: "#cf4069",
		poison: "#aa6ac7",
		ground: "#db7645",
		flying: "#8ea9df",
		psychic: "#fb7075",
		bug: "#91c22e",
		rock: "#c7b78a",
		ghost: "#5568aa",
		dragon: "#0a6dc8",
		dark: "#595265",
		steel: "#598fa2",
		fairy: "#ef8fe7",
	},

	/**
	 * 🏷️ Mapeamento de emojis por tipo
	 */
	emojis: {
		fire: "🔥",
		water: "💧",
		grass: "🌿",
		electric: "⚡",
		ice: "❄️",
		fighting: "👊",
		poison: "☠️",
		ground: "🌍",
		flying: "🪶",
		psychic: "🧠",
		bug: "🐛",
		rock: "🪨",
		ghost: "👻",
		dragon: "🐉",
		dark: "🌙",
		steel: "⚙️",
		fairy: "🧚",
		normal: "⭐",
	},

	/**
	 * 📋 Lista de tipos válidos
	 */
	validTypes: [
		"normal",
		"fire",
		"water",
		"electric",
		"grass",
		"ice",
		"fighting",
		"poison",
		"ground",
		"flying",
		"psychic",
		"bug",
		"rock",
		"ghost",
		"dragon",
		"dark",
		"steel",
		"fairy",
	],

	/**
	 * 🎨 Obtém cor do tipo
	 */
	getColor(type) {
		return this.colors[type?.toLowerCase()] || this.colors.normal;
	},

	/**
	 * 🎨 Alias para getColor (compatibilidade)
	 */
	getTypeColor(type) {
		return this.getColor(type);
	},

	/**
	 * 🏷️ Obtém emoji do tipo
	 */
	getEmoji(type) {
		return this.emojis[type?.toLowerCase()] || "❓";
	},

	/**
	 * 🖼️ Obtém caminho do ícone do tipo
	 */
	getIconPath(type) {
		const normalizedType = type?.toLowerCase() || "normal";
		return `./src/assets/images/icons/${normalizedType}.png`;
	},

	/**
	 * 🎨 Obtém variável CSS do tipo
	 */
	getCSSVariable(type) {
		const typeKey = type?.toLowerCase();
		if (this.validTypes.includes(typeKey)) {
			return `var(--color-${typeKey})`;
		}
		return "var(--color-normal)";
	},

	/**
	 * ✅ Verifica se um tipo é válido
	 */
	isValidType(type) {
		return this.validTypes.includes(type?.toLowerCase());
	},
};

export default PokemonTypes;
