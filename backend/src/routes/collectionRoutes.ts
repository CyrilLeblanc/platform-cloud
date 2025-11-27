import {createCollection, getMyCollections, getCollectionById, updateCollection, deleteCollection} from '../controllers/collectionController';
import {Router} from "express";
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createCollection);
router.get('/', authMiddleware, getMyCollections);
router.get('/:id', authMiddleware, getCollectionById);
router.put('/:id', authMiddleware, updateCollection);
router.delete('/:id', authMiddleware, deleteCollection);

export default router;
