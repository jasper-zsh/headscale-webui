<template>
    <div class="namespace-page">
        <div v-for="ns in namespaces" :key="ns.id">{{ns}}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import fetcher from '@/fetcher'
import { definitions } from '@/gen/openapi'

export default defineComponent({
  setup (props: any) {
    const namespaces = ref<Array<definitions['v1Namespace']>|undefined>([])

    onMounted(async () => {
      const f = fetcher.path('/api/v1/namespace').method('get').create()
      const res = await f({})
      namespaces.value = res.data.namespaces
    })

    return {
      namespaces
    }
  }
})
</script>
