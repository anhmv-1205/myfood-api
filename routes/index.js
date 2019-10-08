import { index } from '../controllers/index';

export default app => {
    app.get('/status', index);
};
