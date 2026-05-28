import { Scene } from 'phaser';

export class Game extends Scene
{
    // 1. Declaração de variáveis globais
    private jogador!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private plataformas!: Phaser.Physics.Arcade.StaticGroup;
    private teclas !: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // Limpar a cor de fundo para um cinzento de ginásio
        this.cameras.main.setBackgroundColor('#2c3e50');

        //==========================================
        // 2. CRIAÇÃO DO CHÃO E PLATAFORMAS (Static Group)

        // Objetos que não saem do sítio e servem de barreira
        this.plataformas = this.physics.add.staticGroup();

        // Vamos criar uma textura temporária para o chão por código (um bloco verde)
        // createRectangle(x, y, largura, altura, cor)
        const chãoGrafico = this.make.graphics({ x: 0, y: 0 }).fillStyle(0x27ae60).fillRect(0, 0, 1024, 40);
        chãoGrafico.generateTexture('chão_temp', 1024, 40);

        // Blocos cinzentos como caixas de Crossfit
        const platGrafica = this.make.graphics({ x: 0, y: 0 }).fillStyle(0x7f8c8d).fillRect(0, 0, 200, 30);
        platGrafica.generateTexture('plat_temp', 200, 30);

        // Posicionar o Chão principal no fundo do ecrã (X: 512 [meio], Y: 748 [perto do fundo])
        this.plataformas.create(512, 748, 'chão_temp');

        // Posicionar duas plataformas aéreas para o Pou poder subir e saltar
        this.plataformas.create(300, 550, 'plat_temp');
        this.plataformas.create(724, 420, 'plat_temp');

        //==========================================
        // 3. CRIAÇÃO DO JOGADOR - POU (Dynamic Body)

        // Textura circular laranja temporária para fingir que é o Pou
        const pouGrafico = this.make.graphics({ x: 0, y: 0 }).fillStyle(0xe67e22).fillCircle(25, 25, 25);
        pouGrafico.generateTexture('pou_temp', 50, 50);

        // Instanciar o jogador com física dinâmica (sofre gravidade)
        this.jogador = this.physics.add.sprite(512, 100, 'pou_temp');

        // Configurações físicas do Pou
        this.jogador.setCollideWorldBounds(true); // Impede o Pou de sair pelas bordas do ecrã
        this.jogador.setBounce(0.1); // Dá um minúsculo saltinho ao bater no chão, sem parecer uma bola de basquete

        // ==========================================
        // 4. SISTEMA DE COLISÕES (Física Arcade)

        // Fazer o jogador colidir com um grupo de plataformas
        this.physics.add.collider(this.jogador, this.plataformas);

        // ==========================================
        // 5. ATIVAÇÃO DOS CONTROLOS (Input)

        // Ativar as Setas do Teclado (Cima, Baixo, Esquerda, Direita) + a Barra de Espaço
        if (this.input.keyboard) {
            this.teclas = this.input.keyboard.createCursorKeys();
        }
    }

    update ()
    {

    }
}
