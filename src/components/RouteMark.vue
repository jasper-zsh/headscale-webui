<template>
    <span class="route-mark">
        <el-tag v-if="isExitNode" size="small">Exit Node</el-tag>
        <el-tag v-if="hasSubnets" size="small">Subnets</el-tag>
    </span>
</template>

<script lang="ts">
import fetcher from '@/fetcher'
import { computed, defineComponent, ref, toRefs, watch } from 'vue'
import { definitions } from '@/gen/openapi'

export default defineComponent({
  props: {
    machineId: String
  },
  setup (props) {
    const { machineId } = toRefs(props)
    const routes = ref<definitions['v1Routes']|undefined>()
    const f = fetcher.path('/api/v1/machine/{machineId}/routes').method('get').create()
    watch(machineId, async (val) => {
      const res = await f({
        machineId: val ?? ''
      })
      routes.value = res.data.routes
    }, { immediate: true })

    const isExitNode = computed(() => {
      const r = routes.value?.advertisedRoutes?.filter(r => r.endsWith('/0'))
      return r && r.length > 0
    })
    const hasSubnets = computed(() => {
      const r = routes.value?.advertisedRoutes?.filter(r => !r.endsWith('/0'))
      return r && r.length > 0
    })

    return {
      routes,
      isExitNode,
      hasSubnets
    }
  }
})
</script>
