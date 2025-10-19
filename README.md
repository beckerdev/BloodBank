# Gestão de Estoque de Sangue (local)

Aplicação front-end simples (HTML/CSS/JS) para identificar doadores elegíveis para notificação com base em compatibilidade sanguínea e tempo desde a última doação.

Como funciona
- Carregue os doadores do arquivo `donors.json`.
- Selecione o tipo sanguíneo em falta e a quantidade necessária.
- O app filtra doadores que são compatíveis segundo regras ABO/Rh e que não doaram nos últimos 90 dias.
- Notificações são simuladas no console do navegador e alteram o botão para "Notificado".

Novos filtros disponíveis
- Gênero (Todos / Feminino / Masculino)
- Faixa etária (mínimo e máximo)
- Mínimo de dias desde a última doação (padrão 90)
- Mínimo de dias desde a última doação (padrão 120 — ~4 meses)
- Busca por nome (parte do nome)
- Checkbox "Mostrar todos compatíveis" para ignorar o limitador de quantidade e listar todos os elegíveis

Campos de contato agora incluídos
- Cada doador em `donors.json` contém `phone`, `city` e `email`.
- Esses campos são exibidos na ficha do doador (telefone e e-mail visíveis) para facilitar a notificação manual.

Requisitos
- Navegador moderno (Chrome, Firefox, Edge).

Notas
- O arquivo `donors.json` contém amostras de doadores. Adapte conforme sua base real.
- Regras de compatibilidade implementadas no `script.js` (constante COMPAT). Ajuste se necessário.
# BloodBank
software para gerenciamento de bolsas de sangue
