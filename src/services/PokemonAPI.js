/**
 * 🔌 POKEMONAPI.JS - SERVIÇO DE API DA POKÉDX
 *
 * Responsável por todas as interações com a PokéAPI.
 * Centraliza as chamadas de API e oferece uma interface
 * simples e consistente para obter dados dos Pokémon.
 *
 * Funcionalidades:
 * - 📋 Buscar lista de Pokémon (com paginação)
 * - 🔍 Buscar detalhes de um Pokémon específico
 * - 🎵 Obter URL do áudio (cry) do Pokémon
 * - 💾 Cache simples para melhorar performance
 * - 🚨 Tratamento de erros robusto
 *
 */

import { TextFormatter, PokemonTypes, GeneralHelpers } from "../utils/index.js";

/**
 * 🔌 Classe principal para interação com a PokéAPI
 *
 * Implementa um cache simples e métodos organizados
 * para buscar dados dos Pokémon de forma eficiente.
 */
class PokemonAPI {
	/**
	 * Construtor da API
	 * Inicializa configurações e cache
	 */
	constructor() {
		// 🌐 URL base da PokéAPI
		this.baseUrl = "https://pokeapi.co/api/v2";

		// 💾 Cache simples para evitar requests desnecessários
		// funciona como um dicionário para armazenar respostas
		// onde a chave é uma string única para cada solicitação
		// exemplo: "list_0_36" para a lista de Pokémon
		// onde o 0 e 36 são o offset e limit
		// o offset é o índice de início e limit é a quantidade por página
		// e "details_1" para detalhes do Pokémon com ID 1
		this.cache = new Map();

		// ⚙️ Configurações da API
		this.config = {
			timeout: 10000, // 10 segundos de timeout
			pageSize: 36, // 36 Pokémon por página
			maxRetries: 3, // Máximo 3 tentativas
		};

		console.log("🔌 PokemonAPI inicializada");
	}

	// ========================================
	// 📋 MÉTODOS PARA LISTA DE POKÉMON
	// ========================================

	/**
	 * 📋 Busca uma lista paginada de Pokémon
	 *
	 * @param {number} offset - Índice de início (padrão: 0)
	 * @param {number} limit - Quantidade por página (padrão: 36)
	 * @param {number} pageSize - Tamanho da página (opcional, padrão: 36)
	 * @returns {Promise<Object>} Lista de Pokémon com metadados
	 * @throws {Error} Se ocorrer um erro na requisição
	 * @description
	 * Busca uma lista paginada de Pokémon da PokéAPI.
	 */
	async getPokemonList(offset = 0, limit = this.config.pageSize) {
		try {
			console.log(`📋 Buscando lista: offset=${offset}, limit=${limit}`);

			// 🔑 Chave para cache
			// o que e cacheKey?
			// cacheKey é uma string única que identifica a solicitação de API
			const cacheKey = `list_${offset}_${limit}`;

			// 💾 Verificar cache primeiro
			if (this.cache.has(cacheKey)) {
				console.log("💾 Dados encontrados no cache");
				return this.cache.get(cacheKey); // Retorna dados do cache
			}

			// 🌐 Fazer request para API
			const url = `${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`; // URL da lista de Pokémon
			const response = await this._fetchWithRetry(url);

			// 📊 Processar resposta
			// faz um map para transformar os resultados em objetos com id, name e url
			// isso serve para facilitar a criação dos cards
			const data = {
				pokemons: response.results.map((pokemon, index) => ({
					id: offset + index + 1, // ID baseado no offset
					name: pokemon.name,
					url: pokemon.url,
				})),
				count: response.count,
				next: response.next,
				previous: response.previous,
				hasMore: !!response.next,
			};

			// 💾 Salvar no cache
			// salva a lista de Pokémon no cache com a chave gerada
			this.cache.set(cacheKey, data);

			console.log(`✅ Lista carregada: ${data.pokemons.length} Pokémon`);
			return data;
		} catch (error) {
			console.error("❌ Erro ao buscar lista:", error);
			throw new Error(`Falha ao carregar lista de Pokémon: ${error.message}`);
		}
	}

	// ========================================
	// 🔍 MÉTODOS PARA DETALHES DO POKÉMON
	// ========================================

	/**
	 * 🔍 Busca detalhes completos de um Pokémon
	 *
	 * @param {number|string} idOrName - ID ou nome do Pokémon
	 * @returns {Promise<Object>} Dados completos do Pokémon
	 * @throws {Error} Se ocorrer um erro na requisição
	 * @description
	 * Busca detalhes completos de um Pokémon, incluindo imagens, tipos, estatísticas, habilidades,
	 * e outros metadados. Utiliza cache para evitar requisições desnecessárias
	 */
	async getPokemonDetails(idOrName) {
		try {
			console.log(`🔍 Buscando detalhes do Pokémon: ${idOrName}`);

			// 🔑 Chave para cache
			// que foi gerada a partir do ID ou nome do Pokémon
			// isso serve para evitar requisições desnecessárias
			const cacheKey = `details_${idOrName}`;

			// 💾 Verificar cache primeiro
			if (this.cache.has(cacheKey)) {
				console.log("💾 Detalhes encontrados no cache");
				return this.cache.get(cacheKey);
			}

			// 🌐 Fazer request para API
			const url = `${this.baseUrl}/pokemon/${idOrName}`;
			const response = await this._fetchWithRetry(url);

			// 📊 Processar dados do Pokémon
			const pokemon = this._processPokemonData(response);
			console.log(pokemon);
			// 💾 Salvar no cache
			this.cache.set(cacheKey, pokemon);

			console.log(`✅ Detalhes carregados: ${pokemon.name}`);
			return pokemon;
		} catch (error) {
			console.error("❌ Erro ao buscar detalhes:", error);
			throw new Error(
				`Falha ao carregar Pokémon "${idOrName}": ${error.message}`
			);
		}
	}

	/**
	 * 🎵 Busca URL do áudio (cry) do Pokémon
	 *
	 * @param {number} pokemonId - ID do Pokémon
	 * @returns {Promise<string|null>} URL do áudio ou null se não encontrado
	 * @throws {Error} Se ocorrer um erro na requisição
	 * @description
	 * Busca o áudio do Pokémon na PokéAPI. Retorna a URL do arquivo de áudio ou null
	 * se o Pokémon não tiver áudio disponível.
	 * Utiliza a URL padrão dos cries da PokéAPI.
	 */
	async getPokemonAudio(pokemonId) {
		try {
			// 🎵 URL padrão dos cries na PokéAPI
			const audioUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;

			// ✅ Verificar se o áudio existe
			const exists = await this._checkUrlExists(audioUrl);

			if (exists) {
				console.log(`🎵 Áudio encontrado para Pokémon #${pokemonId}`);
				return audioUrl;
			} else {
				console.warn(`⚠️ Áudio não encontrado para Pokémon #${pokemonId}`);
				return null;
			}
		} catch (error) {
			console.error("❌ Erro ao buscar áudio:", error);
			return null;
		}
	}

	// ========================================
	// 🔧 MÉTODOS UTILITÁRIOS PRIVADOS
	// ========================================

	/**
	 * 🌐 Faz request com retry automático
	 *
	 * @param {string} url - URL para fazer request
	 * @param {number} retryCount - Contador de tentativas
	 * @returns {Promise<Object>} Dados da resposta
	 * @private
	 * @throws {Error} Se ocorrer um erro na requisição
	 * @description
	 * Faz uma requisição para a URL especificada com suporte a retries.
	 * Utiliza um controller para timeout e implementa backoff progressivo
	 * para evitar sobrecarga no servidor.
	 * Se a requisição falhar, tenta novamente até o número máximo de tentativas.
	 * Se ainda falhar, lança um erro com detalhes.
	 * retries são incrementais (1s, 2s, 3s...)
	 * backoff progressivo são uma técnica para evitar sobrecarga no servidor
	 * e melhorar a taxa de sucesso em redes instáveis.
	 */
	async _fetchWithRetry(url, retryCount = 0) {
		try {
			// ⏱️ Controller para timeout
			const controller = new AbortController(); // cria um controller para abortar a requisição se demorar demais
			const timeoutId = setTimeout(() => controller.abort(), this.config.timeout); // 10 segundos de timeout

			// 🌐 Fazer request
			const response = await fetch(url, {
				signal: controller.signal,
			});

			// 🧹 Limpar timeout
			clearTimeout(timeoutId);

			// ✅ Verificar se resposta é válida
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			// 📊 Converter para JSON
			return await response.json();
		} catch (error) {
			// 🔄 Tentar novamente se não excedeu limite
			if (retryCount < this.config.maxRetries && error.name !== "AbortError") {
				console.warn(
					`⚠️ Tentativa ${retryCount + 1} falhou, tentando novamente...`
				);
				await GeneralHelpers.sleep(1000 * (retryCount + 1)); // Backoff progressivo
				return this._fetchWithRetry(url, retryCount + 1);
			}

			throw error;
		}
	}

	/**
	 * 📊 Processa dados brutos do Pokémon da API
	 *
	 * @param {Object} rawData - Dados brutos da API
	 * @returns {Object} Dados processados e organizados
	 * @private
	 * @description
	 * Processa os dados brutos do Pokémon para extrair apenas as informações necessárias.
	 * Retorna um objeto com ID, nome formatado, imagens, tipos, estatísticas,
	 * habilidades, características físicas e outros metadados.
	 * Utiliza métodos utilitários para formatação e cores dos tipos.
	 * para adicionar mais informações
	 * ou modificar a estrutura, basta alterar este método.
	 */
	_processPokemonData(rawData) {
		return {
			// 🆔 Informações básicas
			id: rawData.id,
			name: rawData.name,
			formattedName: TextFormatter.formatPokemonName(rawData.name),

			// 🎨 Imagens
			images: {
				front: rawData.sprites?.front_default, // Imagem frontal
				back: rawData.sprites?.back_default, // Imagem traseira
				frontShiny: rawData.sprites?.front_shiny, // Imagem frontal shiny
				backShiny: rawData.sprites?.back_shiny, // Imagem traseira shiny
				official: rawData.sprites?.other?.["official-artwork"]?.front_default, // Imagem oficial
				home: rawData.sprites?.other?.home?.front_default, // Imagem home
			},

			// 🏷️ Tipos
			types:
				rawData.types?.map((type) => ({
					name: type.type.name,
					formatted: TextFormatter.formatPokemonType(type.type.name), // Nome formatado do tipo
					color: PokemonTypes.getColor(type.type.name), // Cor do tipo
				})) || [],

			// 📏 Características físicas
			height: rawData.height,
			weight: rawData.weight,

			// 📊 Estatísticas
			stats:
				rawData.stats?.map((stat) => ({
					name: stat.stat.name,
					value: stat.base_stat,
					effort: stat.effort,
				})) || [],

			// 🎯 Habilidades
			abilities:
				rawData.abilities?.map((ability) => ({
					name: ability.ability.name,
					formatted: TextFormatter.formatPokemonName(ability.ability.name),
					isHidden: ability.is_hidden,
				})) || [],

			// 🎮 Dados do jogo
			baseExperience: rawData.base_experience,
			order: rawData.order,

			moves: rawData.moves,

			// 🕐 Metadados
			loadedAt: new Date().toISOString(),

		};
	}

	/**
	 * ✅ Verifica se uma URL existe
	 *
	 * @param {string} url - URL para verificar
	 * @returns {Promise<boolean>} True se URL existe
	 * @private
	 * @description
	 * Faz uma requisição HEAD para verificar se a URL existe.
	 * Retorna true se a URL for acessível, false caso contrário.
	 * Utiliza fetch com método HEAD para evitar download desnecessário.
	 * Isso é útil para verificar se imagens ou áudios estão disponíveis
	 * sem precisar baixar o conteúdo completo.
	 */
	async _checkUrlExists(url) {
		try {
			const response = await fetch(url, { method: "HEAD" });
			return response.ok;
		} catch {
			return false;
		}
	}

	// ========================================
	// 🧹 MÉTODOS DE LIMPEZA E CACHE
	// ========================================

	/**
	 * 🧹 Limpa o cache da API
	 * @description
	 * Limpa todo o cache armazenado na instância da API.
	 */
	clearCache() {
		this.cache.clear();
		console.log("🧹 Cache da API limpo");
	}

	/**
	 * 📊 Retorna informações sobre o cache
	 *
	 * @returns {Object} Estatísticas do cache
	 * @description
	 * Retorna informações sobre o estado atual do cache, incluindo
	 * o tamanho e as chaves armazenadas.
	 */
	getCacheStats() {
		return {
			size: this.cache.size,
			keys: Array.from(this.cache.keys()),
		};
	}
}

// ========================================
// 🌍 INSTÂNCIA GLOBAL
// ========================================

/**
 * 🌍 Instância global da API
 * Reutilizada em toda a aplicação
 */
const pokemonAPI = new PokemonAPI();

// 🌍 Disponibilizar globalmente para debug
window.pokemonAPI = pokemonAPI;

// ========================================
// 📤 EXPORTAÇÕES ES6
// ========================================

export { PokemonAPI, pokemonAPI };
export default pokemonAPI;
