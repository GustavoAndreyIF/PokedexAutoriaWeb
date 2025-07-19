# 🎨 Guia de Design - Imagens da Pokédex

Este documento contém todas as especificações para criação das imagens de fundo e ícones dos tipos de Pokémon.

## 📁 Estrutura de Pastas

```
img/
├── icons/          # Ícones dos tipos (16x16px)
├── backgrounds/    # Fundos dos cards (140x140px)
├── fire.png       ✅ # Legado - será movido para backgrounds/
├── water.png      ✅ # Legado - será movido para backgrounds/
└── grass.png      ✅ # Legado - será movido para backgrounds/
```

## 🎯 Especificações de Design

### 🔹 **Ícones dos Tipos** (`img/icons/`)

-   **Tamanho**: 16x16 pixels (quadrados)
-   **Formato**: PNG com transparência
-   **Estilo**: Ícones minimalistas e reconhecíveis
-   **Fundo**: Transparente
-   **Uso**: Dentro dos badges dos tipos nos cards

### 🔸 **Fundos dos Cards** (`img/backgrounds/` ou raiz `img/`)

-   **Tamanho**: 140x140 pixels (quadrados)
-   **Formato**: PNG
-   **Estilo**: Gradientes radiais ou padrões sutis
-   **Opacidade**: Será aplicada 0.6 via CSS
-   **Posição**: Canto superior direito dos cards
-   **Forma**: Será cortada em semicírculo (100% 0 0 100%)

## 🌈 Lista Completa de Tipos e Cores Oficiais

| Tipo         | Cor Principal | Cor Secundária | Ícone Sugerido   | Status      |
| ------------ | ------------- | -------------- | ---------------- | ----------- |
| **Normal**   | `#A8A878`     | `#C6C6A7`      | Círculo simples  | ❌ Pendente |
| **Fire**     | `#F08030`     | `#FFCC33`      | Chama            | ✅ Completo |
| **Water**    | `#6890F0`     | `#9DB7F5`      | Gota d'água      | ✅ Completo |
| **Electric** | `#F8D030`     | `#F5DD5B`      | Raio             | ❌ Pendente |
| **Grass**    | `#78C850`     | `#A7DB8D`      | Folha            | ✅ Completo |
| **Ice**      | `#98D8D8`     | `#BCE6E6`      | Cristal de gelo  | ❌ Pendente |
| **Fighting** | `#C03028`     | `#D67873`      | Punho            | ❌ Pendente |
| **Poison**   | `#A040A0`     | `#C183C1`      | Gota venenosa    | ❌ Pendente |
| **Ground**   | `#E0C068`     | `#EBD69D`      | Montanha/Terra   | ❌ Pendente |
| **Flying**   | `#A890F0`     | `#C6B7F5`      | Asa/Pena         | ❌ Pendente |
| **Psychic**  | `#F85888`     | `#FA92B2`      | Olho/Mente       | ❌ Pendente |
| **Bug**      | `#A8B820`     | `#C6D16E`      | Inseto/Antena    | ❌ Pendente |
| **Rock**     | `#B8A038`     | `#D1C17D`      | Pedra/Rocha      | ❌ Pendente |
| **Ghost**    | `#705898`     | `#A292BC`      | Fantasma         | ❌ Pendente |
| **Dragon**   | `#7038F8`     | `#A27DFA`      | Dragão/Escama    | ❌ Pendente |
| **Dark**     | `#705848`     | `#A29288`      | Lua/Sombra       | ❌ Pendente |
| **Steel**    | `#B8B8D0`     | `#D1D1E0`      | Engrenagem/Metal | ❌ Pendente |
| **Fairy**    | `#EE99AC`     | `#F4BDC9`      | Estrela/Sparkle  | ❌ Pendente |

## 📐 Instruções de Criação

### Para Ícones (16x16px):

1. **Base**: Canvas quadrado 16x16px
2. **Margem**: 1-2px de margem interna
3. **Traço**: Linhas de 1-2px de espessura
4. **Cores**: Use a cor principal do tipo
5. **Simplicidade**: Máximo 3 elementos visuais
6. **Teste**: Visualize em 14x14px (tamanho de uso real)

### Para Fundos (140x140px):

1. **Base**: Canvas quadrado 140x140px
2. **Gradiente**: Radial do centro para as bordas
3. **Cor primária**: Centro (100% opacidade)
4. **Cor secundária**: Bordas (70% opacidade)
5. **Padrão**: Elementos sutis relacionados ao tipo
6. **Teste**: Aplique opacidade 0.6 e semicírculo

## 🔄 Nomenclatura de Arquivos

### Ícones:

```
img/icons/normal.png
img/icons/fire.png
img/icons/water.png
img/icons/electric.png
img/icons/grass.png
img/icons/ice.png
img/icons/fighting.png
img/icons/poison.png
img/icons/ground.png
img/icons/flying.png
img/icons/psychic.png
img/icons/bug.png
img/icons/rock.png
img/icons/ghost.png
img/icons/dragon.png
img/icons/dark.png
img/icons/steel.png
img/icons/fairy.png
```

### Fundos:

```
img/normal.png
img/fire.png      ✅ (existe)
img/water.png     ✅ (existe)
img/electric.png
img/grass.png     ✅ (existe)
img/ice.png
img/fighting.png
img/poison.png
img/ground.png
img/flying.png
img/psychic.png
img/bug.png
img/rock.png
img/ghost.png
img/dragon.png
img/dark.png
img/steel.png
img/fairy.png
```

## 🎨 Exemplos de Estilos

### Fire (Fogo):

-   **Fundo**: Gradiente laranja-vermelho com padrão de chamas
-   **Ícone**: Chama estilizada simples

### Water (Água):

-   **Fundo**: Gradiente azul com padrão de ondas ou bolhas
-   **Ícone**: Gota d'água clean

### Grass (Grama):

-   **Fundo**: Gradiente verde com padrão de folhas
-   **Ícone**: Folha minimalista

## 🔧 Integração no Código

O sistema carrega automaticamente:

```javascript
// Fundo do card
background-image: url('img/${primaryType}.png')

// Ícone do badge
<img src="img/icons/${type}.png" alt="${type}" />
```

## ✅ Checklist de Entrega

### Ícones (18 arquivos):

-   [ ] normal.png
-   [ ] fire.png
-   [ ] water.png
-   [ ] electric.png
-   [ ] grass.png
-   [ ] ice.png
-   [ ] fighting.png
-   [ ] poison.png
-   [ ] ground.png
-   [ ] flying.png
-   [ ] psychic.png
-   [ ] bug.png
-   [ ] rock.png
-   [ ] ghost.png
-   [ ] dragon.png
-   [ ] dark.png
-   [ ] steel.png
-   [ ] fairy.png

### Fundos (15 arquivos novos):

-   [ ] normal.png
-   [ ] electric.png
-   [ ] ice.png
-   [ ] fighting.png
-   [ ] poison.png
-   [ ] ground.png
-   [ ] flying.png
-   [ ] psychic.png
-   [ ] bug.png
-   [ ] rock.png
-   [ ] ghost.png
-   [ ] dragon.png
-   [ ] dark.png
-   [ ] steel.png
-   [ ] fairy.png

**Total**: 33 arquivos para criar um sistema visual completo!
