import express from 'express';
const router = express.Router();

import userRoute from './user.route';
import noteRoutes from './note.routes';
/**
 * Function contains Application routes
 *
 * @returns router
 */
const routes = () => {
  router.get('/', (req, res) => {
    res.json('Welcome');
  });
  router.use('/users', userRoute);
  router.use('/notes', noteRoutes);

  return router;
};

export default routes;