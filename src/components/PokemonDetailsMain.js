/**
 * ========================================
 * POKEMON DETAILS MAIN - Sistema de Abas Modular
 * ========================================
 *
 * Este componente gerencia a coluna principal da página de detalhes do Pokémon,
 * implementando um sistema de abas totalmente modular e extensível.
 *
 * ARQUITETURA:
 * - Cada aba é um componente independente com sua própria lógica
 * - Sistema de navegação com Bootstrap Button Groups
 * - Carregamento dinâmico de conteúdo por aba
 * - Gestão de estado e cache automático
 *
 * TUTORIAL PARA DESENVOLVEDORES:
 * ========================================
 *
 * Para criar uma nova aba, siga estes passos:
 *
 * 1. CRIAÇÃO DO COMPONENTE DE ABA:
 *    Crie um arquivo em /src/components/tabs/MinhaNovaTab.js:
 *
 *    ```javascript
 *    export class MinhaNovaTab {
 *        constructor(pokemonId, pokemonUrl) {
 *            this.pokemonId = pokemonId;
 *            this.pokemonUrl = pokemonUrl;
 *            this.dadosCache = null; // Cache dos dados
 *        }
 *
 *        async fetchData() {
 *            if (this.dadosCache) return this.dadosCache;
 *            // Sua lógica de fetch aqui
 *            return this.dadosCache;
 *        }
 *
 *        async render(container) {
 *            await this.fetchData();
 *            container.innerHTML = `<!-- Seu HTML aqui -->`;
 *        }
 *    }
 *    ```
 *
 * 2. IMPORTAÇÃO NO MAIN:
 *    Adicione a importação no topo deste arquivo:
 *    ```javascript
 *    import { MinhaNovaTab } from "./tabs/MinhaNovaTab.js";
 *    ```
 *
 * 3. INSTANCIAÇÃO NO CONSTRUCTOR:
 *    Adicione no constructor:
 *    ```javascript
 *    this.minhaNovaTab = new MinhaNovaTab(pokemonId, pokemonUrl);
 *    ```
 *
 * 4. ADIÇÃO DO BOTÃO:
 *    No método render(), adicione o botão na div.btn-group:
 *    ```html
 *    <button type="button" class="btn btn-outline-primary" onclick="switchTab('minhanova')">
 *        <i class="bi bi-icon-name me-2"></i>Minha Nova Aba
 *    </button>
 *    ```
 *
 * 5. CONTAINER DE CONTEÚDO:
 *    Adicione o container na seção de Tab Content:
 *    ```html
 *    <div id="minhanova-content" class="tab-content-section d-none">
 *        <!-- Conteúdo será inserido dinamicamente -->
 *    </div>
 *    ```
 *
 * 6. CASE NO SWITCH:
 *    Adicione no método loadTabData():
 *    ```javascript
 *    case "minhanova":
 *        await this.minhaNovaTab.render(targetContainer);
 *        break;
 *    ```
 *
 * PADRÕES E CONVENÇÕES:
 * ========================================
 *
 * - Nomes de abas sempre em lowercase
 * - IDs dos containers: "nomeaba-content"
 * - Métodos obrigatórios: fetchData() e render(container)
 * - Use cache para evitar requisições desnecessárias
 * - Tratamento de erro consistente
 * - Loading states durante fetch
 *
 *
 */

import { DOMUtils, PokemonTypes } from "../utils/index.js";
import { StatsTab } from "./tabs/StatsTab.js";
import { EvolutionTab } from "./tabs/EvolutionTab.js";
import { MovesTab } from "./tabs/MovesTab.js";
import { LocationTab } from "./tabs/LocationTab.js";

/**
 * Componente principal que gerencia o sistema de abas da página de detalhes do Pokémon.
 *
 * Este componente é responsável por:
 * - Renderizar a estrutura base das abas
 * - Gerenciar a navegação entre abas
 * - Coordenar o carregamento de dados de cada aba
 * - Manter o estado ativo da interface
 *
 * @class PokemonDetailsMain
 * @example
 * // Uso básico
 * const mainComponent = new PokemonDetailsMain(25, "https://pokeapi.co/api/v2/pokemon/25");
 * await mainComponent.render();
 */
export class PokemonDetailsMain {
	/**
	 * Cria uma nova instância do componente principal de abas.
	 *
	 * @param {number|string} pokemonId - ID do Pokémon para buscar dados
	 * @param {string} pokemonUrl - URL da API do Pokémon
	 *
	 * @example
	 * const detailsMain = new PokemonDetailsMain(1, "https://pokeapi.co/api/v2/pokemon/1");
	 */
	constructor(pokemonId, pokemonUrl) {
		/** @type {number|string} ID do Pokémon atual */
		this.pokemonId = pokemonId;

		/** @type {string} URL da API para o Pokémon atual */
		this.pokemonUrl = pokemonUrl;

		/** @type {Object|null} Dados básicos do Pokémon para cores temáticas */
		this.basicData = null;

		// ========================================
		// INSTANCIAÇÃO DOS COMPONENTES DE ABA
		// ========================================
		// Cada aba é um componente independente que gerencia:
		// - Seus próprios dados e cache
		// - Lógica de fetch específica
		// - Renderização do conteúdo

		/** @type {StatsTab} Componente da aba de estatísticas */
		this.statsTab = new StatsTab(pokemonId, pokemonUrl);

		/** @type {EvolutionTab} Componente da aba de evolução */
		this.evolutionTab = new EvolutionTab(pokemonId, pokemonUrl);

		/** @type {MovesTab} Componente da aba de movimentos */
		this.movesTab = new MovesTab(pokemonId, pokemonUrl);

		/** @type {LocationTab} Componente da aba de localização */
		this.locationTab = new LocationTab(pokemonId, pokemonUrl);
	}

	/**
	 * Busca dados básicos do Pokémon para aplicar cores temáticas.
	 *
	 * @async
	 * @method fetchBasicData
	 * @returns {Promise<void>} Promise que resolve quando os dados estiverem carregados
	 * @private
	 */
	async fetchBasicData() {
		try {
			if (this.basicData) return; // Evita fetch duplicado

			const response = await fetch(this.pokemonUrl);
			if (!response.ok) {
				throw new Error(`Erro HTTP: ${response.status}`);
			}

			const pokemonData = await response.json();

			// Extrair apenas dados necessários para cores temáticas
			this.basicData = {
				types: pokemonData.types.map((typeInfo) => typeInfo.type.name),
				primaryType: pokemonData.types[0]?.type.name?.toLowerCase() || "normal",
			};

			console.log(
				`🎨 Dados básicos carregados para ${this.pokemonId}:`,
				this.basicData
			);
		} catch (error) {
			console.error(`❌ Erro ao carregar dados básicos:`, error);
			// Fallback para tipo normal
			this.basicData = {
				types: ["normal"],
				primaryType: "normal",
			};
		}
	}

	/**
	 * Renderiza a estrutura principal do sistema de abas no container especificado com cores temáticas.
	 *
	 * FLUXO DE EXECUÇÃO:
	 * 1. Localiza o container principal no DOM
	 * 2. Gera HTML da estrutura base (botões + containers de conteúdo)
	 * 3. Configura event handlers globais
	 * 4. Carrega automaticamente a primeira aba (stats)
	 *
	 * ESTRUTURA GERADA:
	 * - Card container com Bootstrap styling
	 * - Button group para navegação entre abas
	 * - Containers individuais para cada aba (inicialmente ocultos)
	 * - Loading states e tratamento de erro
	 *
	 * @async
	 * @method render
	 * @returns {Promise<void>} Promise que resolve quando a renderização estiver completa
	 *
	 * @throws {Error} Caso o container 'pokemon-details-main-container' não seja encontrado
	 *
	 * @example
	 * const detailsMain = new PokemonDetailsMain(25, "https://pokeapi.co/api/v2/pokemon/25");
	 * try {
	 *   await detailsMain.render();
	 *   console.log("Interface de abas renderizada com sucesso!");
	 * } catch (error) {
	 *   console.error("Erro na renderização:", error);
	 * }
	 */
	async render() {
		// ========================================
		// VALIDAÇÃO DO CONTAINER PRINCIPAL
		// ========================================
		// O container deve existir no HTML antes da renderização
		const mainContainer = DOMUtils.findElement("pokemon-details-main-container");
		if (!mainContainer) {
			console.error("❌ Container pokemon-details-main-container não encontrado");
			return;
		}

		try {
			// ========================================
			// BUSCAR DADOS BÁSICOS PARA CORES TEMÁTICAS
			// ========================================
			await this.fetchBasicData();

			// Obter cor do tipo para classes CSS
			const typeColor = PokemonTypes.getValidTypeColor(
				this.basicData.primaryType
			);

			console.log(`🔍 Tipo detectado: ${this.basicData.primaryType}`);
			console.log(`🎨 Cor aplicada: ${typeColor}`);

			// ========================================
			// GERAÇÃO DA ESTRUTURA HTML BASE
			// ========================================
			// Cria toda a estrutura necessária para o sistema de abas:
			// - Bootstrap card layout com cores temáticas
			// - Button group para navegação
			// - Containers individuais para cada aba
			// - Estados de loading por aba

			mainContainer.innerHTML = `
				<!-- Pokemon Details Main Container -->
				<div class="pokemon-main-container">
					<div class="pokemon-content-wrapper">
						<!-- Navigation Container with Pokemon Type Theme -->
						<div class="pokemon-nav-container nav-type-${typeColor}">
							<div class="pokemon-btn-group btn-group w-100" role="group" aria-label="Navegação de abas do Pokémon">
								<!-- Stats Tab (Active by default) -->
								<button type="button" 
										class="pokemon-nav-btn active" 
										onclick="switchTab('stats')"
										aria-pressed="true">
									<i class="bi bi-bar-chart-fill"></i>Stats
								</button>
								
								<!-- Evolution Tab -->
								<button type="button" 
										class="pokemon-nav-btn" 
										onclick="switchTab('evolution')"
										aria-pressed="false">
									<i class="bi bi-arrow-repeat"></i>Evolution
								</button>
								
								<!-- Moves Tab -->
								<button type="button" 
										class="pokemon-nav-btn" 
										onclick="switchTab('moves')"
										aria-pressed="false">
									<i class="bi bi-lightning-fill"></i>Moves
								</button>
								
								<!-- Location Tab -->
								<button type="button" 
										class="pokemon-nav-btn" 
										onclick="switchTab('location')"
										aria-pressed="false">
									<i class="bi bi-geo-alt-fill"></i>Location
								</button>
							</div>
						</div>
						
						<!-- Tab Content Area -->
						<div class="pokemon-tab-content">
							<!-- Stats Tab Content (Active by default) -->
							<div id="stats-content" 
								 class="tab-content-section" 
								 role="tabpanel" 
								 aria-labelledby="stats-tab">
								<div class="pokemon-loading">
									<div class="spinner-border text-primary" role="status">
										<span class="visually-hidden">Carregando estatísticas...</span>
									</div>
								</div>
							</div>
							
							<!-- Evolution Tab Content (Hidden) -->
							<div id="evolution-content" 
								 class="tab-content-section d-none" 
								 role="tabpanel" 
								 aria-labelledby="evolution-tab">
								<!-- Content will be dynamically inserted by EvolutionTab -->
							</div>
							
							<!-- Moves Tab Content (Hidden) -->
							<div id="moves-content" 
								 class="tab-content-section d-none" 
								 role="tabpanel" 
								 aria-labelledby="moves-tab">
								<!-- Content will be dynamically inserted by MovesTab -->
							</div>
							
							<!-- Location Tab Content (Hidden) -->
							<div id="location-content" 
								 class="tab-content-section d-none" 
								 role="tabpanel" 
								 aria-labelledby="location-tab">
								<!-- Content will be dynamically inserted by LocationTab -->
							</div>
						</div>
					</div>
				</div>
			`;

			// ========================================
			// CONFIGURAÇÃO DE EVENT HANDLERS GLOBAIS
			// ========================================
			// Disponibiliza a função switchTab globalmente para os onclick dos botões
			// NOTA: Esta é uma solução simples, em projetos maiores considere usar
			// event delegation ou frameworks como React/Vue
			window.switchTab = this.switchTab.bind(this);

			// ========================================
			// CARREGAMENTO AUTOMÁTICO DA ABA INICIAL
			// ========================================
			// Carrega automaticamente o conteúdo da primeira aba (stats)
			// para melhorar a experiência do usuário
			await this.loadTabData("stats");
		} catch (error) {
			// ========================================
			// TRATAMENTO DE ERRO GLOBAL
			// ========================================
			// Exibe uma mensagem de erro amigável caso algo falhe na renderização
			mainContainer.innerHTML = `
				<div class="alert alert-danger m-4" role="alert">
					<h4 class="alert-heading">❌ Erro ao carregar conteúdo principal</h4>
					<p class="mb-0">${error.message}</p>
					<hr>
					<p class="mb-0">
						<small class="text-muted">
							Tente recarregar a página ou entre em contato com o suporte.
						</small>
					</p>
				</div>
			`;
			console.error("❌ Erro na renderização do PokemonDetailsMain:", error);
		}
	}

	/**
	 * Gerencia a navegação entre abas do sistema.
	 *
	 * FLUXO DE FUNCIONAMENTO:
	 * 1. Remove estado ativo de todos os botões
	 * 2. Ativa o botão da aba selecionada
	 * 3. Oculta todos os containers de conteúdo
	 * 4. Exibe o container da aba selecionada
	 * 5. Carrega dinamicamente os dados da aba usando o componente correspondente
	 *
	 * ACESSIBILIDADE:
	 * - Atualiza aria-pressed nos botões
	 * - Gerencia role="tabpanel" nos containers
	 * - Foco e navegação por teclado (quando implementado)
	 *
	 * @async
	 * @method switchTab
	 * @param {string} tabName - Nome da aba a ser ativada ('stats', 'evolution', 'moves', 'location')
	 * @returns {Promise<void>} Promise que resolve quando a troca de aba estiver completa
	 *
	 * @example
	 * // Troca para a aba de movimentos
	 * await detailsMain.switchTab('moves');
	 *
	 * // Uso nos botões HTML (configurado automaticamente)
	 * <button onclick="switchTab('stats')">Stats</button>
	 */
	async switchTab(tabName) {
		// ========================================
		// RESETAR ESTADO DOS BOTÕES
		// ========================================
		// Remove o estado ativo de todos os botões da navegação
		document.querySelectorAll(".pokemon-nav-btn").forEach((btn) => {
			btn.classList.remove("active");
			btn.setAttribute("aria-pressed", "false");
		});

		// ========================================
		// ATIVAR BOTÃO SELECIONADO
		// ========================================
		// Localiza e ativa o botão correspondente à aba selecionada
		const activeButton = document.querySelector(
			`[onclick="switchTab('${tabName}')"]`
		);
		if (activeButton) {
			activeButton.classList.add("active");
			activeButton.setAttribute("aria-pressed", "true");
		}

		// ========================================
		// GERENCIAR VISIBILIDADE DOS CONTAINERS
		// ========================================
		// Oculta todos os containers de conteúdo das abas
		document.querySelectorAll(".tab-content-section").forEach((section) => {
			section.classList.add("d-none");
		});

		// Exibe o container da aba selecionada
		const targetContent = DOMUtils.findElement(`${tabName}-content`);
		if (targetContent) {
			targetContent.classList.remove("d-none");
		}

		// ========================================
		// CARREGAMENTO DINÂMICO DE DADOS
		// ========================================
		// Chama o método loadTabData para carregar/renderizar o conteúdo específico
		// usando o componente modular correspondente
		await this.loadTabData(tabName);
	}

	/**
	 * Carrega e renderiza dinamicamente o conteúdo de uma aba específica.
	 *
	 * SISTEMA MODULAR:
	 * Este método delega o carregamento para o componente específico de cada aba,
	 * mantendo a separação de responsabilidades e permitindo fácil extensão.
	 *
	 * FLUXO DE CARREGAMENTO:
	 * 1. Valida se o container da aba existe
	 * 2. Exibe estado de loading
	 * 3. Chama o método render() do componente correspondente
	 * 4. Trata erros e exibe mensagens apropriadas
	 *
	 * CACHE E PERFORMANCE:
	 * - Cada componente gerencia seu próprio cache
	 * - Dados são carregados apenas uma vez por sessão
	 * - Loading states melhoram a percepção de performance
	 *
	 * @async
	 * @method loadTabData
	 * @param {string} tabName - Nome da aba para carregar ('stats', 'evolution', 'moves', 'location')
	 * @returns {Promise<void>} Promise que resolve quando o carregamento estiver completo
	 *
	 * @throws {Error} Caso o container da aba não seja encontrado ou haja erro no componente
	 *
	 * @example
	 * // Carregamento manual de uma aba
	 * try {
	 *   await detailsMain.loadTabData('moves');
	 *   console.log("Aba de movimentos carregada!");
	 * } catch (error) {
	 *   console.error("Erro ao carregar aba:", error);
	 * }
	 */
	async loadTabData(tabName) {
		try {
			// ========================================
			// VALIDAÇÃO DO CONTAINER
			// ========================================
			const targetContainer = DOMUtils.findElement(`${tabName}-content`);
			if (!targetContainer) {
				console.error(`❌ Container ${tabName}-content não encontrado`);
				return;
			}

			// ========================================
			// ESTADO DE LOADING
			// ========================================
			// Exibe spinner enquanto os dados são carregados
			// Melhora a experiência do usuário indicando que algo está acontecendo
			targetContainer.innerHTML = `
				<div class="pokemon-loading">
					<div class="spinner-border text-primary" role="status">
						<span class="visually-hidden">Carregando...</span>
					</div>
				</div>
			`;

			// ========================================
			// DELEGAÇÃO PARA COMPONENTES MODULARES
			// ========================================
			// Cada case chama o método render() do componente correspondente
			// O componente é responsável por:
			// - Buscar seus próprios dados (com cache)
			// - Renderizar seu HTML específico
			// - Tratar seus próprios erros

			switch (tabName) {
				case "stats":
					// Componente de estatísticas: barras de progresso, valores base
					await this.statsTab.render(targetContainer);
					break;
				case "evolution":
					// Componente de evolução: cadeia evolutiva, condições, gatilhos
					await this.evolutionTab.render(targetContainer);
					break;
				case "moves":
					// Componente de movimentos: lista com níveis, tipos, descrições
					await this.movesTab.render(targetContainer);
					break;
				case "location":
					// Componente de localização: áreas de encontro, raridade
					await this.locationTab.render(targetContainer);
					break;
				default:
					// ========================================
					// TRATAMENTO DE ABA DESCONHECIDA
					// ========================================
					throw new Error(`Aba desconhecida: ${tabName}`);
			}
		} catch (error) {
			// ========================================
			// TRATAMENTO DE ERRO POR ABA
			// ========================================
			// Cada aba tem seu próprio tratamento de erro para não afetar as outras
			console.error(`❌ Erro ao carregar dados da aba ${tabName}:`, error);
			const targetContainer = DOMUtils.findElement(`${tabName}-content`);
			if (targetContainer) {
				targetContainer.innerHTML = `
					<div class="alert alert-danger">
						<h6 class="alert-heading">❌ Erro ao carregar conteúdo</h6>
						<p class="mb-0">${error.message}</p>
						<hr>
						<button class="btn btn-outline-danger btn-sm" onclick="loadTabData('${tabName}')">
							<i class="bi bi-arrow-clockwise me-1"></i>Tentar novamente
						</button>
					</div>
				`;
			}
		}
	}
}
