// ============================================
// PROVA ONLINE - LÓGICA PRINCIPAL
// ============================================


// DOM Elements
const entryScreen = document.getElementById("entryScreen");
const examScreen = document.getElementById("examScreen");
const resultScreen = document.getElementById("resultScreen");
// (Admin views are declared once below in the Modal section)

// Entry Screen Elements
const statusAlert = document.getElementById("statusAlert");
const statusText = document.getElementById("statusText");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const registerMsg = document.getElementById("registerMsg");
const loginMsg = document.getElementById("loginMsg");

// Exam Screen Elements
const studentName = document.getElementById("studentName");
const currentTime = document.getElementById("currentTime");
const timeRemaining = document.getElementById("timeRemaining");
const questionsContainer = document.getElementById("questionsContainer");
const submitBtn = document.getElementById("submitBtn");

// Result Screen Elements
const resultName = document.getElementById("resultName");
const resultCPF = document.getElementById("resultCPF");
const resultReason = document.getElementById("resultReason");
const retryBtn = document.getElementById("retryBtn");

// Admin Elements
const adminBtnEntry = document.getElementById("adminBtnEntry");

// Modal
const adminModal = document.getElementById("adminModal");
const adminModalClose = document.getElementById("adminModalClose");

// Views
const adminScreen = document.getElementById("adminScreen");
const adminLoginScreen = document.getElementById("adminLoginScreen");

// Auth
const adminAuthForm = document.getElementById("adminAuthForm");
const adminAuthMsg = document.getElementById("adminAuthMsg");
const adminLogoutBtn = document.getElementById("adminLogoutBtn");
const adminUidEl = document.getElementById("adminUid");

// Release / Lists
const adminToggleReleaseBtn = document.getElementById("adminToggleReleaseBtn");
const adminToggleText = document.getElementById("adminToggleText");
const adminStatusDot = document.getElementById("adminStatusDot");
const adminStatusLabel = document.getElementById("adminStatusLabel");
const adminStatusDesc = document.getElementById("adminStatusDesc");
const adminReleaseMsg = document.getElementById("adminReleaseMsg");
const adminSearchBlocked = document.getElementById("adminSearchBlocked");
const adminBlockedList = document.getElementById("adminBlockedList");
const adminPendingList = document.getElementById("adminPendingList");
const adminSearchPending = document.getElementById("adminSearchPending");

// Ranking
const adminRefreshRankingBtn = document.getElementById("adminRefreshRankingBtn");
const rankingSort = document.getElementById("rankingSort");
const rankingCongregation = document.getElementById("rankingCongregation");
const rankingSearch = document.getElementById("rankingSearch");
const rankingTbody = document.getElementById("rankingTbody");
const rankingMsg = document.getElementById("rankingMsg");

// Variável para evitar que o sistema de segurança bloqueie o aluno ao enviar a prova
let isSubmitting = false;
// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (typeof initFirebase === 'function') {
        initFirebase(); // Isso ativa o database e o auth
    }
    initializeApp();
});

// Aguardar DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  console.log('🚀 Inicializando aplicação...');
  setupEventListeners();
  renderQuestions();
  updateStatusDisplay();
  updateClock();
  setInterval(updateClock, 1000);
  startGlobalObservers(); 
  console.log('✅ Aplicação inicializada!');

  window.addEventListener('examStatusChanged', (e) => {
  const isReleased = e.detail;
  if (statusAlert) {
    statusAlert.style.display = isReleased ? "none" : "flex"; //
  }
  updateReleaseStatus(); // Atualiza os botões do painel admin

});

}

// No app.js, dentro da função de inicialização ou após o Firebase conectar:
// ESCUTADOR EM TEMPO REAL

function startGlobalObservers() {
    if (!database) return;

    // Fica vigiando se o Admin mudou o botão de liberar
    database.ref('settings/isExamReleased').on('value', (snapshot) => {
        const released = snapshot.val();
        appState.isExamReleased = released;
        
        // Atualiza a tela de entrada do aluno automaticamente
        if (typeof updateStatusAlert === 'function') {
            updateStatusAlert();
        }
    });
}

function initializeApp() {
  console.log('🚀 Inicializando aplicação...');
  
  setupEventListeners();
  renderQuestions();
  
  // ADICIONE ESTA LINHA AQUI:
  startGlobalObservers(); 

  updateClock();
  setInterval(updateClock, 1000);
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tabName = e.currentTarget.dataset.tab;
      switchTab(tabName);
    });
  });

  // Forms
  registerForm.addEventListener("submit", handleRegister);
  loginForm.addEventListener("submit", handleLogin);


  // Admin (Modal)
  adminBtnEntry.addEventListener("click", openAdminLogin);

  // Fechar modal (botão X e clique fora)
  adminModalClose.addEventListener("click", closeAdminLogin);
  adminModal.addEventListener("click", (e) => {
    if (e.target === adminModal) closeAdminLogin();
  });

  adminAuthForm.addEventListener("submit", handleAdminLogin);
  adminToggleReleaseBtn.addEventListener("click", handleToggleRelease);
  adminLogoutBtn.addEventListener("click", handleAdminLogout);

  adminSearchBlocked.addEventListener("input", filterBlockedStudents);
  adminSearchPending.addEventListener("input", filterPendingStudents);

  // Ranking
  adminRefreshRankingBtn.addEventListener("click", loadRanking);
  rankingSort.addEventListener("change", renderRanking);
  rankingCongregation.addEventListener("change", renderRanking);
  rankingSearch.addEventListener("input", renderRanking);


  // Exam
  submitBtn.addEventListener("click", handleSubmitExam);
  retryBtn.addEventListener("click", handleRetry);

  // Security
  window.addEventListener("blur", handleSecurityViolation);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("beforeunload", handleBeforeUnload);
}

// ============================================
// TAB SWITCHING
// ============================================

function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.remove("active");
  });
  event.target.closest(".tab-btn").classList.add("active");

  // Update content
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.classList.remove("active");
  });
  document.getElementById(`${tabName}Tab`).classList.add("active");
}

// ============================================
// ENTRY SCREEN - REGISTER
// ============================================

async function handleRegister(e) {
  e.preventDefault();
  if (registerMsg) registerMsg.classList.remove("show", "success", "error");

  try {
    const cpfInput = document.getElementById("regCPF");
    const cpfDigits = onlyDigits(cpfInput.value);

    // 1. BLOQUEIO DE SEGURANÇA: Verifica se o CPF já existe no banco de dados
    // Isso impede que alguém sobrescreva um cadastro existente
    const checkCpfSnapshot = await database.ref(`cpfIndex/${cpfDigits}`).once('value');
    
    if (checkCpfSnapshot.exists()) {
      throw new Error("Este CPF já está cadastrado no sistema. Vá para a tela de Login.");
    }

    // 2. Validações básicas de formulário
    const name = document.getElementById("regName").value.trim();
    if (name.length < 3) throw new Error("Insira o nome completo.");
    if (!isValidCPF(cpfDigits)) throw new Error("CPF inválido.");

    // 3. Gera o UID randômico (Padrão que você usa)
    const uniqueId = "user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5);

    const profile = {
      uid: uniqueId,
      name: name,
      cpf: cpfDigits,
      birthDate: document.getElementById("regBirthDate")?.value || "",
      congregation: document.getElementById("regCongregation").value,
      approved: false, // Inicia bloqueado para o Admin liberar
      registeredAt: new Date().toISOString(),
      deviceId: appState.deviceId
    };

    // 4. Salva no Firebase (Perfil e Índice ao mesmo tempo)
    await saveProfileToFirebase(profile);

    showMessage(registerMsg, "✅ Cadastro realizado com sucesso! Aguarde a liberação do administrador.", "success");
    registerForm.reset();

    // Redireciona para o login após um tempo
    setTimeout(() => switchTab("login"), 4000);

  } catch (error) {
    console.error("Erro no cadastro:", error.message);
    showMessage(registerMsg, error.message, "error");
  }
}

// ============================================
// ENTRY SCREEN - LOGIN
// ============================================

async function handleLogin(e) {
  e.preventDefault();
  if (loginMsg) loginMsg.classList.remove("show", "success", "error");

  const cpfInput = document.getElementById("loginCPF");
  const cpfDigits = onlyDigits(cpfInput.value);

  try {
    // 1. Validações Básicas
    if (!isValidCPF(cpfDigits)) throw new Error("CPF inválido.");
    if (!appState.isExamReleased) throw new Error("A prova ainda não foi liberada.");
    if (isCPFBlocked(cpfDigits)) throw new Error("CPF bloqueado por segurança.");

    // 2. Busca o UID pelo índice de CPF
    const indexSnap = await database.ref(`cpfIndex/${cpfDigits}`).once('value');
    
    if (!indexSnap.exists()) {
      throw new Error("Aluno não cadastrado. Por favor, cadastre-se primeiro.");
    }

    const indexData = indexSnap.val();
    // LOGICA DE RECUPERAÇÃO DE UID (Tenta objeto ou string direta)
    const uid = (indexData && typeof indexData === 'object') ? indexData.uid : indexData;

    if (!uid) {
      throw new Error("Erro ao identificar o cadastro. Tente cadastrar novamente.");
    }

    // 3. Busca o Perfil Real pelo UID encontrado
    const profileSnap = await database.ref(`users/${uid}/profile`).once('value');
    const profile = profileSnap.val();

    if (!profile) {
      throw new Error("Perfil não encontrado no servidor.");
    }

    // 4. Verifica Aprovação
    if (profile.approved !== true) {
      throw new Error("Seu cadastro ainda não foi liberado pelo administrador.");
    }

    // 5. Verifica se já fez a prova (Prevenção Dupla)
    const examCheck = await database.ref(`attempts/${EXAM_CONFIG.examId}/${uid}`).once('value');
    if (examCheck.exists()) {
      throw new Error("Você já realizou e enviou esta prova.");
    }

    // SUCESSO
    lockCPFToDevice(cpfDigits);
    appState.currentProfile = profile;
    appState.currentUser = { uid: uid };

    showMessage(loginMsg, "Acesso autorizado! Carregando prova...", "success");
    
    // Inicia a prova após um breve delay
    setTimeout(() => {
      // Configura o tempo e troca de tela
      appState.timeLeft = EXAM_CONFIG.totalTimeMinutes * 60;
      appState.examStartedAt = new Date().toISOString();
      
      studentName.textContent = profile.name;
      switchScreen("exam");
      startTimer();
    }, 1500);

  } catch (error) {
    console.error("Erro no Login:", error);
    showMessage(loginMsg, error.message, "error");
  }
}

// ============================================
// EXAM SCREEN
// ============================================

function iniciarExperiencia() {
    const hero = document.getElementById('heroScreen');
    const app = document.getElementById('appContent');
    const entry = document.getElementById('entryScreen');

    // 1. Efeito de sumir
    hero.style.transition = "opacity 0.8s ease";
    hero.style.opacity = "0";

    setTimeout(() => {
        hero.classList.add('hidden');
        
        // 2. Mostra o conteúdo do sistema
        app.classList.remove('hidden');
        
        // 3. Ativa a tela de login/cadastro
        if(entry) entry.classList.add('active');
        
        // Libera o scroll do corpo se necessário
        document.body.style.overflowY = "auto";
        
        console.log("Sistema Elias Carregado.");
    }, 800);
}

function startExam(profile) {
  if (studentName) studentName.textContent = profile.name;
  
  const duration = EXAM_CONFIG.totalTimeMinutes || 60;
  appState.timeLeft = duration * 60; // ✅ CORRETO - multiplica por 60 (converte minutos para segundos)
  
  switchScreen("exam");
  isSubmitting = false;
  
  startTimer();
  renderQuestions();
  updateTimerDisplay();

  console.log(`🔥 Prova iniciada para ${profile.name}. Duração: ${duration}min (${appState.timeLeft}s)`);
}

function updateTimerDisplay() {
  // Se timeLeft não for um número, define como 0 para não quebrar a tela
  const totalSeconds = isNaN(appState.timeLeft) ? 0 : appState.timeLeft;
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (timeRemaining) {
    timeRemaining.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
}
// Garanta que o Admin Modal possa ser aberto da capa
function openAdminLogin() {
    // Aqui vai a lógica que você já tem para mostrar o modal de admin
    const modal = document.getElementById('adminModal');
    if(modal) modal.classList.add('active');
}

function renderQuestions() {
  questionsContainer.innerHTML = "";

  EXAM_CONFIG.questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question-card";

    // header
    const header = document.createElement("div");
    header.className = "question-header";

    const title = document.createElement("div");
    title.className = "question-title";
    title.textContent = q.title;

    const badge = document.createElement("div");
    badge.className = "question-badge";
    badge.textContent = `${index + 1}/${EXAM_CONFIG.questions.length}`;

    header.appendChild(title);
    header.appendChild(badge);

    // imagem (se tiver)
    let imageContainer = null;
    if (q.image && q.image.src) {
      imageContainer = document.createElement("div");
      imageContainer.className = "question-image-container";

      const img = document.createElement("img");
      img.className = "question-img";
      img.src = q.image.src;
      img.alt = q.image.alt || "Imagem da questão";

      imageContainer.appendChild(img);
    }

    // texto da questão (AQUI é o pulo do gato)
    const qText = document.createElement("div");
    qText.className = "question-text";
    qText.style.whiteSpace = "pre-line"; // garante quebra
    qText.textContent = q.question;      // ✅ NÃO use innerHTML

    // opções
    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    q.options.forEach((opt) => {
      const lbl = document.createElement("label");
      lbl.className = "option-label";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = q.id;
      input.value = opt.value;

      const span = document.createElement("span");
      span.style.whiteSpace = "pre-line"; // garante quebra nas opções também
      span.textContent = opt.label;       // ✅ NÃO use innerHTML

      lbl.appendChild(input);
      lbl.appendChild(span);
      optionsDiv.appendChild(lbl);
    });

    // monta tudo
    questionDiv.appendChild(header);
    if (imageContainer) questionDiv.appendChild(imageContainer);
    questionDiv.appendChild(qText);
    questionDiv.appendChild(optionsDiv);

    questionsContainer.appendChild(questionDiv);
  });
}


function startTimer() {
  const timerInterval = setInterval(() => {
    appState.timeLeft--;

    if (appState.timeLeft < 0) {
      clearInterval(timerInterval);
      handleAutoSubmit();
      return;
    }

    updateTimerDisplay();

    // Warning at 5 minutes
    if (appState.timeLeft === 300) {
      timeRemaining.classList.add("warning");
    }
  }, 1000);

  appState.timerInterval = timerInterval;
}

function updateTimerDisplay() {
  const minutes = Math.floor(appState.timeLeft / 60);
  const seconds = appState.timeLeft % 60;
  timeRemaining.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateClock() {
  currentTime.textContent = new Date().toLocaleTimeString("pt-BR");
}

function collectAnswers() {
  const answers = {};
  EXAM_CONFIG.questions.forEach(q => {
    const checked = document.querySelector(`input[name="${q.id}"]:checked`);
    answers[q.id] = checked ? checked.value : null;
  });
  return answers;
}

function gradeExam(answers) {
  let correctCount = 0;
  const correctQuestions = [];
  const wrongQuestions = [];

  for (const [questionId, expectedAnswer] of Object.entries(EXAM_CONFIG.answerKey)) {
    const userAnswer = answers[questionId];
    if (userAnswer === expectedAnswer) {
      correctCount++;
      correctQuestions.push(questionId);
    } else {
      wrongQuestions.push(questionId);
    }
  }

  const total = Object.keys(EXAM_CONFIG.answerKey).length;
  const percent = Math.round((correctCount / total) * 100);

  return { total, correctCount, percent, correctQuestions, wrongQuestions };
}

async function handleSubmitExam() {
  // 1. Ativa o modo de envio para ignorar bloqueios de segurança
  isSubmitting = true;

  // 2. Para o cronômetro
  clearInterval(appState.timerInterval);

  // 3. Feedback visual no botão
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

  try {
    const answers = collectAnswers();
    const result = gradeExam(answers);

    // 4. Salva no Firebase
    await saveExamToFirebase(answers, result);
    
    console.log("✅ Prova enviada com sucesso!");

    // 5. Finaliza a sessão do aluno
    appState.currentProfile = null;
    appState.currentUser = null;

    // 6. Volta para a tela inicial
    switchScreen("entry");
    resetForms();
    
    // Agora o alert acontece DEPOIS que ele já saiu da tela da prova
    alert("Parabéns! Sua prova foi enviada com sucesso.");
    
  } catch (error) {
    console.error("Erro ao enviar:", error);
    alert("Erro ao enviar a prova. Verifique sua conexão.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Tentar enviar novamente";
    isSubmitting = false; // Permite tentar de novo
  }
}

function handleAutoSubmit() {
  alert("Tempo esgotado! Enviando prova automaticamente...");
  handleSubmitExam();
}

// ============================================
// RESULT SCREEN
// ============================================

function showResult(reason) {
  resultReason.textContent = reason;
  if (appState.currentProfile) {
    resultName.textContent = appState.currentProfile.name;
    resultCPF.textContent = formatCPF(appState.currentProfile.cpf);
  }
  switchScreen("result");
}

function handleRetry() {
  switchScreen("entry");
  resetForms();
}

// ============================================
// SECURITY
// ============================================

function handleSecurityViolation() {
  // SÓ bloqueia se estiver na tela da prova E NÃO estiver enviando formalmente
  if (examScreen.classList.contains("active") && !isSubmitting) {
    blockStudent(appState.currentProfile, "Você saiu da página. A prova foi encerrada por segurança.");
    showResult("Você saiu da página. A prova foi encerrada por segurança.");
  }
}

function handleVisibilityChange() {
  if (document.hidden) {
    if (examScreen.classList.contains("active")) {
      blockStudent(appState.currentProfile, "A aba foi minimizada. A prova foi encerrada por segurança.");
      showResult("A aba foi minimizada. A prova foi encerrada por segurança.");
    }
  }
}

function handleBeforeUnload(e) {
  if (examScreen.classList.contains("active")) {
    e.preventDefault();
    e.returnValue = "";
  }
}

// ============================================
// BLOCKING FUNCTIONS
// ============================================

function isDeviceBlocked() {
  return localStorage.getItem(`blocked-device-${appState.deviceId}`) === "true";
}

function isCPFBlocked(cpf) {
  const cpfDigits = onlyDigits(cpf);
  return appState.blockedStudents.some(s => s.cpf === cpfDigits);
}

function cpfInUseElsewhere(cpf) {
  const cpfDigits = onlyDigits(cpf);
  const activeDeviceId = localStorage.getItem(`cpf-device-${cpfDigits}`);
  return activeDeviceId !== null && activeDeviceId !== appState.deviceId;
}

function lockCPFToDevice(cpf) {
  const cpfDigits = onlyDigits(cpf);
  localStorage.setItem(`cpf-device-${cpfDigits}`, appState.deviceId);
}

// Para Bloquear
async function blockStudent(profile, reason) {
  if (!profile) return;
  const cpfDigits = onlyDigits(profile.cpf);

  const blockedData = {
    cpf: cpfDigits,
    name: profile.name,
    reason: reason,
    blockedAt: new Date().toISOString(),
    deviceId: appState.deviceId
  };

  // Salva no Firebase usando o CPF como chave para evitar duplicatas
  await database.ref(`blockedStudents/${cpfDigits}`).set(blockedData);
}

// Para Desbloquear (Geral)
async function unblockStudent(cpf) {
  const cpfDigits = onlyDigits(cpf);
  await database.ref(`blockedCPFs/${cpfDigits}`).remove();
  saveAppState(); // Mantém a sincronia local se necessário
}

// ============================================
// ADMIN PANEL
// ============================================

function setAdminView(viewName) {
  // viewName: "login" | "dashboard"
  adminLoginScreen.classList.remove("active");
  adminScreen.classList.remove("active");
  if (viewName === "login") adminLoginScreen.classList.add("active");
  if (viewName === "dashboard") adminScreen.classList.add("active");
}

function openAdminLogin() {
  // Abre o popup do admin (não muda de tela)
  adminModal.classList.add("show");
  adminModal.setAttribute("aria-hidden", "false");
  setAdminView("login");
  adminAuthForm.reset();
  adminAuthMsg.classList.remove("show", "success", "error");
}

function closeAdminLogin() {
  // Fecha o popup do admin
  adminModal.classList.remove("show");
  adminModal.setAttribute("aria-hidden", "true");
  setAdminView("login");
  adminAuthForm.reset();
  adminAuthMsg.classList.remove("show", "success", "error");
}

function showAdminPanel() {
  setAdminView("dashboard");
}

async function handleAdminLogin(e) {
  if (e) e.preventDefault(); 

  const emailField = document.getElementById("adminEmail");
  const passwordField = document.getElementById("adminPassword");

  // .trim() é vital para não dar erro com espaços invisíveis
  const email = emailField.value.trim();
  const password = passwordField.value;

  console.log("Tentando entrar como admin:", email);

  try {
    // 'auth' vem do seu config.js
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log("✅ Sucesso!", userCredential.user);

    // USANDO AS SUAS VARIÁVEIS DECLARADAS NO TOPO:
    adminLoginScreen.classList.remove("active"); // Esconde o login
    adminScreen.classList.add("active");        // Mostra o painel
    
    // Inicializa os dados do admin
    updateAdminPanel();
    loadRanking();

  } catch (error) {
    console.error("Erro no login:", error.code);
    
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      alert("E-mail ou senha incorretos.");
    } else {
      alert("Erro ao acessar o Firebase: " + error.message);
    }
  }
}
function handleAdminLogout() {
  if (auth) {
    auth.signOut();
  }
  appState.currentUser = null;
  closeAdminLogin();
}

function updateAdminPanel() {
  updateReleaseStatus();
  updatePendingList();
  updateBlockedList();
}


// ============================================
// RANKING (SÓ ADMIN)
// ============================================

async function loadRanking() {
  try {
    if (!database) {
      showMessage(rankingMsg, "Firebase não inicializado. O ranking precisa do Firebase Realtime Database.", "error");
      rankingTbody.innerHTML = `<tr><td colspan="8" class="muted-cell">Sem Firebase.</td></tr>`;
      return;
    }

    showMessage(rankingMsg, "Carregando ranking...", "success");

    const snap = await database.ref(`attempts/${EXAM_CONFIG.examId}`).once("value");
    const data = snap.val() || {};

    const latestByUid = [];

    Object.entries(data).forEach(([uid, attemptsObj]) => {
      if (!attemptsObj) return;

      let best = null;
      Object.values(attemptsObj).forEach((att) => {
        if (!att) return;

        const submittedAt = att.submittedAt || att.startedAt || null;
        const submittedMs = submittedAt ? Date.parse(submittedAt) : 0;

        if (!best) {
          best = { ...att, _submittedMs: submittedMs, _uid: uid };
          return;
        }
        if (submittedMs > best._submittedMs) {
          best = { ...att, _submittedMs: submittedMs, _uid: uid };
        }
      });

      if (best) {
        const correctCount = best.result?.correctCount ?? 0;
        const correctQuestions = best.result?.correctQuestions ?? [];
        latestByUid.push({
          uid,
          name: best.name || "-",
          cpf: best.cpf || "-",
          congregation: best.congregation || "-",
          correctCount,
          correctQuestions,
          timeSpentSec: Number(best.timeSpentSec || 0),
          submittedAt: best.submittedAt || best.startedAt || null,
          _submittedMs: best._submittedMs || 0
        });
      }
    });

    // Ordenação padrão
    appState.rankingCache = latestByUid;
    renderRanking();

    rankingMsg.classList.remove("show");
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
    showMessage(rankingMsg, "Erro ao carregar ranking. Veja o console (F12).", "error");
  }
}

function fmtDuration(seconds) {
  const s = Math.max(0, Number(seconds || 0));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(Math.floor(s % 60)).padStart(2, "0");
  return `${mm}:${ss}`;
}

function fmtDateTimeISO(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString("pt-BR");
  } catch {
    return String(iso);
  }
}

function applyRankingSort(list, mode) {
  const arr = [...list];

  const sortBy = {
    score: (a,b) => (b.correctCount - a.correctCount),
    time: (a,b) => (a.timeSpentSec - b.timeSpentSec),
    date: (a,b) => (a._submittedMs - b._submittedMs)
  };

  if (mode === "score") return arr.sort((a,b)=> sortBy.score(a,b) || sortBy.time(a,b) || sortBy.date(a,b));
  if (mode === "time") return arr.sort((a,b)=> sortBy.time(a,b) || sortBy.score(a,b) || sortBy.date(a,b));
  if (mode === "date") return arr.sort((a,b)=> sortBy.date(a,b) || sortBy.score(a,b) || sortBy.time(a,b));

  if (mode === "score_date_time") {
    return arr.sort((a,b)=> sortBy.score(a,b) || sortBy.date(a,b) || sortBy.time(a,b));
  }
  // default: score_time_date
  return arr.sort((a,b)=> sortBy.score(a,b) || sortBy.time(a,b) || sortBy.date(a,b));
}

function renderRanking() {
  const raw = Array.isArray(appState.rankingCache) ? appState.rankingCache : [];

  const cong = (rankingCongregation?.value || "all").trim();
  const q = (rankingSearch?.value || "").trim().toLowerCase();
  const mode = (rankingSort?.value || "score_time_date");

  let filtered = raw;

  if (cong !== "all") {
    filtered = filtered.filter(r => (r.congregation || "-") === cong);
  }

  if (q) {
    filtered = filtered.filter(r => {
      const name = String(r.name || "").toLowerCase();
      const cpf = String(r.cpf || "").toLowerCase();
      return name.includes(q) || cpf.includes(q);
    });
  }

  filtered = applyRankingSort(filtered, mode);

  if (filtered.length === 0) {
    rankingTbody.innerHTML = `<tr><td colspan="8" class="muted-cell">Sem dados com esses filtros.</td></tr>`;
    return;
  }

  rankingTbody.innerHTML = filtered.map((r, i) => {
    const cpfFmt = r.cpf && r.cpf !== "-" ? formatCPF(r.cpf) : "-";
    const acertou = Array.isArray(r.correctQuestions) && r.correctQuestions.length
      ? r.correctQuestions.join(", ")
      : "-";

    return `
      <tr>
        <td>${i+1}</td>
        <td>${escapeHtml(r.name || "-")}</td>
        <td>${escapeHtml(cpfFmt)}</td>
        <td>${escapeHtml(r.congregation || "-")}</td>
        <td><strong>${Number(r.correctCount || 0)}</strong></td>
        <td>${fmtDuration(r.timeSpentSec)}</td>
        <td>${escapeHtml(fmtDateTimeISO(r.submittedAt))}</td>
        <td>${escapeHtml(acertou)}</td>
      </tr>
    `;
  }).join("");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateReleaseStatus() {
  if (appState.isExamReleased) {
    adminStatusDot.classList.add("active");
    adminStatusLabel.textContent = "Prova Liberada";
    adminStatusDesc.textContent = "Os alunos podem acessar a prova";
    adminToggleText.textContent = "Bloquear";
    adminToggleReleaseBtn.classList.remove("btn-danger");
    adminToggleReleaseBtn.classList.add("btn-primary");
  } else {
    adminStatusDot.classList.remove("active");
    adminStatusLabel.textContent = "Prova Bloqueada";
    adminStatusDesc.textContent = "Os alunos não podem acessar a prova";
    adminToggleText.textContent = "Liberar";
    adminToggleReleaseBtn.classList.remove("btn-primary");
    adminToggleReleaseBtn.classList.add("btn-danger");
  }

  updateStatusDisplay();
}

async function handleToggleRelease() {
  // Inverte o estado atual baseado no appState que vem do Firebase
  const newStatus = !appState.isExamReleased;
  
  try {
    // 1. Grava no Firebase
    await database.ref('settings/isExamReleased').set(newStatus);
    
    // O appState.isExamReleased será atualizado pelo ouvinte .on('value') no config.js
    // mas atualizamos aqui também para feedback imediato se desejar
    updateReleaseStatus();

    const msg = newStatus ? "Prova liberada com sucesso!" : "Prova bloqueada com sucesso!";
    showMessage(adminReleaseMsg, msg, "success");
    setTimeout(() => adminReleaseMsg.classList.remove("show"), 3000);
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    alert("Falha ao comunicar com o banco de dados.");
  }
}

async function updateBlockedList() {
  if (!database) return;

  const snapshot = await database.ref('blockedStudents').once('value');
  const blockedData = snapshot.val() || {};
  const blockedArray = Object.values(blockedData);

  if (blockedArray.length === 0) {
    adminBlockedList.innerHTML = `<div class="empty-state"><p>Nenhum aluno bloqueado</p></div>`;
    return;
  }

  adminBlockedList.innerHTML = blockedArray.map(student => `
    <div class="blocked-item">
      <div class="blocked-info">
        <div class="blocked-name">${student.name}</div>
        <div class="blocked-cpf">${formatCPF(student.cpf)}</div>
        <div class="blocked-reason"><strong>Motivo:</strong> ${student.reason}</div>
      </div>
      <button class="btn btn-secondary" onclick="handleUnblockClick('${student.cpf}')">
        <i class="fas fa-unlock"></i> Desbloquear
      </button>
    </div>
  `).join("");
}



function getAllStudentsFromStorage() {
  const students = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("student-")) {
      try {
        const profile = JSON.parse(localStorage.getItem(key));
        if (profile && profile.cpf) students.push(profile);
      } catch (e) {}
    }
  }
  return students;
}

// --- FUNÇÃO PARA LISTAR QUEM PRECISA DE APROVAÇÃO ---
// Mude de .once para .on para ser EM TEMPO REAL

async function updatePendingList() {
  if (!database) return;
  const snapshot = await database.ref('users').once('value');
  const usersData = snapshot.val() || {};
  
  // O mapeamento deve entrar em users -> UID -> profile
  const pending = Object.values(usersData)
    .map(u => u.profile)
    .filter(p => p && p.approved === false);

  if (pending.length === 0) {
    adminPendingList.innerHTML = `<div class="empty-state"><p>Nenhum cadastro pendente</p></div>`;
    return;
  }

  // Renderiza Nome, CPF e Congregação conforme solicitado
  adminPendingList.innerHTML = pending.map(p => `
    <div class="blocked-item">
      <div class="blocked-info">
        <div class="blocked-name">${p.name}</div>
        <div class="blocked-cpf">${formatCPF(p.cpf)}</div>
        <div class="blocked-reason"><strong>Congregação:</strong> ${p.congregation}</div>
      </div>
      <button class="btn btn-primary" onclick="approveStudent('${p.uid}')">
        <i class="fas fa-check"></i> Liberar
      </button>
    </div>
  `).join("");
}

async function approveStudent(uid) {
  try {
    // Atualiza o status no Firebase para true
    await database.ref(`users/${uid}/profile`).update({
      approved: true,
      approvedAt: new Date().toISOString()
    });
    
    showMessage(adminReleaseMsg, "Acesso liberado com sucesso!", "success");
    updatePendingList(); // Atualiza a lista na tela
  } catch (error) {
    alert("Erro ao liberar: " + error.message);
  }
}
window.approveStudent = approveStudent; // Garante que o botão HTML encontre a função



async function handleUnblockClick(cpf) {
  const cpfDigits = onlyDigits(cpf);
  if (confirm(`Deseja desbloquear o CPF ${formatCPF(cpf)}?`)) {
    try {
      await database.ref(`blockedStudents/${cpfDigits}`).remove(); // Remove do banco
      updateBlockedList();
      showMessage(adminReleaseMsg, "CPF desbloqueado!", "success");
    } catch (error) {
      alert("Erro ao desbloquear.");
    }
  }
}

function filterBlockedStudents() {
  const searchTerm = adminSearchBlocked.value.toLowerCase();

  const filtered = appState.blockedStudents.filter(student => {
    const cpfMatch = student.cpf.includes(onlyDigits(searchTerm));
    const nameMatch = student.name.toLowerCase().includes(searchTerm);
    return cpfMatch || nameMatch;
  });

  if (filtered.length === 0) {
    adminBlockedList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search"></i>
        <p>Nenhum resultado encontrado</p>
      </div>
    `;
    return;
  }

  adminBlockedList.innerHTML = filtered.map(student => `
    <div class="blocked-item">
      <div class="blocked-info">
        <div class="blocked-name">${student.name}</div>
        <div class="blocked-cpf">${formatCPF(student.cpf)}</div>
        <div class="blocked-reason"><strong>Motivo:</strong> ${student.reason}</div>
      </div>
      <button class="btn btn-secondary" onclick="handleUnblockClick('${student.cpf}')">
        <i class="fas fa-unlock"></i> Desbloquear
      </button>
    </div>
  `).join("");
}

// ============================================
// UI HELPERS
// ============================================

function switchScreen(screenName) {
  entryScreen.classList.remove("active");
  examScreen.classList.remove("active");
  resultScreen.classList.remove("active");

  if (screenName === "entry") {
    entryScreen.classList.add("active");
  } else if (screenName === "exam") {
    examScreen.classList.add("active");
  } else if (screenName === "result") {
    resultScreen.classList.add("active");
  }
}

function updateStatusDisplay() {
    // Verifica se os elementos existem antes de mudar (evita erro no console)
    const statusAlert = document.getElementById("statusAlert");
    if (statusAlert) {
        statusAlert.style.display = appState.isExamReleased ? "none" : "flex";
    }
    
    // Atualiza o botão do Admin se ele estiver aberto
    const adminLabel = document.getElementById("adminStatusLabel");
    if (adminLabel) {
        adminLabel.textContent = appState.isExamReleased ? "Prova Liberada" : "Prova Bloqueada";
    }
}

function showMessage(element, message, type) {
  element.textContent = message;
  element.classList.add("show", type);
  setTimeout(() => {
    element.classList.remove("show", type);
  }, 4000);
}

function resetForms() {
  registerForm.reset();
  loginForm.reset();
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  document.querySelector(".tab-btn").classList.add("active");
  document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
  document.getElementById("registerTab").classList.add("active");
  registerMsg.classList.remove("show");
  loginMsg.classList.remove("show");
}

// ============================================
// FIREBASE FUNCTIONS
// ============================================

async function saveProfileToFirebase(profile) {
  try {
    if (!database) {
      throw new Error("Banco de dados não inicializado. Verifique sua conexão.");
    }

    const updates = {};
    // Salva o perfil completo usando o UID randômico
    updates[`/users/${profile.uid}/profile`] = profile;
    
    // Cria o índice por CPF para permitir o login e busca rápida
    updates[`/cpfIndex/${profile.cpf}`] = {
      uid: profile.uid,
      name: profile.name
    };

    await database.ref().update(updates);
    console.log("✅ Dados salvos no Firebase com UID:", profile.uid);
    return true;
  } catch (error) {
    console.error("❌ Erro ao salvar no Firebase:", error);
    throw error;
  }
}

async function saveExamToFirebase(answers, result) {
  try {
    if (!database) {
      console.error("Erro: Banco de dados não inicializado.");
      return;
    }

    // Se o aluno não tiver um UID (não logou como anônimo), vamos criar um temporário
    const uid = (appState.currentUser && appState.currentUser.uid) 
                ? appState.currentUser.uid 
                : "anon-" + appState.currentProfile.cpf;

    const attemptRef = database.ref(`attempts/${EXAM_CONFIG.examId}/${uid}`).push();

    await attemptRef.set({
      examId: EXAM_CONFIG.examId,
      ownerUid: uid,
      cpf: appState.currentProfile.cpf,
      name: appState.currentProfile.name,
      congregation: appState.currentProfile.congregation,
      deviceId: appState.deviceId,
      status: "SUBMITTED",
      startedAt: appState.examStartedAt || new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      answers,
      result,
      timeSpentSec: EXAM_CONFIG.totalTimeMinutes * 60 - appState.timeLeft
    });
    
    console.log("✅ Prova salva no Firebase!");
  } catch (error) {
    console.error("❌ Erro fatal ao salvar no Firebase:", error);
    alert("Erro de permissão ao salvar. Verifique as regras do Firebase.");
    throw error; // Repassa o erro para a função principal
  }
}

// ============================================
// INICIALIZAÇÃO DO APP
// ============================================

// Esperar Firebase estar pronto
if (typeof auth !== 'undefined' && auth) {
  auth.onAuthStateChanged((user) => {
    if (user && appState.currentUser === null) {
      // User logged in
    }
  });
}


function startRealtimeSync() {
    console.log("Sincronizando com Firebase...");

    // Sincroniza Alunos Bloqueados
    database.ref('blockedCPFs').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        appState.blockedStudents = Object.keys(data).map(cpf => ({
            cpf: cpf,
            ...data[cpf]
        }));
        updateBlockedList(); // Atualiza a tela do admin se estiver aberta
    });

    // Sincroniza Status de Liberação do Exame
    database.ref('settings/isExamReleased').on('value', (snapshot) => {
        appState.isExamReleased = snapshot.val() || false;
        updateReleaseStatus();
    });
}

function filterPendingStudents() {
    const searchTerm = document.getElementById("adminSearch")?.value.toLowerCase() || "";
    const items = adminPendingList.querySelectorAll(".blocked-item");

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? "flex" : "none";
    });
}

async function refreshRanking() {
    const tbody = document.getElementById("rankingTbody");
    const sortMode = document.getElementById("rankingSort").value;
    const congFilter = document.getElementById("rankingCongregation").value;
    const searchVal = document.getElementById("rankingSearch").value.toLowerCase();

    tbody.innerHTML = `<tr><td colspan="8" class="muted-cell"><i class="fas fa-spinner fa-spin"></i> Carregando resultados...</td></tr>`;

    try {
        const snapshot = await database.ref(`attempts/${EXAM_CONFIG.examId}`).once('value');
        const data = snapshot.val() || {};
        let attempts = Object.values(data);

        // Filtro por Congregação e Busca
        attempts = attempts.filter(a => {
            const matchCong = congFilter === "all" || a.congregation === congFilter;
            const matchSearch = a.name.toLowerCase().includes(searchVal) || a.cpf.includes(searchVal);
            return matchCong && matchSearch;
        });

        // Ordenação (Exemplo: Acertos desc, depois tempo asc)
        attempts.sort((a, b) => {
            if (sortMode === "score") return b.result.score - a.result.score;
            if (sortMode === "time") return a.timeSpentSec - b.timeSpentSec;
            return b.result.score - a.result.score || a.timeSpentSec - b.timeSpentSec;
        });

        if (attempts.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="muted-cell">Nenhum resultado encontrado.</td></tr>`;
            return;
        }

        tbody.innerHTML = attempts.map((a, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${a.name.toUpperCase()}</strong></td>
                <td>${a.cpf}</td>
                <td>${a.congregation}</td>
                <td><span class="badge-score">${a.result.score}</span></td>
                <td>${Math.floor(a.timeSpentSec / 60)}m ${a.timeSpentSec % 60}s</td>
                <td>${new Date(a.submittedAt).toLocaleTimeString()}</td>
                <td><small>${a.result.correctIds.join(", ")}</small></td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("Erro ao carregar ranking:", error);
        tbody.innerHTML = `<tr><td colspan="8" class="muted-cell" style="color:red">Erro ao carregar dados.</td></tr>`;
    }
}

// Vincula o botão de atualizar
document.getElementById("adminRefreshRankingBtn").addEventListener("click", refreshRanking);



async function loadAdminReport() {
  const reportContainer = document.getElementById("adminReportList");
  if (!reportContainer || !database) return;

  reportContainer.innerHTML = "<p class='loading-msg'>Gerando relatório detalhado...</p>";

  try {
    const snapshot = await database.ref('users').once('value');
    const usersData = snapshot.val() || {};
    
    // Filtra apenas perfis aprovados
    const approvedStudents = Object.values(usersData)
      .map(u => u.profile)
      .filter(p => p && p.approved === true);

    if (approvedStudents.length === 0) {
      reportContainer.innerHTML = "<p class='empty-state'>Nenhum aluno aprovado no sistema.</p>";
      return;
    }

    // Agrupa os alunos por congregação
    const grouped = {};
    approvedStudents.forEach(student => {
      const cong = student.congregation || "Não Informada";
      if (!grouped[cong]) grouped[cong] = [];
      grouped[cong].push(student);
    });

    // Gera o HTML organizando por Congregação
    let html = "";
    
    // Ordenar as congregações alfabeticamente
    const congregations = Object.keys(grouped).sort();

    congregations.forEach(congName => {
      const students = grouped[congName];
      
      html += `
        <div class="report-section" style="margin-bottom: 25px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div class="report-header" style="background: #2c3e50; color: white; padding: 12px 15px; font-weight: bold; display: flex; justify-content: space-between;">
            <span> CONGREGAÇÃO: ${congName.toUpperCase()}</span>
            <span>Aluno(s): ${students.length}</span>
          </div>
          
          <div class="report-body">
            <table style="width: 100%; border-collapse: collapse; background: white;">
              <thead>
                <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                  <th style="padding: 10px; text-align: left;">Nome do Aluno</th>
                  <th style="padding: 10px; text-align: left;">CPF</th>
                  <th style="padding: 10px; text-align: center;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${students.map(s => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">${s.name}</td>
                    <td style="padding: 10px;">${formatCPF(s.cpf)}</td>
                    <td style="padding: 10px; text-align: center;">
                      <span style="color: #27ae60; font-size: 0.85rem; font-weight: bold;">
                        <i class="fas fa-check-circle"></i> APROVADO
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    });

    reportContainer.innerHTML = html;

  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    reportContainer.innerHTML = "<p class='error-msg'>Erro ao carregar os dados dos alunos.</p>";
  }
}