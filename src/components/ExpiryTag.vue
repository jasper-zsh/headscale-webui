<template>
    <el-tag size="small" type="info">{{ expiryMsg }}</el-tag>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import moment from 'moment'

export default defineComponent({
  props: {
    expiry: String
  },
  setup (props) {
    const { expiry } = toRefs(props)

    const expiryMsg = computed(() => {
      const m = moment(expiry.value)
      if (m.isBefore(moment('1900-01-01'))) {
        return 'No expiry'
      } else {
        return m.isBefore(moment.now()) ? 'Expired ' : 'Expires ' + m.fromNow()
      }
    })

    return {
      expiryMsg
    }
  }
})
</script>
