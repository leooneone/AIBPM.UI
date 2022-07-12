import request from '@/utils/request'
import scope from './scope'
const apiPrefix = `${process.env.VUE_APP_BASE_API}/${scope}/workflowtemplate/`
// 员工管理
export const get = (params, config = {}) => {
  return request.get(apiPrefix + 'get', { params: params, ...config })
}

export const list = (params, config = {}) => {
  return request.get(apiPrefix + 'listPublished', { params: params, ...config })
}
 


export const getForm = (params, config = {}) => {
  return request.get(apiPrefix + 'getForm', { params: params, ...config })
}
export const getPage = (params, config = {}) => {
  return request.post(apiPrefix + 'getpage', params, config)
}

export const edit = (params, config = {}) => {
  return request.put(apiPrefix + 'update', params, config)
}
export const update = (params, config = {}) => {
  return request.put(apiPrefix + 'updateBasic', params, config)
}
//新增流程模板
export const add = (params, config = {}) => {
  return request.post(apiPrefix + 'Add', params, config)
}
export const removeEmployee = (params, config = {}) => {
  return request.delete(apiPrefix + 'softdelete', { params: params, ...config })
}
export const batchRemoveEmployee = (params, config = {}) => {
  return request.put(apiPrefix + 'BatchsoftDelete', params, config)
}
 