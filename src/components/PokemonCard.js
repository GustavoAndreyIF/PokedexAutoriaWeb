/**
 * 🎴 POKEMONCARD.JS - COMPONENTE DE CARD DE POKÉMON
 * Componente simples para renderizar cards de Pokémon na home.
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
	 * * Utiliza desestruturação para facilitar o acesso aos dados do Pokémon
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

		// 🏷️ Criar badges dos tipos com emojis
		const typeBadges = this._renderTypeBadgesWithEmojis(types);

		// 🎨 Background usando imagem do backgroundCard
		const backgroundInfo = ImageManager.getTypeBackgroundImage(primaryType);

		return `
            <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-2">
                <div class="card pokemon-card h-100 pokemon-type-${primaryType}"
                     data-pokemon-id="${id}" 
                     data-pokemon-type="${primaryType}">

                    <!-- Fundo baseado no tipo -->
                    <div class="pokemon-card__background"
                         style="background-image: url('${backgroundInfo.imagePath}');"></div>

                    <div class="card-body pokemon-card__body">
                        <div class="pokemon-card__info">
                            <!-- Número da Pokédex -->
                            <span class="badge pokemon-card__number mb-1">
                                #${pokedexNumber}
                            </span>

                            <!-- Nome do Pokémon -->
                            <h5 class="card-title pokemon-card__name">
                                ${formattedName}
                            </h5>

                            <!-- Tipos -->
                            <div class="pokemon-card__types">
                                ${typeBadges}
                            </div>
                        </div>

                        <!-- Sprite do Pokémon -->
                        <div class="pokemon-card__sprite-container">
                            ${
								pokemonImage
									? `<img src="${pokemonImage}" 
                                        alt="${formattedName}" 
                                        class="pokemon-card__sprite">`
									: `<div class="pokemon-card__sprite-fallback">❓</div>`
							}
                        </div>
                    </div>
                </div>
            </div>
        `;
	}

	/**
	 * 🏷️ Renderiza badges dos tipos
	 * @param {Array} types - Array de tipos do Pokémon
	 * @returns {string} HTML dos badges
	 * @private
	 */
	_renderTypeBadgesWithEmojis(types) {
		return types
			.map((type) => {
				const typeName = type.name;
				const typeColor = PokemonTypes.getColor(typeName);
				const iconPath = PokemonTypes.getIconPath(typeName);
				const displayName = TextFormatter.capitalize(typeName);

				return `
					<span class="badge pokemon-type-badge"
						  style="background-color: ${typeColor};">
						<img src="${iconPath}" 
							 alt="${typeName}" 
							 class="pokemon-type-badge__icon"
							 onerror="this.style.display='none';">
						${displayName}
					</span>
				`;
			})
			.join("");
	}

	/**
	 * 🎯 Cria o elemento DOM e adiciona event listeners
	 * * @description
	 * Monta o card no container especificado e adiciona os eventos necessários.
	 * * Utiliza o método `insertAdjacentHTML` para inserir o HTML do card.
	 * * O elemento DOM criado é armazenado na propriedade `element` para referência futura.
	 * * Adiciona um event listener de click para navegar para a página de detalhes do Pokémon.
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
	 * * * Adiciona um listener de click para navegar para a página de detalhes do Pokémon.
	 * * * Utiliza o método `_navigateToDetails` para realizar a navegação.
	 * * * Verifica se o elemento DOM já foi criado antes de adicionar os eventos.
	 * * * Evita erros caso o card ainda não tenha sido montado.
	 * @private
	 */
	_attachEvents() {
		if (!this.element) return;

		// 🖱️ Click para navegar para detalhes
		this.element.addEventListener("click", () => {
			this._navigateToDetails();
		});

	}

	/**
	 * 🎯 Navega para página de detalhes do Pokémon
	 * * * Utiliza a função global `pokeDexApp.goToDetails` se disponível, senão navega diretamente.
	 * * * Loga a navegação para debug.
	 * * * Usa o ID do Pokémon para construir a URL de detalhes.
	 * * * Se a função global não estiver disponível, usa `window.location.href` para navegar.
	 * * * Garante que a navegação funcione mesmo sem o app global.
	 * * * Evita erros caso a função não exista.
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
}

// ========================================
// 🏭 FACTORY FUNCTIONS PARA FACILITAR USO
// ========================================

/**
 * 🏭 Cria múltiplos cards de Pokémon
 * * * Utiliza a classe PokemonCard para criar instâncias de cards
 * * * Recebe uma lista de Pokémon e retorna um array de componentes PokemonCard
 * * * Facilita a criação de múltiplos cards sem precisar instanciar manualmente
 * * * Útil para renderizar listas de Pokémon na home
 * @param {Array} pokemonList - Lista de Pokémon
 * @returns {Array} Array de componentes PokemonCard
 */
export function createPokemonCards(pokemonList) {
	return pokemonList.map((pokemon) => new PokemonCard(pokemon));
}

/**
 * 🎨 Renderiza múltiplos cards em um container
 * * * Utiliza a função createPokemonCards para criar os componentes
 * * * Insere os cards no container especificado
 * * * Retorna um array de componentes criados
 * * * Facilita a renderização de listas de Pokémon na home
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
