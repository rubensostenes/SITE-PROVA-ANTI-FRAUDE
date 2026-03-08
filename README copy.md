# Prova Online - Sistema de Avaliação (HTML/CSS/JavaScript)

Sistema de prova online com autenticação Firebase, controle administrativo e segurança contra saída da página.

## 📋 Conteúdo

- `index.html` - Estrutura HTML completa
- `style.css` - Estilos CSS responsivos
- `config.js` - Configuração do Firebase
- `app.js` - Lógica principal da aplicação
- `README.md` - Este arquivo

## 🚀 Quick Start

### 1. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto chamado "prova-online"
3. Adicione um app web
4. Copie as credenciais
5. Edite `config.js` e substitua as credenciais:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 2. Configurar Realtime Database

1. No Firebase Console, vá para "Realtime Database"
2. Clique em "Criar banco de dados"
3. Escolha a localização (ex: São Paulo)
4. Inicie em "Modo de teste"
5. Vá para "Regras" e substitua por:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "attempts": {
      ".read": true,
      ".write": true
    },
    "blockedDevices": {
      ".read": true,
      ".write": false
    },
    "cpfIndex": {
      ".read": true,
      ".write": true
    }
  }
}
```

### 3. Configurar Autenticação

1. No Firebase Console, vá para "Authentication"
2. Clique em "Começar"
3. Ative "Anônimo" (para alunos)
4. Ative "Email/Senha" (para admin)
5. Crie uma conta de admin:
   - Email: `admin@example.com`
   - Senha: `sua-senha-segura`

### 4. Testar Localmente

Abra `index.html` em um navegador ou use um servidor local:

```bash
# Com Python 3
python -m http.server 8000

# Com Node.js
npx http-server

# Com Live Server (VS Code)
# Instale a extensão "Live Server" e clique com botão direito em index.html
```

Acesse `http://localhost:8000`

## 📱 Funcionalidades

### Tela de Entrada
- **Novo Cadastro**: Formulário completo com validação de CPF
- **Entrar**: Login rápido com CPF para alunos já cadastrados
- **Status da Prova**: Alerta visual indicando se a prova está liberada

### Painel da Prova
- Cronômetro com aviso de tempo baixo
- Questões de múltipla escolha
- Proteção contra saída da página
- Bloqueio automático ao minimizar
- Envio automático ao expirar o tempo

### Painel Administrativo
- Acesso via botão "Admin" no topo
- Autenticação com Firebase
- **Liberar Prova**: Toggle para liberar/bloquear acesso
- **Alunos Bloqueados**: Lista com busca e desbloqueio individual

## 🔐 Segurança

O sistema detecta e bloqueia automaticamente:
- ✅ Saída da página (blur)
- ✅ Minimização da janela
- ✅ Mudança de aba
- ✅ Tentativa de recarregar (F5)

## 🌐 Deploy no Netlify

### Opção 1: Drag & Drop

1. Acesse [Netlify](https://netlify.com)
2. Faça login ou crie uma conta
3. Arraste a pasta `prova-online-html` para a área de upload
4. Pronto! Seu site está publicado

### Opção 2: GitHub

1. Crie um repositório no GitHub
2. Faça push dos arquivos
3. Conecte o repositório no Netlify
4. Netlify fará deploy automático

### Opção 3: CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Deploy
netlify deploy --prod --dir=.
```

## 📝 Editar Questões

Edite o arquivo `config.js`:

```javascript
const EXAM_CONFIG = {
  examId: "prova-001",
  totalTimeMinutes: 30,  // Tempo em minutos
  answerKey: {
    q1: "c",  // Resposta correta
    q2: "b",
    q3: "b"
  },
  questions: [
    {
      id: "q1",
      title: "Questão 1",
      question: "Sua pergunta aqui?",
      options: [
        { value: "a", label: "Opção A" },
        { value: "b", label: "Opção B" },
        { value: "c", label: "Opção C" },
        { value: "d", label: "Opção D" }
      ]
    }
    // Adicione mais questões...
  ]
};
```

## 🎓 Dados Armazenados

### No Firebase Realtime Database

```
prova-online/
├── users/{uid}/profile
│   ├── name: "João Silva"
│   ├── cpf: "12345678901"
│   ├── birthDate: "1990-01-15"
│   ├── age: 34
│   ├── baptized: "sim"
│   ├── congregation: "Comportas"
│   ├── resp1: "Maria Silva"
│   └── resp2: "Pedro Silva"
├── attempts/{examId}/{uid}/{attemptId}
│   ├── examId: "prova-001"
│   ├── status: "SUBMITTED"
│   ├── answers: {...}
│   └── result: {...}
├── blockedDevices/{deviceId}
└── cpfIndex/{cpf}/uid
```

### No localStorage

- `deviceId` - ID único do dispositivo
- `examReleased` - Status de liberação da prova
- `blockedStudents` - Lista de alunos bloqueados
- `student-{cpf}` - Dados do aluno

## 🔧 Customização

### Cores

Edite as variáveis CSS em `style.css`:

```css
:root {
  --primary: #2563eb;        /* Azul principal */
  --danger: #e11d48;         /* Vermelho de perigo */
  --success: #16a34a;        /* Verde de sucesso */
  --warning: #f59e0b;        /* Amarelo de aviso */
  /* ... mais cores ... */
}
```

### Congregações

Edite em `config.js`:

```javascript
congregations: [
  "Comportas",
  "Lagoa 1",
  "Lagoa 2",
  "Engenho",
  "Alto do Céu",
  "Acaraú"
]
```

## 🐛 Troubleshooting

### "Firebase não carregou"
- Verifique se as credenciais em `config.js` estão corretas
- Confirme que o projeto Firebase foi criado
- Limpe o cache do navegador

### "Acesso negado ao banco de dados"
- Verifique as regras de segurança do Firebase
- Confirme que a autenticação anônima está ativada
- Confirme que o Realtime Database está ativo

### Aluno não consegue se cadastrar
- Verifique se a prova foi liberada pelo admin
- Valide o CPF (deve ter 11 dígitos válidos)
- Verifique se o CPF não está bloqueado

### Botão Admin não funciona
- Confirme que tem uma conta de admin criada no Firebase
- Verifique o email e senha
- Limpe o cache do navegador

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Consulte os logs do navegador (F12 → Console)
3. Verifique as variáveis de ambiente
4. Confirme a configuração do Firebase

## 📄 Estrutura de Arquivos

```
prova-online-html/
├── index.html          # Estrutura HTML
├── style.css           # Estilos CSS
├── config.js           # Configuração Firebase
├── app.js              # Lógica principal
└── README.md           # Este arquivo
```

## ✅ Checklist de Deploy

- [ ] Firebase configurado com credenciais corretas
- [ ] Realtime Database criado e com regras de segurança
- [ ] Autenticação Firebase ativada (Anônimo + Email/Senha)
- [ ] Conta de admin criada
- [ ] Questões editadas em `config.js`
- [ ] Congregações atualizadas em `config.js`
- [ ] Testado localmente
- [ ] Enviado para Netlify
- [ ] Testado em produção

## 🎯 Próximos Passos

1. **Dashboard de Resultados**: Adicionar página para visualizar resultados
2. **Relatórios**: Gerar relatórios em PDF
3. **Notificações**: Alertas em tempo real para o admin
4. **Múltiplas Provas**: Suportar diferentes provas
5. **Análise de Dados**: Gráficos de desempenho

## 📄 Licença

Este projeto é de uso exclusivo da Área 61.

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2026  
**Suporte**: Firebase + Netlify
