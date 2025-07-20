/**
 * ⏳ LOADINGSPINNER.JS - COMPONENTE DE LOADING
 *
 * Componente simples para exibir estados de carregamento.
 * Baseado no Bootstrap existente no projeto.
 *
 */

import { DOMUtils } from "../utils/index.js";

/**
 * ⏳ Componente de loading spinner
 */
class LoadingSpinner {
	/**
	 * Construtor do componente
	 * @param {Object} options - Opções de configuração
	 */
	constructor(options = {}) {
		this.options = {
			message: "Carregando...",
			size: "normal", // 'small', 'normal', 'large'
			color: "primary", // Bootstrap color classes
			showMessage: true,
			className: "",
			...options,
		};
		this.element = null;
		this.isVisible = false;
	}

	/**
	 * 🎨 Renderiza o HTML do spinner
	 * @returns {string} HTML do spinner
	 */
	render() {
		const { message, size, color, showMessage, className } = this.options;

		// 📏 Definir tamanhos
		const sizeClasses = {
			small: "spinner-border-sm",
			normal: "",
			large: "spinner-border-lg",
		};

		const sizeStyles = {
			small: "",
			normal: "",
			large: "width: 3rem; height: 3rem;",
		};

		return `
            <div class="loading-spinner d-flex flex-column align-items-center justify-content-center py-4 ${className}">
                <div class="spinner-border text-${color} ${
			sizeClasses[size] || ""
		} mb-3" 
                     role="status"
                     style="${sizeStyles[size] || ""}">
                    <span class="visually-hidden">Loading...</span>
                </div>
                ${
					showMessage
						? `
                    <p class="text-muted mb-0">${message}</p>
                `
						: ""
				}
            </div>
        `;
	}

	/**
	 * 👀 Exibe o spinner em um container
	 * @param {Element|string} container - Container onde exibir
	 */
	show(container) {
		const containerElement =
			typeof container === "string" ? DOMUtils.findElement(container) : container;

		if (!containerElement) {
			console.error("❌ Container não encontrado para exibir loading");
			return;
		}

		// 🧹 Limpar container
		DOMUtils.clearElement(containerElement);

		// 🎨 Inserir spinner
		containerElement.innerHTML = this.render();

		// 🔍 Encontrar elemento criado
		this.element = containerElement.querySelector(".loading-spinner");
		this.isVisible = true;

		console.log("⏳ Loading spinner exibido");
	}

	/**
	 * 🙈 Esconde o spinner
	 */
	hide() {
		if (this.element) {
			DOMUtils.hideElement(this.element);
			this.isVisible = false;
			console.log("✅ Loading spinner escondido");
		}
	}

	/**
	 * 🧹 Remove o spinner completamente do DOM
	 */
	remove() {
		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
			this.element = null;
			this.isVisible = false;
			console.log("🧹 Loading spinner removido");
		}
	}

	/**
	 * 📝 Atualiza a mensagem do spinner
	 * @param {string} newMessage - Nova mensagem
	 */
	updateMessage(newMessage) {
		this.options.message = newMessage;

		if (this.element) {
			const messageElement = this.element.querySelector("p");
			if (messageElement) {
				messageElement.textContent = newMessage;
			}
		}
	}

	/**
	 * 📊 Retorna status do componente
	 * @returns {Object} Status atual
	 */
	getStatus() {
		return {
			isVisible: this.isVisible,
			element: this.element,
			options: { ...this.options },
		};
	}
}

// ========================================
// 🏭 FACTORY FUNCTIONS E UTILITÁRIOS
// ========================================

/**
 * ⏳ Exibe loading rápido em um container
 * @param {Element|string} container - Container
 * @param {string} message - Mensagem opcional
 * @returns {LoadingSpinner} Instância do spinner
 */
export function showLoading(container, message = "Carregando...") {
	const spinner = new LoadingSpinner({ message });
	spinner.show(container);
	return spinner;
}

/**
 * ⏳ Exibe loading de página completa
 * @param {string} message - Mensagem opcional
 * @returns {LoadingSpinner} Instância do spinner
 */
export function showPageLoading(message = "Carregando página...") {
	const spinner = new LoadingSpinner({
		message,
		size: "large",
		className: "py-5",
	});

	// 🔍 Buscar container principal
	const container =
		DOMUtils.findElement("#loading-indicator") ||
		DOMUtils.findElement(".container") ||
		document.body;

	spinner.show(container);
	return spinner;
}

/**
 * ⏳ Spinner pequeno inline
 * @param {Element|string} container - Container
 * @param {string} message - Mensagem opcional
 * @returns {LoadingSpinner} Instância do spinner
 */
export function showInlineLoading(container, message = "Carregando...") {
	const spinner = new LoadingSpinner({
		message,
		size: "small",
		showMessage: false,
		className: "py-2",
	});

	spinner.show(container);
	return spinner;
}

// ========================================
// 📤 EXPORTAÇÕES
// ========================================

export { LoadingSpinner };
export default LoadingSpinner;
