export default {
  start: {
    type: "start",
    content: "所有人",
    properties: { title: '发起人', initiator: {} ,participants:{}}//'ALL' 发起人应该只有1人
  },
  approver: {
    type: "approver",
    content: "请设置审批人",
    properties: { title: '审批人',participants:{} }
  },
  copy:{
    type: 'copy',
    content: '发起人自选',
    properties: {
      title: '抄送人',
      participants: {},
      userOptional: true
    }
  },
  condition: {
    type: "condition",
    content: "请设置条件",
    properties: { title: '条件', conditions: [], initiator: null }
  },
  branch: { type: "branch", content: "", properties: {} },
  empty: { type: "empty", content: "", properties: {} }
}