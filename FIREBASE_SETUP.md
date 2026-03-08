# Guia de Configuração do Firebase para Prova Online

## 1️⃣ Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em **"Criar projeto"**
3. Digite o nome: `prova-online`
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

## 2️⃣ Adicionar App Web

1. No console do Firebase, clique no ícone de web `</>`
2. Registre o app com o nome: `Prova Online`
3. Copie o objeto `firebaseConfig` exibido

## 3️⃣ Configurar Realtime Database

1. No menu lateral, clique em **"Realtime Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha a localização: **"South America - São Paulo"**
4. Inicie em **"Modo de teste"** (para desenvolvimento)
5. Clique em **"Ativar"**

## 4️⃣ Configurar Regras de Segurança

1. Vá para a aba **"Regras"**
2. Substitua o conteúdo pelas regras abaixo:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "profile": {
          ".validate": "newData.hasChildren(['name', 'cpf', 'birthDate', 'age', 'baptized', 'congregation', 'resp1'])"
        }
      }
    },
    "attempts": {
      "$examId": {
        "$uid": {
          ".read": true,
          ".write": true,
          ".validate": "newData.hasChildren(['examId', 'ownerUid', 'status'])"
        }
      }
    },
    "blockedDevices": {
      "$deviceId": {
        ".read": true,
        ".write": false
      }
    },
    "cpfIndex": {
      "$cpf": {
        ".read": true,
        ".write": true
      }
    },
    ".read": false,
    ".write": false
  }
}
```

3. Clique em **"Publicar"**

## 5️⃣ Configurar Autenticação

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Começar"**
3. Selecione **"Email/Senha"**
4. Ative a opção
5. Clique em **"Salvar"**
6. Volte e selecione **"Anônimo"**
7. Ative a opção
8. Clique em **"Salvar"**

## 6️⃣ Criar Conta de Admin

1. Em Authentication, vá para a aba **"Usuários"**
2. Clique em **"Adicionar usuário"**
3. Digite:
   - **Email**: `admin@example.com`
   - **Senha**: `sua-senha-segura-aqui`
4. Clique em **"Adicionar usuário"**

## 6.1️⃣ Liberar Acesso de Admin (obrigatório)

O sistema **só abre o painel** para usuários que estiverem na lista:

`/admins/{UID_DO_USUARIO} = true`

### Como fazer (vários admins)

1. No **Authentication → Usuários**, copie o **UID** de cada admin criado.
2. Vá em **Realtime Database → Dados**.
3. Crie o nó **admins**.
4. Dentro de **admins**, adicione cada UID como chave e o valor **true**.

Exemplo:

```json
{
  "admins": {
    "UID_ADMIN_1": true,
    "UID_ADMIN_2": true,
    "UID_ADMIN_3": true,
    "UID_ADMIN_4": true
  }
}
```

✅ Pronto: agora você pode ter **4+ administradores**.

## 7️⃣ Obter Credenciais Firebase

1. Volte ao console do Firebase
2. Clique em **"Configurações do projeto"** (ícone de engrenagem)
3. Vá para a aba **"Seu apps"**
4. Localize seu app web
5. Copie o objeto `firebaseConfig`:

```javascript
{
  apiKey: "AIza...",
  authDomain: "prova-online-xxxxx.firebaseapp.com",
  projectId: "prova-online-xxxxx",
  storageBucket: "prova-online-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
}
```

## 8️⃣ Atualizar config.js

1. Abra o arquivo `config.js`
2. Substitua o objeto `firebaseConfig` com suas credenciais:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyChangeThis",  // ← Substitua
  authDomain: "seu-projeto.firebaseapp.com",  // ← Substitua
  projectId: "seu-projeto",  // ← Substitua
  storageBucket: "seu-projeto.appspot.com",  // ← Substitua
  messagingSenderId: "123456789",  // ← Substitua
  appId: "1:123456789:web:abc123def456"  // ← Substitua
};
```

3. Salve o arquivo

## 9️⃣ Testar Localmente

1. Abra `index.html` em um navegador
2. Tente fazer um cadastro
3. Clique em "Admin" e faça login com:
   - Email: `admin@example.com`
   - Senha: `sua-senha-segura-aqui`
4. Libere a prova
5. Tente fazer login como aluno

## 🔟 Verificar Dados no Firebase

1. No Firebase Console, vá para **"Realtime Database"**
2. Clique em **"Dados"**
3. Você verá a estrutura de dados em tempo real:

```
prova-online-xxxxx/
├── users/
│   └── {uid}/
│       └── profile/
├── attempts/
│   └── prova-001/
├── blockedDevices/
└── cpfIndex/
```

## ✅ Checklist

- [ ] Projeto Firebase criado
- [ ] App web adicionado
- [ ] Realtime Database criado
- [ ] Regras de segurança configuradas
- [ ] Autenticação Email/Senha ativada
- [ ] Autenticação Anônima ativada
- [ ] Conta de admin criada
- [ ] Credenciais copiadas para `config.js`
- [ ] Testado localmente
- [ ] Dados aparecem no Firebase Console

## 🚀 Próximo Passo

Após configurar o Firebase, você pode:

1. **Testar localmente** - Abra `index.html` em um navegador
2. **Deploy no Netlify** - Arraste a pasta para o Netlify
3. **Customizar questões** - Edite `config.js`

## 🆘 Troubleshooting

### Erro: "Firebase não carregou"
- Verifique se as credenciais em `config.js` estão corretas
- Confirme que o projeto Firebase foi criado
- Limpe o cache do navegador (Ctrl+Shift+Delete)

### Erro: "Acesso negado ao banco de dados"
- Verifique as regras de segurança
- Confirme que a autenticação anônima está ativada
- Confirme que o Realtime Database está ativo

### Admin não consegue fazer login
- Verifique se a conta de admin foi criada
- Confirme o email e senha
- Verifique se a autenticação Email/Senha está ativada

### Dados não aparecem no Firebase
- Confirme que o aluno completou o cadastro
- Verifique se não há erros no console do navegador (F12)
- Confirme que as regras de segurança permitem escrita

## 📚 Recursos

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Docs - Realtime Database](https://firebase.google.com/docs/database)
- [Firebase Docs - Authentication](https://firebase.google.com/docs/auth)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

---

**Dúvidas?** Consulte a documentação oficial do Firebase ou o arquivo README.md
