import axios from 'axios'

const API_URL = '/api/comments/'

const getConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } })

const getComments = async (quackId, token) => {
  const response = await axios.get(API_URL + 'quack/' + quackId, getConfig(token))
  return response.data
}

const createComment = async (commentData, token) => {
  const response = await axios.post(API_URL, commentData, getConfig(token))
  return response.data
}

const deleteComment = async (id, token) => {
  const response = await axios.delete(API_URL + id, getConfig(token))
  return response.data
}

const commentService = { getComments, createComment, deleteComment }

export default commentService
