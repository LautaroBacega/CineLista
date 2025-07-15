import List from "../models/list.model.js"
import { errorHandler } from "../utils/error.js"
import crypto from "crypto"

// Create default lists for new user
export const createDefaultLists = async (userId) => {
  const defaultLists = [
    { name: "Favoritas", description: "Mis películas favoritas", isDefault: true },
    { name: "Aún no he visto", description: "Películas que quiero ver", isDefault: true },
    { name: "Ya vistas", description: "Películas que ya he visto", isDefault: true },
  ]

  try {
    const lists = defaultLists.map((list) => ({
      ...list,
      user: userId,
    }))

    await List.insertMany(lists)
    console.log(`✅ Default lists created for user ${userId}`)
  } catch (error) {
    console.error("❌ Error creating default lists:", error)
  }
}

// Get user's lists
export const getUserLists = async (req, res, next) => {
  try {
    const lists = await List.find({ user: req.user.id }).sort({ createdAt: 1 })
    res.status(200).json(lists)
  } catch (error) {
    next(error)
  }
}

// Create new list
export const createList = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body

    if (!name || name.trim() === "") {
      return next(errorHandler(400, "El nombre de la lista es requerido"))
    }

    // Check if user already has a list with this name
    const existingList = await List.findOne({
      user: req.user.id,
      name: name.trim(),
    })

    if (existingList) {
      return next(errorHandler(400, "Ya tienes una lista con este nombre"))
    }

    const newList = new List({
      name: name.trim(),
      description: description?.trim() || "",
      user: req.user.id,
      isPublic: isPublic || false,
    })

    const savedList = await newList.save()
    res.status(201).json(savedList)
  } catch (error) {
    next(error)
  }
}

// Update list
export const updateList = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description, isPublic } = req.body

    const list = await List.findOne({ _id: id, user: req.user.id })

    if (!list) {
      return next(errorHandler(404, "Lista no encontrada"))
    }

    if (list.isDefault && name && name !== list.name) {
      return next(errorHandler(400, "No puedes cambiar el nombre de las listas por defecto"))
    }

    if (name) list.name = name.trim()
    if (description !== undefined) list.description = description.trim()
    if (isPublic !== undefined) list.isPublic = isPublic

    const updatedList = await list.save()
    res.status(200).json(updatedList)
  } catch (error) {
    next(error)
  }
}

// Delete list
export const deleteList = async (req, res, next) => {
  try {
    const { id } = req.params

    const list = await List.findOne({ _id: id, user: req.user.id })

    if (!list) {
      return next(errorHandler(404, "Lista no encontrada"))
    }

    if (list.isDefault) {
      return next(errorHandler(400, "No puedes eliminar las listas por defecto"))
    }

    await List.findByIdAndDelete(id)
    res.status(200).json({ message: "Lista eliminada correctamente" })
  } catch (error) {
    next(error)
  }
}

// Add movie to list
export const addMovieToList = async (req, res, next) => {
  try {
    const { id } = req.params
    const { movieId, title, posterPath, releaseDate, voteAverage } = req.body

    const list = await List.findOne({ _id: id, user: req.user.id })

    if (!list) {
      return next(errorHandler(404, "Lista no encontrada"))
    }

    // Check if movie already exists in list
    const movieExists = list.movies.some((movie) => movie.movieId === movieId)

    if (movieExists) {
      return next(errorHandler(400, "La película ya está en esta lista"))
    }

    list.movies.push({
      movieId,
      title,
      posterPath,
      releaseDate,
      voteAverage,
    })

    const updatedList = await list.save()
    res.status(200).json(updatedList)
  } catch (error) {
    next(error)
  }
}

// Remove movie from list
export const removeMovieFromList = async (req, res, next) => {
  try {
    const { id, movieId } = req.params

    const list = await List.findOne({ _id: id, user: req.user.id })

    if (!list) {
      return next(errorHandler(404, "Lista no encontrada"))
    }

    list.movies = list.movies.filter((movie) => movie.movieId !== Number.parseInt(movieId))

    const updatedList = await list.save()
    res.status(200).json(updatedList)
  } catch (error) {
    next(error)
  }
}

// Generate share token for list
export const generateShareToken = async (req, res, next) => {
  try {
    const { id } = req.params

    const list = await List.findOne({ _id: id, user: req.user.id })

    if (!list) {
      return next(errorHandler(404, "Lista no encontrada"))
    }

    // Generate unique share token
    const shareToken = crypto.randomBytes(16).toString("hex")
    list.shareToken = shareToken
    list.isPublic = true

    const updatedList = await list.save()
    res.status(200).json({
      shareToken,
      shareUrl: `${req.protocol}://${req.get("host")}/shared-list/${shareToken}`,
    })
  } catch (error) {
    next(error)
  }
}

// Get shared list
export const getSharedList = async (req, res, next) => {
  try {
    const { token } = req.params

    const list = await List.findOne({ shareToken: token, isPublic: true }).populate("user", "username")

    if (!list) {
      return next(errorHandler(404, "Lista compartida no encontrada"))
    }

    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}

// Get list details
export const getListDetails = async (req, res, next) => {
  try {
    const { id } = req.params

    const list = await List.findOne({ _id: id, user: req.user.id })

    if (!list) {
      return next(errorHandler(404, "Lista no encontrada"))
    }

    res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}
