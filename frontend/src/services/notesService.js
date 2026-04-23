import api from "./api";

export const notesService = {
  getAll: async () => (await api.get("/notes")).data,
  getById: async (id) => (await api.get(`/notes/${id}`)).data,
  create: async (noteData) => (await api.post("/notes", noteData)).data,
  update: async (id, noteData) => (await api.put(`/notes/${id}`, noteData)).data,
  delete: async (id) => (await api.delete(`/notes/${id}`)).data,
};