import express from 'express';
import authRoutes from './routes/auth.route.js';
import postRouter from './routes/post.route.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/post', postRouter);

export default app;