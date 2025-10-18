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

const DEFAULT_MIN_DAYS = 90; // valor padrão

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

function eligibleFor(targetType, donor, filters){
  // compatibilidade ABO/Rh
  if(!COMPAT[targetType].includes(donor.blood)) return false;

  // gênero
  if(filters.gender !== 'all' && donor.gender !== filters.gender) return false;

  // idade
  if(donor.age < filters.ageMin || donor.age > filters.ageMax) return false;

  // tempo desde última doação
  const days = daysSince(donor.last_donation);
  if(days < filters.minDays) return false;

  // busca por nome (parte)
  if(filters.name && !donor.name.toLowerCase().includes(filters.name.toLowerCase())) return false;

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
      <div class="donorTop">
        <div class="donorLeft">
          <div class="avatar">${d.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</div>
          <div>
            <strong>${d.name}</strong>
            <div class="meta">${d.age} anos · ${d.gender} · <span style="color:var(--accent-2)">${d.city}</span></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          <div class="bloodTag">${d.blood}</div>
          <div class="meta" style="font-size:0.82rem">Última: ${d.last_donation} · ${daysSince(d.last_donation)}d</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div class="meta">📞 ${d.phone} · ✉️ ${d.email}</div>
        <div style="display:flex;justify-content:flex-end">
          <button class="notify" data-id="${d.id}">Notificar</button>
        </div>
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
  const gender = document.getElementById('genderFilter').value;
  const ageMin = parseInt(document.getElementById('ageMin').value,10) || 18;
  const ageMax = parseInt(document.getElementById('ageMax').value,10) || 65;
  const minDays = parseInt(document.getElementById('minDays').value,10) || DEFAULT_MIN_DAYS;
  const name = document.getElementById('nameSearch').value.trim();
  const showAll = document.getElementById('showAll').checked;

  const donors = await loadDonors();

  const filters = {gender, ageMin, ageMax, minDays, name};

  // filtrar por elegibilidade + filtros adicionais
  let eligibles = donors.filter(d => eligibleFor(target,d,filters));

  // ordenar: preferir doadores com mais dias desde a última doação
  eligibles.sort((a,b)=> daysSince(b.last_donation) - daysSince(a.last_donation));

  const suggested = showAll ? eligibles : eligibles.slice(0, qty);

  renderList(suggested.length ? suggested : eligibles, target);
});

document.getElementById('clearBtn').addEventListener('click', ()=>{
  document.getElementById('genderFilter').value = 'all';
  document.getElementById('ageMin').value = 18;
  document.getElementById('ageMax').value = 65;
  document.getElementById('minDays').value = DEFAULT_MIN_DAYS;
  document.getElementById('nameSearch').value = '';
  document.getElementById('showAll').checked = false;
  document.getElementById('quantity').value = 1;
  document.getElementById('list').innerHTML = '<p>Filtros limpos. Selecione tipo e clique em "Encontrar doadores elegíveis".</p>';
});

// carregar inicialmente um conjunto vazio
window.addEventListener('load', ()=>{
  document.getElementById('list').innerHTML = '<p>Selecione tipo e clique em "Encontrar doadores elegíveis".</p>';
});
