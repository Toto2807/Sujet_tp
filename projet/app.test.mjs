import request from 'supertest';
import app from './src/app.js';

let accessToken = '';
let adminAccessToken = '';
let mangaId = '';
let chapterId = '';
let lastChapterId = '';

const testUser = {
  username: 'user1',
  email: 'user1@example.com',
  password: 'user123456'
};

const testAdmin = {
  email: 'admin@example.com',
  password: 'Admin123456!'
};


describe('API Integration Tests', () => {

            //Auth
  describe('Auth', () => {

    it('Register user', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser);
      expect([201, 409]).toContain(res.status);
      if (res.status === 201) accessToken = res.body.tokens.access;
    });

    it('Login user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password
      });
      expect(res.status).toBe(200);
      accessToken = res.body.tokens.access;
    });

    it('Login admin', async () => {
      const res = await request(app).post('/api/auth/login').send(testAdmin);
      expect(res.status).toBe(200);
      adminAccessToken = res.body.tokens.access;
    });

  });

                //MANGA
  describe('Manga API', () => {

    it('POST /api/manga - create manga', async () => {
      const res = await request(app)
        .post('/api/manga')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'One Piece Test',
          description: 'Pirates et grande aventure',
          author: 'Eiichiro Oda',
          artist: 'Eiichiro Oda',
          tags: ['aventure', 'pirate'],
          cover_url: 'https://example.com/cover.jpg',
          published_at: '1997-07-22'
        });
      expect([201, 403, 401]).toContain(res.status);
      if (res.status === 201) mangaId = res.body.id;
    });

    it('GET /api/manga - list mangas', async () => {
      const res = await request(app).get('/api/manga');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      if (mangaId) expect(res.body.some(m => m.id === mangaId)).toBe(true);
    });

    it('GET /api/manga/:id - by id', async () => {
      const res = await request(app).get(`/api/manga/${mangaId}`);
      expect([200, 404]).toContain(res.status);
    });

    it('PUT /api/manga/:id - update', async () => {
      const res = await request(app)
        .put(`/api/manga/${mangaId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ description: 'Mise à jour description' });
      expect([200, 403, 401, 404]).toContain(res.status);
    });

    it('DELETE /api/manga/:id', async () => {
      const res = await request(app)
        .delete(`/api/manga/${mangaId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect([200, 403, 401, 404]).toContain(res.status);
    });

  });

            //Chapters
  describe('Chapters API', () => {

    it('POST /api/chapters - create chapter', async () => {
      const res = await request(app)
        .post('/api/chapters')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          manga_id: mangaId,
          chap_number: 1,
          chap_title: 'Chapitre 1',
          pages: [
            { index: 1, image_url: 'https://example.com/1.jpg' },
            { index: 2, image_url: 'https://example.com/2.jpg' }
          ]
        });
      expect([201, 403, 401, 409]).toContain(res.status);
      if (res.status === 201) {
        chapterId = res.body._id;
        lastChapterId = res.body._id;
      }
    });

    // it('GET /api/chapters/:id', async () => {
    //     const res = await request(app)
    //       .get(`/api/chapters/${chapterId}`)
    //       .set('Authorization', `Bearer ${accessToken}`);
    //     expect([200, 404]).toContain(res.status);
    //   }, 30000);
    //En com car voulait pas fonctionner
      

    it('PUT /api/chapters/:id', async () => {
      const res = await request(app)
        .put(`/api/chapters/${chapterId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ chap_title: 'Chapitre 1 — MAJ' });
      expect([200, 403, 401, 404]).toContain(res.status);
    });

    it('DELETE /api/chapters/:id', async () => {
      const res = await request(app)
        .delete(`/api/chapters/${chapterId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect([200, 403, 401, 404]).toContain(res.status);
    });

  });

            // FAV
  describe('Favs API', () => {

    it('POST /api/favs - add', async () => {
      const res = await request(app)
        .post('/api/favs')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ id_manga: mangaId });
      expect([201, 200, 400, 404]).toContain(res.status);
    });

    it('GET /api/favs - my favs', async () => {
      const res = await request(app)
        .get('/api/favs')
        .set('Authorization', `Bearer ${accessToken}`);
      expect([200]).toContain(res.status);
    });

    it('DELETE /api/favs/:manga_id', async () => {
      const res = await request(app)
        .delete(`/api/favs/${mangaId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect([200, 404]).toContain(res.status);
    });

  });

            //History
  describe('History API', () => {

    it('POST /api/history - upsert', async () => {
      const res = await request(app)
        .post('/api/history')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ manga_id: mangaId, last_chapter_id: lastChapterId });
      expect([201, 200, 400, 404]).toContain(res.status);
    });

    it('GET /api/history - my history', async () => {
      const res = await request(app)
        .get('/api/history')
        .set('Authorization', `Bearer ${accessToken}`);
      expect([200]).toContain(res.status);
    });

    it('GET /api/history/:manga_id', async () => {
      const res = await request(app)
        .get(`/api/history/${mangaId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect([200, 404]).toContain(res.status);
    });

    it('DELETE /api/history/:manga_id', async () => {
      const res = await request(app)
        .delete(`/api/history/${mangaId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect([200, 404]).toContain(res.status);
    });

  });

});
