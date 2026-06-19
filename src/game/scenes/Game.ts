import * as Phaser from 'phaser';
import { Scene } from 'phaser';

export class Game extends Scene
{
    // Declaração de variáveis globais
    private jogador!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private plataformas!: Phaser.Physics.Arcade.StaticGroup;
    private teclas!: Phaser.Types.Input.Keyboard.CursorKeys;

    private proteinas!: Phaser.Physics.Arcade.Group;
    private obstaculos!: Phaser.Physics.Arcade.Group;

    private pontuacao: number = 0;
    private vidas: number = 3;
    private textoPontuacao!: Phaser.GameObjects.Text;
    private textoVidas!: Phaser.GameObjects.Text;

    private proximaPlataformaY: number = 400;
    private ultimaPlataformaX: number = 512; 
    private barraMorteY: number = 800;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // Cor sólida recomendada para a Academia de Cristal (Azul Escuro Profundo)
        this.cameras.main.setBackgroundColor('#209cc9');

        this.pontuacao = 0;
        this.vidas = 3;

        this.proximaPlataformaY = 400; 
        this.ultimaPlataformaX = 512; 
        this.barraMorteY = 800;

        // CRIAÇÃO DO CHÃO
        this.plataformas = this.physics.add.staticGroup();
        const chãoGrafico = this.make.graphics({ x: 0, y: 0 }).fillStyle(0x27ae60).fillRect(0, 0, 1024, 40);
        chãoGrafico.generateTexture('chão_temp', 1024, 40);

        // PRIMEIRAS PLATAFORMAS (Usando a imagem nova do Preloader)
        const p1 = this.plataformas.create(512, 650, 'plataforma_img') as Phaser.Physics.Arcade.Sprite;
        p1.setDisplaySize(200, 30).refreshBody();
        
        const p2 = this.plataformas.create(300, 450, 'plataforma_img') as Phaser.Physics.Arcade.Sprite;
        p2.setDisplaySize(200, 30).refreshBody();
        
        const p3 = this.plataformas.create(724, 250, 'plataforma_img') as Phaser.Physics.Arcade.Sprite;
        p3.setDisplaySize(200, 30).refreshBody();

        // Ajuste CRÍTICO: Fazer as plataformas terem colisão apenas na parte de cima.
        this.plataformas.getChildren().forEach((platObj: any) => {
            const plataforma = platObj as Phaser.Physics.Arcade.Sprite;
            if (plataforma.body) {
                plataforma.body.checkCollision.down = false;
                plataforma.body.checkCollision.left = false;
                plataforma.body.checkCollision.right = false;
            }
        });

        if (this.input.keyboard) {
            this.teclas = this.input.keyboard.createCursorKeys();
        }

        // TEXTURAS PARA PROTEÍNAS E OBSTÁCULOS
        
        
        // CRIAÇÃO DO JOGADOR - POU
        const pouGrafico = this.make.graphics({ x: 0, y: 0 }).fillStyle(0xe67e22).fillCircle(25, 25, 25);
        pouGrafico.generateTexture('pou_temp', 50, 50);
        this.jogador = this.physics.add.sprite(512, 500, 'pou_temp');
        
        this.physics.add.collider(this.jogador, this.plataformas, this.puloAutomatico, undefined, this);

        // Armazenar os objetos na memória
        this.proteinas = this.physics.add.group();
        this.obstaculos = this.physics.add.group();

        // Colisão de proteinas e obstáculos com as plataformas
        this.physics.add.collider(this.proteinas, this.plataformas);
        this.physics.add.collider(this.obstaculos, this.plataformas);

        // INTERAÇÃO DE SOBREPOSIÇÃO (Overlap)
        this.physics.add.overlap(this.jogador, this.proteinas, this.coletarProteina, undefined, this);
        this.physics.add.overlap(this.jogador, this.obstaculos, this.baterNoObstaculo, undefined, this);

        this.add.rectangle(512, this.barraMorteY, 1024, 100, 0xff0000);

        // --- INTERFACE DO UTILIZADOR ---
        const dicionario = this.cache.json.get('traducoes');
        const idiomaAtual = this.registry.get('idioma') || 'pt';

        const textoLabelProteina = dicionario[idiomaAtual].proteina;
        const textoLabelEnergia = dicionario[idiomaAtual].energia;

        this.textoPontuacao = this.add.text(16, 16, textoLabelProteina + '0', { fontSize: '32px', color: '#fff', fontFamily: 'Arial' });
        this.textoVidas = this.add.text(800, 16, textoLabelEnergia + '3', { fontSize: '32px', color: '#fff', fontFamily: 'Arial' });

        this.textoPontuacao.setScrollFactor(0);
        this.textoVidas.setScrollFactor(0);

        // Temporizador de obstaculos
        this.time.addEvent({
            delay: 1500, 
            callback: () => {
                this.gerarObstaculoCaindo();
            },
            loop: true
        });
    }

    update ()
    {
        if (!this.teclas || !this.jogador || !this.jogador.body) return;

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
            this.jogador.setVelocityX(0);
        }

        // Camera dinâmica
        this.cameras.main.scrollY = this.jogador.y - 384;

        while (this.proximaPlataformaY > this.cameras.main.scrollY - 400) {
            this.gerarNovaPlataforma();
        }

        // Parede infinita
        if (this.jogador.x < -25) {
            this.jogador.x = 1049;
        } else if (this.jogador.x > 1049) {
            this.jogador.x = -25;
        }

        // Destrói os obstáculos que caíram no abismo
        this.obstaculos.getChildren().forEach((obsObj: any) => {
            const obs = obsObj as Phaser.Physics.Arcade.Sprite;
            if (obs.y > this.barraMorteY + 200) {
                obs.destroy();
            }
        });

        if (this.jogador.y > this.barraMorteY) {
            this.scene.start('GameOver', { pontosFinais: this.pontuacao, resultado: 'derrota' });
        }
    }

    private gerarNovaPlataforma()
    {
        let variacaoX = Phaser.Math.Between(-350, 350);
        let novoX = this.ultimaPlataformaX + variacaoX;

        if (novoX < 100) novoX = 100;
        if (novoX > 924) novoX = 924;

        this.ultimaPlataformaX = novoX;

        // Cria a nova plataforma com a imagem correta
        const plat = this.plataformas.create(novoX, this.proximaPlataformaY, 'plataforma_img') as Phaser.Physics.Arcade.Sprite;
        plat.setDisplaySize(200, 30);
        plat.refreshBody();
        
        if (plat.body) {
            plat.body.checkCollision.down = false;
            plat.body.checkCollision.left = false;
            plat.body.checkCollision.right = false;
        }

        // 40% de chance de proteina
        if (Phaser.Math.Between(1, 100) <= 40) 
        {
            // TROCOU 'proteina_temp' POR 'proteina_img'
            const p = this.proteinas.create(novoX, this.proximaPlataformaY - 35, 'milk_img') as Phaser.Physics.Arcade.Sprite;
            
            // Define o tamanho do prêmio na tela
            p.setDisplaySize(50, 50); 
            
            if (p.body) {
                p.body.allowGravity = false; // A proteína flutua paradinha na plataforma
                p.body.setSize(p.width, p.height); // Ajusta a colisão física ao tamanho da imagem
            }
        }
        this.proximaPlataformaY -= Phaser.Math.Between(120, 180);
    }

    private gerarObstaculoCaindo()
    {
        if (!this.cameras || !this.cameras.main) return;

        const xAleatorio = Phaser.Math.Between(50, 974);
        const yNascimento = this.cameras.main.scrollY - 50;

        const o = this.obstaculos.create(xAleatorio, yNascimento, 'obs_img') as Phaser.Physics.Arcade.Sprite;
        
        // Define o tamanho visual do obstáculo na tela (mude 40, 40 para o tamanho que preferir)
        o.setDisplaySize(50, 50); 
        
        if (o && o.body) {
            o.setBounce(0, 0.1);
            // Ajusta o tamanho da caixinha de colisão para o tamanho da nova imagem
            o.body.setSize(o.width, o.height); 
        }

        
    }
    private coletarProteina(playerObj: any, itemObj: any)
    {
        const item = itemObj as Phaser.Physics.Arcade.Sprite;
        item.disableBody(true, true);

        this.pontuacao += 100;
        const dicionario = this.cache.json.get('traducoes');
        const idiomaAtual = this.registry.get('idioma') || 'pt';
        this.textoPontuacao.setText(dicionario[idiomaAtual].proteina + this.pontuacao);

        if (this.pontuacao >= 1000)
        {
            this.scene.start('GameOver', { pontosFinais: this.pontuacao, resultado: 'vitoria' });
        }
    }

    private baterNoObstaculo(playerObj: any, obstaculoObj: any)
    {
        const obstaculo = obstaculoObj as Phaser.Physics.Arcade.Sprite;
        obstaculo.disableBody(true, true);

        this.vidas -= 1;
        const dicionario = this.cache.json.get('traducoes');
        const idiomaAtual = this.registry.get('idioma') || 'pt';
        this.textoVidas.setText(dicionario[idiomaAtual].energia + this.vidas);

        if (this.vidas <= 0)
        {
            this.scene.start('GameOver', { pontosFinais: this.pontuacao, resultado: 'derrota' });
        }
    }

    private puloAutomatico(jogadorObj: any, plataformaObj: any)
    {
        const jogador = jogadorObj as Phaser.Physics.Arcade.Sprite;
        if (jogador.body && jogador.body.touching.down) {
            jogador.setVelocityY(-600); 
        }
    }
}