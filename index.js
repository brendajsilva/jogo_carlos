let canvas = document.getElementById('des');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let des = canvas.getContext('2d');

const carrosDisponiveis = [
    './img/car2.png',
    './img/car3.png',
    './img/car4.png',
    './img/car5.png',
    './img/car6.png',
    './img/car7.png',
    './img/car8.png',
];
let carroSelecionado1 = carrosDisponiveis[0];
let carroSelecionado2 = carrosDisponiveis[1];

let f1; // Declaração sem inicialização inicial
let f2; // Declaração sem inicialização inicial

const c1 = new Carro2(250, 10, 60, 100, './img/car3.png');
const c2 = new Carro2(450, -110, 60, 100, './img/car4.png');
const c3 = new Carro2(150, -220, 60, 100, './img/car5.png');
const c4 = new Carro2(350, -330, 60, 100, './img/car6.png');
const c5 = new Carro2(550, -440, 60, 100, './img/car7.png');
const c6 = new Carro2(50, -550, 60, 100, './img/car8.png');

const estradas = [];
for (let i = 0; i < canvas.width; i += 100) {
    for (let j = 0; j < canvas.height; j += 120) {
        estradas.push(new Est(i, j, 8, 40, 'yellow'));
    }
}

let som1 = new Audio('./img/motor.wav');
let som2 = new Audio('./img/inicio.wav');
let somBatida = new Audio('./img/batida.mp3');
som1.loop = true;
som1.volume = 0.5;
som2.loop = true;
som2.volume = 0.5;
somBatida.volume = 0.5;

let sirene = new Audio('./img/sirene.mp3');
sirene.loop = true;
sirene.volume = 0.5;

let jogo = false;
let fase1 = 1;
let fase2 = 1;
let pontuacao1 = 0;
let pontuacao2 = 0;
let vidas1 = 5;
let vidas2 = 5;
let jogadorSelecionando = 1;
let carrosSelecionados = [false, false];

const velocidadeInicialInimigos = 2;

// Configurar botões de controle
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('volume-down-button').addEventListener('click', diminuirVolume);

// Mostrar a tela de tutorial
document.getElementById('tutorial-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('tutorial-screen').style.display = 'block';
});

// Voltar para a tela inicial
document.getElementById('back-to-start-button').addEventListener('click', () => {
    document.getElementById('tutorial-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
});

document.addEventListener('keydown', (e) => {
    console.log('Tecla pressionada:', e.key);
    switch (e.key) {
        case 'a':
            if(f1 && vidas1 > 0) f1.dir = -10;
            break;
        case 'd':
            if(f1 && vidas1 > 0) f1.dir = 10;
            break;
        case 'w':
            if(f1 && vidas1 > 0) f1.y -= 10; 
            break;
        case 's':
            if(f1 && vidas1 > 0) f1.y += 10; 
            break;
        case 'ArrowLeft':
            if(f2 && vidas2 > 0) f2.dir = -10;
            break;
        case 'ArrowRight':
            if(f2 && vidas2 > 0) f2.dir = 10;
            break;
        case 'ArrowUp':
            if(f2 && vidas2 > 0) f2.y -= 10; 
            break;
        case 'ArrowDown':
            if(f2 && vidas2 > 0) f2.y += 10; 
            break;
    }
});

document.addEventListener("keyup", (e) => {
    switch (e.key) {
        case 'a':
            if (f1 && vidas1 > 0 ) f1.dir = 0;
            break;
        case 'd':
            if (f1 && vidas1 > 0 ) f1.dir = 0;
            break;
        case 'w':
            if (f1 && vidas1 > 0 ) f1.y = 0;
            break;
        case 's':
            if (f1 && vidas1 > 0 ) f1.y = 0; 
            break;    
        case 'ArrowLeft':
            if (f2 && vidas2 > 0 ) f2.dir = 0;
            break;
        case 'ArrowRight':
            if (f2 && vidas2 > 0 ) f2.dir = 0;
            break;
        case 'ArrowUp':
            if (f2 && vidas2 > 0 ) f2.y = 0; 
            break;
        case 'ArrowDown':
            if (f2 && vidas2 > 0 ) f2.y = 0; 
            break;
    }
});
document.addEventListener('keypress', (e) => {
    if (e.key === 'g' && carrosSelecionados[0] && carrosSelecionados[1]) {
        startGame();
    } else if (e.key === 'p') {
        jogo = false;
        som1.pause();
        som2.play();
    }
});

// Ajustar o tamanho do canvas para a janela
function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', ajustarCanvas);
ajustarCanvas();

// Função para iniciar o jogo
function startGame() {
    if (carrosSelecionados[0] && carrosSelecionados[1]) {
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('des').style.display = 'block';
        jogo = true;
        som1.play();
        som2.pause();
        verificarSirene();

        // Criar as instâncias de f1 e f2 aqui, após a seleção dos carros
        f1 = new Carro(250, 550, 60, 100, carroSelecionado1);
        f2 = new Carro(350, 550, 60, 100, carroSelecionado2);
        f1.speed = 7;
        f2.speed = 7;

        main();
    } else {
        alert('Selecione os carros para ambos os jogadores antes de iniciar.');
    }
}

// Função para reiniciar o jogo
function restartGame() {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('des').style.display = 'block';
    resetGame();
    jogo = true;
    som1.play();
    main();
}

// Função para diminuir o volume
function diminuirVolume() {
    som1.volume = Math.max(0, som1.volume - 0.1);
    som2.volume = Math.max(0, som2.volume - 0.1);
    somBatida.volume = Math.max(0, somBatida.volume - 0.1);
    sirene.volume = Math.max(0, sirene.volume - 0.1);
}

// Função principal do jogo
function main() {
    if (jogo) {
        atualizar();
        desenhar();
        requestAnimationFrame(main);
    }
}

function showGameOverScreen() {
    document.getElementById('des').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
    document.getElementById('final-score').innerText = `Jogador 1: ${pontuacao1}, Jogador 2: ${pontuacao2}`;
}

function colisao() {
    const carrosObstaculos = [c1, c2, c3, c4, c5, c6];
    let colidiu1 = false;
    let colidiu2 = false;

    carrosObstaculos.forEach(carro => {
        if (f1 && f1.colid(carro)) {
            colidiu1 = true;
        }
        if (f2 && f2.colid(carro)) {
            colidiu2 = true;
        }
    });

    if (f1 && f2 && f1.colid(f2)) {
        colidiu1 = true;
        colidiu2 = true;
    }

    if (colidiu1 && vidas1 > 0) {
        vidas1--;
        somBatida.play();
        f1.x = 250;
        f1.y = 550;
        
        if (vidas1 <= 0) {
            f1 = null; 
        }
    }

   
    if (colidiu2 && vidas2 > 0) {
        vidas2--;
        somBatida.play();
        f2.x = 350;
        f2.y = 550;
        
        if (vidas2 <= 0) {
            f2 = null; 
        }
    }

    if ((vidas1 <= 0 && (vidas2 <= 0 || !f2)) || (vidas2 <= 0 && (vidas1 <= 0 || !f1))) {
        jogo = false;
        showGameOverScreen();
    }
}


const pontosParaFases = [20, 40, 60, 80];

function atualizar() {
    if (!jogo) return;

    if(f1 && vidas1 > 0) f1.move();
    if(f2 && vidas2 > 0) f2.move();
    c1.move();
    c2.move();
    c3.move();
    c4.move();
    c5.move();
    c6.move();

    verificarUltrapassagem();
    colisao();

    if (fase1 <= pontosParaFases.length && pontuacao1 >= pontosParaFases[fase1 - 1]) {
        fase1 += 1;
        aumentarDificuldade();
    }

    if (fase2 <= pontosParaFases.length && pontuacao2 >= pontosParaFases[fase2 - 1]) {
        fase2 += 1;
        aumentarDificuldade();
    }
}

function verificarUltrapassagem() {
    const carrosObstaculos = [c1, c2, c3, c4, c5, c6];

    carrosObstaculos.forEach(carro => {
        if (!carro.ultrapassado && carro.y > (f1 ? f1.y + f1.h : 0)) {
            carro.ultrapassado = true;
            pontuacao1 += 1;
        }
        if (!carro.ultrapassado && carro.y > (f2 ? f2.y + f2.h : 0)) {
            carro.ultrapassado = true;
            pontuacao2 += 1;
        }
    });
}

function desenhar() {
    // Desenhar a imagem da estrada
    let estradaImg = new Image();
    estradaImg.src = './img/estrada.png';
    des.drawImage(estradaImg, 0, 0, canvas.width, canvas.height);

    c1.draw();
    c2.draw();
    c3.draw();
    c4.draw();
    c5.draw();
    c6.draw();
    
    if (f1 && vidas1 > 0) f1.draw();
    if (f2 && vidas2 > 0) f2.draw();


    // Configurações para o texto do Jogador 1 com sombra
    des.fillStyle = 'white';
    des.font = 'bold 20px Arial';
    des.shadowColor = 'black'; // Cor da sombra
    des.shadowBlur = 5; // Intensidade da sombra
    des.fillText('Pontuação Jogador 1: ' + pontuacao1, 10, 20);
    des.fillText('Fase Jogador 1: ' + fase1, 10, 45);
    des.fillText('Vidas Jogador 1: ' + vidas1, 10, 70);

    // Configurações para o texto do Jogador 2 com sombra
    des.fillText('Pontuação Jogador 2: ' + pontuacao2, canvas.width - 245, 20);
    des.fillText('Fase Jogador 2: ' + fase2, canvas.width - 245, 45);
    des.fillText('Vidas Jogador 2: ' + vidas2, canvas.width - 245, 70);

    // Resetar a sombra para outros desenhos
    des.shadowBlur = 0;
}

function desenharInicio() {
    let img = new Image();
    img.src = './img/tela_inicio.jpg';
    img.onload = () => {
        des.drawImage(img, 0, 0, canvas.width, canvas.height);
        des.fillStyle = 'white';
        des.font = '30px Arial';
        des.fillText('Pressione G para iniciar', canvas.width / 2 - 150, canvas.height / 2);
        som2.play();
    };

    const carSelectionDiv = document.getElementById('car-selection');
    carSelectionDiv.innerHTML = '';
    carrosDisponiveis.forEach((carro, index) => {
        let card = document.createElement('div');
        card.className = 'car-card';
        card.onclick = () => escolherCarro(index);

        let img = document.createElement('img');
        img.src = carro;
        card.appendChild(img);

        let p = document.createElement('p');
        p.innerText = `Carro ${index + 1}`;
        card.appendChild(p);

        carSelectionDiv.appendChild(card);
    });
}

function resetGame() {
    pontuacao1 = 0;
    pontuacao2 = 0;
    fase1 = 1;
    fase2 = 1;
    vidas1 = 5;
    vidas2 = 5;
    f1 = new Carro(250, 550, 60, 100, carroSelecionado1);
    f2 = new Carro(350, 550, 60, 100, carroSelecionado2);
    f1.speed = 7;
    f2.speed = 7;
    c1.y = 10;
    c2.y = -110;
    c3.y = -220;
    c4.y = -330;
    c5.y = -440;
    c6.y = -550;
    c1.speed = velocidadeInicialInimigos;
    c2.speed = velocidadeInicialInimigos;
    c3.speed = velocidadeInicialInimigos;
    c4.speed = velocidadeInicialInimigos;
    c5.speed = velocidadeInicialInimigos;
    c6.speed = velocidadeInicialInimigos;
    verificarSirene();
}

function aumentarDificuldade() {
    c1.speed += 1;
    c2.speed += 1;
    c3.speed += 1;
    c4.speed += 1;
    c5.speed += 1;
    c6.speed += 1;
}

function escolherCarro(index) {
    if (jogadorSelecionando === 1) {
        carroSelecionado1 = carrosDisponiveis[index];
        carrosSelecionados[0] = true;
        jogadorSelecionando = 2;
        alert('Jogador 1 selecionou o carro. Jogador 2, escolha seu carro.');
    } else if (jogadorSelecionando === 2) {
        carroSelecionado2 = carrosDisponiveis[index];
        carrosSelecionados[1] = true;
        alert('Jogador 2 selecionou o carro. Pressione "g" para iniciar o jogo.');
    }

    if (carroSelecionado1 === './img/car6.png' || carroSelecionado2 === './img/car6.png') {
        sirene.play();
    } else {
        sirene.pause();
    }
}

function verificarSirene() {
    if (carroSelecionado1 === './img/car6.png' || carroSelecionado2 === './img/car6.png') {
        sirene.play();
    } else {
        sirene.pause();
    }
}

main();