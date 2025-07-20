/**
 * 🖼️ IMAGE-MANAGER.JS - GERENCIADOR DE IMAGENS
 *
 * Gerencia caminhos e fallbacks para imagens dos Pokémon
 * Usa as funções do Utils.js para cores e emojis
 */

import { PokemonTypes, TextFormatter } from "./index.js";

/**
 * 🖼️ Gerencia caminhos de imagens para cards
 */
class ImageManager {
	/**
	 * 🎨 Retorna caminho da imagem de background do tipo
	 * @param {string} typeName - Nome do tipo (ex: 'fire', 'water')
	 * @returns {Object} Informações da imagem de fundo
	 */
	static getTypeBackgroundImage(typeName) {
		const type = typeName.toLowerCase();

		// 📂 Tentar caminho da imagem específica
		const imagePath = `src/assets/images/backgroundCard/${type}.png`;

		// 🎨 Se não existir, usar gradiente CSS baseado na cor do tipo
		const typeColor = PokemonTypes.getColor(type);
		const fallbackStyle = `linear-gradient(135deg, ${typeColor}66, ${typeColor}33)`;

		return {
			imagePath,
			fallbackStyle,
			hasImage: false, // Por padrão, assumir que não tem imagem física
		};
	}

	/**
	 * 🏷️ Retorna caminho do ícone do tipo
	 * @param {string} typeName - Nome do tipo
	 * @returns {Object} Informações do ícone
	 */
	static getTypeIcon(typeName) {
		const type = typeName.toLowerCase();

		// 📂 Caminho do ícone
		const iconPath = `src/assets/images/icons/${type}.png`;

		// 🎨 Emoji fallback usando Utils
		const emoji = PokemonTypes.getEmoji(type);

		return {
			iconPath,
			emoji,
		};
	}

	/**
	 * 🎨 Retorna estilo de background para o card
	 * @param {string} typeName - Nome do tipo
	 * @returns {string} Estilo CSS para background
	 */
	static getCardBackgroundStyle(typeName) {
		const typeInfo = this.getTypeBackgroundImage(typeName);

		// 🖼️ Se tiver imagem, usar ela
		if (typeInfo.hasImage) {
			return `
                background-image: url('${typeInfo.imagePath}');
                background-size: cover;
                background-position: center;
                opacity: 0.6;
            `;
		}

		// 🎨 Caso contrário, usar gradiente
		return `
            background: ${typeInfo.fallbackStyle};
            opacity: 0.6;
        `;
	}

	/**
	 * 🏷️ Retorna HTML do badge do tipo com ícone
	 * @param {string} typeName - Nome do tipo
	 * @param {Object} options - Opções de estilo
	 * @returns {string} HTML do badge
	 */
	static getTypeBadgeHTML(typeName, options = {}) {
		const type = typeName.toLowerCase();
		const typeIcon = this.getTypeIcon(type);
		const typeColor = PokemonTypes.getColor(type);
		const displayName = TextFormatter.capitalize(typeName);

		// 🎨 Opções de estilo personalizáveis
		const {
			size = "0.7rem",
			iconSize = "0.8rem",
			padding = "px-2 py-1",
			extraClasses = "small d-flex align-items-center gap-1",
		} = options;

		return `
            <span class="badge text-white rounded-pill ${padding} ${extraClasses}"
                  style="background-color: ${typeColor}; font-size: ${size};">
                <span style="font-size: ${iconSize};">${typeIcon.emoji}</span>
                ${displayName}
            </span>
        `;
	}

	/**
	 * 🖼️ Verifica se uma imagem existe
	 * @param {string} imagePath - Caminho da imagem
	 * @returns {Promise<boolean>} True se a imagem existe
	 */
	static async imageExists(imagePath) {
		try {
			const response = await fetch(imagePath, { method: "HEAD" });
			return response.ok;
		} catch {
			return false;
		}
	}

	/**
	 * 🎨 Gera CSS customizado para um tipo específico
	 * @param {string} typeName - Nome do tipo
	 * @returns {string} CSS gerado
	 */
	static generateTypeCSS(typeName) {
		const typeColor = PokemonTypes.getColor(typeName);
		const backgroundInfo = this.getTypeBackgroundImage(typeName);

		return `
			.pokemon-type-${typeName} {
				--type-color: ${typeColor};
				--type-background: ${backgroundInfo.fallbackStyle};
			}
			
			.pokemon-type-${typeName} .badge {
				background-color: ${typeColor} !important;
			}
			
			.pokemon-type-${typeName} .progress-bar {
				background: linear-gradient(90deg, ${typeColor}66, ${typeColor}) !important;
			}
		`;
	}
}

export { ImageManager };
export default ImageManager;
