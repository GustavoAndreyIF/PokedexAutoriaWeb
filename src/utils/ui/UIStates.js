/**
 * ⏳ UISTATES.JS - UTILITÁRIOS DE ESTADOS DA INTERFACE
 *
 * Loading, erros, estados vazios e feedbacks visuais
 */

import DOMUtils from "../dom/DOMUtils.js";

const UIStates = {
	/**
	 * ⏳ Exibe um spinner de loading
	 */
	showLoading(element, message = "Carregando...") {
		const el =
			typeof element === "string" ? DOMUtils.findElement(element) : element;
		if (!el) return;

		const loadingHtml = `
            <div class="d-flex flex-column align-items-center justify-content-center p-4">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mb-0">${message}</p>
            </div>
        `;

		el.innerHTML = loadingHtml;
	},

	/**
	 * ✅ Remove o loading
	 */
	hideLoading(element) {
		const el =
			typeof element === "string" ? DOMUtils.findElement(element) : element;
		if (!el) return;

		const spinner = el.querySelector(".spinner-border");
		if (spinner) {
			spinner.closest(".d-flex").remove();
		}
	},

	/**
	 * 🎯 Exibe um estado vazio
	 */
	showEmptyState(element, message = "Nenhum resultado encontrado", icon = "📭") {
		const el =
			typeof element === "string" ? DOMUtils.findElement(element) : element;
		if (!el) return;

		const emptyHtml = `
            <div class="text-center p-5">
                <div class="display-1 mb-3">${icon}</div>
                <h3 class="text-muted">${message}</h3>
            </div>
        `;

		el.innerHTML = emptyHtml;
	},

	/**
	 * 🚨 Exibe uma mensagem de erro
	 */
	showError(element, message, showRetry = true) {
		const el =
			typeof element === "string" ? DOMUtils.findElement(element) : element;
		if (!el) return;

		const retryButton = showRetry
			? `
            <button class="btn btn-outline-danger mt-3" onclick="location.reload()">
                🔄 Tentar Novamente
            </button>
        `
			: "";

		const errorHtml = `
            <div class="alert alert-danger text-center" role="alert">
                <div class="display-4 mb-3">💥</div>
                <h4 class="alert-heading">Oops! Algo deu errado</h4>
                <p class="mb-3">${message}</p>
                ${retryButton}
            </div>
        `;

		el.innerHTML = errorHtml;
	},
};

export default UIStates;
