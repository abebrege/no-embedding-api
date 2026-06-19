import { Router } from "express";
import asyncRoute from "#root/src/lib/asyncRoute.js";
import {
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution
} from "#root/src/controllers/institutionsController.js";

const router = Router();

router.get('/', asyncRoute(getAllInstitutions));

router.get('/:id', asyncRoute(getInstitutionById));

router.post('/', asyncRoute(createInstitution));

router.put('/:id', asyncRoute(updateInstitution));

router.delete('/:id', asyncRoute(deleteInstitution));

export default router;
