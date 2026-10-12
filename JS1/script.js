/* ==========================================================
   Sessão da Tarde – Catálogo de Filmes Interativo
   Desenvolvimento WEB I – Atividade JS 1
   ========================================================== */


/* ===== B. DADOS DOS FILMES (array de objetos) ===== */
let filmes = [
  { titulo: "Cidade de Deus",           ano: 2002, genero: "Crime",             nota: 8.6, poster: "poster-2.jpg" },
  { titulo: "A Viagem de Chihiro",      ano: 2001, genero: "Animação",          nota: 8.6, poster: "poster-3.jpg" },
  { titulo: "Mad Max: Estrada da Fúria", ano: 2015, genero: "Ação",             nota: 8.1, poster: "poster-4.jpg" },
  { titulo: "Ainda Estou Aqui",         ano: 2024, genero: "Drama",             nota: 8.0, poster: "poster-5.jpg" },
  { titulo: "Divertida Mente",          ano: 2015, genero: "Animação",          nota: 8.1, poster: "poster-6.jpg" },
  { titulo: "Parasita",                 ano: 2019, genero: "Suspense",          nota: 8.5, poster: "poster-destaque.jpg" }
];

/* Títulos dos filmes favoritados (G) */
let favoritos = [];

/* Lista que está aparecendo na tela agora (resultado da busca/filtro) */
let listaAtual = filmes;

/* Imagem de reserva caso algum pôster não carregue */
const POSTER_RESERVA = "data:image/svg+xml;utf8," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">' +
  '<rect width="400" height="600" fill="#12343b"/>' +
  '<text x="200" y="300" text-anchor="middle" font-family="Georgia,serif" ' +
  'font-size="32" fill="#f2c66d">Sem pôster</text></svg>'
);

/* Elementos da página */
const catalogo          = document.getElementById("catalogo");
const contador          = document.getElementById("contador");
const campoBusca        = document.getElementById("busca");
const filtroGenero      = document.getElementById("filtro-genero");
const btnInverter       = document.getElementById("btn-inverter");
const btnLimpar         = document.getElementById("btn-limpar-favoritos");
const contadorFavoritos = document.getElementById("contador-favoritos");
const listaFavoritos    = document.getElementById("lista-favoritos");
const avisoFavoritos    = document.getElementById("aviso-favoritos");


/* ===== C. EXIBINDO O CATÁLOGO ===== */
function mostrarFilmes(lista) {
  listaAtual = lista;
  let html = "";

  for (let i = 0; i < lista.length; i++) {
    const filme = lista[i];

    /* índice do filme no array original (usado pelo botão de favoritos) */
    const indice = filmes.indexOf(filme);

    /* operador ternário: selo para notas maiores ou iguais a 8 */
    const selo = filme.nota >= 8 ? '<span class="selo">⭐ Recomendado</span>' : "";

    const jaFavorito = favoritos.includes(filme.titulo);
    const classeBotao = jaFavorito ? "btn-favorito ativo" : "btn-favorito";
    const textoBotao = jaFavorito ? "♥ Favoritado" : "♥ Favoritar";

    const nota = filme.nota.toFixed(1).replace(".", ",");
    const busca = encodeURIComponent(filme.titulo + " filme");

    html += '<article class="card">' +
      '<img src="' + filme.poster + '" alt="Pôster de ' + filme.titulo + '" ' +
        'onerror="posterIndisponivel(this)">' +
      '<h3><a href="https://www.google.com/search?q=' + busca + '" target="_blank" rel="noopener">' +
        filme.titulo + '</a></h3>' +
      '<p class="ano">' + filme.ano + '</p>' +
      '<p class="genero">' + filme.genero + '</p>' +
      '<p class="nota">Nota: ' + nota + ' ' + selo + '</p>' +
      '<button type="button" class="' + classeBotao + '" onclick="favoritar(' + indice + ')">' +
        textoBotao + '</button>' +
      '</article>';
  }

  /* D. nenhum filme encontrado */
  if (lista.length === 0) {
    html = '<p class="vazio">Nenhum filme encontrado.</p>';
  }

  catalogo.innerHTML = html;
  contador.innerText = lista.length;   /* total de filmes mostrados */
}

/* Troca o pôster quebrado pela imagem de reserva */
function posterIndisponivel(img) {
  img.onerror = null;
  img.src = POSTER_RESERVA;
}


/* ===== D. BUSCA POR TÍTULO + E. FILTRO POR GÊNERO ===== */
/* Tira acentos e deixa em minúsculas para comparar textos */
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* Monta um novo array com os filmes que combinam com a busca e com o gênero */
function aplicarFiltros() {
  const texto = normalizar(campoBusca.value);
  const generoEscolhido = filtroGenero.value;
  const resultado = [];

  for (const filme of filmes) {
    const achouTitulo = normalizar(filme.titulo).includes(texto);

    let achouGenero;
    if (generoEscolhido === "Todos") {
      achouGenero = true;
    } else if (filme.genero === generoEscolhido) {
      achouGenero = true;
    } else {
      achouGenero = false;
    }

    if (achouTitulo && achouGenero) {
      resultado.push(filme);
    }
  }

  mostrarFilmes(resultado);
}

/* Preenche o select com "Todos" e os gêneros que existem no array */
function preencherGeneros() {
  const generos = [];

  for (const filme of filmes) {
    if (!generos.includes(filme.genero)) {
      generos.push(filme.genero);
    }
  }
  generos.sort(function (a, b) { return a.localeCompare(b, "pt-BR"); });

  let opcoes = '<option value="Todos">Todos</option>';
  for (const genero of generos) {
    opcoes += '<option value="' + genero + '">' + genero + '</option>';
  }
  filtroGenero.innerHTML = opcoes;
}

campoBusca.addEventListener("input", aplicarFiltros);
filtroGenero.addEventListener("change", aplicarFiltros);


/* ===== F. ORDEM DO CATÁLOGO ===== */
btnInverter.addEventListener("click", function () {
  listaAtual.reverse();
  mostrarFilmes(listaAtual);
});


/* ===== G. FAVORITOS ===== */
function favoritar(indice) {
  const titulo = filmes[indice].titulo;

  if (favoritos.includes(titulo)) {
    avisoFavoritos.innerText = '"' + titulo + '" já está nos favoritos.';
  } else {
    favoritos.push(titulo);
    avisoFavoritos.innerText = "";
  }

  atualizarFavoritos();
  mostrarFilmes(listaAtual);   /* atualiza o botão do card */
}

function atualizarFavoritos() {
  contadorFavoritos.innerText = favoritos.length;

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = "<li>Nenhum favorito ainda.</li>";
    return;
  }

  let itens = "";
  for (const titulo of favoritos) {
    itens += "<li>" + titulo + "</li>";
  }
  listaFavoritos.innerHTML = itens;
}

btnLimpar.addEventListener("click", function () {
  favoritos = [];
  avisoFavoritos.innerText = "";
  atualizarFavoritos();
  mostrarFilmes(listaAtual);
});


/* ===== H. INTERAÇÃO COM O MOUSE ===== */
/* Títulos das seções (Destaque da Semana, Catálogo, etc.) mudam de cor */
const titulosDeSecao = document.querySelectorAll(".titulo-secao");

for (const titulo of titulosDeSecao) {
  titulo.addEventListener("mouseenter", function () {
    titulo.style.color = "#b66b16";
    titulo.style.backgroundColor = "#fff0d0";
  });

  titulo.addEventListener("mouseout", function () {
    titulo.style.color = "";
    titulo.style.backgroundColor = "";
  });
}


/* ===== INÍCIO: o que roda quando a página carrega ===== */
preencherGeneros();
mostrarFilmes(filmes);
atualizarFavoritos();



