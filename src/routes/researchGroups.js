import { Router } from "express";
import asyncRoute from "#root/src/lib/asyncRoute.js";
import {
  getAllResearchGroups,
  getResearchGroupById,
  createResearchGroup,
  updateResearchGroup,
  deleteResearchGroup
} from "#root/src/controllers/researchGroupsController.js";

const router = Router();

router.get('/', asyncRoute(getAllResearchGroups));

router.get('/:id', asyncRoute(getResearchGroupById));

router.post('/', asyncRoute(createResearchGroup));

router.put('/:id', asyncRoute(updateResearchGroup));

router.delete('/:id', asyncRoute(deleteResearchGroup));

export default router;
