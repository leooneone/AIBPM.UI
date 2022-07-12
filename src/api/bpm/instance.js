import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/instance/`

export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}

export const open = (params, config = {}) => {
  return request.get(apiPrefix + 'open', { params: params, ...config })
}
export const detail = (params, config = {}) => {
  return request.get(apiPrefix + 'detail', { params: params, ...config })
}

export const getRunning = (params, config = {}) => {
  return request.post(apiPrefix + 'getRunning', params, config)
}
export const getForm = (params, config = {}) => {
  return request.get(apiPrefix + 'getForm', { params: params, ...config })
}
export const getEmployeeListPage = (params, config = {}) => {
  return request.post(apiPrefix + 'getpage', params, config)
}
export const editEmployee = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const updateBasicEmployee = (params, config = {}) => {
  return request.put(apiPrefix + 'updateBasic', params, config)
}
//新增流程
export const submit = (params, config = {}) => {
  return request.post(apiPrefix + 'submit', params, config)
}
export const removeEmployee = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const batchRemoveEmployee = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}
 