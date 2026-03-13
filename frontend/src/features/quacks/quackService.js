import axios from 'axios'

const API_URL = '/api/quacks/'

const getConfig = (token) => ({ headers: { Authorization: `Bearer ${token}` } })

const getMyQuacks = async (token) => {
  const response = await axios.get(API_URL + 'mine', getConfig(token))
  return response.data
}

const getQuestionQuacks = async (questionId, token) => {
  const response = await axios.get(API_URL + 'question/' + questionId, getConfig(token))
  return response.data
}

const createQuack = async (quackData, token) => {
  const response = await axios.post(API_URL, quackData, getConfig(token))
  return response.data
}

const updateQuack = async (id, quackData, token) => {
  const response = await axios.put(API_URL + id, quackData, getConfig(token))
  return response.data
}

const deleteQuack = async (id, token) => {
  const response = await axios.delete(API_URL + id, getConfig(token))
  return response.data
}

const resonateQuack = async (id, token) => {
  const response = await axios.post(API_URL + id + '/resonate', {}, getConfig(token))
  return response.data
}

const quackService = {
  getMyQuacks,
  getQuestionQuacks,
  createQuack,
  updateQuack,
  deleteQuack,
  resonateQuack,
}

export default quackService
