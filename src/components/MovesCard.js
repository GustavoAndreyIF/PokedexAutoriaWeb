/*
* Componente do Card dos moves que renderizaram na página de details.
*
*/

import { TextFormatter, PokemonTypes, DOMUtils } from "../utils/index.js";

class MovesCard {
    /** 
    * Construtor do Card
    * @param {object} MovesData - Dados do Moves
    */
    constructor(MovesData) {
        this.MovesData = MovesData;
        this.element = null;
    }

    render() {
        const {id, name, accuracy, damage_class, type, power} = this.MovesData
        /* 
        TODO
        Implementar a processdata do MovesData, a princípio pegar apenas estes dados para os cards no details
        */
        return ``;     
    }

    mount() {

    }
}