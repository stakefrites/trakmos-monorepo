<script setup>
const props= defineProps({
    title: {
        type: String,
        default: '',
    },
    hasActions: {
        type: Boolean,
        default: false,
    }
})
</script>

<template>
    <v-card variant="outlined" class="card">
        <v-card-title>{{props.title}}</v-card-title>
        <v-card-text>
            <slot name="content"></slot>
        </v-card-text>
        <v-card-actions v-if="hasActions">
            <slot name="actions"></slot>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.card {
    border-radius: 10px !important;
    border-width: 5px;
    border-color: #76EFD3;
    color: white;
}

</style>