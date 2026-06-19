import { Router } from "express";
import asyncRoute from "#root/src/lib/asyncRoute.js";
import {
  getAllLiterature,
  getLiteratureById,
  createLiterature,
  updateLiterature,
  deleteLiterature
} from "#root/src/controllers/literatureController.js";

const router = Router();

router.get('/', asyncRoute(getAllLiterature));

router.get('/:id', asyncRoute(getLiteratureById));

router.post('/', asyncRoute(createLiterature));

router.put('/:id', asyncRoute(updateLiterature));

router.delete('/:id', asyncRoute(deleteLiterature));

export default router;
