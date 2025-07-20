/**
 * 🔧 GENERALHELPERS.JS - UTILITÁRIOS GERAIS
 *
 * Funções auxiliares para uso geral na aplicação
 */

const GeneralHelpers = {
	/**
	 * ⏱️ Utilitário para debounce
	 */
	debounce(func, delay) {
		let timeoutId;
		return function (...args) {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => func.apply(this, args), delay);
		};
	},

	/**
	 * 💤 Utilitário para aguardar um tempo
	 */
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},

	/**
	 * 🔍 Verifica se um valor é válido
	 */
	isValid(value) {
		return value !== null && value !== undefined && value !== "";
	},

	/**
	 * 🌐 Constrói uma URL com parâmetros
	 */
	buildUrl(base, params = {}) {
		const url = new URL(base, window.location.origin);

		Object.entries(params).forEach(([key, value]) => {
			if (this.isValid(value)) {
				url.searchParams.set(key, value);
			}
		});

		return url.toString();
	},

	/**
	 * 📊 Obtém parâmetros da URL atual
	 */
	getUrlParams() {
		const params = {};
		const urlParams = new URLSearchParams(window.location.search);

		for (const [key, value] of urlParams) {
			params[key] = value;
		}

		return params;
	},
};

export default GeneralHelpers;
