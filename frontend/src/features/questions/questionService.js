import axios from 'axios'

const API_URL = '/api/questions/'

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

const getMyQuestion = async (token) => {
  const response = await axios.get(API_URL + 'mine', getConfig(token))
  return response.data
}

const getTodaysQuestion = async () => {
  const response = await axios.get(API_URL + 'today')
  return response.data
}

const getNextAvailableDate = async (token) => {
  const response = await axios.get(API_URL + 'next-available-date', getConfig(token))
  return response.data
}

const reorderQuestions = async (ids, token) => {
  const response = await axios.put(API_URL + 'reorder', { ids }, getConfig(token))
  return response.data
}

const getQuestions = async (token) => {
  const response = await axios.get(API_URL, getConfig(token))
  return response.data
}

const createQuestion = async (questionData, token) => {
  const response = await axios.post(API_URL, questionData, getConfig(token))
  return response.data
}

const updateQuestion = async (id, questionData, token) => {
  const response = await axios.put(API_URL + id, questionData, getConfig(token))
  return response.data
}

const deleteQuestion = async (id, token) => {
  const response = await axios.delete(API_URL + id, getConfig(token))
  return response.data
}

const getQuestionByIndex = async (index, token) => {
  const response = await axios.get(API_URL + 'byIndex/' + index, getConfig(token))
  return response.data
}

const questionService = {
  getMyQuestion,
  getQuestionByIndex,
  getTodaysQuestion,
  getNextAvailableDate,
  reorderQuestions,
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
}

export default questionService
