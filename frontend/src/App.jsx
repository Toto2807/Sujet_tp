import { useState, useEffect } from 'react';
import { apiCall } from './api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('auth');
  const [logs, setLogs] = useState([]);

  // Fonction pour afficher les logs d'action à l'écran (pour la démo)
  const addLog = (msg, type = 'info') => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${type.toUpperCase()}: ${msg}`, ...prev]);
  };

  // --- ACTIONS AUTH ---
  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      await apiCall('/auth/register', 'POST', data);
      addLog('Inscription réussie. Connectez-vous maintenant.', 'success');
    } catch (err) { addLog(err.message, 'error'); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await apiCall('/auth/login', 'POST', data);
      setUser(res.user);
      addLog(`Bienvenue ${res.user.username} ! Cookie de session reçu.`, 'success');
      setActiveTab('mangas');
    } catch (err) { addLog(err.message, 'error'); }
  };

  const handleLogout = async () => {
    try {
      // Si tu as créé la route logout, sinon supprime juste le state
      // await apiCall('/auth/logout', 'POST'); 
      setUser(null);
      addLog('Déconnexion réussie (Cookies supprimés).', 'info');
      setActiveTab('auth');
    } catch (err) { addLog('Erreur déconnexion', 'error'); }
  };

  const tryRefresh = async () => {
    try {
      // Tente de rafraîchir la session au chargement
      const res = await apiCall('/auth/refresh', 'POST', {});
      // Note: Le endpoint refresh ne renvoie pas forcément l'user complet selon ton implémentation
      // Si besoin, faire un GET /users/me après
      addLog('Session restaurée via Refresh Token', 'success');
    } catch (err) {
      addLog('Pas de session active', 'info');
    }
  };

  useEffect(() => {
    tryRefresh();
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Mangas API Demo</h1>
        <div className="user-info">
          {user ? (
            <>
              <span>Connecté en tant que : <strong>{user.username}</strong> ({user.role})</span>
              <button onClick={handleLogout} className="btn-danger">Déconnexion</button>
            </>
          ) : (
            <span>Non connecté</span>
          )}
        </div>
      </header>

      <div className="main-content">
        <nav className="tabs">
          <button onClick={() => setActiveTab('auth')} className={activeTab === 'auth' ? 'active' : ''}>Authentification</button>
          <button onClick={() => setActiveTab('mangas')} className={activeTab === 'mangas' ? 'active' : ''}> Mangas & Chapitres</button>
          <button onClick={() => setActiveTab('users')} className={activeTab === 'users' ? 'active' : ''} disabled={!user}> Admin Users</button>
          <button onClick={() => setActiveTab('perso')} className={activeTab === 'perso' ? 'active' : ''} disabled={!user}> Favoris & Historique</button>
        </nav>

        <div className="tab-content">
          {activeTab === 'auth' && <AuthTab onLogin={handleLogin} onRegister={handleRegister} user={user} />}
          {activeTab === 'mangas' && <MangaTab addLog={addLog} user={user} />}
          {activeTab === 'users' && <UsersTab addLog={addLog} />}
          {activeTab === 'perso' && <PersoTab addLog={addLog} />}
        </div>

        <div className="logs-panel">
          <h3>Console de Démo</h3>
          <div className="logs-list">
            {logs.map((log, i) => <div key={i} className="log-item">{log}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function AuthTab({ onLogin, onRegister, user }) {
  if (user) return <div className="center-msg"><h3>Vous êtes déjà connecté ✅</h3></div>;
  return (
    <div className="auth-forms">
      <div className="card">
        <h3>Connexion</h3>
        <form onSubmit={onLogin}>
          <input name="email" placeholder="Email" defaultValue="admin@test.com" required />
          <input name="password" type="password" placeholder="Mot de passe" defaultValue="Password123!" required />
          <button type="submit">Se connecter</button>
        </form>
      </div>
      <div className="card">
        <h3>Inscription</h3>
        <form onSubmit={onRegister}>
          <input name="username" placeholder="Pseudo" required />
          <input name="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Mot de passe" required />
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  );
}

function MangaTab({ addLog, user }) {
  const [mangas, setMangas] = useState([]);
  const [selectedManga, setSelectedManga] = useState(null);
  const [chapters, setChapters] = useState([]);

  const loadMangas = async () => {
    try {
      const res = await apiCall('/mangas'); // Assure-toi que c'est bien GET /mangas ou /mangas/all
      setMangas(res);
      addLog(`Chargé ${res.length} mangas`, 'success');
    } catch (e) { addLog(e.message, 'error'); }
  };

  const createManga = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await apiCall('/mangas', 'POST', Object.fromEntries(formData));
      addLog('Manga créé', 'success');
      loadMangas();
    } catch (e) { addLog(e.message, 'error'); }
  };

  const deleteManga = async (id) => {
    if(!confirm('Supprimer ?')) return;
    try {
      await apiCall(`/mangas/${id}`, 'DELETE');
      addLog('Manga supprimé', 'success');
      loadMangas();
    } catch (e) { addLog(e.message, 'error'); }
  };

  const selectManga = async (manga) => {
    setSelectedManga(manga);
    try {
      // Ajuste la route selon ton back: GET /chapters?manga_id=...
      const res = await apiCall(`/chapters?manga_id=${manga._id || manga.id}`); 
      setChapters(res);
    } catch (e) { addLog('Impossible de charger les chapitres', 'error'); }
  };

  const createChapter = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.manga_id = selectedManga._id || selectedManga.id; // Liaison ID
    try {
      await apiCall('/chapters', 'POST', data);
      addLog('Chapitre ajouté', 'success');
      selectManga(selectedManga); // Reload
    } catch (e) { addLog(e.message, 'error'); }
  };

  return (
    <div className="manga-tab">
      <div className="left-panel">
        <button onClick={loadMangas} className="btn-refresh">🔄 Charger la liste</button>
        <div className="manga-list">
          {mangas.map(m => (
            <div key={m._id || m.id} className="list-item" onClick={() => selectManga(m)}>
              <span>{m.title}</span>
              {user?.role === 'admin' && (
                <button onClick={(e) => {e.stopPropagation(); deleteManga(m._id || m.id)}} className="btn-mini">❌</button>
              )}
            </div>
          ))}
        </div>
        
        {user?.role === 'admin' && (
          <div className="form-mini">
            <h4>Nouveau Manga</h4>
            <form onSubmit={createManga}>
              <input name="title" placeholder="Titre (Test XSS ici!)" required />
              <input name="author" placeholder="Auteur" />
              <input name="published_at" type="date" />
              <button type="submit">Créer</button>
            </form>
          </div>
        )}
      </div>

      <div className="right-panel">
        {selectedManga ? (
          <>
            <h3>{selectedManga.title}</h3>
            <p>ID: {selectedManga._id || selectedManga.id}</p>
            <hr/>
            <h4>Chapitres</h4>
            <ul>
              {chapters.map(c => <li key={c._id || c.id}>Chapitre {c.chap_number}: {c.title}</li>)}
            </ul>
            
            {user?.role === 'admin' && (
              <form onSubmit={createChapter} className="form-inline">
                <input name="chap_number" type="number" placeholder="N°" required style={{width: '60px'}}/>
                <input name="title" placeholder="Titre du chapitre" />
                <button type="submit">Ajouter Chapitre</button>
              </form>
            )}
          </>
        ) : <p>Sélectionnez un manga à gauche</p>}
      </div>
    </div>
  );
}

function UsersTab({ addLog }) {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await apiCall('/users');
      setUsers(res);
      addLog('Utilisateurs chargés', 'success');
    } catch (e) { addLog(e.message, 'error'); }
  };

  return (
    <div>
      <button onClick={loadUsers}>Charger les utilisateurs</button>
      <table className="data-table">
        <thead><tr><th>Email</th><th>Role</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id || u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td><button disabled>Bannir (TODO)</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PersoTab({ addLog }) {
  // Implémente tes appels GET /favorites et GET /history ici de la même façon
  return <div><h3>Fonctionnalité à implémenter (similaire à MangaTab)</h3><p>Utilisez apiCall('/favorites')</p></div>;
}

export default App;