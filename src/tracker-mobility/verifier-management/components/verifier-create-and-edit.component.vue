<script>

import CreateAndEdit from "../../../shared/components/create-and-edit.component.vue";

export default {
  name: 'verifier-create-and-edit',
  components: {CreateAndEdit},

  props: {
    edit: Boolean,
    item: null,
    visible: Boolean
  },

  methods: {

    onCancelRequested() {
      this.$emit('cancel-requested');
    },

    onSaveRequested() {
      this.submitted = true;
      this.$emit('save-requested', this.item);
    }
  },

  created() {
    console.log('Batches Create and Edit Dialog component created');
  }

};

</script>

<template>


  <create-and-edit :entity="item" :visible="visible" entity-name="verificador" :edit="edit"
                   @canceled-shared="onCancelRequested" @saved-shared="onSaveRequested">



  </create-and-edit>

</template>

<style scoped>

</style>