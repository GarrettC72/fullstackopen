import axios from 'axios'
import storageService from './storage'
const baseUrl = '/api/blogs'

const getHeaders = () => {
  const user = storageService.loadUser()
  return { Authorization: user ? `Bearer ${user.token}` : null }
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: getHeaders(),
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const comment = async (id, comment) => {
  const config = {
    headers: getHeaders(),
  }

  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    { comment },
    config
  )
  return response.data
}

const update = async (newObject) => {
  const config = {
    headers: getHeaders(),
  }

  const response = await axios.put(
    `${baseUrl}/${newObject.id}`,
    newObject,
    config
  )
  return response.data
}

const deleteObject = async (id) => {
  const config = {
    headers: getHeaders(),
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, comment, update, deleteObject }
