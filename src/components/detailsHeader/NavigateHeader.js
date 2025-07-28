// ============================================================================
// POKEMON DETAILS HEADER - MÓDULO DE NAVEGAÇÃO
// ============================================================================

/**
 * Módulo responsável pela navegação entre Pokémon
 *
 * Este módulo contém:
 * - Verificação de disponibilidade de navegação (anterior/próximo)
 * - Métodos de navegação entre Pokémon
 * - Controle de limites da Pokédex
 * - Redirecionamento de páginas
 *
 * @module NavigateHeader
 * @author Projeto Pokédex
 * @version 1.0.0
 */

/**
 * Classe para gerenciar navegação do PokemonDetailsHeader
 */
export class NavigateHeader {
	/**
	 * Verifica se existe um Pokémon anterior disponível para navegação
	 *
	 * @param {number} pokemonId - ID do Pokémon atual
	 * @returns {boolean} true se existe Pokémon anterior (ID > 1), false caso contrário
	 *
	 * @example
	 * const canGoPrevious = NavigateHeader.hasPreviousPokemon(25);
	 * console.log(canGoPrevious); // true (Pikachu tem anterior: Arbok #24)
	 */
	static hasPreviousPokemon(pokemonId) {
		return pokemonId > 1;
	}

	/**
	 * Verifica se existe um próximo Pokémon disponível para navegação
	 *
	 * @param {number} pokemonId - ID do Pokémon atual
	 * @param {number} maxPokemonId - ID máximo disponível na Pokédex (padrão: 1025)
	 * @returns {boolean} true se existe próximo Pokémon (ID < maxPokemonId), false caso contrário
	 *
	 * @example
	 * const canGoNext = NavigateHeader.hasNextPokemon(25, 1025);
	 * console.log(canGoNext); // true (Pikachu tem próximo: Raichu #26)
	 */
	static hasNextPokemon(pokemonId, maxPokemonId = 1025) {
		return pokemonId < maxPokemonId;
	}

	/**
	 * Navega para o Pokémon anterior redirecionando a página
	 *
	 * Só executa a navegação se hasPreviousPokemon() retornar true.
	 * Redireciona para detalhes.html com o ID anterior.
	 *
	 * @param {number} pokemonId - ID do Pokémon atual
	 *
	 * @example
	 * // Se estiver no Pokémon #25 (Pikachu), vai para #24 (Arbok)
	 * NavigateHeader.navigateToPrevious(25);
	 */
	static navigateToPrevious(pokemonId) {
		if (NavigateHeader.hasPreviousPokemon(pokemonId)) {
			const previousId = pokemonId - 1;
			window.location.href = `detalhes.html?id=${previousId}`;
		}
	}

	/**
	 * Navega para o próximo Pokémon redirecionando a página
	 *
	 * Só executa a navegação se hasNextPokemon() retornar true.
	 * Redireciona para detalhes.html com o próximo ID.
	 *
	 * @param {number} pokemonId - ID do Pokémon atual
	 * @param {number} maxPokemonId - ID máximo disponível na Pokédex (padrão: 1025)
	 *
	 * @example
	 * // Se estiver no Pokémon #25 (Pikachu), vai para #26 (Raichu)
	 * NavigateHeader.navigateToNext(25, 1025);
	 */
	static navigateToNext(pokemonId, maxPokemonId = 1025) {
		if (NavigateHeader.hasNextPokemon(pokemonId, maxPokemonId)) {
			const nextId = pokemonId + 1;
			window.location.href = `detalhes.html?id=${nextId}`;
		}
	}
}
