<template>
  <a-modal :maskClosable="false"
    title=""
    width="80%"
    :visible="visible"
    @cancel="visible=false"
    :footer="null"
  >
    <SafetyTestingStatisticsList :testingModal="true" @testingModalSelect="testingModalSelect"/>
  </a-modal>
</template>

<script>
import SafetyTestingStatisticsList from '@/views/modules/businessProject/safetyTesting/SafetyTestingStatisticsList.vue'
export default {
  name: "",
  components: {
    SafetyTestingStatisticsList
  },
  data() {
    return {
      visible:false
    };
  },
  methods: {
    show(){
      this.visible = true
    },
    testingModalSelect(record) {
      this.$emit('setTypeDataId',record)
      this.visible = false
    }
  },
};
</script>

<style lang="" scoped>
</style>