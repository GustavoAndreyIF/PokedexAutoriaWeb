// ============================================================================
// POKEMON DETAILS HEADER - MÓDULO DE TOOLTIPS
// ============================================================================

/**
 * Módulo responsável pela inicialização e configuração de tooltips
 *
 * Este módulo contém:
 * - Inicialização de tooltips do Bootstrap
 * - Configurações customizadas por tipo de elemento
 * - Styling dinâmico baseado no tipo do Pokémon
 * - Controle de delay e animações
 *
 * @module TooltipsHeader
 * @author Projeto Pokédex
 * @version 1.0.0
 */

/**
 * Classe para gerenciar tooltips do PokemonDetailsHeader
 */
export class TooltipsHeader {
	/**
	 * Inicializa os tooltips do Bootstrap com configuração customizada
	 *
	 * Configura tooltips para elementos interativos do header:
	 * - Botões de navegação (anterior/próximo)
	 * - Botões de ação (voltar, áudio)
	 * - Cards de habilidades
	 *
	 * Configurações aplicadas:
	 * - Delay de 300ms para entrada/saída
	 * - Posicionamento automático inteligente
	 * - Styling dinâmico baseado no tipo do Pokémon
	 *
	 * @returns {void}
	 *
	 * @example
	 * // Chamado automaticamente após render():
	 * const tooltips = new TooltipsHeader();
	 * tooltips.initialize(); // Ativa tooltips em botões
	 */
	static initialize() {
		// Aguardar um pequeno delay para garantir que o DOM foi renderizado
		setTimeout(() => {
			// Selecionar todos os elementos com data-bs-toggle="tooltip"
			const tooltipTriggerList = document.querySelectorAll(
				'[data-bs-toggle="tooltip"]'
			);

			// Inicializar tooltips do Bootstrap
			const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => {
				return new bootstrap.Tooltip(tooltipTriggerEl, {
					// Configurações customizadas
					delay: { show: 300, hide: 100 },
					animation: true,
					html: false,
				});
			});

			console.log(`✅ ${tooltipList.length} tooltips inicializados no header`);
		}, 100);
	}
}
