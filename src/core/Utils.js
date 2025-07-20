/**
 * 🛠️ UTILS.JS - UTILITÁRIOS COMPARTILHADOS DA POKÉDEX
 *
 * Conjunto de funções utilitárias usadas em toda a aplicação.
 * Mantém o código DRY (Don't Repeat Yourself) e organizado.
 *
 * Categorias de utilitários:
 * - 🎨 Manipulação de DOM
 * - 📝 Formatação de texto
 * - ⏳ Loading e estados
 * - 🚨 Tratamento de erros
 * - 🔧 Helpers gerais
 *
 */

/**
 * 🛠️ Objeto principal com todos os utilitários
 * Organizados por categoria para fácil localização
 */
const Utils = {
	// ========================================
	// 🎨 MANIPULAÇÃO DE DOM
	// ========================================

	/**
	 * 🔍 Encontra um elemento no DOM de forma segura
	 *
	 * @param {string} selector - Seletor CSS do elemento
	 * @param {Element} parent - Elemento pai (opcional)
	 * @returns {Element|null} Elemento encontrado ou null
     * @description
     * Tenta buscar um elemento usando querySelector.
	 */
	findElement(selector, parent = document) {
		try {
			return parent.querySelector(selector);
		} catch (error) {
			console.warn(`⚠️ Erro ao buscar elemento '${selector}':`, error);
			return null;
		}
	},

	/**
	 * 🔍 Encontra múltiplos elementos no DOM
	 *
	 * @param {string} selector - Seletor CSS dos elementos
	 * @param {Element} parent - Elemento pai (opcional)
	 * @returns {NodeList} Lista de elementos encontrados
     * @description
     * Tenta buscar múltiplos elementos usando querySelectorAll.
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
	 *
	 * @param {Element|string} element - Elemento ou seletor
     * @description
     * Limpa o conteúdo HTML de um elemento, removendo todos os filhos.
	 */
	clearElement(element) {
		const el = typeof element === "string" ? this.findElement(element) : element;
		if (el) {
			el.innerHTML = "";
		}
	},

	/**
	 * 👀 Mostra um elemento (remove classe 'd-none')
	 *
	 * @param {Element|string} element - Elemento ou seletor
     * @description
     * Remove a classe 'd-none' de um elemento para torná-lo visível.
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
	 *
	 * @param {Element|string} element - Elemento ou seletor
     * @description
     * Adiciona a classe 'd-none' a um elemento para escondê-lo.
	 */
	hideElement(element) {
		const el = typeof element === "string" ? this.findElement(element) : element;
		if (el) {
			el.classList.add("d-none");
		}
	},

	// ========================================
	// 📝 FORMATAÇÃO DE TEXTO
	// ========================================

	/**
	 * ✨ Capitaliza a primeira letra de uma string
	 *
	 * @param {string} text - Texto para capitalizar
	 * @returns {string} Texto capitalizado
     * @description
     * Capitaliza a primeira letra de uma string e converte o restante para minúsculas.
     * Se o texto for inválido, retorna uma string vazia.
	 */
	capitalize(text) {
		if (!text || typeof text !== "string") return "";
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
	},

	/**
	 * 🎯 Formata o nome de um Pokémon
	 *
	 * Remove hífens, capitaliza e trata casos especiais
	 *
	 * @param {string} name - Nome do Pokémon
	 * @returns {string} Nome formatado
     * @description
     * Remove hífens, capitaliza e trata casos especiais como "nidoran-f    
	 */
	formatPokemonName(name) {
		if (!name) return "";

		// 🔄 Substituir hífens por espaços e capitalizar cada palavra
		return name
			.split("-")
			.map((word) => this.capitalize(word))
			.join(" ");
	},

	/**
	 * 🔢 Formata um número com zeros à esquerda
	 *
	 * @param {number} num - Número para formatar
	 * @param {number} digits - Quantidade de dígitos (padrão: 3)
	 * @returns {string} Número formatado
     * @description
     * Formata um número para ter uma quantidade fixa de dígitos, preenchendo com zeros à esquerda.
     * Por exemplo, 1 se torna "001" se digits for
	 */
	formatNumber(num, digits = 3) {
		return String(num).padStart(digits, "0");
	},

	/**
	 * 🎨 Formata tipo de Pokémon para exibição
	 *
	 * @param {string} type - Tipo do Pokémon
	 * @returns {string} Tipo formatado
     * @description
     * Capitaliza a primeira letra do tipo e converte o restante para minúsculas.
     * Capiataliza significa que a primeira letra é maiúscula e o restante minúsculo.
	 */
	formatPokemonType(type) {
		return this.capitalize(type);
	},

	// ========================================
	// ⏳ LOADING E ESTADOS
	// ========================================

	/**
	 * ⏳ Exibe um spinner de loading em um elemento
	 *
	 * @param {Element|string} element - Elemento ou seletor
	 * @param {string} message - Mensagem opcional (padrão: "Carregando...")
     * @description
     * Exibe um spinner de loading com uma mensagem opcional.
	 */
	showLoading(element, message = "Carregando...") {
		const el = typeof element === "string" ? this.findElement(element) : element;
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
	 * ✅ Remove o loading de um elemento
	 *
	 * @param {Element|string} element - Elemento ou seletor
     * @description
     * Remove o spinner de loading de um elemento, limpando seu conteúdo.
	 */
	hideLoading(element) {
		const el = typeof element === "string" ? this.findElement(element) : element;
		if (!el) return;

		// 🔍 Buscar e remover spinner
		const spinner = el.querySelector(".spinner-border");
		if (spinner) {
			spinner.closest(".d-flex").remove();
		}
	},

	/**
	 * 🎯 Exibe um estado vazio (quando não há dados)
	 *
	 * @param {Element|string} element - Elemento ou seletor
	 * @param {string} message - Mensagem de estado vazio
	 * @param {string} icon - Ícone para exibir (padrão: "📭")
     * @description
     * Exibe um estado vazio com uma mensagem e um ícone.
	 */
	showEmptyState(element, message = "Nenhum resultado encontrado", icon = "📭") {
		const el = typeof element === "string" ? this.findElement(element) : element;
		if (!el) return;

		const emptyHtml = `
            <div class="text-center p-5">
                <div class="display-1 mb-3">${icon}</div>
                <h3 class="text-muted">${message}</h3>
            </div>
        `;

		el.innerHTML = emptyHtml;
	},

	// ========================================
	// 🚨 TRATAMENTO DE ERROS
	// ========================================

	/**
	 * 🚨 Exibe uma mensagem de erro em um elemento
	 *
	 * @param {Element|string} element - Elemento ou seletor
	 * @param {string} message - Mensagem de erro
	 * @param {boolean} showRetry - Mostrar botão de retry (padrão: true)
     * @description
     * Exibe uma mensagem de erro com opção de retry.
     * Se showRetry for true, exibe um botão para tentar novamente.
	 */
	showError(element, message, showRetry = true) {
		const el = typeof element === "string" ? this.findElement(element) : element;
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

	// ========================================
	// 🔧 HELPERS GERAIS
	// ========================================

	/**
	 * ⏱️ Utilitário para debounce (evita execuções excessivas)
	 *
	 * @param {Function} func - Função para executar
	 * @param {number} delay - Delay em milissegundos
	 * @returns {Function} Função com debounce aplicado
     * @description
     * Aplica debounce a uma função, evitando que ela seja chamada excessivamente.
     * Útil para eventos como scroll ou resize.
     * Exemplo: debounce(() => console.log("Executado!"), 300);
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
	 *
	 * @param {number} ms - Milissegundos para aguardar
	 * @returns {Promise} Promise que resolve após o tempo especificado
     * @description
     * Utilitário para aguardar um tempo específico em milissegundos.
     * Exemplo: await Utils.sleep(1000); // Aguarda 1 segundo
	 */
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},


	/**
	 * 🔍 Verifica se um valor é válido (não null, undefined ou vazio)
	 *
	 * @param {any} value - Valor para verificar
	 * @returns {boolean} True se valor é válido
     * @description
     * Verifica se um valor é válido, ou seja, não é null, undefined ou vazio.
     * Exemplo: Utils.isValid("texto") // true, Utils.isValid("") // false
	 */
	isValid(value) {
		return value !== null && value !== undefined && value !== "";
	},

	/**
	 * 🌐 Constrói uma URL com parâmetros
	 *
	 * @param {string} base - URL base
	 * @param {Object} params - Parâmetros para adicionar
	 * @returns {string} URL completa
     * @description
     * Constrói uma URL com parâmetros de consulta, garantindo que apenas valores válidos sejam incluídos.
     * Exemplo: Utils.buildUrl("/api/pokemon", { id: 1, name: "pikachu" });
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
	 *
	 * @returns {Object} Objeto com os parâmetros da URL
     * @description
     * Obtém os parâmetros da URL atual como um objeto.
	 */
	getUrlParams() {
		const params = {};
		const urlParams = new URLSearchParams(window.location.search);

		for (const [key, value] of urlParams) {
			params[key] = value;
		}

		return params;
	},

	/**
	 * 🎨 Obtém cor CSS baseada no tipo do Pokémon
	 *
	 * @param {string} type - Tipo do Pokémon
	 * @returns {string} Valor da variável CSS ou cor hexadecimal
     * @description
     * Obtém a cor CSS baseada no tipo do Pokémon.
	 */
	getPokemonTypeColor(type) {
		const typeColors = {
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
		};

		return typeColors[type?.toLowerCase()] || "#9199a1";
	},

	/**
	 * 🎨 Obtém variável CSS do tipo do Pokémon
	 *
	 * @param {string} type - Tipo do Pokémon
	 * @returns {string} Nome da variável CSS
     * @description
     * Obtém a variável CSS baseada no tipo do Pokémon.
	 */
	getPokemonTypeVariable(type) {
		const validTypes = [
			'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
			'fighting', 'poison', 'ground', 'flying', 'psychic', 
			'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
		];

		const typeKey = type?.toLowerCase();
		if (validTypes.includes(typeKey)) {
			return `var(--color-${typeKey})`;
		}

		return "var(--color-normal)";
	},
};

// ========================================
// 🌍 DISPONIBILIZAR GLOBALMENTE
// ========================================

// 🌍 Disponibilizar no objeto window para uso global
window.Utils = Utils;

// ========================================
// 📤 EXPORTAÇÕES ES6
// ========================================

export default Utils;
