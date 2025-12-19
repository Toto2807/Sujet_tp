// Fonction générique pour faire des requêtes
export const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    // TRES IMPORTANT : Permet d'envoyer/recevoir les cookies HttpOnly
    credentials: 'include', 
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`/api${endpoint}`, options);
    
    // Si on reçoit une 401 (Non autorisé), c'est peut-être que l'access token est expiré
    // On pourrait tenter un refresh automatique ici, mais pour la démo, on gère l'erreur.
    
    const data = await response.json();
    
    if (!response.ok) {
      throw { status: response.status, message: data.message || 'Erreur API' };
    }
    
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};