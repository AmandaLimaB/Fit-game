import { Scene } from 'phaser';

export class Game extends Scene
{
    //Declaração de variáveis globais
    private jogador!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private plataformas!: Phaser.Physics.Arcade.StaticGroup;
    private teclas !: Phaser.Types.Input.Keyboard.CursorKeys;

    private proteinas!: Phaser.Physics.Arcade.Group;
    private obstaculos!: Phase.Physics.Arcade.Group;

    private pontuacao: number =0;
    private vidas: number = 3;
    private textoPontuacao!: Phaser.GameObjects.Text;
    private textoVidas!: Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#2c3e50');

        this.pontuacao = 0;
        this.vidas = 3;

        //CRIAÇÃO DO CHÃO E PLATAFORMAS (Static Group)
        this.plataformas = this.physics.add.staticGroup();
        const chãoGrafico = this.make.graphics({ x: 0, y: 0 }).fillStyle(0x27ae60).fillRect(0, 0, 1024, 40);
        chãoGrafico.generateTexture('chão_temp', 1024, 40);
        const platGrafica = this.make.graphics({ x: 0, y: 0 }).fillStyle(0x7f8c8d).fillRect(0, 0, 200, 30); // Blocos cinzentos
        platGrafica.generateTexture('plat_temp', 200, 30);

        this.plataformas.create(512, 748, 'chão_temp');
        this.plataformas.create(300, 550, 'plat_temp');
        this.plataformas.create(724, 420, 'plat_temp');


        //CRIAÇÃO DO JOGADOR - POU (Dynamic Body)
        const pouGrafico = this.make.graphics({ x: 0, y: 0 }).fillStyle(0xe67e22).fillCircle(25, 25, 25);
        pouGrafico.generateTexture('pou_temp', 50, 50);
        this.jogador = this.physics.add.sprite(512, 100, 'pou_temp');
        this.jogador.setCollideWorldBounds(true); // Impede o Pou de sair pelas bordas do ecrã
        this.jogador.setBounce(0.1); // Salto ao bater no chão

        //SISTEMA DE COLISÕES (Física Arcade)
        this.physics.add.collider(this.jogador, this.plataformas);
      
        // ATIVAÇÃO DOS BOTÕES DO TECLADO (Input)
        if (this.input.keyboard) {
            this.teclas = this.input.keyboard.createCursorKeys();
        }
        
        //TEXTURAS PARA PROTEÍNAS E OBSTÁCULOS
        const proteinaGrafica = this.make.graphics({ x: 0, y: 0 }).fillStyle(0x3498db).fillCircle(15, 15, 15);
        proteinaGrafica.generateTexture('proteina_temp', 30, 30);
        const obstaculoGrafico = this.make.graphics({ x: 0, y: 0 }).fillStyle(0xe74c3c).fillRect(0, 0, 30, 30);
        obstaculoGrafico.generateTexture('obstaculo_temp', 30, 30);

        // Armazenar os objetos na memória
        this.proteinas = this.physics.add.group();
        this.obstaculos = this.physics.add.group();

        // Colisão de proteinas e obstáculos com as plataformas
        this.physics.add.collider(this.proteinas, this.plataformas);
        this.physics.add.collider(this.obstaculos, this.plataformas);

    }

    //O método update corre 60 vezes por segundo a ler as teclas
    update ()
    {
        // Se as teclas não foram configuradas por segurança, não faz nada
        if (!this.teclas || !this.jogador) return;

        // Movimento horizontal
        if (this.teclas.left.isDown)
        {
            this.jogador.setVelocityX(-300);
        }
        else if (this.teclas.right.isDown)
        {
            this.jogador.setVelocityX(300);
        }
        else
        {
            
            this.jogador.setVelocityX(0); //Se não carregar nada, o Pou fica parado horizontalmente
        }

        // Movimento vertical
        if (this.teclas.space.isDown && this.jogador.body.touching.down)
        {
            this.jogador.setVelocityY(-450); //Velocidade negativa, Pou sobe
        }

    }
}
