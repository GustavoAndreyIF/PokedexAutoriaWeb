/**
 * 🎨 DOMUTILS.JS - UTILITÁRIOS DE MANIPULAÇÃO DO DOM
 *
 * Funções para interação e manipulação de elementos DOM
 */

const DOMUtils = {
	/**
	 * 🔍 Encontra um elemento no DOM de forma segura
	 * Aceita tanto IDs (sem #) quanto seletores CSS completos
	 */
	findElement(selector, parent = document) {
		try {
			// Se não começar com #, ., [, :, ou espaço, assumir que é um ID
			const normalizedSelector =
				selector.match(/^[#.\[:]/g) || selector.includes(" ")
					? selector
					: `#${selector}`;

			return parent.querySelector(normalizedSelector);
		} catch (error) {
			console.warn(`⚠️ Erro ao buscar elemento '${selector}':`, error);
			return null;
		}
	},

	/**
	 * 🔍 Encontra múltiplos elementos no DOM
	 */
	findElements(selector, parent = document) {
		try {
			return parent.querySelectorAll(selector);
		} catch (error) {
			console.warn(`⚠️ Erro ao buscar elementos '${selector}':`, error);
			return [];
		}
	},

	/**
	 * 🎨 Limpa o conteúdo de um elemento
	 */
	clearElement(element) {
		const el = typeof element === "string" ? this.findElement(element) : element;
		if (el) {
			el.innerHTML = "";
		}
	},

	/**
	 * 👀 Mostra um elemento (remove classe 'd-none')
	 */
	showElement(element) {
		const el = typeof element === "string" ? this.findElement(element) : element;
		if (el) {
			el.classList.remove("d-none");
			el.style.display = "";
		}
	},

	/**
	 * 🙈 Esconde um elemento (adiciona classe 'd-none')
	 */
	hideElement(element) {
		const el = typeof element === "string" ? this.findElement(element) : element;
		if (el) {
			el.classList.add("d-none");
		}
	},
};

export default DOMUtils;
