<template>
    <div class="machines-page">
        <el-table :data="machines" :row-style="{height: '100px'}">
            <el-table-column label="Machine">
                <template #default="scope">
                    <div>{{ scope.row.name }}</div>
                    <div>
                        <route-mark :machineId="scope.row.id" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="IP">
                <template #default="scope">
                    <div>
                        <el-tag
                            size="small"
                            v-for="addr in scope.row.ipAddresses"
                            :key="addr"
                            @click="copy(addr)"
                        >{{ addr }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="Last Seen">
                <template #default="scope">
                    <span>{{ moment(scope.lastSeen).format('YYYY-MM-DD HH:mm:ss') }}</span>
                </template>
            </el-table-column>
            <el-table-column>
                <template #default="scope">
                    <el-dropdown trigger="click">
                        <el-button>...</el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="openRouteSettingsDialog(scope.row)">Edit route settings</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <route-settings-dialog ref="routeSettingsDialog" />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { definitions } from '@/gen/openapi'
import fetcher from '@/fetcher'
import { useStore } from 'vuex'
import moment from 'moment'
import useClipboard from 'vue-clipboard3'
import { ElMessage } from 'element-plus'
import RouteSettingsDialog from '@/components/RouteSettingsDialog.vue'
import RouteMark from '@/components/RouteMark.vue'

export default defineComponent({
  components: { RouteMark, RouteSettingsDialog },
  setup () {
    const machines = ref<definitions['v1Machine'][]|undefined>([])
    const store = useStore()
    const namespace = computed(() => store.state.namespace)
    const editingMachine = ref<definitions['v1Machine']>()
    const routeSettingsDialog = ref<typeof RouteSettingsDialog>()

    watch(namespace, async (n) => {
      const f = fetcher.path('/api/v1/machine').method('get').create()
      const res = await f({
        namespace: n
      })
      machines.value = res.data.machines
    }, { immediate: true })

    const { toClipboard } = useClipboard()
    return {
      machines,
      moment,
      editingMachine,
      routeSettingsDialog,
      toClipboard,
      async copy (content: string) {
        try {
          await toClipboard(content)
          ElMessage({
            message: `${content} copied to clipboard`,
            type: 'success'
          })
        } catch (e) {
          console.log(e)
          ElMessage({
            message: 'Failed to access clipboard',
            type: 'error'
          })
        }
      }
    }
  },
  methods: {
    openRouteSettingsDialog (machine: definitions['v1Machine']) {
      this.routeSettingsDialog?.open(machine)
    }
  }
})
</script>
