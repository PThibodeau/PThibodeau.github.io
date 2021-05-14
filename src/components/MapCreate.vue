<template>
    <div class="card card-body mt-4">
        <form @submit.prevent="onSubmit">
            <div class="form-group">
                <label>level</label>
                <input v-model="form.level" class="form-control" required />
            </div>

            <div class="form-group mt-3">
                <label>grid</label>
                <input v-model="form.grid" class="form-control" required />
            </div>

            <button type="submit" class="btn btn-success mt-3">
                Create Map
            </button>
        </form>
    </div>
</template>

<script>
import { createMap } from '@/firebase'
import { reactive } from 'vue'

export default {
    setup() {
        const form = reactive({ level: '', grid: ''})

        const onSubmit = async () => {
            await createMap({...form})
            form.level = ''
            form.grid = ''
        }

        return { form, onSubmit}
    }
}
</script>
