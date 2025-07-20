/**
 * 🎴 POKEMONCARD.JS - COMPONENTE DE CARD DE POKÉMON
 *
 * Componente simples para renderizar cards de Pokémon na home.
 * Baseado no HTML e CSS existentes, mantendo simplicidade.
 *
 */

import Utils from "../core/Utils.js";

/**
 * 🎴 Componente para card de Pokémon
 *
 * Renderiza um card Bootstrap simples com informações básicas do Pokémon
 */
class PokemonCard {
	/**
	 * Construtor do componente
	 * @param {Object} pokemon - Dados do Pokémon
	 */
	constructor(pokemon) {
		this.pokemon = pokemon;
		this.element = null;
	}

	/**
	 * 🎨 Renderiza o HTML do card
	 * @returns {string} HTML do card
	 */
	render() {
		const { id, name, images, types } = this.pokemon;

		// 🔢 Formatar número da Pokédex
		const pokedexNumber = Utils.formatNumber(id, 3);

		// 🎨 Formatear nome
		const formattedName = Utils.formatPokemonName(name);

		// 🏷️ Renderizar badges dos tipos
		const typeBadges = this._renderTypeBadges(types);

		// 🖼️ Imagem principal (preferir official-artwork, fallback para front)
		const pokemonImage = images?.official || images?.front || "";

		return `
            <div class="col-md-6 col-lg-4 col-xl-3">
                <div class="card pokemon-card h-100 shadow-sm border-0" 
                     data-pokemon-id="${id}" 
                     style="cursor: pointer; transition: transform 0.2s ease;">
                    
                    <!-- Número da Pokédx -->
                    <div class="position-absolute top-0 end-0 p-2">
                        <small class="badge bg-secondary">#${pokedexNumber}</small>
                    </div>
                    
                    <!-- Imagem do Pokémon -->
                    <div class="card-img-top d-flex align-items-center justify-content-center bg-light" 
                         style="height: 200px; overflow: hidden;">
                        ${
							pokemonImage
								? `
                            <img src="${pokemonImage}" 
                                 alt="${formattedName}"
                                 class="img-fluid"
                                 style="max-height: 180px; max-width: 180px; object-fit: contain;"
                                 loading="lazy">
                        `
								: `
                            <div class="text-muted fs-1">❓</div>
                        `
						}
                    </div>
                    
                    <!-- Conteúdo do card -->
                    <div class="card-body d-flex flex-column">
                        <!-- Nome do Pokémon -->
                        <h5 class="card-title text-center mb-2">${formattedName}</h5>
                        
                        <!-- Tipos -->
                        <div class="d-flex justify-content-center gap-1 flex-wrap mt-auto">
                            ${typeBadges}
                        </div>
                    </div>
                </div>
            </div>
        `;
	}

	/**
	 * 🏷️ Renderiza badges dos tipos do Pokémon
	 * @param {Array} types - Array de tipos do Pokémon
	 * @returns {string} HTML dos badges
	 * @private
	 */
	_renderTypeBadges(types) {
		if (!types || types.length === 0) {
			return '<span class="badge bg-secondary">Unknown</span>';
		}

		return types
			.map((type) => {
				const typeName = Utils.formatPokemonType(type.name);
				const typeColor = Utils.getPokemonTypeColor(type.name);

				return `
                <span class="badge" 
                      style="background-color: ${typeColor}; color: white; font-weight: 500;">
                    ${typeName}
                </span>
            `;
			})
			.join("");
	}

	/**
	 * 🎯 Cria o elemento DOM e adiciona event listeners
	 * @param {Element} container - Container onde inserir o card
	 * @returns {Element} Elemento DOM criado
	 */
	mount(container) {
		// 🎨 Criar HTML
		const cardHtml = this.render();

		// 📝 Inserir no container
		container.insertAdjacentHTML("beforeend", cardHtml);

		// 🔍 Encontrar o elemento criado
		this.element = container.lastElementChild.querySelector(".pokemon-card");

		// 👂 Adicionar event listeners
		this._attachEvents();

		return this.element;
	}

	/**
	 * 👂 Adiciona event listeners ao card
	 * @private
	 */
	_attachEvents() {
		if (!this.element) return;

		// 🖱️ Click para navegar para detalhes
		this.element.addEventListener("click", () => {
			this._navigateToDetails();
		});

		// 🎨 Hover effects
		this.element.addEventListener("mouseenter", () => {
			this.element.style.transform = "translateY(-5px)";
			this.element.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
		});

		this.element.addEventListener("mouseleave", () => {
			this.element.style.transform = "translateY(0)";
			this.element.style.boxShadow = "";
		});
	}

	/**
	 * 🎯 Navega para página de detalhes do Pokémon
	 * @private
	 */
	_navigateToDetails() {
		const pokemonId = this.pokemon.id;

		// 📊 Log para debug
		console.log(`🎯 Navegando para detalhes do Pokémon #${pokemonId}`);

		// 🌐 Usar a função global se disponível, senão navegação direta
		if (window.pokeDexApp && window.pokeDexApp.goToDetails) {
			window.pokeDexApp.goToDetails(pokemonId);
		} else {
			window.location.href = `detalhes.html?id=${pokemonId}`;
		}
	}

	/**
	 * 🧹 Remove o card do DOM
	 */
	unmount() {
		if (this.element && this.element.parentNode) {
			this.element.parentNode.removeChild(this.element);
			this.element = null;
		}
	}

	/**
	 * 🔄 Atualiza os dados do Pokémon e re-renderiza
	 * @param {Object} newPokemon - Novos dados do Pokémon
	 */
	update(newPokemon) {
		this.pokemon = newPokemon;

		if (this.element) {
			const container = this.element.parentNode;
			this.unmount();
			this.mount(container);
		}
	}

	/**
	 * 📊 Retorna informações do componente
	 * @returns {Object} Status do componente
	 */
	getStatus() {
		return {
			pokemonId: this.pokemon?.id,
			pokemonName: this.pokemon?.name,
			isMounted: !!this.element,
			element: this.element,
		};
	}
}

// ========================================
// 🏭 FACTORY FUNCTIONS PARA FACILITAR USO
// ========================================

/**
 * 🏭 Cria múltiplos cards de Pokémon
 * @param {Array} pokemonList - Lista de Pokémon
 * @returns {Array} Array de componentes PokemonCard
 */
export function createPokemonCards(pokemonList) {
	return pokemonList.map((pokemon) => new PokemonCard(pokemon));
}

/**
 * 🎨 Renderiza múltiplos cards em um container
 * @param {Array} pokemonList - Lista de Pokémon
 * @param {Element|string} container - Container onde renderizar
 * @returns {Array} Array de componentes criados
 */
export function renderPokemonCards(pokemonList, container) {
	const containerElement =
		typeof container === "string" ? Utils.findElement(container) : container;

	if (!containerElement) {
		console.error("❌ Container não encontrado para renderizar cards");
		return [];
	}

	const cards = createPokemonCards(pokemonList);

	cards.forEach((card) => {
		card.mount(containerElement);
	});

	console.log(`✅ ${cards.length} cards de Pokémon renderizados`);
	return cards;
}

// ========================================
// 📤 EXPORTAÇÕES
// ========================================

export { PokemonCard };
export default PokemonCard;
