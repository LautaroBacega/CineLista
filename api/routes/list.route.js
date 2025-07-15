import express from "express"
import {
  getUserLists,
  createList,
  updateList,
  deleteList,
  addMovieToList,
  removeMovieFromList,
  generateShareToken,
  getSharedList,
  getListDetails,
} from "../controllers/list.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

// Protected routes (require authentication)
router.get("/", verifyToken, getUserLists)
router.post("/", verifyToken, createList)
router.get("/:id", verifyToken, getListDetails)
router.put("/:id", verifyToken, updateList)
router.delete("/:id", verifyToken, deleteList)
router.post("/:id/movies", verifyToken, addMovieToList)
router.delete("/:id/movies/:movieId", verifyToken, removeMovieFromList)
router.post("/:id/share", verifyToken, generateShareToken)

// Public routes
router.get("/shared/:token", getSharedList)

export default router
