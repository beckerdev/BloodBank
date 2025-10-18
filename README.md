# Gestão de Estoque de Sangue (local)

Aplicação front-end simples (HTML/CSS/JS) para identificar doadores elegíveis para notificação com base em compatibilidade sanguínea e tempo desde a última doação.

Como funciona
- Carregue os doadores do arquivo `donors.json`.
- Selecione o tipo sanguíneo em falta e a quantidade necessária.
- O app filtra doadores que são compatíveis segundo regras ABO/Rh e que não doaram nos últimos 90 dias.
- Notificações são simuladas no console do navegador e alteram o botão para "Notificado".

Requisitos
- Navegador moderno (Chrome, Firefox, Edge).
- Um servidor local simples para servir arquivos (o fetch do JSON não funciona via file://).

Executando localmente
Você pode usar o Python para servir os arquivos na pasta atual:

```bash
# Python 3
python3 -m http.server 8000
```

Depois abra `http://localhost:8000` no navegador e clique em "Encontrar doadores elegíveis".

Notas
- O arquivo `donors.json` contém amostras de doadores. Adapte conforme sua base real.
- Regras de compatibilidade implementadas no `script.js` (constante COMPAT). Ajuste se necessário.
# BloodBank
software para gerenciamento de bolsas de sangue
