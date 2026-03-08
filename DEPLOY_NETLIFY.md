# Guia de Deploy no Netlify

## 🚀 3 Formas de Fazer Deploy

### Opção 1: Drag & Drop (Mais Fácil) ⭐

1. Acesse [Netlify](https://netlify.com)
2. Faça login ou crie uma conta (pode usar GitHub)
3. Na página inicial, procure por **"Drag and drop your site"**
4. Selecione a pasta `prova-online-html` inteira
5. Arraste para a área de upload
6. Aguarde o upload terminar
7. Pronto! Seu site está publicado em um domínio temporário

### Opção 2: GitHub (Recomendado para Produção)

#### Passo 1: Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique em **"New"** para criar um novo repositório
3. Digite o nome: `prova-online`
4. Selecione **"Public"** (ou Private)
5. Clique em **"Create repository"**

#### Passo 2: Fazer Upload dos Arquivos

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/prova-online.git
cd prova-online

# Copiar os arquivos
cp -r /home/ubuntu/prova-online-html/* .

# Fazer commit
git add .
git commit -m "Initial commit: Prova Online System"
git push origin main
```

#### Passo 3: Conectar ao Netlify

1. Acesse [Netlify](https://netlify.com)
2. Clique em **"New site from Git"**
3. Selecione **"GitHub"**
4. Autorize o Netlify a acessar seu GitHub
5. Selecione o repositório `prova-online`
6. Clique em **"Deploy"**
7. Aguarde o deploy terminar
8. Seu site estará em um domínio do Netlify

### Opção 3: Netlify CLI (Para Desenvolvedores)

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Navegar para a pasta
cd /home/ubuntu/prova-online-html

# Deploy
netlify deploy --prod --dir=.
```

## 🎯 Após o Deploy

### 1. Configurar Domínio Personalizado

1. No Netlify, vá para **"Site settings"**
2. Clique em **"Domain management"**
3. Clique em **"Add custom domain"**
4. Digite seu domínio (ex: `prova.seusite.com`)
5. Siga as instruções para configurar o DNS

### 2. Configurar HTTPS

- Netlify configura HTTPS automaticamente
- Certificado SSL é renovado automaticamente

### 3. Variáveis de Ambiente

Se precisar adicionar variáveis de ambiente:

1. No Netlify, vá para **"Site settings"**
2. Clique em **"Build & deploy"** → **"Environment"**
3. Clique em **"Edit variables"**
4. Adicione suas variáveis

## 🔐 Segurança

### Checklist de Segurança

- [ ] Firebase configurado com regras de segurança
- [ ] HTTPS ativado (automático no Netlify)
- [ ] Credenciais Firebase não expostas no código
- [ ] Conta de admin criada com senha forte
- [ ] Autenticação Firebase ativada
- [ ] Realtime Database com regras restritivas

### Proteger Credenciais Firebase

**IMPORTANTE**: Nunca exponha suas credenciais Firebase no código!

Se você precisar usar variáveis de ambiente:

1. Crie um arquivo `.env.local` (não versione no Git):

```env
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_PROJECT_ID=seu_projeto_aqui
```

2. Adicione `.env.local` ao `.gitignore`:

```
.env.local
.env.*.local
```

3. No Netlify, adicione as variáveis em **Site settings** → **Environment**

## 📊 Monitorar Performance

### Analytics do Netlify

1. No Netlify, vá para **"Analytics"**
2. Visualize:
   - Visitantes
   - Requisições
   - Tempo de resposta
   - Erros

### Google Analytics (Opcional)

1. Crie uma conta no [Google Analytics](https://analytics.google.com)
2. Adicione o código de rastreamento ao `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🔄 Atualizações

### Atualizar Código

#### Via GitHub:
```bash
# Fazer mudanças
# Fazer commit
git add .
git commit -m "Descrição da mudança"
git push origin main

# Netlify fará deploy automaticamente
```

#### Via Drag & Drop:
1. Faça as mudanças localmente
2. Arraste a pasta novamente para o Netlify
3. Clique em "Deploy"

## 🆘 Troubleshooting

### "Site não carrega"
- Verifique se os arquivos foram enviados corretamente
- Verifique os logs do Netlify (Deploy → Logs)
- Limpe o cache do navegador

### "Firebase não funciona"
- Verifique se as credenciais estão corretas em `config.js`
- Verifique se o Firebase está acessível
- Verifique os logs do navegador (F12 → Console)

### "Admin não consegue fazer login"
- Verifique se a conta de admin foi criada no Firebase
- Verifique se a autenticação Email/Senha está ativada
- Verifique os logs do navegador

### "Dados não aparecem no Firebase"
- Verifique as regras de segurança do Firebase
- Verifique se o Realtime Database está ativo
- Verifique os logs do navegador

## 📈 Escalabilidade

### Limites do Netlify (Plano Gratuito)

- ✅ Bandwidth: 100 GB/mês
- ✅ Builds: Ilimitados
- ✅ Domínios: Ilimitados
- ✅ HTTPS: Incluído
- ✅ CDN: Global

### Limites do Firebase (Plano Gratuito)

- ✅ Armazenamento: 1 GB
- ✅ Download: 1 GB/mês
- ✅ Autenticação: Ilimitada
- ✅ Realtime Database: 100 conexões simultâneas

Para mais usuários, considere fazer upgrade.

## 📞 Suporte

### Netlify
- [Netlify Docs](https://docs.netlify.com)
- [Netlify Support](https://support.netlify.com)

### Firebase
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2026
