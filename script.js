// Dados serão carregados do arquivo donors.json (simulado como fetch local)

const COMPAT = {
  // receptor: [doadores possíveis]
  'A+': ['A+','A-','O+','O-'],
  'A-': ['A-','O-'],
  'B+': ['B+','B-','O+','O-'],
  'B-': ['B-','O-'],
  'AB+': ['AB+','AB-','A+','A-','B+','B-','O+','O-'],
  'AB-': ['AB-','A-','B-','O-'],
  'O+': ['O+','O-'],
  'O-': ['O-']
};

const MIN_DAYS = 90; // não notificar quem doou há menos de 90 dias

function daysSince(dateStr){
  const past = new Date(dateStr);
  const diff = Date.now() - past.getTime();
  return Math.floor(diff / (1000*60*60*24));
}

async function loadDonors(){
  try{
    const res = await fetch('donors.json');
    return await res.json();
  }catch(e){
    console.error('Erro carregando donors.json', e);
    return [];
  }
}

function eligibleFor(targetType, donor){
  // compatibilidade ABO/Rh
  if(!COMPAT[targetType].includes(donor.blood)) return false;

  // idade (assumir 18-65 como faixa válida)
  if(donor.age < 18 || donor.age > 65) return false;

  // tempo desde última doação
  const days = daysSince(donor.last_donation);
  if(days < MIN_DAYS) return false;

  return true;
}

function renderList(list, targetType){
  const container = document.getElementById('list');
  container.innerHTML = '';
  if(list.length === 0){
    container.innerHTML = '<p>Nenhum doador elegível encontrado.</p>';
    return;
  }

  list.forEach(d =>{
    const el = document.createElement('div');
    el.className = 'donor';
    el.innerHTML = `
      <div>
        <strong>${d.name}</strong>
        <div class="meta">${d.blood} · ${d.age} anos · ${d.gender} · última doação: ${d.last_donation} (${daysSince(d.last_donation)} dias)</div>
      </div>
      <div>
        <button class="notify" data-id="${d.id}">Notificar</button>
      </div>
    `;
    container.appendChild(el);
  });

  // adicionar handlers para notificar (simulado)
  container.querySelectorAll('.notify').forEach(btn =>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.id;
      const donor = list.find(x=>String(x.id)===String(id));
      if(donor){
        // aqui a notificação é simulada: log + alteração visual
        console.log(`Notificação enviada para ${donor.name} (id:${donor.id}) para doar ${targetType}`);
        btn.textContent = 'Notificado';
        btn.disabled = true;
      }
    });
  });
}

document.getElementById('findBtn').addEventListener('click', async ()=>{
  const target = document.getElementById('bloodType').value;
  const qty = parseInt(document.getElementById('quantity').value,10) || 1;
  const donors = await loadDonors();

  // filtrar por elegibilidade
  const eligibles = donors.filter(d => eligibleFor(target,d));

  // ordenar: preferir doadores com mais dias desde a última doação
  eligibles.sort((a,b)=> daysSince(b.last_donation) - daysSince(a.last_donation));

  // limitar pela quantidade necessária (mas mostrar lista completa para opção manual)
  const suggested = eligibles.slice(0, qty);

  renderList(suggested.length ? suggested : eligibles, target);
});

// carregar inicialmente um conjunto vazio
window.addEventListener('load', ()=>{
  document.getElementById('list').innerHTML = '<p>Selecione tipo e clique em "Encontrar doadores elegíveis".</p>';
});
