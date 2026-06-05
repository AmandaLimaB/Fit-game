import * as Phaser from 'phaser';

export class GameOver extends Phaser.Scene
{
    private pontosFinais: number = 0;
    private resultado: string = 'derrota';
    private teclaR!: Phaser.Input.Keyboard.Key;

    constructor ()
    {
        super('GameOver');
    }

    // Recebe os dados de this.scene.start() em Game.ts
    init (data: { pontosFinais: number, resultado: string })
    {
        this.pontosFinais = data.pontosFinais || 0;
        this.resultado = data.resultado || 'derrota';
    }

    create ()
    {
        if (this.resultado === 'vitoria') {
            this.cameras.main.setBackgroundColor('#27ae60');
        } else {
            this.cameras.main.setBackgroundColor('#c0392b');
        }

        const dicionario = this.cache.json.get('traducoes');
        const idiomaAtual = this.registry.get('idioma') || 'pt';

        let tituloTexto;
        if (this.resultado === 'vitoria') {
            tituloTexto = 'Vitória!';
        } else {
            tituloTexto = dicionario[idiomaAtual].gameover_titulo;
        }
        
        this.add.text(512, 250, tituloTexto, {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5);

        // Mostrar a Pontuação Final alcançada
        const labelProteina = dicionario[idiomaAtual].proteina;
        this.add.text(512, 380, labelProteina + this.pontosFinais, {
            fontFamily: 'Arial Black', fontSize: 40, color: '#f1c40f',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5);

        // Instruções de reinício multilíngue
        const instrucaoReiniciar = idiomaAtual === 'pt' ? 'Pressione [ R ] para Treinar Novamente' : 'Press [ R ] to Train Again';
        this.add.text(512, 500, instrucaoReiniciar, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5);

        if (this.input.keyboard) {
            this.teclaR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        }

        this.input.on('pointerdown', () => {
            this.voltarAoMenu();
        });
    }

    update ()
    {
        if (this.teclaR && this.teclaR.isDown) //Teclar R reinicia o jogo
        {
            this.voltarAoMenu();
        }
    }

    private voltarAoMenu()
    {
        this.scene.start('MainMenu');
    }
}