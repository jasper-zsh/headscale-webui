<template>
    <div class="namespace-selector">
        <el-select v-model="namespace">
            <el-option
                v-for="ns in namespaces"
                :key="ns.id"
                :value="ns.name"
                :label="ns.name"
            />
        </el-select>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { definitions } from '@/gen/openapi'
import fetcher from '@/fetcher'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const store = useStore()

    const namespaces = ref<definitions['v1Namespace'][]|undefined>([])
    const f = fetcher.path('/api/v1/namespace').method('get').create()

    onMounted(async () => {
      const res = await f({})
      namespaces.value = res.data.namespaces
    })

    const namespace = computed({
      get () {
        return store.state.namespace
      },
      set (val) {
        store.commit('setNamespace', val)
      }
    })

    return {
      namespaces,
      namespace
    }
  }
})
</script>
