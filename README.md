# 🛡️ Sistema de Prova Online Antifraude - Área 61

Sistema desenvolvido para a gestão e aplicação de exames online com foco em segurança, controle de acesso e monitoramento em tempo real. Ideal para instituições que buscam integridade no processo de avaliação.

## 🚀 Funcionalidades Principais

- **Sistema de Login & Cadastro:** Validação de CPF e dados demográficos integrados ao Firebase.
- **Mecanismos Antifraude:**
  - 📱 **Travamento por Dispositivo:** Impede que o mesmo CPF acesse a prova de aparelhos diferentes simultaneamente.
  - ⏱️ **Cronômetro Progressivo/Regressivo:** Controle rígido do tempo de prova.
  - 🚫 **Bloqueio de Estudantes:** Painel administrativo com capacidade de bloquear usuários em tempo real.
- **Painel Administrativo:**
  - Monitoramento de progresso dos alunos.
  - Ranking automático de acertos e tempo.
  - Liberação/Bloqueio global da prova.
- **Interface Imersiva:** Design moderno com foco na experiência do usuário (UX).

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
- **Backend/Database:** Firebase Realtime Database.
- **Autenticação:** Firebase Auth.
- **Hospedagem:** Netlify.

## ⚙️ Configuração

1. Clone o repositório.
2. Configure as credenciais do seu projeto Firebase no arquivo `config.js`.
3. Ative o **Realtime Database** e **Email/Password Auth** no console do Firebase.
4. Defina as regras de segurança conforme o arquivo `FIREBASE_SETUP.md`.

## 📄 Licença

Este projeto foi desenvolvido para o grupo **Área 61**. Sinta-se à vontade para usar como base para seus próprios sistemas de avaliação.
