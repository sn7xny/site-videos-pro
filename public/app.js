async function loadFeed(){
  const res = await fetch('/videos-feed');
  const vids = await res.json();

  const feed = document.getElementById('feed');
  feed.innerHTML = '';

  vids.forEach(v => {
    feed.innerHTML += `
      <div class="card">
        <video controls onclick="view('${v.id}')" src="/videos/${v.file}"></video>
        <p>${v.title}</p>
        <p>👁️ ${v.views}</p>
      </div>
    `;
  });
}

async function view(id){
  await fetch('/view/' + id, { method:'POST' });
}

function admin(){
  const senha = prompt('Senha:');
  if(senha === '1234'){
    window.location.href = '/admin.html';
  } else {
    alert('Senha errada');
  }
}

loadFeed();