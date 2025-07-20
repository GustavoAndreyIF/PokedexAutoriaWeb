export class MovesManager {
  constructor(pokemonId) {
    this.pokemonId = pokemonId;
    this.moves = [];
	this.baseUrl = "https://pokeapi.co/api/v2/pokemon";
  }

  async fetchMovesFromPokemon() {
    try {
      const url = `${this.baseUrl}/${this.pokemonId}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      let data = await response.json();
      this.moves = data.moves;

      return this;
    }
    catch (error) {
      console.error(`❌ Erro ao buscar movimentos do Pokemon ${this.pokemonId}:`, error);
      throw error;
    }
  }

  renderMoves() {
    if (this.moves.length === 0) {
      console.log("❌ Nenhum movimento encontrado para este Pokemon.");
      return;
    }
    const movesList = document.getElementById("moves-list");
    movesList.innerHTML = ""; // Limpa a lista antes de renderizar
    this.moves.forEach(moveData => {
        //implementa os cards dos movimentos
    })
  }

  getMoves() {
    return this.moves;
  }
}
