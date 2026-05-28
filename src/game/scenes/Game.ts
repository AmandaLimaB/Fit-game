import { Scene } from 'phaser';

export class Game extends Scene
{
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
    }

    update ()
    {

    }
}
