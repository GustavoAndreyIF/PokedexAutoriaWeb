// ========================================
// POKEMON CARD - Classe para representar um Pokemon na home
// ========================================

export class PokemonCard {
	constructor(name, url) {
		this.name = name;
		this.url = url;
		this.id = null;
		this.sprite = null;
		this.types = [];
	}

	// Método para buscar detalhes do Pokemon para o card
	// procura o id(numero da pokedex), sprite(de frente) e tipos
	async fetchDetails() {
		try {
			const response = await fetch(this.url);
			if (!response.ok) {
				throw new Error(`Erro HTTP: ${response.status}`);
			}

			const data = await response.json();

			// Extrair apenas as informações necessárias para o card
			this.id = data.id;
			this.sprite = data.sprites.front_default;
			this.types = data.types.map((typeInfo) => typeInfo.type.name);

			console.log(`✅ Pokemon ${this.name} carregado:`, {
				id: this.id,
				name: this.name,
				sprite: this.sprite,
				types: this.types,
			});

			return this;
		} catch (error) {
			console.error(`❌ Erro ao buscar detalhes do ${this.name}:`, error);
			throw error;
		}
	}

	// Retorna dados formatados para exibição no card
	getCardData() {
		return {
			id: this.id,
			pokedexnumber: this.id ? this.id.toString().padStart(3, "0") : "???",
			name: this.name.charAt(0).toUpperCase() + this.name.slice(1),
			sprite: this.sprite,
			types: this.types.map(
				(type) => type.charAt(0).toUpperCase() + type.slice(1)
			),
		};
	}

	// Método para renderizar o card na home (integrado com front-end)
	renderCard() {
		const cardData = this.getCardData();

		// Log para debug
		console.log(`🎨 RENDERIZANDO CARD - Pokemon #${cardData.pokedexnumber}:`);

		// Verificar se estamos no browser e há um container
		if (typeof document !== "undefined") {
			const pokemonGrid = document.getElementById("pokemon-grid");
			if (pokemonGrid) {
				// Criar HTML do card usando classes do Bootstrap
				const primaryType = cardData.types[0].toLowerCase(); // Primeiro tipo para o fundo
				const cardHTML = `
<div class="col-12 col-md-6 col-lg-3">
	<div
		class="card shadow-sm border-0 rounded-1 position-relative overflow-hidden"
		data-pokemon-id="${cardData.id}"
		style="cursor: pointer; transition: all 0.3s ease; min-height: 120px"
	>
		<!-- Fundo semi-circular baseado no tipo -->
		<div
			class="position-absolute top-0 end-0 h-100"
			style="
				width: 120px;
				background-image: url('img/backgrounds/${primaryType}.png');
				background-size: cover;
				background-position: center;
				border-radius: 100% 0 0 100%;
				opacity: 0.6;
				z-index: 1;
			"
		></div>

		<div
			class="card-body position-relative"
			style="z-index: 2; padding-right: 130px;"
		>
			<!-- Informações principais -->
			<div >
				<!-- Número da Pokédex -->
				<small
					class="badge bg-dark bg-opacity-10 text-muted fw-bold mb-1 d-block"
					style="font-size: 0.7rem; width: fit-content"
				>
					#${cardData.pokedexnumber}
				</small>

				<!-- Nome do Pokémon -->
				<h5
					class="card-title fw-bold mb-1 text-dark"
					style="font-size: 1.2rem; line-height: 1.2"
				>
					${cardData.name}
				</h5>

				<!-- Tipos com ícones -->
				<div class="d-flex flex-wrap">
					${cardData.types
						.map(
							(type) => `<span
						class="badge type-${type.toLowerCase()} text-white px-2 py-1 rounded-pill small d-flex align-items-center gap-1"
						style="font-size: 0.7rem"
					>
						<img
							src="img/icons/${type.toLowerCase()}.png"
							alt="${type}"
							style="width: 14px; height: 14px"
						/>
						${type} </span
					>`
						)
						.join("")}
				</div>
			</div>

			<!-- Sprite do Pokémon -->
			<div class="position-absolute" style="top: 0; right: 0;">
				<img
					src="${cardData.sprite}"
					alt="${cardData.name}"
					style="width: 120px; height: 120px;"
				/>
			</div>
		</div>
	</div>
</div>

				`;

				// Inserir no DOM
				pokemonGrid.innerHTML += cardHTML;

				console.log(`✅ Card inserido no DOM: ${cardData.name}`);
				return cardData;
			}
		}

		// Fallback: log simulado (para debug ou ambientes sem DOM)
		console.log(`
		<!-- Card do ${cardData.name} -->
		<div class="pokemon-card" data-pokemon-id="${cardData.id}">
			<div class="pokemon-number">#${cardData.pokedexnumber}</div>
			<img src="${cardData.sprite}" alt="${cardData.name}" class="pokemon-sprite">
			<h3 class="pokemon-name">${cardData.name}</h3>
			<div class="pokemon-types">
				${cardData.types
					.map(
						(type) => `<span class="type-badge type-${type}">${type}</span>`
					)
					.join("")}
			</div>
		</div>
		`);

		return cardData;
	}
}
