/**
 * ========================================
 * STATS TAB - Componente de Estatísticas do Pokémon
 * ========================================
 * 
 * Este componente é responsável por exibir as estatísticas base do Pokémon
 * em formato visual com barras de progresso e valores numéricos.
 * 
 * FUNCIONALIDADES:
 * - Fetch e cache de dados de estatísticas
 * - Renderização de barras de progresso responsivas
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
 * 
 * @author Gustavo Andrey
 * @version 1.0.0
 * @since 2025-07-21
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
		 * @type {Array<StatData>|null} Cache dos dados de estatísticas processados
		 * @private
		 */
		this.statsData = null;
	}

	/**
	 * Busca e processa os dados de estatísticas do Pokémon da PokeAPI.
	 * 
	 * FUNCIONAMENTO DO CACHE:
	 * - Na primeira chamada, faz requisição HTTP e processa dados
	 * - Chamadas subsequentes retornam dados do cache
	 * - Cache permanece válido durante toda a sessão
	 * 
	 * PROCESSAMENTO DOS DADOS:
	 * - Extrai apenas os campos necessários (name, base_stat)
	 * - Formata nomes para exibição (snake_case → Title Case)
	 * - Valida integridade dos dados recebidos
	 * 
	 * @async
	 * @method fetchData
	 * @returns {Promise<Array<StatData>>} Array com dados processados das estatísticas
	 * 
	 * @throws {Error} Erro HTTP da API ou dados inválidos
	 * 
	 * @example
	 * const statsTab = new StatsTab(25, "https://pokeapi.co/api/v2/pokemon/25");
	 * try {
	 *   const stats = await statsTab.fetchData();
	 *   console.log("Stats do Pikachu:", stats);
	 *   // Output: [{ name: "hp", value: 35 }, { name: "attack", value: 55 }, ...]
	 * } catch (error) {
	 *   console.error("Erro ao buscar stats:", error);
	 * }
	 * 
	 * @typedef {Object} StatData
	 * @property {string} name - Nome da estatística (hp, attack, defense, etc.)
	 * @property {number} value - Valor base da estatística (0-255)
	 */
	async fetchData() {
		// ========================================
		// VERIFICAÇÃO DE CACHE
		// ========================================
		// Retorna dados em cache para evitar requisições desnecessárias
		if (this.statsData) return this.statsData;

		try {
			// ========================================
			// REQUISIÇÃO HTTP
			// ========================================
			const response = await fetch(this.pokemonUrl);
			if (!response.ok) {
				throw new Error(`Erro HTTP: ${response.status}`);
			}

			const pokemonData = await response.json();

			// ========================================
			// VALIDAÇÃO DOS DADOS
			// ========================================
			if (!pokemonData.stats || !Array.isArray(pokemonData.stats)) {
				throw new Error("Dados de estatísticas não encontrados ou inválidos");
			}

			// ========================================
			// PROCESSAMENTO E CACHE
			// ========================================
			// Extrai apenas os dados necessários e os armazena em cache
			this.statsData = pokemonData.stats.map((stat) => ({
				name: stat.stat.name,
				value: stat.base_stat,
			}));

			console.log(
				`📊 Stats carregados para ID ${this.pokemonId}:`,
				this.statsData
			);
			return this.statsData;
			
		} catch (error) {
			console.error(`❌ Erro ao carregar stats:`, error);
			throw error;
		}
	}

	/**
	 * Renderiza o componente de estatísticas no container fornecido.
	 * 
	 * ESTRUTURA VISUAL GERADA:
	 * - Título da seção com ícone
	 * - Lista de estatísticas com barras de progresso
	 * - Badges com valores numéricos
	 * - Layout responsivo com Bootstrap
	 * 
	 * CÁLCULOS VISUAIS:
	 * - Percentual da barra: (valor / 180) * 100 (180 é considerado valor alto)
	 * - Cores: gradiente baseado no tipo do Pokémon
	 * - Altura das barras: 8px para melhor visualização
	 * 
	 * RESPONSIVIDADE:
	 * - Funciona em mobile, tablet e desktop
	 * - Barras se ajustam ao container
	 * - Texto legível em todos os tamanhos
	 * 
	 * @async
	 * @method render
	 * @param {HTMLElement} container - Elemento DOM onde inserir o conteúdo
	 * @returns {Promise<void>} Promise que resolve quando a renderização estiver completa
	 * 
	 * @throws {Error} Erro ao buscar dados ou renderizar
	 * 
	 * @example
	 * const container = document.getElementById("stats-content");
	 * const statsTab = new StatsTab(25, "https://pokeapi.co/api/v2/pokemon/25");
	 * 
	 * try {
	 *   await statsTab.render(container);
	 *   console.log("Estatísticas renderizadas com sucesso!");
	 * } catch (error) {
	 *   console.error("Erro na renderização:", error);
	 * }
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
			// Cria uma barra de progresso para cada estatística
			const statsList = this.statsData
				.map((stat) => {
					// Formatação do nome da estatística
					const statName = TextFormatter.capitalize(
						stat.name.replace("-", " ")
					);
					
					// Cálculo do percentual para a barra (máximo considerado: 180)
					const percentage = Math.min((stat.value / 180) * 100, 100);
					
					// Cor primária do gradiente (usando cor padrão por enquanto)
					const primaryColor = PokemonTypes.getTypeColor("normal");

					return `
						<div class="mb-3">
							<!-- Nome e valor da estatística -->
							<div class="d-flex justify-content-between mb-1">
								<small class="fw-bold">${statName}</small>
								<small class="badge bg-secondary">${stat.value}</small>
							</div>
							
							<!-- Barra de progresso -->
							<div class="progress" style="height: 8px; border-radius: 4px;">
								<div class="progress-bar" 
									 style="width: ${percentage}%; background: linear-gradient(90deg, ${primaryColor}66, ${primaryColor});"
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
			// RENDERIZAÇÃO FINAL
			// ========================================
			// Insere o HTML completo no container fornecido
			container.innerHTML = `
				<h5 class="fw-semibold mb-3">⚡ Estatísticas Base</h5>
				<div class="stats-container">
					${statsList}
				</div>
				
				<!-- Informação adicional -->
				<div class="mt-3">
					<small class="text-muted">
						<i class="bi bi-info-circle me-1"></i>
						Estatísticas base do Pokémon no nível 50
					</small>
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
