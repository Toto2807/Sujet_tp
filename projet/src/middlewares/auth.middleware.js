// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// export function authMiddleware(req, res, next) {
//   const auth = req.headers.authorization;
//   if (!auth || !auth.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Token manquant' });
//   }
//   const token = auth.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = {
//       id: payload.sub,
//       role: payload.role || payload.roles || 'user',
//       raw: payload
//     };
//     return next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Token invalide', detail: err.message });
//   }
// }



import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || null;

export async function authMiddleware(req, res, next) {
  try {
    console.log('--- authMiddleware start ---');
    console.log('headers.authorization =', req.headers.authorization);

    if (!req.headers || !req.headers.authorization) {
      console.log('-> Token manquant (no header)');
      return res.status(401).json({ message: 'Token manquant' });
    }

    const auth = req.headers.authorization;
    if (!auth.startsWith('Bearer ')) {
      console.log('-> Format invalide (not Bearer)');
      return res.status(401).json({ message: 'Format d\'autorisation invalide' });
    }

    const token = auth.split(' ')[1];

    if (!JWT_SECRET) {
      console.error('-> JWT_SECRET non défini ! process.env.JWT_SECRET=', process.env.JWT_SECRET);
      return res.status(500).json({ message: 'Server misconfiguration: JWT secret missing' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (verifyErr) {
      console.error('-> jwt.verify error:', verifyErr && verifyErr.message);
      return res.status(401).json({ message: 'Token invalide ou expiré', detail: verifyErr.message });
    }

    req.user = { id: payload.sub, role: payload.role || 'user', raw: payload };
    console.log('-> payload =', payload);
    console.log('--- authMiddleware end ---');
    return next();
  } catch (err) {
    console.error('authMiddleware unexpected error:', err && (err.stack || err));
    return res.status(500).json({ message: 'Erreur serveur (auth)', detail: err && err.message });
  }
}
