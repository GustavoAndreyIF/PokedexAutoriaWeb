/**
 * ========================================
 * STATS TAB - Componente de Estatísticas do Pokémon
 * ========================================
 *
 * Este componente é responsável por exibir as estatísticas base do Pokémon
 * em formato visual com barras de progresso e valores numéricos.
 *
 * FUNCIONALIDADES:
 * - Fetch e cache de dados de estatísticas e species
 * - Renderização de barras de progresso responsivas
 * - Exibição de informações físicas e de captura
 * - Formatação de nomes e valores
 * - Tratamento de erros específico
 *
 * DADOS EXIBIDOS:
 * - HP (Health Points)
 * - Attack (Ataque)
 * - Defense (Defesa)
 * - Special Attack (Ataque Especial)
 * - Special Defense (Defesa Especial)
 * - Speed (Velocidade)
 * - Held Items (Itens segurados)
 * - Height & Weight (Altura e Peso)
 * - Generation (Geração)
 * - Habitat (Habitat)
 * - Is Legendary/Mythical (Lendário/Mítico)
 * - Capture Rate & Is Baby
 *
 *
 * @example
 * // Uso básico
 * const statsTab = new StatsTab(25, "https://pokeapi.co/api/v2/pokemon/25");
 * await statsTab.render(document.getElementById("stats-content"));
 */

import { PokemonTypes, TextFormatter } from "../../utils/index.js";

/**
 * Componente especializado para exibir estatísticas base do Pokémon.
 *
 * Implementa o padrão de componente de aba definido no sistema modular,
 * sendo responsável por seu próprio ciclo de vida de dados e renderização.
 *
 * @class StatsTab
 * @implements {TabComponent} Interface implícita para componentes de aba
 */
export class StatsTab {
	/**
	 * Cria uma nova instância do componente de estatísticas.
	 *
	 * @param {number|string} pokemonId - ID único do Pokémon (1-1010+)
	 * @param {string} pokemonUrl - URL completa da API do Pokémon
	 *
	 * @example
	 * const statsTab = new StatsTab(1, "https://pokeapi.co/api/v2/pokemon/1");
	 * const pikachuStats = new StatsTab("pikachu", "https://pokeapi.co/api/v2/pokemon/pikachu");
	 */
	constructor(pokemonId, pokemonUrl) {
		/** @type {number|string} ID do Pokémon para referência e logs */
		this.pokemonId = pokemonId;

		/** @type {string} URL da PokeAPI para buscar dados do Pokémon */
		this.pokemonUrl = pokemonUrl;

		/**
		 * @type {Object|null} Cache dos dados completos processados
		 * @private
		 */
		this.statsData = null;
	}

	/**
	 * Busca e processa os dados completos do Pokémon da PokeAPI.
	 *
	 * FUNCIONAMENTO DO CACHE:
	 * - Na primeira chamada, faz requisição HTTP e processa dados
	 * - Chamadas subsequentes retornam dados do cache
	 * - Cache permanece válido durante toda a sessão
	 *
	 * PROCESSAMENTO DOS DADOS:
	 * - Extrai estatísticas, held items, dimensões físicas
	 * - Busca generation, habitat, legendary/mythical status
	 * - Formata nomes para exibição (snake_case → Title Case)
	 * - Valida integridade dos dados recebidos
	 *
	 * @async
	 * @method fetchData
	 * @returns {Promise<Object>} Objeto com todos os dados processados
	 *
	 * @throws {Error} Erro HTTP da API ou dados inválidos
	 */
	async fetchData() {
		// ========================================
		// VERIFICAÇÃO DE CACHE
		// ========================================
		// Retorna dados em cache para evitar requisições desnecessárias
		if (this.statsData) {
			console.log(
				`📊 Dados completos já carregados para ID ${this.pokemonId}, retornando cache...`
			);
			return this.statsData;
		}

		try {
			// ========================================
			// REQUISIÇÕES PARALELAS
			// ========================================
			console.log(
				`🔄 Buscando dados completos para Pokémon ID ${this.pokemonId}...`
			);

			const speciesUrl = this.pokemonUrl.replace(
				"/pokemon/",
				"/pokemon-species/"
			);

			const [pokemonResponse, speciesResponse] = await Promise.all([
				fetch(this.pokemonUrl),
				fetch(speciesUrl),
			]);

			if (!pokemonResponse.ok) {
				throw new Error(`Erro HTTP Pokemon: ${pokemonResponse.status}`);
			}
			if (!speciesResponse.ok) {
				throw new Error(`Erro HTTP Species: ${speciesResponse.status}`);
			}

			const [pokemonData, speciesData] = await Promise.all([
				pokemonResponse.json(),
				speciesResponse.json(),
			]);

			// ========================================
			// VALIDAÇÃO DOS DADOS
			// ========================================
			if (!pokemonData.stats || !Array.isArray(pokemonData.stats)) {
				throw new Error("Dados de estatísticas não encontrados ou inválidos");
			}

			// ========================================
			// PROCESSAMENTO E CACHE COMPLETO
			// ========================================
			// Extrai todos os dados necessários e os armazena em cache
			this.statsData = {
				// Estatísticas base
				stats: pokemonData.stats.map((stat) => ({
					name: stat.stat.name,
					value: stat.base_stat,
				})),

				// Tipos do Pokémon
				types: pokemonData.types.map((type) => type.type.name),

				// Dimensões físicas
				physicalData: {
					height: pokemonData.height, // em decímetros (dividir por 10 para metros)
					weight: pokemonData.weight, // em hectogramas (dividir por 10 para kg)
				},

				// Itens que pode carregar
				heldItems: pokemonData.held_items.map((item) => ({
					name: item.item.name,
					rarity: item.version_details.map((v) => ({
						version: v.version.name,
						rarity: v.rarity,
					})),
				})),

				// Informações da espécie
				speciesInfo: {
					captureRate: speciesData.capture_rate || 0,
					isBaby: speciesData.is_baby || false,
					isLegendary: speciesData.is_legendary || false,
					isMythical: speciesData.is_mythical || false,
					generation: speciesData.generation?.name || null,
					habitat: speciesData.habitat?.name || null,
					growthRate: speciesData.growth_rate?.name || null,
				},
			};

			console.log(
				`📊 Dados completos carregados para ID ${this.pokemonId}:`,
				this.statsData
			);
			return this.statsData;
		} catch (error) {
			console.error(`❌ Erro ao carregar dados completos:`, error);
			throw error;
		}
	}

	/**
	 * Renderiza o componente completo de estatísticas no container fornecido.
	 *
	 * ESTRUTURA VISUAL GERADA:
	 * - Título da seção com ícone
	 * - Lista de estatísticas com barras de progresso
	 * - Informações físicas (altura e peso)
	 * - Itens segurados
	 * - Informações da espécie (geração, habitat, status especial)
	 * - Informações de captura
	 * - Layout responsivo com Bootstrap
	 *
	 * @async
	 * @method render
	 * @param {HTMLElement} container - Elemento DOM onde inserir o conteúdo
	 * @returns {Promise<void>} Promise que resolve quando a renderização estiver completa
	 *
	 * @throws {Error} Erro ao buscar dados ou renderizar
	 */
	async render(container) {
		try {
			// ========================================
			// CARREGAMENTO DE DADOS
			// ========================================
			// Garante que os dados estejam disponíveis antes da renderização
			await this.fetchData();

			// ========================================
			// GERAÇÃO DE HTML DAS ESTATÍSTICAS
			// ========================================
			// Obtém o tipo primário para aplicar a cor temática
			const primaryType = this.statsData.types[0] || "normal";

			// Cria uma barra de progresso para cada estatística
			const statsList = this.statsData.stats
				.map((stat) => {
					// Formatação do nome da estatística
					const statName = TextFormatter.capitalize(
						stat.name.replace("-", " ")
					);

					// Cálculo do percentual para a barra (máximo considerado: 180)
					const percentage = Math.min((stat.value / 180) * 100, 100);

					// Ícones para cada estatística
					const statIcons = {
						hp: "bi-heart",
						attack: "bi-caret-up",
						defense: "bi-shield",
						"special-attack": "bi-lightning",
						"special-defense": "bi-shield-check",
						speed: "bi-speedometer",
					};

					const iconClass = statIcons[stat.name] || "bi-bar-chart-fill";

					return `
                        <div class="mb-3">
                            <!-- Nome e valor da estatística -->
                            <div class="d-flex justify-content-between mb-1">
                                <small class="fw-bold stats-text"><i class="${iconClass}"></i> ${statName}</small>
                                <small class="badge stat-badge stat-badge--${primaryType} stats-number">${stat.value}</small>
                            </div>
                            
                            <!-- Barra de progresso -->
                            <div class="progress stats-progress" style="height: 8px; border-radius: 4px;">
                                <div class="progress-bar stats-progress-bar stats-progress-bar--${primaryType}" 
                                     style="width: ${percentage}%;"
                                     role="progressbar" 
                                     aria-valuenow="${stat.value}" 
                                     aria-valuemin="0" 
                                     aria-valuemax="180"
                                     aria-label="${statName}: ${stat.value} pontos">
                                </div>
                            </div>
                        </div>
                    `;
				})
				.join("");

			// ========================================
			// FORMATAÇÃO DE DADOS FÍSICOS
			// ========================================
			const heightInMeters = (this.statsData.physicalData.height / 10).toFixed(1);
			const weightInKg = (this.statsData.physicalData.weight / 10).toFixed(1);

			// ========================================
			// FORMATAÇÃO DE HELD ITEMS
			// ========================================
			const heldItemsList =
				this.statsData.heldItems.length > 0
					? this.statsData.heldItems
							.map(
								(item) =>
									`<span class="badge stat-badge stat-badge--${primaryType} stats-text me-1">${TextFormatter.capitalize(
										item.name.replace("-", " ")
									)}</span>`
							)
							.join("")
					: `<span class="badge stat-badge stat-badge--${primaryType} stats-text">None</span>`;

			// ========================================
			// INFORMAÇÕES DA SPECIES
			// ========================================
			const captureRatePercentage = (
				(this.statsData.speciesInfo.captureRate / 255) *
				100
			).toFixed(1);

			const generationName = this.statsData.speciesInfo.generation
				? TextFormatter.capitalize(
						this.statsData.speciesInfo.generation.replace("-", " ")
				  )
				: "Unknown";

			const habitatName = this.statsData.speciesInfo.habitat
				? TextFormatter.capitalize(
						this.statsData.speciesInfo.habitat.replace("-", " ")
				  )
				: "Unknown";

			const growthRateName = this.statsData.speciesInfo.growthRate
				? TextFormatter.capitalize(
						this.statsData.speciesInfo.growthRate.replace("-", " ")
				  )
				: "Unknown";

			// Status especial (Legendary/Mythical/Baby)
			let specialStatus = [];
			if (this.statsData.speciesInfo.isLegendary)
				specialStatus.push("Legendary");
			if (this.statsData.speciesInfo.isMythical) specialStatus.push("Mythical");
			if (this.statsData.speciesInfo.isBaby) specialStatus.push("Baby");

			const specialStatusText =
				specialStatus.length > 0 ? specialStatus.join(", ") : "Normal";

			// ========================================
			// RENDERIZAÇÃO FINAL
			// ========================================
			// Insere o HTML completo no container fornecido
			container.innerHTML = `
                <div class="stats-tab stats-tab--${primaryType}">
                    <h5 class="fw-semibold mb-3 stats-title"><i class="bi bi-bar-chart-fill me-2"></i>Stats Base</h5>
                <div class="stats-info mb-3">
                    <div class="row g-2">
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="fw-bold stats-text"><i class="bi bi-rulers"></i> Height:</small>
                                <span class="badge stat-badge stat-badge--${primaryType} stats-number">${heightInMeters} m</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="fw-bold stats-text"><i class="bi bi-speedometer2"></i> Weight:</small>
                                <span class="badge stat-badge stat-badge--${primaryType} stats-number">${weightInKg} kg</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="fw-bold stats-text"><i class="bi bi-box-seam"></i> Held Items:</small>
                                <div>${heldItemsList}</div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="fw-bold stats-text"><i class="bi bi-gem"></i> Generation:</small>
                                <span class="badge stat-badge stat-badge--${primaryType} stats-text">${generationName}</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="fw-bold stats-text"><i class="bi bi-tree"></i> Habitat:</small>
                                <span class="badge stat-badge stat-badge--${primaryType} stats-text">${habitatName}</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="fw-bold stats-text"><i class="bi bi-star"></i> Special Status:</small>
                                <span class="badge stat-badge stat-badge--${primaryType} stats-text">${specialStatusText}</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <small class="fw-bold stats-text"><i class="bi bi-bullseye"></i> Capture Rate:</small>
                                <span class="badge stat-badge stat-badge--${primaryType} stats-number">${this.statsData.speciesInfo.captureRate}/255 (${captureRatePercentage}%)</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="fw-bold stats-text"><i class="bi bi-graph-up"></i> Growth Rate:</small>
                                <span class="badge stat-badge stat-badge--${primaryType} stats-text">${growthRateName}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="stats-container mt-3">
                    ${statsList}
                </div>
                </div>
            `;
		} catch (error) {
			// ========================================
			// TRATAMENTO DE ERRO ESPECÍFICO
			// ========================================
			// Exibe uma mensagem de erro amigável específica para esta aba
			container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h6 class="alert-heading">❌ Erro ao carregar estatísticas</h6>
                    <p class="mb-0">${error.message}</p>
                    <hr>
                    <button class="btn btn-outline-danger btn-sm mt-2" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise me-1"></i>Recarregar página
                    </button>
                </div>
            `;
			console.error("❌ Erro na renderização do StatsTab:", error);
		}
	}
}
