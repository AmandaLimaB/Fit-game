import * as Phaser from 'phaser';
import { Scene } from 'phaser';

export class Game extends Scene
{
    //Declaração de variáveis globais
    private jogador!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private plataformas!: Phaser.Physics.Arcade.StaticGroup;
    private teclas !: Phaser.Types.Input.Keyboard.CursorKeys;

    private proteinas!: Phaser.Physics.Arcade.Group;
    private obstaculos!: Phaser.Physics.Arcade.Group;

    private pontuacao: number =0;
    private vidas: number = 3;
    private textoPontuacao!: Phaser.GameObjects.Text;
    private textoVidas!: Phaser.GameObjects.Text;

    private proximaPlataformaY: number = 400; 
    private barraMorteY: number = 800;

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
        // CRIAÇÃO DAS PLATAFORMAS INICIAIS (Static Group)
        this.plataformas = this.physics.add.staticGroup();
        const platGrafica = this.make.graphics({ x: 0, y: 0 }).fillStyle(0x7f8c8d).fillRect(0, 0, 200, 30); // Blocos cinzentos
        platGrafica.generateTexture('plat_temp', 200, 30);

        // Criamos uma plataforma inicial logo abaixo de onde o jogador nasce
        this.plataformas.create(512, 650, 'plat_temp');
        
        // Algumas plataformas de teste um pouco mais acima
        this.plataformas.create(300, 450, 'plat_temp');
        this.plataformas.create(724, 250, 'plat_temp');

        // Ajuste CRÍTICO: Fazer as plataformas terem colisão apenas na parte de cima.
        // Isso permite que o Pou passe por baixo delas sem bater a cabeça enquanto sobe.
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

        //TEXTURAS PARA PROTEÍNAS E OBSTÁCULOS
        const proteinaGrafica = this.make.graphics({ x: 0, y: 0 }).fillStyle(0x3498db).fillCircle(15, 15, 15);
        proteinaGrafica.generateTexture('proteina_temp', 30, 30);
        const obstaculoGrafico = this.make.graphics({ x: 0, y: 0 }).fillStyle(0xe74c3c).fillRect(0, 0, 30, 30);
        obstaculoGrafico.generateTexture('obstaculo_temp', 30, 30);
        
        // CRIAÇÃO DO JOGADOR - POU (Dynamic Body)
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

        //INTERAÇÃO DE SOBREPOSIÇÃO (Overlap)
        this.physics.add.overlap(this.jogador, this.proteinas, this.coletarProteina, undefined, this); //Interação com proteínas
        
        // Quando o jogador toca num obstáculo, ativa a função 'baterNoObstaculo'
        this.physics.add.overlap(this.jogador, this.obstaculos, this.baterNoObstaculo, undefined, this); //Interação com obstáculos

        // Barra da morte
        this.add.rectangle(512, this.barraMorteY, 1024, 100, 0xff0000);

        const dicionario = this.cache.json.get('traducoes');
        const idiomaAtual = this.registry.get('idioma') || 'pt';

        const textoLabelProteina = dicionario[idiomaAtual].proteina;
        const textoLabelEnergia = dicionario[idiomaAtual].energia;

        this.textoPontuacao = this.add.text(16, 16, textoLabelProteina + '0', { fontSize: '32px', color: '#fff', fontFamily: 'Arial' });
        this.textoVidas = this.add.text(800, 16, textoLabelEnergia + '3', { fontSize: '32px', color: '#fff', fontFamily: 'Arial' });

        this.textoPontuacao.setScrollFactor(0);
        this.textoVidas.setScrollFactor(0);

    }

   update ()
    {
        // Se as teclas não foram configuradas por segurança, não faz nada
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

        // --- LÓGICA DA CÂMERA (Passo 2) ---
        // Se o Pou subir acima do meio da tela atual (scrollY + 384), a câmera acompanha
        const metadeDaTela = this.cameras.main.scrollY + 384;
        if (this.jogador.y < metadeDaTela) {
            this.cameras.main.scrollY = this.jogador.y - 384;
        }

        // --- EFEITO PAREDE INFINITA ---
        // Se o jogador sair pela direita, aparece na esquerda (e vice-versa)
        if (this.jogador.x < -25) {
            this.jogador.x = 1049;
        } else if (this.jogador.x > 1049) {
            this.jogador.x = -25;
        }

        // --- CONDIÇÃO DE GAME OVER (Cair) ---
        // Se o jogador cair para fora da área visível inferior da câmera
        if (this.jogador.y > this.cameras.main.scrollY + 800) {
            this.scene.start('GameOver', { pontosFinais: this.pontuacao, resultado: 'derrota' });
        }
        
    }

    private gerarItem()
    {
        try {
            const xAleatorio = Phaser.Math.Between(50, 974);
            
            // Proteína 80% de chance e obstáculo 20% de chance
            if (Phaser.Math.Between(1, 10) <= 8)
            {
                // Criamos o item e dizemos ao código que ele é uma Sprite Física
                const p = this.proteinas.create(xAleatorio, 0, 'proteina_temp') as Phaser.Physics.Arcade.Sprite;
                
                // Verificação de segurança: só aplica o ressalto se o corpo físico existir
                if (p && p.body) {
                    p.setBounce(0, Phaser.Math.FloatBetween(0.2, 0.4)); 
                }
            }
            else
            {
                const o = this.obstaculos.create(xAleatorio, 0, 'obstaculo_temp') as Phaser.Physics.Arcade.Sprite;
                
                if (o && o.body) {
                    o.setBounce(0, 0.1);
                }
            }
        } catch (erro) {
            console.error("Erro fatal evitado na geração do item:", erro);
        }
    }

    private coletarProteina(playerObj: any, itemObj: any)
    {
        const item = itemObj as Phaser.Physics.Arcade.Sprite;
        
        // Remove o item do ecrã e da memória física
        item.disableBody(true, true);

        this.pontuacao += 100;
        const dicionario = this.cache.json.get('traducoes');
        const idiomaAtual = this.registry.get('idioma') || 'pt';
        this.textoPontuacao.setText(dicionario[idiomaAtual].proteina + this.pontuacao);

        if (this.pontuacao >= 1000)
        {
            this.scene.start('GameOver', {pontosFinais: this.pontuacao, resultado: 'vitoria'});
        }
    }

    //Consertar depois
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
        
        // O jogador só pula se estiver batendo com o pé (touching.down)
        if (jogador.body && jogador.body.touching.down) {
            // Aplica uma força vertical negativa forte para ele subir
            jogador.setVelocityY(-600); 
        }
    }
}
