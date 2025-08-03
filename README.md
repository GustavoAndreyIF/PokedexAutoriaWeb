<h1 align="center">Pokédex</h1>

<div align="center">

<a href="https://opensource.org/license/mit"><img alt="licence" src="https://img.shields.io/badge/License-MIT-red.svg"></a>

</div>

⚡ Aplicação web front-end desenvolvida com a PokeApi para a disciplina de Autoria Web do 3º ano do Ensino Médio Técnico em Informática (turma da manhã), com o objetivo de aplicar os conhecimentos adquiridos em Bootstrap.

<h2 align="center">App Preview</h2>

|      ![Home Preview](src/assets/images/preview/home.png)      | ![Details Preview](src/assets/images/preview/details.png) |
| :-----------------------------------------------------------: | :-------------------------------------------------------: |
| ![Evolution Preview](src/assets/images/preview/evolution.png) |   ![Modal Preview](src/assets/images/preview/modal.png)   |

<h2 align="center">PokeAPI</h2>
<div align="center">

<img src="src/assets/images/pokeapi.png">
<br>
<a href="https://pokeapi.co/" style="margin-top: 8px;">
  <img src="https://img.shields.io/badge/PokeAPI-REST%20API-3773a1?logo=pokemon&logoColor=white&style=for-the-badge" alt="PokeAPI Badge" />
</a>
</div>

💾 Esta aplicação consome a API RESTful da [**PokeAPI**](https://pokeapi.co/) para buscar dados de Pokémon. A PokeAPI fornece objetos detalhados que facilitam a construção de aplicações temáticas de pokémon, especialmente Pokédex.

<h2 align="center">Paginas</h2>
📺 Diagrama ilustrando o fluxo de navegação entre as principais páginas do projeto:
<div align="center">
  <img src="src/assets/images/diagrama.svg" alt="Diagrama de fluxo de páginas" width="500" />
</div>

<h3 align="center">Move Details Tab</h3>
⚡ Componente responsável por exibir os detalhes completos de um movimento (golpe) do Pokémon, incluindo atributos, efeitos e descrição visual.
<div align="center">
  <img src="src/assets/images/pages/moveDetails.png" alt="Move Details Tab Preview" width="500" />
</div>

```html
<div id="move-main-container">
	<div class="d-md-flex container mt-3">
		<div class="card border-0 mb-3 move-details-card">
			<div class="card-body">
				<h2 class="text-capitalize">Thunderbolt</h2>
				<h4 class="text-capitalize">Dados do Movimento</h4>
				<hr />
				<div class="d-flex align-items-end justify-content-between mb-3">
					<div><h5 class="card-text">Power:</h5></div>
					<h4 class="card-text">90</h4>
				</div>
				<hr />
				<div class="d-flex align-items-end justify-content-between mb-3">
					<div><h5 class="card-text">PP:</h5></div>
					<h4 class="card-text">15</h4>
				</div>
				<hr />
				<div class="d-flex align-items-end justify-content-between mb-3">
					<div><h5 class="card-text">Type:</h5></div>
					<span
						class="badge text-white pokemon-type-badge px-2 px-md-3 py-2 rounded-pill d-flex align-items-center"
						style="background-color: #F8D030;"
					>
						<img
							src="img/icons/electric.png"
							class="pokemon-type-badge__icon"
						/>
						Electric
					</span>
				</div>
				<hr />
				<div class="d-flex align-items-end justify-content-between mb-3">
					<div><h5 class="card-text">Category:</h5></div>
					<h4 class="card-text">special</h4>
				</div>
				<hr />
				<div class="d-flex align-items-end justify-content-between mb-1">
					<div><h5 class="card-text">Accuracy:</h5></div>
					<h5
						class="card-text px-2 py-1 rounded text-light"
						style="background-color: #F8D030"
					>
						100
					</h5>
				</div>
				<div
					class="progress stats-progress"
					style="height: 8px; border-radius: 4px;"
				>
					<div
						class="progress-bar stats-progress-bar stats-progress-bar--electric"
						style="width: 100%; background-color: #F8D030;"
					></div>
				</div>
			</div>
		</div>
		<div class="card border-0 mb-3 move-details-card-2">
			<div class="card-body">
				<div class="flavor-move-text p-2 mb-5 mb-md-2 text-center">
					<p class="card-text">
						<i>"Um ataque elétrico poderoso que pode paralisar o alvo."</i>
					</p>
				</div>
				<h4 class="card-text">Efeitos</h4>
				<hr />
				<p class="card-text"><i>"Pode paralisar o oponente."</i></p>
			</div>
		</div>
	</div>
</div>
```

> [!NOTE] > **Comentários do Dev**
>
> "Fazer o moveDetails em si não foi complicado, obviamente já que eu utilizei o auxílio do Copilot, mas a problemática era no geral, integrar a página à todo resto do site o que seria bem trabalhoso. O detalhe de um movimento é referenciado na TAB de movimentos que um pokemon pode aprender, devido a arquitetura REST da api utilizada, isso foi bem tranquilo de fazer. Feito isso, a segunda parte foi montar os componentes dinamicamente, o moveDetailsHeader é uma reciclagem do header da Home, porém utiliza do Type do move referenciado para alterar a cor dinâmicamente, cada paleta de cores foi salva em variáveis CSS que foram então foram exportadas. Por fim, o moveDetailMain contém os detalhes mais essenciais dos movimentos, como PP, Poder, precisão e etc, apenas incluindo um flavor text e o efeito do movimento, todos carregados dinamicamente."
>
> — [Leonardo1234321](https://github.com/Leonardo1234321)

<h2 align="center">Componentes</h2>
🧱 Conheça os principais componentes reutilizáveis da nossa aplicação, apresentados com exemplos de HTML simples e prático.

<h3 align="center">Evolution Tab</h3>
🧬 Componente responsável por exibir de forma visual e intuitiva as possíveis evoluções de cada Pokémon.
<div align="center">
  <img src="src/assets/images/components/evolutionTab.png" alt="Evolution Tab Preview" width="500" />
</div>

```html
<h5 class="fw-semibold mb-3 stats-title">
	<i class="bi bi-arrow-repeat me-2"></i>Evolution
</h5>
<div class="row justify-content-center">
	<div class="col-12 col-md-4 d-flex justify-content-center mb-4">
		<a
			href="detalhes.html?id=26"
			class="text-decoration-none w-100"
			style="max-width: 260px; padding-top: 1rem;"
		>
			<div class="pokemon-card text-center p-3">
				<img
					width="140"
					src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png"
					class="img-fluid"
				/>
				<h6 class="mt-2">Raichu <span class="text-muted">#26</span></h6>
			</div>
			<h6 class="mt-2 text-center" style="font-size: 0.9rem; color: #6c757d;">
				Triggered by Thunder Stone
			</h6>
		</a>
	</div>

	<h5 class="fw-semibold mb-3 mt-4">
		<i class="bi bi-arrow-left-circle me-2"></i>Evolves from:
	</h5>

	<div>
		<a
			href="detalhes.html?id=$172"
			class="text-decoration-none w-100"
			style="max-width: 260px; padding-top: 1rem;"
		>
			<div class="pokemon-card text-center p-3">
				<img
					width="140"
					src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/172.png"
					alt="Pichu"
					class="img-fluid"
				/>
				<h6 class="mt-2">Pichu <span class="text-muted">#172</span></h6>
			</div>
		</a>
	</div>
</div>
```

> [!NOTE] > **Comentários do Dev**
>
> "Primeiro, decidi como organizar as possível evoluções, escolhi estruturar em cards que podem te levar à página de detalhes da evolução. O código usa o id do pokémon que vemos para acessar sua api e procurar a chave 'evolution_chain' e sua url. A partir da cadeia evolutiva, determinei onde está o pokémon atual para listar os próximos e o anterior, caso o pokémon em si seja uma evolução. A parte mais interessante do código é o looping de acessar a chave 'evolves_to' e comparar o nome da espécie para saber em que estágio estamos."
>
> — [TrojanN63](https://github.com/TrojanN63)

<h2 align="center">Contribuição</h2>
👥 Esse projeto não seria possível sem os seguintes amigos feitos pelo caminho <3

<div align="center">

| <a href="https://github.com/GustavoAndreyIF"><img src="https://github.com/GustavoAndreyIF.png" width="60" style="border-radius:50%"><br><b>GustavoAndreyIF</b></a> | <a href="https://github.com/TrojanN63"><img src="https://github.com/TrojanN63.png" width="60" style="border-radius:50%"><br><b>TrojanN63</b></a> | <a href="https://github.com/Leonardo1234321"><img src="https://github.com/Leonardo1234321.png" width="60" style="border-radius:50%"><br><b>Leonardo1234321</b></a> |
| :----------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |

</div>

<h3 align="center">Comentarios dos Devs</h3>


> [!NOTE] > **Comentários do Dev**
>
> "Fora a aba de evoluções, fiz a de variantes —a princípio, funciona igual— e alguns detalhes de decoração: separar os icons de cada tipo e fazer o gif de background que originalmente era uma imagem parada, mas com o uso da linguagem python e das bibliotecas opencv e pillow, salvei várias versões cortadas da imagem em partes diferentes e salvei na forma de gif, aparentando a movimentação."
>
> — [TrojanN63](https://github.com/TrojanN63)