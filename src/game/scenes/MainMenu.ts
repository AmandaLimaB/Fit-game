import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    instrucoes: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.sound.stopAll();
        this.sound.play('som_jogo', { loop: true, volume: 0.3 });
        this.background = this.add.image(512, 384, 'background').setDisplaySize(1024, 768);
        this.logo = this.add.image(512, 220, 'logo');

        // Define idioma padrão
        if (!this.registry.has('idioma')) {
            this.registry.set('idioma', 'pt');
        }

        const dicionario = this.cache.json.get('traducoes');
        const idiomaAtual = this.registry.get('idioma');

        this.title = this.add.text(512, 400, dicionario[idiomaAtual].menu_titulo, {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5);

        this.instrucoes = this.add.text(512, 480, dicionario[idiomaAtual].menu_instrucoes, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5);

        
        this.instrucoes.setInteractive({ useHandCursor: true });
        this.instrucoes.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Botão PORTUGUÊS
        const botaoPT = this.add.text(450, 600, 'PT', {
            fontFamily: 'Arial Black', fontSize: 32, color: idiomaAtual === 'pt' ? '#2ecc71' : '#ffffff',
            backgroundColor: '#2c3e50', padding: { x: 15, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Botão INGLÊS
        const botaoEN = this.add.text(574, 600, 'EN', {
            fontFamily: 'Arial Black', fontSize: 32, color: idiomaAtual === 'en' ? '#2ecc71' : '#ffffff',
            backgroundColor: '#2c3e50', padding: { x: 15, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        botaoPT.on('pointerdown', () => {
            this.registry.set('idioma', 'pt');
            this.scene.restart(); // Reinicia a cena para atualizar os textos
        });

        botaoEN.on('pointerdown', () => {
            this.registry.set('idioma', 'en');
            this.scene.restart();
        });
    }
}