import { Router } from "express";
import asyncRoute from "#root/src/lib/asyncRoute.js";
import {
  getAllLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage
} from "#root/src/controllers/languagesController.js";

const router = Router();

router.get('/', asyncRoute(getAllLanguages));

router.get('/:id', asyncRoute(getLanguageById));

router.post('/', asyncRoute(createLanguage));

router.put('/:id', asyncRoute(updateLanguage));

router.delete('/:id', asyncRoute(deleteLanguage));

export default router;
