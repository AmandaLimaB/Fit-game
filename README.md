# FitGame: Academia de Cristal (Maromba Jump)

### Autores
* **Amanda Lima Bezerra** – Nº 37174
* **Felipe Amorim do Carmo Silva** – Nº 37172

### Especificações Técnicas e Versões
* **Motor de Jogo:** Phaser 3 (Versão 3.85+)
* **Bundler & Servidor Local:** Vite 6.3.1
* **Linguagem:** TypeScript 5.7.2
* **Inclusão do Motor:** Gerenciado via npm (instalação de dependências locais).

---

## 🎮 Descrição do Jogo e Objetivo
**FitGame** é um jogo de plataforma vertical infinita (*Endless Vertical Platformer*) focado em agilidade e desvio de obstáculos. O jogador controla um personagem determinado ("Maromba") que treina subindo as plataformas da Academia de Cristal. 

O objetivo principal é coletar suplementos para evoluir o shape, sobrevivendo aos perigos que caem do teto. O jogo termina em **Vitória** se o jogador alcançar a meta de pontuação ou em **Game Over** se esgotar sua energia ou cair no abismo.

### Regras do Jogo
1. **Estado Inicial:** O jogador inicia a partida com 3 pontos de Energia (Vidas) e 0 pontos de Proteína.
2. **Sistema de Dano:** Halteres e pesos de academia caem continuamente do topo do ecrã. Tocar em um desses obstáculos reduz 1 ponto de Energia.
3. **Sistema de Pontuação:** Potes de Whey Protein surgem aleatoriamente sobre as plataformas. Coletar cada pote garante **+100 pontos de Proteína**.
4. **Condição de Vitória:** Alcançar a marca de **1000 pontos de Proteína**.
5. **Condição de Derrota:** Perder todos os 3 pontos de Energia ou cair abaixo do limite inferior da câmara (abismo).

---

## 🕹️ Jogabilidade e Controlos
O ciclo de movimentação e física do jogo foi projetado para ser intuitivo e responsivo:
* **Setas Direcionais (Esquerda / Direita):** Controlam a movimentação horizontal do personagem.
* **Pulo Automático:** O impulso vertical é acionado automaticamente pela física do jogo sempre que o personagem colide de cima para baixo com o topo de uma plataforma, criando uma dinâmica contínua de escalada.
* **Mecânica de Tela Infinita (Wrap):** Se o jogador ultrapassar o limite esquerdo do ecrã, reaparece no limite direito e vice-versa, permitindo criar estratégias de fuga e alcance.

---

## 🛠️ Arquitetura do Código e Cenas
O projeto foi estruturado utilizando o conceito de máquinas de estado orientadas por cenas independentes do Phaser 3, garantindo modularidade e eliminando duplicações de código:
1. **Boot:** Configurações iniciais do motor, escala de ecrã e carregamento de assets essenciais de transição.
2. **Preloader:** Carregamento centralizado de mídia (áudio e imagem), monitorado por uma barra de progresso visual dinamicamente calculada.
3. **MainMenu:** Tela inicial contendo a logo do projeto, instruções de jogabilidade, inicialização da trilha sonora e o seletor global de idiomas.
4. **Game:** Cena principal onde roda a lógica de física Arcade, temporizadores de spawn, movimentação de câmara contínua, colisão/overlap e cálculo de pontuação.
5. **GameOver:** Tela de encerramento que recebe parâmetros da cena de jogo. Adapta o visual dinamicamente para **Verde (Vitória)** ou **Vermelho (Derrota)** e possibilita o reinício rápido através da tecla **[ R ]** ou clique no ecrã.

---

## 🌐 Suporte Multilíngue (i18n)
O jogo possui suporte total nativo para 2 idiomas: **Português (PT)** e **Inglês (EN)**.
* **Implementação:** Toda a interface de texto do usuário (UI) é renderizada a partir de uma estrutura externa centralizada em um arquivo de tradução JSON (`idiomas.json`), eliminando completamente textos fixos (*strings hardcoded*) no código.
* **Seletor:** Disponível diretamente na interface do Menu Principal através de botões interativos que alternam o registro global de idioma e atualizam a interface instantaneamente.

---

## 🔊 Aspectos Multimédia e Otimização
Todos os recursos de mídia foram selecionados e tratados seguindo critérios rigorosos de desempenho e coerência estética:

### Formatos e Resoluções
* **Imagens e Sprites:** Armazenadas em formato `.png` com canais de transparência otimizados. A resolução das sprites (como plataformas e itens) foi ajustada proporcionalmente ao tamanho de exibição final em tela (ex: spritesheets e elementos redimensionados para blocos de 50px), evitando o uso de imagens sobredimensionadas na memória de texturas da GPU.
* **Áudio:** Foram utilizados arquivos comprimidos em formato `.wav` para efeitos de curta duração por razões de latência zero no disparo da física, e músicas de fundo tratadas para garantir um carregamento rápido e leve.

### Origem e Justificativa dos Assets
* **Origem:** Assets visuais e sonoros obtidos de plataformas de domínio público e licença open-source (Kenney.nl e OpenGameArt).
* **Justificativa:** Os efeitos sonoros (impacto ao bater no peso, som de clique ao coletar o Whey e efeito de mola ao pular) dão o feedback auditivo essencial para as mecânicas. A separação das músicas de fundo (uma melodia de entrada suave para o Menu e uma trilha rítmica acelerada para o Game) reforça a imersão e a mudança de atmosfera entre a preparação e a ação do jogo.
* **Controle de Peso:** O pacote total de assets do projeto ocupa menos de 5 MB, cumprindo com folga o teto estipulado de desempenho do motor, garantindo carregamento instantâneo no browser. Todos os arquivos não utilizados foram removidos do repositório.

---

## 🚀 Como Executar o Projeto Localmente

O jogo precisa ser executado por meio de um servidor HTTP local válido para que o Phaser consiga carregar os assets externos sem bloqueios de segurança do navegador.

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.
2. Abra o terminal na pasta raiz do projeto e instale as dependências executando:
```bash
   npm install
   npm run dev
