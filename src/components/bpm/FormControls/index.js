import Amount from './Amount'
import Calculation from './Calculation'
import TimeDuration from './TimeDuration'
import DateDuration from './DateDuration'
import OrgTransfer from './OrgTransfer'
import OrgSelect from './OrgSelect'
import InputTable from './InputTable'
//import Tinymce from './Tinymce'
const components = [
  Amount,
  Calculation,
  TimeDuration,
  DateDuration,
  OrgTransfer,
  OrgSelect,
  InputTable,
  //Tinymce 已经注册 不需要这里再加载
]

const install = function ( Vue ) {
  components.map( component => {
    console.log('注册：'+component.name)
    Vue.component( component.name, component )
  } )
}

export default {
  install
}