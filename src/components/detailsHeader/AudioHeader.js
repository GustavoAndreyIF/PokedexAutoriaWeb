// ============================================================================
// POKEMON DETAILS HEADER - MÓDULO DE ÁUDIO
// ============================================================================

import { DOMUtils } from "../../utils/index.js";

/**
 * Módulo responsável pelo controle de áudio e reprodução de cries
 *
 * Este módulo contém:
 * - Reprodução de cries do Pokémon
 * - Controle de indicadores visuais de áudio
 * - Gerenciamento de estado de reprodução
 * - Animações do sprite durante reprodução
 *
 * @module AudioHeader
 * @author Projeto Pokédex
 * @version 1.0.0
 */

/**
 * Classe para gerenciar áudio do PokemonDetailsHeader
 */
export class AudioHeader {
	/**
	 * Exibe o indicador visual de reprodução de áudio
	 *
	 * Ativa a animação do indicador quando o áudio do cry está sendo reproduzido.
	 * O indicador fornece feedback visual ao usuário sobre o estado do áudio.
	 *
	 * @param {Object} data - Dados do Pokémon atual
	 * @returns {void}
	 *
	 * @example
	 * // Ao clicar no botão de play do cry:
	 * AudioHeader.showAudioIndicator(this.data); // Mostra animação de ondas sonoras
	 */
	static showAudioIndicator(data) {
		const audioIndicator = DOMUtils.findElement("audio-indicator");

		if (audioIndicator && data) {
			audioIndicator.style.opacity = "1";
		}
	}

	/**
	 * Oculta o indicador visual de reprodução de áudio
	 *
	 * Remove a animação do indicador quando o áudio termina ou é pausado.
	 * Restaura o estado visual padrão da interface.
	 *
	 * @param {boolean} isPlayingAudio - Estado atual do áudio
	 * @returns {void}
	 *
	 * @example
	 * // Quando o áudio termina ou é pausado:
	 * AudioHeader.hideAudioIndicator(false); // Remove animação
	 */
	static hideAudioIndicator(isPlayingAudio) {
		const audioIndicator = DOMUtils.findElement("audio-indicator");
		if (audioIndicator) {
			// Esconder com transição
			audioIndicator.style.opacity = "0";
			audioIndicator.style.transform = "translate(50%, -50%) scale(1)";

			// Esconder completamente após a transição
			setTimeout(() => {
				if (audioIndicator && !isPlayingAudio) {
					audioIndicator.style.display = "none";
				}
			}, 300);
		}
	}

	/**
	 * Reproduz o áudio do cry do Pokémon com controle de estado
	 *
	 * Gerencia a reprodução do som característico do Pokémon:
	 * - Previne reproduções sobrepostas
	 * - Controla indicadores visuais (sprite e audio indicator)
	 * - Gerencia estados de loading e erro
	 * - Limpa recursos automaticamente
	 *
	 * Fluxo de execução:
	 * 1. Verifica se já está tocando (previne sobreposição)
	 * 2. Valida disponibilidade de áudio
	 * 3. Ativa indicadores visuais
	 * 4. Cria e reproduz elemento HTML5 Audio
	 * 5. Limpa estado ao finalizar/falhar
	 *
	 * @param {Object} context - Contexto do PokemonDetailsHeader contendo:
	 *   - isPlayingAudio: estado atual do áudio
	 *   - audioUrl: URL do arquivo de áudio
	 *   - data: dados do Pokémon
	 * @param {Function} updateIsPlayingAudio - Função para atualizar o estado isPlayingAudio
	 * @returns {Promise<boolean>} true se reproduziu com sucesso, false caso contrário
	 * @throws {Error} Em caso de falha na reprodução
	 *
	 * @example
	 * // Ao clicar no sprite do Pokémon:
	 * const success = await AudioHeader.playPokemonCry({
	 *   isPlayingAudio: this.isPlayingAudio,
	 *   audioUrl: this.audioUrl,
	 *   data: this.data
	 * }, (newState) => { this.isPlayingAudio = newState; });
	 * if (success) console.log('Cry reproduzido!');
	 */
	static async playPokemonCry(context, updateIsPlayingAudio) {
		// Verificar se áudio já está tocando
		if (context.isPlayingAudio) {
			console.log(
				`🔊 Áudio de ${context.data.name} já está tocando, ignorando nova tentativa`
			);
			return false;
		}

		if (!context.audioUrl) {
			console.log(`🔇 Nenhum áudio disponível para ${context.data.name}`);
			return false;
		}

		const sprite = DOMUtils.findElement("pokemon-main-sprite");

		try {
			// Marcar como tocando ANTES de mostrar o indicator
			updateIsPlayingAudio(true);
			console.log(`🔊 Tocando áudio de ${context.data.name}:`, context.audioUrl);

			// Mostrar indicador visual imediatamente
			AudioHeader.showAudioIndicator(context.data);

			// Adicionar classe de áudio tocando no sprite
			if (sprite) {
				sprite.classList.add("audio-playing");
			}

			// Criar e tocar áudio
			const audio = new Audio(context.audioUrl);
			audio.volume = 0.6; // Volume moderado

			// Promise para aguardar o áudio terminar
			await new Promise((resolve, reject) => {
				audio.onended = () => {
					console.log(`✅ Áudio de ${context.data.name} finalizado`);

					// Marcar como não tocando ANTES de esconder
					updateIsPlayingAudio(false);

					// Esconder indicador imediatamente quando áudio termina
					AudioHeader.hideAudioIndicator(false);

					// Remover classe de áudio tocando do sprite
					if (sprite) {
						sprite.classList.remove("audio-playing");
					}

					resolve();
				};

				audio.onerror = (error) => {
					console.error(
						`❌ Erro ao tocar áudio de ${context.data.name}:`,
						error
					);

					// Marcar como não tocando ANTES de esconder
					updateIsPlayingAudio(false);

					// Esconder indicador em caso de erro
					AudioHeader.hideAudioIndicator(false);

					// Remover classe de áudio tocando do sprite
					if (sprite) {
						sprite.classList.remove("audio-playing");
					}

					reject(error);
				};

				// Iniciar reprodução
				audio.play().catch(reject);
			});

			return true;
		} catch (error) {
			console.error(
				`❌ Erro ao reproduzir áudio de ${context.data.name}:`,
				error
			);

			// Limpar estados em caso de erro
			updateIsPlayingAudio(false);
			AudioHeader.hideAudioIndicator(false);

			if (sprite) {
				sprite.classList.remove("audio-playing");
			}

			return false;
		}
	}
}
