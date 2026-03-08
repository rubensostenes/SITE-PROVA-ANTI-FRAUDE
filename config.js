// ============================================
// CONFIGURAÇÃO DO FIREBASE
// ============================================

// Aguardar Firebase carregar
let  auth, database;

// Função para inicializar Firebase
function initFirebase() {
let attempts = 0;
    
    const checkInterval = setInterval(() => {
        attempts++;
        
        // Verifica se o objeto 'firebase' injetado pelo Google existe
        if (typeof firebase !== 'undefined') {
            clearInterval(checkInterval);
            
            const firebaseConfig = {
                apiKey: "",
                authDomain: "",
                databaseURL: "",
                projectId: "",
                storageBucket: "",
                messagingSenderId: "",
                appId: "",
                measurementId: ""
            };

            firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            database = firebase.database();
            
            // Dentro da function initFirebase(), após database = firebase.database();

// Escutar se a prova está liberada ou não (Globalmente)
database.ref('settings/isExamReleased').on('value', (snapshot) => {
    appState.isExamReleased = snapshot.val() || false;
    console.log("📢 Status da Prova atualizado:", appState.isExamReleased);
    // Se a função updateStatusDisplay existir no app.js, ela será chamada aqui
    if (typeof updateStatusDisplay === 'function') updateStatusDisplay();
});

// Escutar atualizações no tempo da prova (Caso o coordenador mude)
database.ref('settings/totalTimeMinutes').on('value', (snapshot) => {
    if (snapshot.exists()) {
        EXAM_CONFIG.totalTimeMinutes = snapshot.val();
        console.log("⏱️ Tempo da prova atualizado para:", EXAM_CONFIG.totalTimeMinutes);
    }
});

            console.log("✅ Firebase inicializado com sucesso!");
            window.dispatchEvent(new Event('firebaseReady'));
        } else if (attempts > 10) {
            clearInterval(checkInterval);
            console.error("❌ Erro fatal: O SDK do Firebase não carregou após 5 segundos. Verifique sua conexão ou adblock.");
            alert("Erro de conexão com o servidor. Tente atualizar a página.");
        }
    }, 500);



  }

initFirebase();

// ============================================
// CONFIGURAÇÕES DA PROVA
// ============================================

const EXAM_CONFIG = {
  examId: "prova-001",
  totalTimeMinutes: 120,
  answerKey: {
    q1: "d",
    q2: "d",
    q3: "c",
    q4: "b",
    q5: "d",
    q6: "c",
    q7: "d",
    q8: "d",
    q9: "c",
    q10: "b",
    q11: "d",
    q12: "b",
    q13: "c",
    q14: "b",
    q15: "b",
    q16: "d",
    q17: "c",
    q18: "d",
    q19: "c",
    q20: "d",
    q21: "c",
    q22: "c",
    q23: "a",
    q24: "e",
    q25: "d",
    q26: "c",
    q27: "c",
    q28: "a",
  },

  questions: [
    {
      id: "q1",
      title: "QUESTÃO 01",
      question:
        "O ministério do profeta \n" +
        "Elias, especialmente em seu surgimento \n" +
        "histórico no Reino do Norte, revela aspectos \n" +
        "centrais da vocação profética em contextos \n" +
        "de decadência espiritual. Considerando o \n" +
        "testemunho bíblico acerca de Elias e sua \n" +
        "atuação diante de um cenário marcado pela \n" +
        "infidelidade a Deus, assinale a alternativa \n" +
        "que melhor expressa o significado \n" +
        "teológico e missional de sua postura, \n" +
        "aplicável também à atuação da Igreja na \n" +
        "atualidade.",
      options: [
        {
          value: "a",
          label:
            "Elias representa um modelo de isolamento \n" +
            "espiritual, no qual a fidelidade a Deus exige \n" +
            "o afastamento definitivo da sociedade e de \n" +
            "seus conflitos morais.",
        },
        {
          value: "b",
          label:
            "A atuação de Elias evidencia que a missão \n" +
            "profética está condicionada à aprovação \n" +
            "política e religiosa das lideranças vigentes.",
        },
        {
          value: "c",
          label:
            "A postura de Elias demonstra que o amor \n" +
            "ao Senhor se manifesta prioritariamente por \n" +
            "meio da adaptação da mensagem divina às \n" +
            "demandas culturais do seu tempo.",
        },
        {
          value: "d",
          label:
            "O ministério de Elias aponta que a \n" +
            "fidelidade a Deus implica posicionamento \n" +
            "firme, dependência da provisão divina e \n" +
            "confronto profético diante de um mundo \n" +
            "dominado pelo pecado.",
        },
        {
          value: "e",
          label:
            "A experiência de Elias limita-se ao \n" +
            "contexto histórico de Israel, não oferecendo \n" +
            "parâmetros relevantes para a compreensão \n" +
            "da missão cristã contemporânea.",
        },
      ],
    },

    {
      id: "q2",
      title: "QUESTÃO 02",
      question:
        "O reinado de Acabe, no \n" +
        "Reino do Norte, é tradicionalmente \n" +
        "compreendido como um dos períodos de \n" +
        "maior afastamento espiritual da história de \n" +
        "Israel. A partir da análise bíblica desse \n" +
        "contexto, assinale a alternativa que melhor \n" +
        "expressa a relação entre liderança, prática \n" +
        "religiosa e juízo divino, conforme \n" +
        "apresentada nas Escrituras.",
      options: [
        {
          value: "a",
          label:
            "A decadência espiritual de Israel nesse \n" +
            "período ocorreu de forma independente das \n" +
            "decisões reais, estando relacionada apenas às \n" +
            "escolhas individuais do povo.",
        },
        {
          value: "b",
          label:
            "As práticas religiosas introduzidas \n" +
            "durante o reinado de Acabe representaram \n" +
            "uma ampliação legítima das formas de culto, \n" +
            "sem comprometer a fidelidade ao Senhor.",
        },
        {
          value: "c",
          label:
            "As alianças firmadas pelo rei tiveram \n" +
            "caráter exclusivamente político, não \n" +
            "exercendo influência significativa sobre a \n" +
            "vida espiritual da nação.",
        },
        {
          value: "d",
          label:
            "As decisões do rei contribuíram para a \n" +
            "corrupção do culto, estimularam práticas \n" +
            "reprováveis aos olhos do Senhor e \n" +
            "demandaram uma atuação profética \n" +
            "confrontadora.",
        },
        {
          value: "e",
          label:
            "O juízo divino manifestado nesse período \n" +
            "contradiz o caráter misericordioso de Deus, \n" +
            "revelando uma resposta desproporcional às \n" +
            "ações humanas.",
        },
      ],
    },

    {
      id: "q3",
      title: "QUESTÃO 03",
      question:
        "O surgimento do profeta \n" +
        "Elias no cenário histórico de Israel, durante \n" +
        "o reinado de um dos monarcas mais \n" +
        "perversos da nação, revela um padrão \n" +
        "recorrente da ação divina ao longo da \n" +
        "história da redenção. O texto de referência \n" +
        "associa esse padrão às reflexões paulinas em \n" +
        "1 Coríntios 1.26–28 e à compreensão \n" +
        "neotestamentária do papel da Igreja. À luz \n" +
        "desse estudo, o levantamento de Elias por \n" +
        "Deus expressa, teologicamente, o princípio \n" +
        "de que:",
      options: [
        {
          value: "a",
          label:
            "Deus prefere agir por meio de \n" +
            "personagens marginalizados para evitar \n" +
            "confrontos diretos com estruturas políticas e \n" +
            "religiosas consolidadas.",
        },
        {
          value: "b",
          label:
            "A ausência de genealogia e formação \n" +
            "profética formal em Elias indica que o \n" +
            "ministério profético prescinde de preparo \n" +
            "espiritual prévio.",
        },
        {
          value: "c",
          label:
            "A escolha de Elias confirma que a \n" +
            "soberania divina se manifesta ao utilizar \n" +
            "instrumentos considerados fracos e \n" +
            "desprezados para confrontar poderes \n" +
            "estabelecidos e cumprir Seus propósitos \n" +
            "eternos.",
        },
        {
          value: "d",
          label:
            "O chamado profético de Elias representa \n" +
            "uma exceção histórica, não podendo ser \n" +
            "relacionado à identidade da Igreja no Novo \n" +
            "Testamento.",
        },
        {
          value: "e",
          label:
            "A origem simples de Elias demonstra que \n" +
            "a rusticidade cultural é condição \n" +
            "indispensável para o exercício da autoridade \n" +
            "espiritual.",
        },
      ],
    },

    {
      id: "q4",
      title: "QUESTÃO 04",
      question:
        "Na lição 1 aprendemos que \n" +
        "Elias tinha uma mensagem a levar, uma \n" +
        "mensagem de juízo expressa em I Rs 17.1, \n" +
        "mas ainda assim revestida de profundo \n" +
        "significado espiritual. Na expressão do \n" +
        "profeta, fica expressa que a firmeza dele \n" +
        "provém:",
      options: [
        {
          value: "a",
          label:
            "De si mesmo, pois sua formação espiritual \n" +
            "sólida era capaz de lhe garantir vencer \n" +
            "qualquer desafio.",
        },
        {
          value: "b",
          label:
            "De um profundo compromisso com Deus, \n" +
            "perante quem Elias permanecia, sabendo que \n" +
            "O SENHOR é vivo e O único Deus de Israel.",
        },
        {
          value: "c",
          label:
            "Do impacto causado pela ação de \n" +
            "mudança espiritual expresso pela conversão \n" +
            "de Jezabel e dos profetas de Azera.",
        },
        {
          value: "d",
          label:
            "Da certeza que o coração do povo já \n" +
            "estava decidido por Deus, a multidão o \n" +
            "apoiaria pois nunca havia entrado \n" +
            "verdadeiramente no caminho da idolatria.",
        },
        {
          value: "e",
          label:
            "Do acordo feito junto aos profetas \n" +
            "escondidos e liderança militar das nações \n" +
            "vizinhas.",
        },
      ],
    },

    {
      id: "q5",
      title: "QUESTÃO 05",
      question:
        "“Então lhe veio a palavra do \n" +
        "Senhor, dizendo: Levanta-te, vai a Sarepta, \n" +
        "que é de Sidom, e habita ali; eis que ordenei \n" +
        "ali a uma mulher viúva que te sustente.”\n" +
        "(1 Reis 17.8-9)\n" +
        "A partir do texto bíblico e do contexto do \n" +
        "ministério de Elias, assinale a alternativa que \n" +
        "melhor expressa o ensino teológico central \n" +
        "dessa experiência.",
      options: [
        {
          value: "a",
          label:
            "A providência divina elimina a \n" +
            "necessidade de obediência humana diante \n" +
            "das ordens de Deus.",
        },
        {
          value: "b",
          label:
            "O cuidado de Deus manifesta-se \n" +
            "prioritariamente em ambientes confortáveis \n" +
            "e previsíveis.",
        },
        {
          value: "c",
          label:
            "A provisão divina está condicionada \n" +
            "exclusivamente aos recursos materiais \n" +
            "disponíveis no lugar.",
        },
        {
          value: "d",
          label:
            "Deus conduz seus servos a caminhos \n" +
            "inesperados, ensinando dependência e \n" +
            "submissão à sua vontade soberana.",
        },
        {
          value: "e",
          label:
            "A experiência de Elias em Sarepta \n" +
            "demonstra a superioridade espiritual de \n" +
            "Israel sobre as demais nações.",
        },
      ],
    },

    {
      id: "q6",
      title: "QUESTÃO 06",
      question:
        "A experiência do profeta \n" +
        "Elias no ribeiro de Querite constitui um \n" +
        "importante momento pedagógico na sua \n" +
        "formação espiritual e ministerial. À luz do \n" +
        "relato bíblico e de sua interpretação \n" +
        "teológica, analise as proposições a seguir:\n\n" +
        "I. O período em Querite evidencia que Deus \n" +
        "conduz seus servos por processos de \n" +
        "humilhação e anonimato como parte do \n" +
        "preparo para responsabilidades maiores.\n\n" +
        "II. A provisão por meio dos corvos ensina \n" +
        "que a confiança em Deus se fortalece quando \n" +
        "o servo passa a depender exclusivamente da \n" +
        "palavra divina, mesmo em contextos \n" +
        "improváveis.\n\n" +
        "III. O secar do ribeiro revela que a \n" +
        "providência de Deus está condicionada à \n" +
        "estabilidade das circunstâncias, exigindo que \n" +
        "o servo busque alternativas por conta \n" +
        "própria.\n\n" +
        "Assinale a alternativa CORRETA.",
      options: [
        { value: "a", label: "Apenas I está correta." },
        { value: "b", label: "Apenas II está correta." },
        { value: "c", label: "Apenas I e II estão corretas." },
        { value: "d", label: "Apenas I e III estão corretas." },
        { value: "e", label: "I, II e III estão corretas." },
      ],
    },

    {
      id: "q7",
      title: "QUESTÃO 07",
      question:
        "A experiência de Elias em \n" +
        "Sarepta é apresentada nas Escrituras como \n" +
        "um processo de refinamento espiritual, no \n" +
        "qual fé, dependência e submissão à vontade \n" +
        "divina são profundamente exercitadas. \n" +
        "Considerando o relato bíblico e seus \n" +
        "ensinamentos teológicos, assinale a \n" +
        "alternativa INCORRETA.",
      options: [
        {
          value: "a",
          label:
            "O significado de Sarepta como “forno de \n" +
            "fundição” simboliza um estágio mais \n" +
            "profundo de purificação espiritual na vida do \n" +
            "profeta.",
        },
        {
          value: "b",
          label:
            "Elias demonstrou maturidade espiritual ao \n" +
            "não se mover de Querite até receber uma \n" +
            "direção clara do Senhor, evitando agir por \n" +
            "iniciativa própria.",
        },
        {
          value: "c",
          label:
            "Ao depender de uma viúva pobre e \n" +
            "estrangeira, Elias aprendeu que a \n" +
            "providência divina pode operar por meios \n" +
            "humanos improváveis.",
        },
        {
          value: "d",
          label:
            "As circunstâncias adversas enfrentadas por \n" +
            "Elias em Sarepta indicam que ele havia \n" +
            "saído do centro da vontade de Deus, sendo \n" +
            "provado por sua desobediência.",
        },
        {
          value: "e",
          label:
            "A postura de Elias diante da viúva revela \n" +
            "fé e coragem fundamentadas na promessa \n" +
            "divina, mesmo diante da escassez extrema.",
        },
      ],
    },

    {
      id: "q8",
      title: "QUESTÃO 08",
      question:
        "O episódio da viúva de \n" +
        "Sarepta constitui um dos relatos mais \n" +
        "didáticos das Escrituras acerca da fé prática, \n" +
        "da obediência e da ação da providência \n" +
        "divina. Considerando o ensino bíblico desse \n" +
        "episódio e suas implicações para a vida \n" +
        "cristã, analise as proposições a seguir:\n\n" +
        "I. A atitude da viúva ao atender ao pedido do \n" +
        "profeta demonstra a priorização do Reino de \n" +
        "Deus acima das necessidades imediatas.\n\n" +
        "II. O reconhecimento explícito da escassez \n" +
        "revela que a fé bíblica exige negar a \n" +
        "realidade das limitações humanas.\n\n" +
        "III. A obediência da viúva precedeu a \n" +
        "manifestação do milagre, evidenciando a \n" +
        "confiança na palavra de Deus.\n\n" +
        "IV. A presença do profeta na casa da viúva \n" +
        "simboliza a mediação divina, pela qual a \n" +
        "provisão do Senhor se torna contínua.\n\n" +
        "V. O episódio ensina que a experiência com \n" +
        "os milagres de Deus está associada à fé \n" +
        "obediente e perseverante.\n\n" +
        "Assinale a alternativa CORRETA.",
      options: [
        { value: "a", label: "Apenas I, III e V estão corretas." },
        { value: "b", label: "Apenas I, II e IV estão corretas." },
        { value: "c", label: "Apenas II, III e IV estão corretas." },
        { value: "d", label: "Apenas I, III, IV e V estão corretas." },
        { value: "e", label: "I, II, III, IV e V estão corretas." },
      ],
    },

    {
      id: "q9",
      title: "QUESTÃO 09",
      question:
        "Leia atentamente os \n" +
        "trechos a seguir, extraídos de hinos da \n" +
        "Harpa Cristã:\n" +
        "Texto I – Hino 298 (HC)\n" +
        "“Glória a Deus, pois vencerei\n" +
        "Glória a Deus, pois vencerei\n" +
        "Triunfante sigo, levando a cruz\n" +
        "Glória a Deus, pois vencerei\n" +
        "Glória a Deus, pois vencerei\n" +
        "Em nome de Jesus”\n\n" +
        "Texto II – Hino 372 (HC)\n" +
        "“Vencerá, vencerá, por Seu sangue vencerá\n" +
        "Vencerá, vencerá, sempre vencerá\n" +
        "Pois Jesus, que impera, novas forças dá\n" +
        "E quem n'Ele espera sempre vencerá”\n\n" +
        "Considerando a mensagem teológica \n" +
        "presente nos hinos e o confronto espiritual \n" +
        "narrado em 1 Reis 18.16–24, assinale a \n" +
        "alternativa que melhor estabelece a relação \n" +
        "entre a experiência de fé expressa nos \n" +
        "cânticos e a postura do profeta Elias \n" +
        "diante dos desafios espirituais.",
      options: [
        {
          value: "a",
          label:
            "Os hinos enfatizam uma espiritualidade \n" +
            "subjetiva e emocional, enquanto o episódio \n" +
            "do Carmelo destaca exclusivamente a \n" +
            "manifestação de sinais extraordinários.",
        },
        {
          value: "b",
          label:
            "A vitória proclamada nos hinos está \n" +
            "associada ao esforço humano contínuo, ao \n" +
            "passo que Elias atribui o resultado do \n" +
            "confronto à mobilização coletiva do povo.",
        },
        {
          value: "c",
          label:
            "Tanto os hinos quanto a atuação de Elias \n" +
            "revelam que a vitória espiritual está \n" +
            "fundamentada na fidelidade ao Senhor e na \n" +
            "confiança absoluta em Seu poder soberano.",
        },
        {
          value: "d",
          label:
            "Os textos poéticos abordam uma fé de \n" +
            "caráter individual, enquanto o episódio \n" +
            "bíblico se limita a um conflito de natureza \n" +
            "político-religiosa.",
        },
        {
          value: "e",
          label:
            "A mensagem dos hinos evita o confronto \n" +
            "direto, ao passo que Elias promove um \n" +
            "embate público, evidenciando perspectivas \n" +
            "teológicas opostas.",
        },
      ],
    },

    {
      id: "q10",
      title: "QUESTÃO 10",
      question:
        "O encontro entre Elias e \n" +
        "Acabe, mediado pela atuação de Obadias, \n" +
        "revela diferentes posturas diante da crise \n" +
        "espiritual que assolava Israel. A partir da \n" +
        "análise desse episódio, estabeleça a \n" +
        "correlação correta entre os \n" +
        "personagens/situações (Coluna I) e as \n" +
        "características/ações que melhor os definem \n" +
        "(Coluna II).\n\n" +
        "Coluna I\n" +
        "1. Elias diante de Acabe\n" +
        "2. Obadias no contexto do reinado de \n" +
        "Acabe\n" +
        "3. Acabe diante da calamidade em \n" +
        "Israel\n\n" +
        "Coluna II\n" +
        "( ) Reconhece a ação soberana de Deus \n" +
        "mesmo em meio à corrupção espiritual, \n" +
        "assumindo riscos para proteger os servos do \n" +
        "Senhor.\n" +
        "( ) Interpreta a crise nacional a partir de uma \n" +
        "lógica distorcida, transferindo a \n" +
        "responsabilidade espiritual para quem \n" +
        "proclama a verdade.\n" +
        "( ) Assume postura ousada e obediente à \n" +
        "ordem divina, colocando a fidelidade a Deus \n" +
        "acima da própria segurança pessoal.\n\n" +
        "Assinale a alternativa que apresenta a \n" +
        "sequência CORRETA, de cima para baixo.",
      options: [
        { value: "a", label: "1 – 2 – 3" },
        { value: "b", label: "2 – 3 – 1" },
        { value: "c", label: "3 – 1 – 2" },
        { value: "d", label: "2 – 1 – 3" },
        { value: "e", label: "1 – 3 – 2" },
      ],
    },

    {
      id: "q11",
      title: "QUESTÃO 11",
      question:
        "Leia atentamente o texto \n" +
        "bíblico a seguir:\n\n" +
        "“Então Elias se chegou a todo o povo e \n" +
        "disse: Até quando coxeareis entre dois \n" +
        "pensamentos? Se o Senhor é Deus, segui-o; \n" +
        "e, se Baal, segui-o. Porém o povo não lhe \n" +
        "respondeu nada.” (1 Reis 18.21)\n\n" +
        "À luz do episódio do monte Carmelo e da \n" +
        "atuação do profeta Elias diante dos profetas \n" +
        "de Baal, assinale a alternativa \n" +
        "INCORRETA.",
      options: [
        {
          value: "a",
          label:
            "A convocação do povo e dos profetas ao \n" +
            "Carmelo indica que os confrontos espirituais \n" +
            "decisivos são precedidos por preparação \n" +
            "espiritual e dependência de Deus.",
        },
        {
          value: "b",
          label:
            "O apelo de Elias ao povo revela a \n" +
            "incompatibilidade entre a fidelidade ao \n" +
            "Senhor e a tentativa de conciliar o culto \n" +
            "verdadeiro com a idolatria.",
        },
        {
          value: "c",
          label:
            "O silêncio do povo diante da exortação de \n" +
            "Elias evidencia a crise espiritual de Israel e a \n" +
            "ausência de posicionamento claro diante da \n" +
            "verdade.",
        },
        {
          value: "d",
          label:
            "O desafio aos profetas de Baal demonstra \n" +
            "que a eficácia espiritual depende da \n" +
            "quantidade de recursos humanos e da \n" +
            "intensidade do esforço religioso.",
        },
        {
          value: "e",
          label:
            "A vitória de Elias no Carmelo evidencia \n" +
            "que os recursos provenientes de Deus são \n" +
            "superiores às forças meramente humanas e \n" +
            "religiosas.",
        },
      ],
    },

    {
      id: "q12",
      title: "QUESTÃO 12",
      image: {
        src: "image-elias.jpeg",
        alt: "Elias ajoelhado diante de um altar de pedras, com fogo descendo do céu; pessoas ao fundo observam.",
      },
      question:
        "A imagem apresentada retrata um momento \n" +
        "decisivo do ministério do profeta Elias, em \n" +
        "um contexto de confronto espiritual e \n" +
        "restauração do culto ao Senhor. \n" +
        "Considerando o episódio bíblico \n" +
        "correspondente e suas implicações \n" +
        "teológicas, analise as proposições a seguir:\n\n" +
        "I. A reconstrução do altar simboliza não \n" +
        "apenas um ato litúrgico, mas a restauração da \n" +
        "comunhão entre Deus e o Seu povo, rompida\n" +
        "pela infidelidade espiritual.\n\n" +
        "II. A postura de Elias evidencia que a \n" +
        "eficácia da ação profética está vinculada à \n" +
        "obediência à palavra do Senhor, e não a \n" +
        "estratégias humanas ou demonstrações \n" +
        "espetaculares.\n\n" +
        "III. O contraste entre as práticas dos profetas \n" +
        "de Baal e a oração de Elias revela a \n" +
        "superioridade de métodos religiosos mais \n" +
        "intensos e sacrificiais.\n\n" +
        "IV. A resposta divina por meio do fogo \n" +
        "confirma a soberania de Deus e tem como \n" +
        "finalidade principal revelar quem é o \n" +
        "verdadeiro Senhor diante do povo.\n\n" +
        "V. A sequência dos acontecimentos indica \n" +
        "que a restauração espiritual precede a \n" +
        "restauração material, evidenciada \n" +
        "posteriormente pela chuva.\n\n" +
        "Assinale a alternativa que contém apenas as \n" +
        "proposições CORRETAS:",
      options: [
        { value: "a", label: "I, II e IV" },
        { value: "b", label: "I, II, IV e V" },
        { value: "c", label: "II, III e IV" },
        { value: "d", label: "I, III e V" },
        { value: "e", label: "I, II, III e V" },
      ],
    },

    {
      id: "q13",
      title: "QUESTÃO 13",
      question:
        "O contraste entre a vitória \n" +
        "pública de Elias no monte Carmelo e sua \n" +
        "fuga motivada pela ameaça de Jezabel \n" +
        "evidencia uma tensão recorrente na \n" +
        "experiência do servo de Deus. A lição \n" +
        "articula essa tensão com textos paulinos e \n" +
        "com a realidade da caminhada cristã. À luz \n" +
        "dessa abordagem, a reação de Elias após o \n" +
        "Carmelo revela que:",
      options: [
        {
          value: "a",
          label:
            "A vitória espiritual elimina \n" +
            "definitivamente o risco de abatimento \n" +
            "emocional e espiritual no servo de Deus.",
        },
        {
          value: "b",
          label:
            "A manifestação sobrenatural do poder \n" +
            "divino no Carmelo foi insuficiente para \n" +
            "sustentar Elias em longo prazo.",
        },
        {
          value: "c",
          label:
            "A experiência de grandes vitórias não \n" +
            "anula a continuidade da guerra espiritual \n" +
            "nem a necessidade constante de dependência \n" +
            "de Deus.",
        },
        {
          value: "d",
          label:
            "O medo de Elias demonstra falta de fé \n" +
            "incompatível com o ministério profético \n" +
            "autêntico.",
        },
        {
          value: "e",
          label:
            "A perseguição de Jezabel indica que Deus \n" +
            "havia retirado temporariamente Seu favor do \n" +
            "profeta.",
        },
      ],
    },

    {
      id: "q14",
      title: "QUESTÃO 14",
      question:
        "A lição afirma que o medo \n" +
        "experimentado por Elias não deve ser \n" +
        "compreendido apenas como um sentimento, \n" +
        "mas como um espírito que influencia \n" +
        "decisões, percepções e atitudes, conforme 2 \n" +
        "Timóteo 1.7. Com base nessa compreensão, \n" +
        "o texto ensina que o medo:",
      options: [
        {
          value: "a",
          label:
            "É inevitável e permanente na vida dos \n" +
            "servos de Deus, devendo ser aceito como \n" +
            "parte natural da espiritualidade.",
        },
        {
          value: "b",
          label:
            "Surge quando o homem passa a interpretar \n" +
            "a realidade apenas à luz das ameaças \n" +
            "visíveis, desviando o olhar da soberania \n" +
            "divina.",
        },
        {
          value: "c",
          label:
            "Constitui uma virtude necessária para \n" +
            "preservar o profeta de riscos excessivos no \n" +
            "cumprimento do chamado.",
        },
        {
          value: "d",
          label:
            "É sinal inequívoco de apostasia espiritual \n" +
            "e abandono completo da fé.",
        },
        {
          value: "e",
          label:
            "Decorre exclusivamente de fatores \n" +
            "psicológicos, sem implicações espirituais.",
        },
      ],
    },

    {
      id: "q15",
      title: "QUESTÃO 15",
      question:
        "No relato de 1 Reis 19, Elias \n" +
        "se afasta do povo, deixa seu moço e caminha \n" +
        "para o deserto. A lição distingue entre \n" +
        "desertos permitidos por Deus e desertos \n" +
        "escolhidos pelo próprio homem. Segundo \n" +
        "essa reflexão, o erro central de Elias nesse \n" +
        "momento foi:",
      options: [
        {
          value: "a",
          label:
            "Atravessar regiões longas sem \n" +
            "planejamento físico adequado.",
        },
        {
          value: "b",
          label:
            "Buscar o deserto como espaço de\n" +
            "isolamento pessoal, e não como ambiente \n" +
            "conduzido pela direção divina.",
        },
        {
          value: "c",
          label:
            "Abandonar temporariamente o ministério \n" +
            "profético para preservar sua vida.",
        },
        {
          value: "d",
          label:
            "Reconhecer sua fragilidade emocional \n" +
            "diante das ameaças sofridas.",
        },
        {
          value: "e",
          label:
            "Desejar a morte como expressão de \n" +
            "humildade extrema diante de Deus.",
        },
      ],
    },

    {
      id: "q16",
      title: "QUESTÃO 16",
      question:
        "O socorro prestado por \n" +
        "Deus a Elias no deserto ocorre por meio de \n" +
        "descanso, toque angelical, alimento e \n" +
        "encorajamento, sem qualquer palavra de \n" +
        "reprovação. Essa sequência revela um \n" +
        "princípio teológico relevante sobre a ação \n" +
        "divina diante da fragilidade humana. À luz \n" +
        "do texto estudado, esse princípio pode ser \n" +
        "corretamente compreendido como:",
      options: [
        {
          value: "a",
          label:
            "A substituição do ministério profético por \n" +
            "intervenção angelical direta.",
        },
        {
          value: "b",
          label:
            "A prioridade da restauração física antes de \n" +
            "qualquer restauração espiritual.",
        },
        {
          value: "c",
          label:
            "A demonstração de que Deus reprova \n" +
            "silenciosamente Seus servos quando falham \n" +
            "emocionalmente.",
        },
        {
          value: "d",
          label:
            "A manifestação da graça restauradora de \n" +
            "Deus, que fortalece o servo antes de \n" +
            "conduzi-lo novamente ao propósito.",
        },
        {
          value: "e",
          label:
            "A suspensão temporária da missão \n" +
            "profética até que o servo prove sua \n" +
            "fidelidade.",
        },
      ],
    },

    {
      id: "q17",
      title: "QUESTÃO 17",
      question:
        "A caminhada de elias até \n" +
        "Horebe não foi direta, mas prolongada, \n" +
        "marcada por quarenta dias e noites de \n" +
        "deslocamento, sustentado pelo alimento \n" +
        "provido por deus. a lição associa esse \n" +
        "percurso a outros períodos bíblicos de \n" +
        "quarenta dias ou anos. à luz dessa correlação \n" +
        "bíblica, o tempo prolongado da caminhada \n" +
        "de Elias até Horebe simboliza:",
      options: [
        {
          value: "a",
          label:
            "A punição divina pela fuga de elias após a \n" +
            "ameaça de jezabel.",
        },
        {
          value: "b",
          label:
            "A necessidade de isolamento absoluto \n" +
            "como condição para a revelação divina.",
        },
        {
          value: "c",
          label:
            "Um processo pedagógico de deus, voltado \n" +
            "ao quebrantamento, dependência e \n" +
            "renovação espiritual do servo.",
        },
        {
          value: "d",
          label:
            "A limitação física do profeta, incapaz de \n" +
            "percorrer o caminho em menor tempo.",
        },
        {
          value: "e",
          label:
            "A repetição mecânica de um padrão \n" +
            "numérico sem implicação teológica.",
        },
      ],
    },

    {
      id: "q18",
      title: "QUESTÃO 18",
      question:
        "O monte Horebe é \n" +
        "apresentado como lugar de revelação, \n" +
        "orientação e reencontro com Deus, tanto no \n" +
        "Antigo quanto no Novo Testamento. A lição \n" +
        "destaca que, no Horebe, Deus fala de \n" +
        "maneira específica e direcionadora. \n" +
        "Considerando essa perspectiva, o significado \n" +
        "espiritual de Horebe para a vida do crente \n" +
        "pode ser corretamente compreendido como:",
      options: [
        {
          value: "a",
          label:
            "um espaço geográfico exclusivo, \n" +
            "inacessível fora do contexto histórico de \n" +
            "Israel.",
        },
        {
          value: "b",
          label:
            "um símbolo de fuga legítima das \n" +
            "responsabilidades ministeriais.",
        },
        {
          value: "c",
          label:
            "um ambiente onde Deus se manifesta \n" +
            "apenas por meio de sinais extraordinários.",
        },
        {
          value: "d",
          label:
            "um tempo e lugar conduzidos por Deus \n" +
            "para revelar Sua vontade e alinhar o servo ao \n" +
            "Seu propósito.",
        },
        {
          value: "e",
          label:
            "uma etapa final da caminhada espiritual, \n" +
            "após a qual não há mais desafios.",
        },
      ],
    },

    {
      id: "q19",
      title: "QUESTÃO 19",
      question:
        "Quando Elias se encontra na \n" +
        "caverna em Horebe, a Palavra do Senhor o \n" +
        "alcança com a pergunta: “Que fazes aqui, \n" +
        "Elias?”. A lição enfatiza o caráter \n" +
        "confrontador e restaurador dessa indagação \n" +
        "divina. Teologicamente, essa pergunta revela \n" +
        "que:",
      options: [
        {
          value: "a",
          label:
            "Deus desconhecia o paradeiro exato do \n" +
            "profeta naquele momento.",
        },
        {
          value: "b",
          label:
            "Elias havia sido conduzido por Deus à \n" +
            "caverna como local definitivo de descanso.",
        },
        {
          value: "c",
          label:
            "A pergunta divina visa despertar a \n" +
            "consciência do servo quanto ao afastamento \n" +
            "do propósito original.",
        },
        {
          value: "d",
          label:
            "O questionamento expressa reprovação \n" +
            "severa e rejeição do ministério de Elias.",
        },
        {
          value: "e",
          label:
            "Deus aceitava plenamente a justificativa \n" +
            "apresentada por Elias.",
        },
      ],
    },

    {
      id: "q20",
      title: "QUESTÃO 20",
      question:
        "Ao se manifestar a Elias em \n" +
        "Horebe, o Senhor não fala por meio de vento \n" +
        "forte, terremoto ou fogo, mas em um “cicio \n" +
        "tranquilo e suave”. Esse modo de revelação \n" +
        "contrasta com experiências anteriores do \n" +
        "ministério do profeta. Conforme a lição, essa \n" +
        "forma de manifestação divina ensina que:",
      options: [
        {
          value: "a",
          label:
            "Deus abandonou os sinais sobrenaturais \n" +
            "como meio legítimo de revelação.",
        },
        {
          value: "b",
          label:
            "A ausência de manifestações \n" +
            "espetaculares indica distanciamento divino.",
        },
        {
          value: "c",
          label: "Deus limita Sua revelação a momentos de \n" + "silêncio absoluto.",
        },
        {
          value: "d",
          label:
            "O Senhor pode agir tanto de forma \n" +
            "poderosa quanto silenciosa, mantendo Sua \n" +
            "soberania e cuidado.",
        },
        {
          value: "e",
          label:
            "Apenas profetas maduros são capazes de \n" +
            "ouvir a voz suave de Deus.",
        },
      ],
    },

    {
      id: "q21",
      title: "QUESTÃO 21",
      question:
        "\"Elias era homem sujeito às \n" +
        "mesmas paixões que nós e, orando, pediu \n" +
        "que não chovesse e, por três anos e seis \n" +
        "meses, não choveu sobre a terra. (Tg 5.17)\".\n" +
        "O versículo escrito por Tiago, servo do \n" +
        "Senhor, expressa de maneira cristalina a \n" +
        "humanidade de Elias. A trajetória vitoriosa \n" +
        "de Elias nos ensina que Deus usa pessoas \n" +
        "comuns para propósitos extraordinários. Na \n" +
        "lição de número 6, não é uma característica \n" +
        "humana citada deste homem usado por \n" +
        "Deus:",
      options: [
        { value: "a", label: "Dependente." },
        { value: "b", label: "Sujeito ao esgotamento." },
        { value: "c", label: "Impetuosidade." },
        { value: "d", label: "Isolamento." },
        { value: "e", label: "Experiência de desânimo e medo." },
      ],
    },

    {
      id: "q22",
      title: "QUESTÃO 22",
      question:
        "Quando lemos que Elias era \n" +
        "igual a nós e que ele orou e Deus atendeu, \n" +
        "compreendemos, então, que os recursos à \n" +
        "disposição do homem de Deus estão também\n" +
        "à nossa mercê como cristãos. Tiago diz que \n" +
        "ele “orou com fervor” (NAA) e “depois \n" +
        "orou de novo”, mostrando que a oração era \n" +
        "uma prática constante e habitual em sua \n" +
        "vida. Acerca da oração feita por Elias, o \n" +
        "texto de Tiago 5.17 revela que a seca \n" +
        "(ausência de chuva) profetizada por Elias, \n" +
        "bem como a posterior chegada da chuva \n" +
        "foram antecedidas por oração. Assinale a \n" +
        "alternativa com o versículo que melhor se \n" +
        "harmoniza ao contexto e propósito desta \n" +
        "oração de Elias:",
      options: [
        {
          value: "a",
          label:
            "\"E os seus discípulos, Tiago e João, vendo \n" +
            "isto, disseram: Senhor, queres que digamos \n" +
            "que desça fogo do céu e os consuma, como \n" +
            "Elias também fez?\" (Lucas 9:54)",
        },
        {
          value: "b",
          label:
            "\"E Elias tomou o menino, e o trouxe do \n" +
            "quarto à casa, e o deu à sua mãe; e disse \n" +
            "Elias: Vês aí, teu filho vive.\" (1 Reis 17:23)",
        },
        { value: "c", label: "\"A oração do justo pode muito em seus \n" + "efeitos.\" (Tiago 5:16b)" },
        {
          value: "d",
          label:
            "\"Então orou Ana, e disse: O meu coração \n" +
            "exulta ao Senhor, o meu poder está exaltado \n" +
            "no Senhor; a minha boca se dilatou sobre os \n" +
            "meus inimigos, porquanto me alegro na tua \n" +
            "salvação.\" (1 Samuel 2:1)",
        },
        { value: "e", label: "\"Faz a tua parte e Eu te ajudarei.\" (II Sm \n" + "21.18)" },
      ],
    },

    {
      id: "q23",
      title: "QUESTÃO 23",
      question:
        "A marca mais profunda da \n" +
        "vida de Elias foi sua paixão ardente pelo \n" +
        "Senhor. Nada movia suas decisões mais do \n" +
        "que o desejo de honrar a Deus. Seu coração \n" +
        "queimava com zelo pela santidade divina, \n" +
        "como ele mesmo declarou: “Tenho sido \n" +
        "extremamente zeloso pelo Senhor” (1Rs \n" +
        "19.10). São pontuados como subtópicos pelo \n" +
        "comentarista da Lição 6:",
      options: [
        {
          value: "a",
          label:
            "Um homem em Defesa do Seu Deus, Um \n" +
            "homem intercessor, Um homem disposto ao \n" +
            "sacrifício.",
        },
        {
          value: "b",
          label:
            "Um homem diferenciado, Um profeta \n" +
            "convicto, Um homem em Defesa do Seu \n" +
            "Deus.",
        },
        {
          value: "c",
          label:
            "Um vaso de honra nas mãos dO Senhor, \n" +
            "Um servo incomum, Uma flecha nas mãos \n" +
            "do Valente.",
        },
        { value: "d", label: "Uma tocha de fogo, Um instrumento de \n" + "juízo, Um pai amoroso." },
        { value: "e", label: "Um servo de orelha furada, Um pregador \n" + "eloquente, Um amigo fiel." },
      ],
    },

    {
      id: "q24",
      title: "QUESTÃO 24",
      question:
        "Acerca da humanidade de \n" +
        "Elias, assinale a alternativa que sintetiza a \n" +
        "reflexão proposta na lição 6.",
      options: [
        {
          value: "a",
          label:
            "\"E disse o Senhor a Caim: Onde está Abel, \n" +
            "teu irmão? E ele disse: Não sei; sou eu \n" +
            "guardador do meu irmão?\" (Gênesis 4:9)",
        },
        {
          value: "b",
          label:
            "\"Quando Ezequias diz: ‘O Senhor, o nosso \n" +
            "Deus, nos salvará das mãos do rei da \n" +
            "Assíria’, ele os está enganando, para deixá￾\n" +
            "los morrer de fome e de sede.\" (2 Crônicas \n" +
            "32:11)",
        },
        {
          value: "c",
          label:
            "\"Pois, quem sabe o que é bom para o \n" +
            "homem, nos poucos dias de sua vida vazia, \n" +
            "em que ele passa como uma sombra? Quem \n" +
            "poderá lhe contar o que acontecerá debaixo \n" +
            "do sol depois que ele partir?\" (Eclesiastes \n" +
            "6:12)",
        },
        {
          value: "d",
          label:
            "\"O fariseu, em pé, orava no íntimo: ‘Deus, \n" +
            "eu te agradeço porque não sou como os \n" +
            "outros homens: ladrões, corruptos, \n" +
            "adúlteros; nem mesmo como este publicano. \n" +
            "Jejuo duas vezes por semana e dou o dízimo \n" +
            "de tudo quanto ganho’.\" (Lucas 18:11,12)",
        },
        {
          value: "e",
          label:
            "\"Temos, porém, este tesouro em vasos de \n" +
            "barro, para que a excelência do poder seja de \n" +
            "Deus, e não de nós.\" (2 Coríntios 4:7)",
        },
      ],
    },

    {
      id: "q25",
      title: "QUESTÃO 25",
      question:
        "A trasladação do profeta \n" +
        "Elias é uma mensagem atual para a Igreja do \n" +
        "Senhor. Ela mostra a soberania e a \n" +
        "autoridade de Deus para definir o futuro de \n" +
        "cada um de nós. É Ele quem define o fim da \n" +
        "vida de seus servos, como no caso de \n" +
        "Moisés, a quem Ele mesmo sepultou (Dt \n" +
        "34.5,6). Já na vida de Enoque e de Elias, \n" +
        "Deus estabeleceu exceções à morte, \n" +
        "apontando para o arrebatamento dos santos \n" +
        "na volta de Jesus (Gn 5.24; 2 Rs 2.11). \n" +
        "Acerca desta trasladação, foi responsável \n" +
        "pela separação e sua subida ao céu, \n" +
        "respectivamente:",
      options: [
        { value: "a", label: "Um turbilhão e uma carruagem de ouro" },
        { value: "b", label: "Um vento veemente e um trovão" },
        { value: "c", label: "Uma brisa suave e uma nuvem" },
        { value: "d", label: "Um carro de fogo e um redemoinho" },
        { value: "e", label: "Uma capa e um cetro" },
      ],
    },

    {
      id: "q26",
      title: "QUESTÃO 26",
      question:
        "Antes da trasladação de \n" +
        "Elias, a Bíblia registra em II Reis 2 que ele \n" +
        "passou por diversos lugares. Elias estava em \n" +
        "Gilgal quando falou a Eliseu de sua partida \n" +
        "(2 Rs 2.1). A Palavra de Deus diz que ele \n" +
        "partiu dessa cidade em direção ao lugar onde \n" +
        "seria trasladado pelo Senhor. \n" +
        "Foram lugares por onde Elias passou em \n" +
        "seguida:",
      options: [
        { value: "a", label: "Horebe, Moriá e Jericó" },
        { value: "b", label: "Sucote, Meribá e Luz" },
        { value: "c", label: "Betel, Jericó e Jordão" },
        { value: "d", label: "Jerusalém, Cafarnaum e Mispa" },
        { value: "e", label: "Tebas, Tiberíades e Sinai" },
      ],
    },

    {
      id: "q27",
      title: "QUESTÃO 27",
      question:
        "\"Sucedeu que, havendo eles \n" +
        "passado, Elias disse a Eliseu: Pede-me o que \n" +
        "queres que te faça, antes que seja tomado de \n" +
        "ti. E disse Eliseu: Peço-te que haja porção \n" +
        "dobrada de teu espírito sobre mim. E disse: \n" +
        "Coisa difícil pediste; se me vires quando for \n" +
        "tomado de ti, assim se te fará, porém, se não, \n" +
        "não se fará.\" (2 Reis 2:9,10).\n" +
        "Segundo a lição 7, tal pedido feito por Eliseu \n" +
        "representava:",
      options: [
        {
          value: "a",
          label:
            "O seu desejo de superar Elias, haja vista \n" +
            "que sua idade era muito avançada.",
        },
        {
          value: "b",
          label:
            "Demonstrar ousadia espiritual ao profeta \n" +
            "antes de sua trasladação, para que ele \n" +
            "estivesse tranquilo com respeito à sucessão \n" +
            "no ministério profético",
        },
        { value: "c", label: "O desejo altruísta de ser um autêntico \n" + "discípulo de seu senhor" },
        {
          value: "d",
          label:
            "A expectativa pelo surgimento de uma \n" +
            "nova geração, capaz de ensinar a todos o que \n" +
            "tudo dependia da permissão de Elias para \n" +
            "autenticar Eliseu como profeta em seu lugar",
        },
        {
          value: "e",
          label:
            "Apresentar aos expectadores que a nova \n" +
            "geração de profetas é sempre mais capaz que \n" +
            "a anterior, pela obsolescência do anterior e \n" +
            "dupla capacidade do sucessor",
        },
      ],
    },

    {
      id: "q28",
      title: "QUESTÃO 28",
      question:
        "A Lição 7 ensina como \n" +
        "Elias, na condição de um autêntico servo de \n" +
        "Deus viveu. Antes de sua trasladação, Elias \n" +
        "confronta Acabe, demonstrando no episódio \n" +
        "que:",
      options: [
        { value: "a", label: "Tinha uma mensagem, uma identidade e \n" + "autoridade" },
        {
          value: "b",
          label:
            "Tinha uma posição de controle social, \n" +
            "uma perfeita concordância dos anciãos e \n" +
            "uma unção diferenciada",
        },
        { value: "c", label: "Tinha um vaso de barro a lançar sobre o \n" + "sacrifício, uma espada e um discípulo" },
        { value: "d", label: "Tinha um chifre de azeite, um pergaminho \n" + "e uma trombeta" },
        { value: "e", label: "Tinha um cutelo, um vaso de nardo puro e \n" + "uma capa" },
      ],
    },
  ],

  congregations: ["Comportas", "Lagoa 1", "Lagoa 2", "Engenho", "Alto do Céu", "Acaraú"],
};


// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

function onlyDigits(str) {
  return str.replace(/\D/g, "");
}

function formatCPF(cpf) {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11) return digits;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function isValidCPF(cpf) {
  const digits = onlyDigits(cpf);
  if (digits.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calc = (str) => {
    let sum = 0;
    let multiplier = str.length + 1;
    for (const digit of str) {
      sum += Number(digit) * multiplier;
      multiplier--;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const d1 = calc(digits.slice(0, 9));
  const d2 = calc(digits.slice(0, 9) + String(d1));
  return digits === digits.slice(0, 9) + String(d1) + String(d2);
}

function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = "device-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

function nowLocalString() {
  return new Date().toLocaleString("pt-BR");
}

function formatDate(date) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return date.toLocaleString("pt-BR");
}

// ============================================
// ESTADO GLOBAL
// ============================================

// No config.js, substitua o appState por este:
const appState = {
  currentUser: null,
  currentProfile: null,
  isExamReleased: false, 
  blockedStudents: [],
  deviceId: getOrCreateDeviceId(),
  timeLeft: 0,
  timerInterval: null
};

// APAGUE as funções loadAppState() e saveAppState() que usam localStorage.
// Deixe apenas a inicialização do Firebase.

// Carregar estado do localStorage

// ============================================
// ESTADO GLOBAL DO APP (appState)
// ============================================
// Precisamos definir appState ANTES de loadAppState() rodar, senão quebra o JS.
window.appState = window.appState || {
  currentUser: null,
  currentProfile: null,
  isExamReleased: false,
  blockedStudents: [],
  deviceId: null,
  timeLeft: 0,
  timerInterval: null,
  examStartedAt: null,
  rankingCache: []
};

// ID único do dispositivo (localStorage) - usado para travar CPF por aparelho
(function initDeviceId(){
  try {
    const key = 'deviceId';
    let id = localStorage.getItem(key);
    if (!id) {
      // Gera um id simples e suficiente para o uso aqui
      id = 'dev-' + Math.random().toString(16).slice(2) + '-' + Date.now().toString(16);
      localStorage.setItem(key, id);
    }
    appState.deviceId = id;
  } catch (e) {
    // fallback: sem localStorage, ainda funciona mas sem travamento por aparelho
    appState.deviceId = 'dev-volatile';
  }
})();




// Carregar estado ao iniciar


console.log("✅ Config.js carregado com sucesso!");
console.log("Device ID:", appState.deviceId);