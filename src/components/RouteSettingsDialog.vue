<template>
    <el-dialog
        v-model="visible"
        :title="`Edit route settings of ${machine?.name}`"
    >
        <h4>Subnet routes</h4>
        <p>Connect machines you can't install Tailscale on.</p>
        <el-card>
            <div
                v-for="enabled, route in routeMap"
                :key="route"
            >
                <el-switch :active-text="route" v-model="routeMap[route]" @change="save" />
            </div>
        </el-card>
        <h4>Exit node</h4>
        <p>Allow your network to route internet traffic through this machine.</p>
        <el-switch active-text="Use as exit node" :disabled="!isExitNode" v-model="exitNodeEnabled" @change="save" />
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { definitions } from '@/gen/openapi'
import fetcher from '@/fetcher'

export default defineComponent({
  setup () {
    const machine = ref<definitions['v1Machine']>()
    const routes = ref<definitions['v1Routes']|undefined>()
    const visible = ref(false)
    const loading = ref(false)
    const getRoutes = fetcher.path('/api/v1/machine/{machineId}/routes').method('get').create()
    const routeMap = ref<{[key: string]:boolean}>({})
    const exitNodeEnabled = ref(false)
    const isExitNode = ref(false)
    const loadRoutes = async (val: string) => {
      const res = await getRoutes({
        machineId: val
      })
      routes.value = res.data.routes
    }

    watch(routes, () => {
      const m: {[key: string]: boolean} = {}
      exitNodeEnabled.value = false
      isExitNode.value = false
      routes.value?.advertisedRoutes?.forEach(r => {
        if (r.endsWith('/0')) {
          isExitNode.value = true
          return
        }
        m[r] = false
      })
      routes.value?.enabledRoutes?.forEach(r => {
        if (r.endsWith('/0')) {
          exitNodeEnabled.value = true
          return
        }
        m[r] = true
      })
      routeMap.value = m
    })

    return {
      routes,
      machine,
      visible,
      loadRoutes,
      routeMap,
      exitNodeEnabled,
      isExitNode,
      loading
    }
  },
  methods: {
    open (machine: definitions['v1Machine']) {
      console.log('open', machine)
      this.machine = machine
      this.loadRoutes(machine.id ?? '')
      this.visible = true
    },
    async save () {
      this.loading = true
      const f = fetcher.path('/api/v1/machine/{machineId}/routes').method('post').create({ routes: true })
      const enabledRoutes: string[] = []
      for (const route in this.routeMap) {
        if (this.routeMap[route]) {
          enabledRoutes.push(route)
        }
      }
      if (this.exitNodeEnabled) {
        enabledRoutes.push(...this.routes?.advertisedRoutes?.filter(r => r.endsWith('/0')) ?? [])
      }
      const res = await f({
        machineId: this.machine?.id ?? '',
        routes: enabledRoutes
      })
      this.routes = res.data.routes
    }
  }
})
</script>
