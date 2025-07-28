import { TextFormatter, PokemonTypes } from "../../utils/index.js";
import ImageManager from "../../utils/ImageManager.js";

/**
 * AbilityHeader - Módulo para gerenciamento de habilidades no header do Pokémon
 *
 * Este módulo contém toda a lógica relacionada às habilidades do Pokémon:
 * - Busca e processamento de dados das habilidades
 * - Renderização de botões de habilidades
 * - Geração de modais detalhados
 * - Gestão de Pokémon que possuem cada habilidade
 *
 * Funcionalidades principais:
 * - fetchAbilitiesDetails: Busca informações completas das habilidades
 * - renderAbilities: Gera botões interativos das habilidades
 * - renderAbilityModals: Cria modais com informações detalhadas
 *
 * Design Pattern: Static methods para facilitar integração e testing
 * Dependencies: TextFormatter, PokemonTypes, ImageManager
 *
 * @author Gustavo Andrey
 * @since 2025-01-28
 * @version 1.0.0
 */
export class AbilityHeader {
	/**
	 * Busca os detalhes completos das habilidades do Pokémon
	 *
	 * Processa as habilidades do Pokémon fazendo requisições para a PokéAPI:
	 * - Busca nomes traduzidos e descrições em inglês
	 * - Coleta efeitos detalhados quando disponíveis
	 * - Identifica geração de origem
	 * - Lista Pokémon que possuem a mesma habilidade (limitado a 6)
	 * - Organiza informações por tipo (normal vs hidden)
	 *
	 * Fluxo de execução:
	 * 1. Itera sobre abilities do Pokémon atual
	 * 2. Faz fetch dos dados da habilidade
	 * 3. Extrai informações multilíngue (prioriza inglês)
	 * 4. Coleta lista de Pokémon relacionados
	 * 5. Formata e estrutura dados para renderização
	 *
	 * @param {Object} pokemonData - Dados do Pokémon contendo abilities
	 * @returns {Array} Array de objetos com detalhes das habilidades
	 * @throws {Error} Em caso de falha na requisição à API
	 *
	 * @example
	 * // Buscar habilidades do Pikachu:
	 * const abilities = await AbilityHeader.fetchAbilitiesDetails({
	 *   abilities: [
	 *     { ability: { name: "static", url: "..." }, is_hidden: false, slot: 1 },
	 *     { ability: { name: "lightning-rod", url: "..." }, is_hidden: true, slot: 3 }
	 *   ]
	 * });
	 * console.log(abilities); // Array com detalhes completos
	 */
	static async fetchAbilitiesDetails(pokemonData) {
		try {
			const abilitiesDetails = [];

			for (const abilityInfo of pokemonData.abilities) {
				const response = await fetch(abilityInfo.ability.url);
				if (!response.ok) {
					console.warn(
						`⚠️ Erro ao buscar habilidade ${abilityInfo.ability.name}:`,
						response.status
					);
					continue;
				}

				const abilityData = await response.json();

				// Buscar nome em inglês
				const englishName = abilityData.names.find(
					(name) => name.language.name === "en"
				);
				const abilityName = englishName
					? englishName.name
					: TextFormatter.capitalize(abilityInfo.ability.name);

				// Buscar descrição em inglês (flavor text)
				const englishFlavor = abilityData.flavor_text_entries.find(
					(entry) => entry.language.name === "en"
				);
				const abilityDescription = englishFlavor
					? TextFormatter.cleanFlavorText(englishFlavor.flavor_text)
					: "Description not available.";

				// Buscar efeito detalhado em inglês
				const englishEffect = abilityData.effect_entries.find(
					(entry) => entry.language.name === "en"
				);
				const abilityEffect = englishEffect
					? TextFormatter.cleanFlavorText(englishEffect.effect)
					: null;

				// Buscar informações da geração
				const generation = abilityData.generation;
				const generationNumber = generation
					? generation.name.replace("generation-", "").toUpperCase()
					: "UNKNOWN";

				// Buscar Pokémon que possuem essa habilidade (limitando a 6 para não sobrecarregar)
				const pokemonList = await Promise.all(
					abilityData.pokemon.slice(0, 6).map(async (pokemonInfo) => {
						const pokemonId = AbilityHeader.extractPokemonIdFromUrl(
							pokemonInfo.pokemon.url
						);

						try {
							const pokemonResponse = await fetch(
								pokemonInfo.pokemon.url
							);
							if (!pokemonResponse.ok) {
								console.warn(
									`⚠️ Erro ao buscar Pokémon ${pokemonInfo.pokemon.name}:`,
									pokemonResponse.status
								);
								return {
									id: pokemonId,
									name: pokemonInfo.pokemon.name,
									types: null,
									isHidden: pokemonInfo.is_hidden,
								};
							}

							const pokemonData = await pokemonResponse.json();
							return {
								id: pokemonId,
								name: pokemonData.name,
								types: pokemonData.types.map((type) => type.type.name),
								isHidden: pokemonInfo.is_hidden,
							};
						} catch (fetchError) {
							console.warn(
								`⚠️ Erro ao processar Pokémon ${pokemonInfo.pokemon.name}:`,
								fetchError
							);
							return {
								id: pokemonId,
								name: pokemonInfo.pokemon.name,
								types: null,
								isHidden: pokemonInfo.is_hidden,
							};
						}
					})
				);

				// Adicionar aos detalhes das habilidades
				abilitiesDetails.push({
					id: abilityData.id,
					name: abilityName,
					description: abilityDescription,
					effect: abilityEffect,
					generation: generationNumber,
					pokemonList: pokemonList,
					isHidden: abilityInfo.is_hidden,
					slot: abilityInfo.slot,
					originalName: abilityInfo.ability.name,
				});

				console.log(
					`🎯 Habilidade encontrada para ${pokemonData.name}:`,
					abilityName,
					abilityInfo.is_hidden ? "(Oculta)" : ""
				);
			}

			return abilitiesDetails;
		} catch (error) {
			console.error(`❌ Erro ao carregar detalhes das habilidades:`, error);
			return [];
		}
	}

	/**
	 * Método auxiliar para extrair ID do Pokémon da URL
	 *
	 * Extrai o ID numérico do Pokémon a partir da URL da PokéAPI.
	 * Utiliza regex para encontrar o padrão /pokemon/{id}/ na URL.
	 *
	 * @param {string} url - URL da PokéAPI (ex: https://pokeapi.co/api/v2/pokemon/25/)
	 * @returns {number|null} ID do Pokémon ou null se não encontrado
	 *
	 * @example
	 * const id = AbilityHeader.extractPokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/");
	 * console.log(id); // 25
	 */
	static extractPokemonIdFromUrl(url) {
		const matches = url.match(/\/pokemon\/(\d+)\//);
		return matches ? parseInt(matches[1]) : null;
	}

	/**
	 * Renderiza os botões das habilidades com estilização themed
	 *
	 * Gera HTML para botões interativos que abrem modais com detalhes das habilidades.
	 * Cada botão é estilizado baseado no tipo primário do Pokémon e inclui:
	 * - Ícone de estrela para identificação visual
	 * - Nome da habilidade formatado
	 * - Badge "Hidden" para habilidades ocultas
	 * - Tooltip com descrição rápida
	 * - Integração com Bootstrap modals
	 *
	 * Características visuais:
	 * - Material Design 3 styling
	 * - Hover effects baseados no tipo do Pokémon
	 * - Responsividade para mobile e desktop
	 * - Acessibilidade com ARIA labels
	 *
	 * @param {Array} abilitiesDetails - Array com detalhes das habilidades
	 * @param {string} primaryType - Tipo primário do Pokémon para styling
	 * @returns {string} HTML string dos botões das habilidades
	 *
	 * @example
	 * const buttonsHTML = AbilityHeader.renderAbilities(
	 *   [{ id: 9, name: "Static", isHidden: false, description: "..." }],
	 *   "electric"
	 * );
	 * // Retorna: <button class="btn pokemon-ability-btn ability-electric">...</button>
	 */
	static renderAbilities(abilitiesDetails, primaryType) {
		if (!abilitiesDetails || abilitiesDetails.length === 0) {
			return '<span class="text-white-50 small">No abilities available</span>';
		}

		return abilitiesDetails
			.map((ability) => {
				const hiddenBadge = ability.isHidden
					? '<i class="bi bi-eye-slash-fill ms-1" title="Hidden Ability"></i>'
					: "";
				return `
					<button type="button" 
							class="btn btn-light btn-sm pokemon-ability-btn ability-${primaryType}" 
							data-bs-toggle="modal" 
							data-bs-target="#abilityModal-${ability.id}"
							title="${ability.description}">
						<i class="bi bi-star-fill me-1"></i>
						${ability.name}
						${hiddenBadge}
					</button>
				`;
			})
			.join("");
	}

	/**
	 * Renderiza os modais detalhados das habilidades
	 *
	 * Gera HTML completo para modais Bootstrap com informações abrangentes sobre cada habilidade:
	 * - Header com nome, badges e metadata (geração, ID, slot)
	 * - Seção de descrição (flavor text) estilizada
	 * - Efeito detalhado (quando disponível)
	 * - Cards de Pokémon que possuem a habilidade
	 * - Styling baseado no tipo primário do Pokémon
	 *
	 * Funcionalidades dos modais:
	 * - Design responsivo para todas as telas
	 * - Cards clicáveis dos Pokémon relacionados
	 * - Sprites oficiais com fallback automático
	 * - Type badges e informações visuais
	 * - Indicação de habilidades hidden
	 *
	 * Estrutura dos cards:
	 * - Layout baseado nos cards da homepage
	 * - Background pattern baseado no tipo
	 * - Hover effects e transições suaves
	 * - Links diretos para páginas de detalhes
	 *
	 * @param {Array} abilitiesDetails - Array com detalhes das habilidades
	 * @param {string} primaryType - Tipo primário do Pokémon para theming
	 * @returns {string} HTML string dos modais completos
	 *
	 * @example
	 * const modalsHTML = AbilityHeader.renderAbilityModals(
	 *   [{
	 *     id: 9,
	 *     name: "Static",
	 *     description: "Contact may cause paralysis",
	 *     pokemonList: [{ id: 25, name: "pikachu", types: ["electric"] }]
	 *   }],
	 *   "electric"
	 * );
	 * // Retorna: HTML completo do modal com todos os componentes
	 */
	static renderAbilityModals(abilitiesDetails, primaryType) {
		if (!abilitiesDetails || abilitiesDetails.length === 0) {
			return "";
		}

		return abilitiesDetails
			.map((ability) => {
				const modalId = `abilityModal-${ability.id}`;
				const hiddenBadge = ability.isHidden
					? '<span class="badge bg-white text-dark ms-2 hidden-ability-badge"><i class="bi bi-eye-slash-fill me-1"></i>Hidden</span>'
					: "";

				// Renderizar lista de Pokémon
				const pokemonCards = ability.pokemonList
					.map((pokemon) => {
						const pokemonId = TextFormatter.formatNumber(pokemon.id, 3);
						const formattedName = TextFormatter.formatPokemonName(
							pokemon.name
						);

						// Tipo principal (assumir normal se não disponível por enquanto)
						const primaryType = pokemon.types ? pokemon.types[0] : "normal";

						// Background baseado no tipo
						const backgroundInfo =
							ImageManager.getTypeBackgroundImage(primaryType);

						// Badges dos tipos (se disponível)
						const typeBadges = pokemon.types
							? pokemon.types
									.map((type) => {
										const typeColor =
											PokemonTypes.getTypeColor(type);
										const iconPath = PokemonTypes.getIconPath(type);
										const displayName =
											TextFormatter.capitalize(type);

										return `
									<span class="pokemon-type-badge" style="background-color: ${typeColor};">
										<img src="${iconPath}" 
											 alt="${type}" 
											 class="pokemon-type-badge__icon"
											 onerror="this.style.display='none';">
										${displayName}
									</span>
								`;
									})
									.join("")
							: "";

						// Hidden badge
						const hiddenBadge = pokemon.isHidden
							? '<span class="ability-pokemon-card__hidden-badge"><i class="bi bi-eye-slash-fill me-1"></i>Hidden</span>'
							: "";

						return `
						<div class="col-6 col-md-4">
							<a href="detalhes.html?id=${pokemon.id}" class="text-decoration-none">
								<div class="ability-pokemon-card h-100 pokemon-type-${primaryType}">
									<!-- Fundo baseado no tipo -->
									<div class="ability-pokemon-card__background"
										 style="background-image: url('${backgroundInfo.imagePath}');"></div>
									
									<div class="ability-pokemon-card__body">
										<div class="ability-pokemon-card__info">
											<!-- ID da Pokédex -->
											<div class="ability-pokemon-card__id">
												#${pokemonId}${hiddenBadge}
											</div>
											
											<!-- Nome do Pokémon -->
											<h6 class="ability-pokemon-card__name">
												${formattedName}
											</h6>
											
											<!-- Tipos (se disponível) -->
											${typeBadges ? `<div class="ability-pokemon-card__types">${typeBadges}</div>` : ""}
										</div>
										
										<!-- Sprite do Pokémon -->
										<div class="ability-pokemon-card__sprite-container">
											<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
												pokemon.id
											}.png" 
												 alt="${formattedName}" 
												 class="ability-pokemon-card__sprite"
												 onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
														pokemon.id
													}.png'; if(this.src.includes('official-artwork')) this.style.display='none'; this.nextElementSibling.style.display='flex';">
											<div class="ability-pokemon-card__sprite-fallback" style="display: none;">❓</div>
										</div>
									</div>
								</div>
							</a>
						</div>
					`;
					})
					.join("");

				return `
					<!-- Modal Aprimorado para ${ability.name} -->
					<div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
						<div class="modal-dialog modal-dialog-centered modal-lg">
							<div class="modal-content ability-modal-${primaryType}">
								<div class="modal-header border-0 pb-2">
									<div class="d-flex align-items-center w-100">
										<div class="flex-grow-1">
											<h4 class="modal-title d-flex align-items-center mb-1" id="${modalId}Label">
												<i class="bi bi-star-fill me-2"></i>
												${ability.name}
												${hiddenBadge}
											</h4>
											<div class="ability-meta d-flex align-items-center gap-3">
												<small class="text-white">
													<i class="bi bi-layers me-1 text-light"></i>
													Generation: ${ability.generation}
												</small>
												<small class="text-white">
													<i class="bi bi-hash me-1 text-light"></i>
													ID: ${ability.id}
												</small>
												<small class="text-white">
													<i class="bi bi-award me-1 text-light"></i>
													Slot: ${ability.slot}
												</small>
											</div>
										</div>
										<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
									</div>
								</div>
								
								<div class="modal-body pt-1">
									<!-- Descrição do Flavor Text -->
									<div class="ability-flavor-section mt-3">
										<h6 class="ability-section-title mb-1">
											<i class="bi bi-quote me-1"></i>
											Description
										</h6>
										<div class="ability-flavor-card p-2 rounded-3">
											<p class="ability-description-text mb-0">${ability.description}</p>
										</div>
									</div>

									${
										ability.effect
											? `
									<!-- Efeito Detalhado -->
									<div class="ability-effect-section">
										<h6 class="ability-section-title mb-1 mt-3">
											<i class="bi bi-gear me-1"></i>
											Detailed Effect
										</h6>
										<div class="ability-effect-card p-2 rounded-3">
											<p class="ability-effect-text mb-0">${ability.effect}</p>
										</div>
									</div>
									`
											: ""
									}

									<!-- Pokémon que possuem esta habilidade -->
									<div class="ability-pokemon-section mt-3">
										<h6 class="ability-section-title mb-1 d-flex align-items-center justify-content-between">
											<span>
												<i class="bi bi-collection me-1"></i>
												Pokémon with this ability
											</span>
											<small class="ability-pokemon-count">(first ${ability.pokemonList.length})</small>
										</h6>
										<div class="row g-2">
											${pokemonCards}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				`;
			})
			.join("");
	}
}
