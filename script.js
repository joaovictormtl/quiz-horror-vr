// Versão sem jQuery, usando DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Pega o código da URL atual
  let userCode = window.location;
  userCode = userCode.search.replace("?", "");
  console.log(userCode);

  // Salva no localStorage
  if (userCode) {
    localStorage.setItem("userCode", userCode);
    console.log("Código do usuário salvo:", userCode);
  }
});

const porta = document.querySelector(".porta");
const numeroPergunta = document.querySelector("#numeroPergunta");
let numero = 1;
const camera = document.querySelector("#camera");
const perguntaTexto = document.querySelector("#perguntaTexto");
const opcoes = document.querySelectorAll(".opcao");
const fundo = document.querySelector(".fundo");
const tela = document.querySelector("#tela");
const tvStatic = document.querySelector("#tvStatic");
const criatura = document.createElement("a-gltf-model");
const criaturaGrito = document.querySelector("#criaturaGrito");
const aranha = document.querySelector("#aranha");
const aranhaSound = document.querySelector("#aranhaSound");
const organ = document.querySelector("#organ");
const metal = document.querySelector("#metal");

function sustoCriatura(){
  criatura.setAttribute("visible", "true");
  
  // Anima a criatura para avançar
  criatura.setAttribute("animation", {
      property: "position",
      to: "0 0 -0.5",
      dur: 800
  });
  
  criaturaGrito.components.sound.playSound();
}

function sustoAranha(){
  aranhaSound.components.sound.playSound();
  aranha.setAttribute("rotation", "0 0 0");
  
  aranha.setAttribute("animation", {
    property: "position",
    to: "0 1 0",
    dur: 400
  });
  
  setTimeout(()=>{
    aranha.setAttribute("visible", "false");
  }, 1000);
}

function criarCriatura(){
  criatura.setAttribute("src", "https://cdn.glitch.global/c4b98eb1-37f0-485b-8260-e4b49c77a9a0/lovecraftian_horror.glb?v=1731490174986");
  criatura.setAttribute("position", "0 0 -8.5");
  criatura.setAttribute("scale", "0.1 0.1 0.1");
  criatura.setAttribute("visible", "false");
  document.querySelector("a-scene").appendChild(criatura);
}

window.addEventListener("load", ()=>{
  salvarPerguntasLocalStorage();
  exibirPergunta();
  criarCriatura();
  
  let intervalEscolherOpcao;
  // Torna as opções como selecionáveis
  opcoes.forEach(opcao=>{
    opcao.addEventListener("mouseenter", ()=>{
      
      intervalEscolherOpcao = setTimeout(()=>{
        let porcentagem = Math.random();
        
        if(porcentagem < 0.2){
          organ.components.sound.playSound();
        } else if (porcentagem > 0.8){
          metal.components.sound.playSound();
        }
        
        let opcaoEscolhida = opcao.querySelector("a-text").getAttribute("value").slice(3);
        verificarResposta(opcaoEscolhida);
      }, 1000);
    });
    
    opcao.addEventListener("mouseleave", ()=>{
      clearInterval(intervalEscolherOpcao);
    });
  });
  
  let intervalFundo;
  // Faz a câmera se mover para o fundo da porta
  fundo.addEventListener("mouseenter", ()=>{
    intervalFundo = setTimeout(()=>{
      let {z} = camera.getAttribute("position");
    
      camera.setAttribute("animation", {
        property: "position",
        to: `0 1.6 ${Number(z) - 7}`,
        dur: 500
      });

      camera.setAttribute('look-controls', 'enabled', false);

      setTimeout(()=>{
        porta.setAttribute("position", "0 1.95 -6.3");
        avancarPergunta();
      }, 600);
    }, 500);
  });
  
  fundo.addEventListener("mouseleave", ()=>{
    clearInterval(intervalFundo);
  });
  
  camera.addEventListener("closeDoor", ()=>{
    porta.setAttribute("position", "0 2 -6.3");
    porta.removeAttribute("animation");
    camera.removeAttribute("animation");
    camera.setAttribute('look-controls', 'enabled', true);
  });
});

function salvarPerguntasLocalStorage(){
  let perguntas = [
    {
      id: "1",
      texto: "Qual a capital da Alemanha?",
      opcoes: ["Berlim", "Londres", "Paris", "Lagos"],
      correta: "Berlim"
    },
    {
      id: "2",
      texto: "Qual o maior planeta do sistema solar?",
      opcoes: ["Terra", "Jupiter", "Marte", "Venus"],
      correta: "Jupiter"
    },
    {
      id: "3",
      texto: "Quem pintou a Mona Lisa?",
      opcoes: ["Van Gogh", "Leonardo da Vinci", "Picasso", "Michelangelo"],
      correta: "Leonardo da Vinci"
    },
    {
    id: "4",
    texto: "Qual e o animal terrestre mais rapido do mundo?",
    opcoes: ["Guepardo", "Leao", "Cavalo", "Aguia"],
    correta: "Guepardo"
    },
    {
      id: "5",
      texto: "Qual e o elemento químico com o simbolo 'O'?",
      opcoes: ["Ouro", "Oxio", "Osmio", "Oxigenio"],
      correta: "Oxigenio"
    },
    {
      id: "6",
      texto: "Quantos continentes existem no planeta Terra?",
      opcoes: ["5", "6", "7", "8"],
      correta: "7"
    },
    {
      id: "7",
      texto: "Quem foi o primeiro homem a pisar na Lua?",
      opcoes: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"],
      correta: "Neil Armstrong"
    },
    {
      id: "8",
      texto: "Qual e o maior oceano do mundo?",
      opcoes: ["Atlantico", "Indico", "Artico", "Pacifico"],
      correta: "Pacifico"
    },
    {
      id: "9",
      texto: "Quantos dentes um ser humano adulto possui normalmente?",
      opcoes: ["28", "30", "32", "34"],
      correta: "32"
    },
    {
      id: "10",
      texto: "Qual pais e conhecido como a terra do sol nascente?",
      opcoes: ["China", "Japao", "Coreia do Sul", "Filipinas"],
      correta: "Japao"
    }
  ];
  
  localStorage.setItem("perguntas", JSON.stringify(perguntas));
}

function statica(){
  tela.setAttribute("src", "https://cdn.glitch.global/c4b98eb1-37f0-485b-8260-e4b49c77a9a0/tv-static.png?v=1731482861137");
  tela.setAttribute("color", "");
  tvStatic.components.sound.playSound();
  perguntaTexto.setAttribute("visible", "false");
  
  setTimeout(()=>{
    tela.setAttribute("src", "");
    tela.setAttribute("color", "#333");
    perguntaTexto.setAttribute("visible", "true");
  }, 1000);
}

function getPergunta(){
  const perguntas = JSON.parse(localStorage.getItem("perguntas"));
  return perguntas[Math.floor(Math.random() * perguntas.length)];
}

function exibirPergunta() {
  statica();  
  let perguntaAtual = getPergunta();
  
  if(!perguntaAtual){
    mostrarFimDeJogo();
    return;
  };
  
  opcoes.forEach(opcao=>{
    opcao.classList.add("raycastable");
  });
  
  perguntaTexto.setAttribute("value", `${perguntaAtual.texto}`);
    
  opcoes.forEach((opcao, index)=>{
    opcao.querySelector("a-text").setAttribute("value", `${String.fromCharCode(97 + index)}) ${perguntaAtual.opcoes[index]}`);
  });
}

function verificarResposta(opcaoEscolhida) {
  statica();
  
  // Tira a possibilidade do jogador escolher outra opção
  opcoes.forEach(opcao=>{
    opcao.classList.remove("raycastable");
  });

  let perguntas = JSON.parse(localStorage.getItem("perguntas"));
  
  for(let pergunta of perguntas){
    if(opcaoEscolhida === pergunta.correta){
      
      // Faz com que a porta e o fundo só estejam disponíveis agora, que o jogador acertou
      fundo.classList.add("raycastable");
      
      // Comunica que o jogador acertou
      perguntaTexto.setAttribute("value", "Acertou, Miseravi!");
      
      // Abre a porta
      porta.setAttribute("animation", {
        property: "position",
        to: "2 1.95 -6.3",
        dur: 500
      });
      
      // Retira do localStorage a pergunta para que ela não se repita
      perguntas = perguntas.filter(p => p.id !== pergunta.id);
      localStorage.setItem("perguntas", JSON.stringify(perguntas));
      return;
    } 
  }
  
  // Comunica que o jogador errou
  perguntaTexto.setAttribute("value", "Errou, Desgraca!");
  mostrarCriaturaFimDeJogo();
}

function avancarPergunta() {
  numeroPergunta.setAttribute("value", `${numero+=1}`);
  
  // Impede que o jogador interaja com o fundo denovo
  fundo.classList.remove("raycastable");
  exibirPergunta();
}

function mostrarCriaturaFimDeJogo() {
  if(Math.random() < 0.5){
    sustoCriatura();
  } else{
    sustoAranha();
  }
    
  setTimeout(()=>{
    criatura.parentNode.removeChild(criatura);
    mostrarFimDeJogo(); // Exibe "FIM DE JOGO" após a criatura sumir
  }, 3000);
}

// SALVAR PONTOS
function saveScores(pontos) {
  console.log("pontos", pontos);

  let user = localStorage.getItem("userCode");

  fetch(
    `https://solid-palm-tree-6q6qqgw9grxcrv7x-3000.app.github.dev/users?code=${user}`
  )
    .then(async (res) => {
     return await res.json();
    })
    .then((user) => {
    
    console.log("user", user)
    
      let scoreData = {
        userId: user[0].id,
        experienceId: 4,
        score: pontos
      };
    
    console.log('score', scoreData)

      fetch(
        `https://solid-palm-tree-6q6qqgw9grxcrv7x-3000.app.github.dev/experienceScores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scoreData),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("Dados enviados com sucesso:", data);
        })
        .catch((error) => {
          console.error("Erro ao salvar os dados:", error);
        });
    });
  

  setTimeout(() => {
    window.location.href =
      "https://solid-palm-tree-6q6qqgw9grxcrv7x-3000.app.github.dev/pages/auth";
  }, 10000)

}

function mostrarFimDeJogo() {
    // Desabilita o cursor
    camera.querySelector("a-entity[cursor]").setAttribute("visible", "false");
    numeroPergunta.setAttribute("value", "");

    // Exibe "FIM DE JOGO" na tela
    const fimDeJogo = document.createElement("a-text");
    fimDeJogo.setAttribute("value", "FIM DE JOGO");
    fimDeJogo.setAttribute("color", "red");
    fimDeJogo.setAttribute("scale", "10 10 10");
    fimDeJogo.setAttribute("position", "0 3 -2");
    fimDeJogo.setAttribute("align", "center");
    fimDeJogo.setAttribute("rotation", "-90 0 0");
    document.querySelector("a-scene").appendChild(fimDeJogo);
    
  // Retirar o raycastable das opcoes
  opcoes.forEach(opcao=>{
    opcao.classList.remove("raycastable");
    opcao.setAttribute("visible", "false");
  });
    
    // Travar o jogo, sem mais perguntas ou opções
    perguntaTexto.setAttribute("value", "FIM DE JOGO");
  
  saveScores(numero);
}
