/**
 * 🚨 ERRORMESSAGE.JS - COMPONENTE DE MENSAGEM DE ERRO
 *
 * Componente simples para exibir mensagens de erro de forma amigável.
 * Integrado com Bootstrap existente.
 *
 */

import Utils from "../core/Utils.js";

/**
 * 🚨 Componente de mensagem de erro
 */
class ErrorMessage {
	/**
	 * Construtor do componente
	 * @param {Object} options - Opções de configuração
	 */
	constructor(options = {}) {
		this.options = {
			title: "Oops! Algo deu errado",
			message: "Ocorreu um erro inesperado.",
			showRetry: true,
			showGoHome: false,
			retryText: "Tentar Novamente",
			homeText: "Voltar ao Início",
			icon: "💥",
			className: "",
			onRetry: () => location.reload(),
			onGoHome: () => (window.location.href = "index.html"),
			...options,
		};
		this.element = null;
		this.isVisible = false;
	}

	/**
	 * 🎨 Renderiza o HTML da mensagem de erro
	 * @returns {string} HTML da mensagem
	 */
	render() {
		const {
			title,
			message,
			showRetry,
			showGoHome,
			retryText,
			homeText,
			icon,
			className,
		} = this.options;

		return `
            <div class="error-message alert alert-danger rounded-4 text-center ${className}" role="alert">
                <!-- Ícone -->
                <div class="display-4 mb-3">${icon}</div>
                
                <!-- Título -->
                <h4 class="alert-heading mb-3">${title}</h4>
                
                <!-- Mensagem -->
                <p class="mb-4">${message}</p>
                
                <!-- Botões de ação -->
                ${
					showRetry || showGoHome
						? `
                    <div class="d-flex gap-2 justify-content-center flex-wrap">
                        ${
							showRetry
								? `
                            <button class="btn btn-outline-danger rounded-pill px-4 retry-btn">
                                <i class="bi bi-arrow-clockwise me-2"></i>
                                ${retryText}
                            </button>
                        `
								: ""
						}
                        
                        ${
							showGoHome
								? `
                            <button class="btn btn-outline-secondary rounded-pill px-4 home-btn">
                                <i class="bi bi-house me-2"></i>
                                ${homeText}
                            </button>
                        `
								: ""
						}
                    </div>
                `
						: ""
				}
            </div>
        `;
	}

	/**
	 * 👀 Exibe a mensagem de erro em um container
	 * @param {Element|string} container - Container onde exibir
	 */
	show(container) {
		const containerElement =
			typeof container === "string" ? Utils.findElement(container) : container;

		if (!containerElement) {
			console.error("❌ Container não encontrado para exibir erro");
			return;
		}

		// 🧹 Limpar container
		Utils.clearElement(containerElement);

		// 🎨 Inserir mensagem de erro
		containerElement.innerHTML = this.render();

		// 🔍 Encontrar elemento criado
		this.element = containerElement.querySelector(".error-message");
		this.isVisible = true;

		// 👂 Adicionar event listeners
		this._attachEvents();

		console.log("🚨 Mensagem de erro exibida");
	}

	/**
	 * 👂 Adiciona event listeners aos botões
	 * @private
	 */
	_attachEvents() {
		if (!this.element) return;

		// 🔄 Botão de retry
		const retryBtn = this.element.querySelector(".retry-btn");
		if (retryBtn) {
			retryBtn.addEventListener("click", () => {
				console.log("🔄 Usuário clicou em tentar novamente");
				this.options.onRetry();
			});
		}

		// 🏠 Botão de home
		const homeBtn = this.element.querySelector(".home-btn");
		if (homeBtn) {
			homeBtn.addEventListener("click", () => {
				console.log("🏠 Usuário clicou em voltar ao início");
				this.options.onGoHome();
			});
		}
	}

	/**
	 * 🙈 Esconde a mensagem de erro
	 */
	hide() {
		if (this.element) {
			Utils.hideElement(this.element);
			this.isVisible = false;
			console.log("✅ Mensagem de erro escondida");
		}
	}

	/**
	 * 🧹 Remove a mensagem completamente do DOM
	 */
	remove() {
		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
			this.element = null;
			this.isVisible = false;
			console.log("🧹 Mensagem de erro removida");
		}
	}

	/**
	 * 📝 Atualiza a mensagem de erro
	 * @param {string} newMessage - Nova mensagem
	 * @param {string} newTitle - Novo título (opcional)
	 */
	updateMessage(newMessage, newTitle = null) {
		this.options.message = newMessage;
		if (newTitle) this.options.title = newTitle;

		if (this.element) {
			// 🔄 Re-renderizar
			const container = this.element.parentNode;
			this.remove();
			this.show(container);
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
 * 🚨 Exibe erro rápido
 * @param {Element|string} container - Container
 * @param {string} message - Mensagem de erro
 * @param {Object} options - Opções adicionais
 * @returns {ErrorMessage} Instância da mensagem
 */
export function showError(container, message, options = {}) {
	const errorMsg = new ErrorMessage({
		message,
		...options,
	});
	errorMsg.show(container);
	return errorMsg;
}

/**
 * 🚨 Erro de rede/API
 * @param {Element|string} container - Container
 * @param {string} details - Detalhes técnicos do erro
 * @returns {ErrorMessage} Instância da mensagem
 */
export function showNetworkError(container, details = "") {
	return showError(
		container,
		`Erro de conexão com o servidor. Verifique sua internet e tente novamente.${
			details ? ` (${details})` : ""
		}`,
		{
			title: "Erro de Conexão",
			icon: "🌐",
			showRetry: true,
		}
	);
}

/**
 * 🚨 Erro de Pokémon não encontrado
 * @param {Element|string} container - Container
 * @param {string|number} pokemonId - ID do Pokémon
 * @returns {ErrorMessage} Instância da mensagem
 */
export function showPokemonNotFound(container, pokemonId) {
	return showError(
		container,
		`O Pokémon solicitado (#${pokemonId}) não foi encontrado.`,
		{
			title: "Pokémon Não Encontrado",
			icon: "❓",
			showRetry: true,
			showGoHome: true,
		}
	);
}

/**
 * 🚨 Erro genérico com opção de voltar à home
 * @param {Element|string} container - Container
 * @param {string} message - Mensagem de erro
 * @returns {ErrorMessage} Instância da mensagem
 */
export function showCriticalError(container, message) {
	return showError(container, message, {
		title: "Erro Crítico",
		icon: "🔥",
		showRetry: true,
		showGoHome: true,
	});
}

// ========================================
// 📤 EXPORTAÇÕES
// ========================================

export { ErrorMessage };
export default ErrorMessage;
