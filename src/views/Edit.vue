<template>
    <div class="card card-body mt-4">
        <h3>Edit Maps</h3>
        <form @submit.prevent="update">
            <div class="form-group">
                <label>level</label>
                <input v-model="form.level" class="form-control" required />
            </div>

            <div class="form-group mt-3">
                <label>grid</label>
                <input v-model="form.grid" class="form-control" required />
            </div>

            <button type="submit" class="btn btn-success mt-3">
                Update Map
            </button>
        </form>
    </div>
</template>

<script>
import { reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMap, updateMap } from '@/firebase'

export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        const mapId = computed(() => route.params.id)

        const form = reactive({ level: '', grid: ''})
        onMounted(async () => {
            const map = await getMap(mapId.value)
            form.level = map.level
            form.grid = map.grid
        })

        const update = async () => {
            await updateMap(mapId.value, {...form})
            router.push('/') //go back to main page
            form.level = ''
            form.grid = ''
        }

        return { form, update }
    }
}
</script>
