import FilterPicker from '@/components/FilterPicker'
import FilterPanel from '@/components/FilterPanel'
import VTable from '@/components/VTable'
import RightAside from '@/components/RightAside'
import BreadcrumbItem from '@/components/BreadcrumbItem'

import { getDefaultDate, indexTransUpdate, prefixInteger } from './index'
export const filterTableMixin = {
  components: {
    FilterPicker,
    FilterPanel,
    VTable,
    RightAside,
    BreadcrumbItem
  },
  data () {
    return {
      scrollTop: 0,
      dialogVisible: false,
      dialogType: 'add',
      tableData: [],
      tableOptions: {
        loading: false
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.getScroll, true)
  },
  beforeRouteEnter (to, from, next) {
    const ignoreRouterArrays = [
      '/main',
      '/benefit-withdrawal',
      '/exception-manage/distance-deliver',
      '/cargo-management',
      '/packing-list-management',
      '/exception-manage/list',
      '/goods-manage/type',
      '/site-manage/list',
      '/system-settings/role',
      '/system-settings/admin',
      '/official-account/docker',
      '/data-analysis/order-analysis',
      '/data-analysis/goods-analysis',
      '/data-analysis/places-analysis',
      '/data-analysis/customer-analysis'
    ]
    let path = location.hash.replace('#', '').split('?')[0]
    // to.path.indexOf('/warehouse-manage') >= 0 :仓储管理
    console.log(to.path, ignoreRouterArrays.includes(to.path), to)
    if (ignoreRouterArrays.includes(to.path) || to.path.indexOf('/warehouse-manage') >= 0) {
      console.log('====不需要缓存处理======')
      next()
      return
    }
    console.log(ignoreRouterArrays.includes(to.path), '=======61')
    const canClear = to.meta.keepAlive // 第一次进入页面，mounted和clearFilterPicker都会执行，所以加个限制判断字段
    console.log('=======next to judge router status======', path !== from.path, '============')
    if (path !== from.path) {
      to.meta.keepAlive = true
      console.log(from.query.scrollTop, 'beforeRouteEnter')
      next(vm => {
        document.querySelector('.left-content') && (document.querySelector('.left-content').scrollTop = vm.scrollTop)
      })
    } else {
      to.meta.keepAlive = true
      next(vm => {
        canClear && vm.clearFilterPicker && vm.clearFilterPicker()
        document.querySelector('.left-content') && (document.querySelector('.left-content').scrollTop = 0)
        // to.meta.keepAlive = true;
      })
    }
  },
  methods: {
    getScroll () {
      this.scrollTop = document.querySelector('.left-content') && document.querySelector('.left-content').scrollTop
    },
    getRefDom () {
      return {
        rightAsideDom: this.$refs.rightAsideDom,
        breadcrumbDom: this.$refs.breadcrumbDom
      }
    },
    getDefaultDate,
    paginationEvent (data) {
      this.tableOptions.pageIndex = data.pageIndex
      this.tableOptions.pageSize = data.pageSize
      this.getTableData()
    }
  }
}

export const dialogMixin = {
  props: {
    dialogVisible: {
      type: Boolean
    },
    state: {
      type: String,
      default: 'add'
    },
    params: {}
  },
  data () {
    return {
      isShowDialog: this.dialogVisible
    }
  },
  watch: {
    isShowDialog (newVal) {
      this.$emit('update:dialogVisible', newVal)
    },
    dialogVisible (newVal) {
      this.isShowDialog = newVal
    }
  },
  methods: {
    closeDialog () {
      this.isShowDialog = false
      this.$emit('close')
    }
  }
}

export const discountMixin = {
  methods: {
    transIndex (i, len) {
      return prefixInteger(i + 1, len)
    },
    // 折扣列表转换中文排序-售货机
    getIndex (index) {
      return indexTransUpdate(index)
    },
    getStartAndEndTime (list = []) {
      const times = list.filter((v, i) => {
        return v.type === 'times'
      })
      return times && times[0] && times[0].target && times[0].target[0] ? times[0].target[0] : {}
    },
    getRelatedGoodsLen (list = []) {
      const material = list.filter((v, i) => {
        return v.type === 'material'
      })
      return material && material[0] && material[0].target ? material[0].target.length : 0
    },

    transNumber (value, key, max) {
      const valArr = value.split('.')
      if (valArr.length > 1) {
        if (+valArr[0] === max) {
          value = String(max)
        } else {
          value = `${+(valArr[0].substring(0, 2))}.${valArr[1].substring(0, 2) || '00'}`
        }
      }
      if (+value > max) {
        value = String(max)
      }
      this.setFormValue(key, value)
    },
    setFormValue (key, val) {
      if (this.form[key]) {
        this.form[key] = val
      }
    }
  }
}
