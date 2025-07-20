/**
 * 🎴 POKEMONCARD.JS - COMPONENTE DE CARD DE POKÉMON
 *
 * Componente simples para renderizar cards de Pokémon na home.
 * Baseado no HTML e CSS existentes, mantendo simplicidade.
 *
 */

import { TextFormatter, PokemonTypes, DOMUtils } from "../utils/index.js";
import ImageManager from "../utils/ImageManager.js";

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
	 * @param {Object} pokemon - Dados do Pokémon
	 * @returns {string} HTML do card
	 */
	render() {
		const { id, name, images, types } = this.pokemon; // Desestruturação para facilitar o acesso

		// 🔢 Formatar número da Pokédex
		const pokedexNumber = TextFormatter.formatNumber(id, 3);

		// 🎨 Formatear nome
		const formattedName = TextFormatter.formatPokemonName(name);

		// 🖼️ Imagem principal (preferir official-artwork, fallback para front)
		const pokemonImage = images?.official || images?.front || "";

		// 🎨 Tipo principal para o background
		const primaryType = types[0]?.name || "normal";
		const primaryTypeColor = PokemonTypes.getColor(primaryType);

		// 🏷️ Criar badges dos tipos com emojis
		const typeBadges = this._renderTypeBadgesWithEmojis(types);

		// 🎨 Background usando imagem do backgroundCard
		const backgroundInfo = ImageManager.getTypeBackgroundImage(primaryType);
		const backgroundStyle = `
			background-image: url('${backgroundInfo.imagePath}');
			background-size: cover;
			background-position: center;
		`;

		return `
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card shadow-sm rounded-2 position-relative overflow-hidden"
                     data-pokemon-id="${id}" 
                     data-pokemon-type="${primaryType}"
                     style="cursor: pointer; transition: all 0.3s ease; min-height: 120px; border: none;">
                    
                    <!-- Fundo semi-circular baseado no tipo -->
                    <div class="position-absolute top-0 end-0 h-100"
                         style="
                             width: 180px;
                             ${backgroundStyle}
                             opacity: 0.6;
                             z-index: 1;
                             clip-path: polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%);
                         "></div>

                    <div class="card-body position-relative"
                         style="z-index: 2; padding-right: 130px;">
                        <!-- Informações principais -->
                        <div>
                            <!-- Número da Pokédex -->
                            <small class="badge bg-dark bg-opacity-10 text-muted fw-bold mb-1 d-block"
                                   style="font-size: 0.7rem; width: fit-content;">
                                #${pokedexNumber}
                            </small>

                            <!-- Nome do Pokémon -->
                            <h5 class="card-title fw-bold mb-1 text-dark"
                                style="font-size: 1.2rem; line-height: 1.2;">
                                ${formattedName}
                            </h5>

                            <!-- Tipos com ícones -->
                            <div class="d-flex flex-wrap gap-1">
                                ${typeBadges}
                            </div>
                        </div>

                        <!-- Sprite do Pokémon centralizada -->
                        <div class="position-absolute d-flex align-items-center justify-content-center"
                             style="top: 0; right: 0; width: 120px; height: 120px;">
                            ${
								pokemonImage
									? `<img src="${pokemonImage}" 
                                        alt="${formattedName}" 
                                        style="width: 120px; height: 120px; object-fit: contain;">`
									: `<div class="d-flex align-items-center justify-content-center text-muted" 
                                        style="width: 120px; height: 120px; font-size: 3rem;">❓</div>`
							}
                        </div>
                    </div>
                </div>
            </div>
        `;
	}

	/**
	 * 🏷️ Renderiza badges dos tipos com emojis (estilo elegante)
	 * @param {Array} types - Array de tipos do Pokémon
	 * @returns {string} HTML dos badges
	 * @private
	 */
	_renderTypeBadgesWithEmojis(types) {
		if (!types || types.length === 0) {
			const unknownColor = PokemonTypes.getColor("normal");
			const unknownIcon = PokemonTypes.getIconPath("normal");
			return `
				<span class="badge text-white px-2 py-1 rounded-pill small d-flex align-items-center gap-1"
					  style="background-color: ${unknownColor}; font-size: 0.7rem;">
					<img src="${unknownIcon}" 
						 alt="normal" 
						 style="width: 14px; height: 14px;"
						 onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
					<span style="display: none; font-size: 0.8rem;">⭐</span>
					Unknown
				</span>
			`;
		}

		return types
			.map((type) => {
				const typeName = type.name;
				const typeColor = PokemonTypes.getColor(typeName);
				const iconPath = PokemonTypes.getIconPath(typeName);
				const emojiFallback = PokemonTypes.getEmoji(typeName);
				const displayName =
					typeName.charAt(0).toUpperCase() + typeName.slice(1);

				return `
					<span class="badge text-white px-2 py-1 rounded-pill small d-flex align-items-center gap-1"
						  style="background-color: ${typeColor}; font-size: 0.7rem;">
						<img src="${iconPath}" 
							 alt="${typeName}" 
							 style="width: 14px; height: 14px;"
							 onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
						<span style="display: none; font-size: 0.8rem;">${emojiFallback}</span>
						${displayName}
					</span>
				`;
			})
			.join("");
	}

	/**
	 * 🏷️ Renderiza badges dos tipos do Pokémon (versão simples)
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
				const typeName = TextFormatter.formatPokemonType(type.name);
				const typeColor = PokemonTypes.getColor(type.name);

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
		this.element = container.lastElementChild.querySelector("[data-pokemon-id]");

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
		typeof container === "string" ? DOMUtils.findElement(container) : container;

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
