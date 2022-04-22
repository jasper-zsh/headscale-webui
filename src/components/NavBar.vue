<template>
    <div class="navbar">
        <el-menu mode="horizontal" :default-active="$route.path" router>
            <el-menu-item index="/machine">Machines</el-menu-item>
            <li style="position:absolute;right:0;display:flex;align-items:center;">
                <div class="namespace">
                    <el-form>
                        <el-form-item label="Namespace">
                            <namespace-selector />
                        </el-form-item>
                    </el-form>
                </div>
            </li>
        </el-menu>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import NamespaceSelector from './NamespaceSelector.vue'

export default defineComponent({
  components: { NamespaceSelector },
  setup () {
    const store = useStore()

    const apiKey = computed({
      get () {
        return store.state.apiKey
      },
      set (val) {
        store.commit('setApiKey', val)
      }
    })

    return { apiKey }
  }
})
</script>

<style lang="scss" scoped>
.navbar {
    .float-right {
        position: absolute;
        right: 0;
        display: flex;
    }
    .apikey {
        height: 100%;
        display: flex;
        align-items: center;
    }
}
</style>
