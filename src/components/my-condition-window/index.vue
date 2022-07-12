<template>
  <my-window
    title="高级查询"
    
    :visible.sync="currentVisible"
    :modal="modal"
    :modal-append-to-body="modalAppendToBody"
    :custom-class="'my-search-window'"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
  >
    <my-condition-filter ref="searchFilter" :fields="fields" >
      <template v-slot:field>
          <slot name="field" :fields="fields"></slot>
          </template>
    </my-condition-filter>
    <template #footer>
      <div class="dialog-footer">
        <my-confirm-button
          :placement="'bottom-end'"
          style="margin-left: 0px;float:left;"
          @click="onReset"
        >
          <template #content>
            <p>确定要重置吗？</p>
          </template>
          重置
        </my-confirm-button>
        <el-button @click.native="onCancel">取消</el-button>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>
    </template>
  </my-window>
</template>

<script>
/**
 * 高级查询窗口
 * 使用说明
    import MySearchWindow from '@/components/my-search-window'
    components: { MySearchWindow }

    <!--高级查询窗口-->
    <my-search-window
      :visible.sync="searchWindowVisible"
      :fields="fields"
      @click="onSearchFilter"
    />

    // 高级查询字段
    fields: [
      { value: 'userName', label: '用户名' },
      { value: 'nickName', label: '昵称', type: 'string' },
      { value: 'createdTime', label: '创建时间', type: 'date', config: { type: 'date' }}
    ],
    searchWindowVisible: false,

    // 高级查询显示
    onsearchWindowVisible() {
      this.searchWindowVisible = true
    },
    // 高级查询
    onSearchFilter(dynamicFilter) {
      this.getUsers(dynamicFilter)
      this.searchWindowVisible = false
    },
*/
import MyWindow from '@/components/my-window'
import MyConfirmButton from '@/components/my-confirm-button'
import MyConditionFilter from '@/components/my-condition-filter'
export default {
  name: 'MyConditionWindow',
  components: { MyWindow, MyConfirmButton, MyConditionFilter },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    form: {
      type: String,
      default: ''
    },
    // {field: '', label: '', value: '', type: 'string', config: {}}
    // type string:字符串 date:日期 number:数字 bool:布尔
    // config 控件属性配置
    fields: {
      type: Array,
      default() {
        return []
      }
    },
    // templates:[{name:'',filters:[]}]
    templates: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    currentVisible: {
      get() {
        return this.visible
      },
      set(val) {
        if (!val) {
          this.onCancel()
        }
      }

    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    // 重置
    onReset() {
      this.$refs.searchFilter.reset()
    },
    // 取消
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 高级查询
    onSearch() {
      const dynamicFilter = this.$refs.searchFilter.getDynamicFilter()
      this.$emit('click', this.form, dynamicFilter)
    }
  }
}
</script>
