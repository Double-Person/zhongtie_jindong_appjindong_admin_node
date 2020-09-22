<template>
  <a-modal :maskClosable="false"
    title=""
    width="80%"
    :visible="visible"
    @cancel="visible=false"
    :footer="null"
  >
    <learningModalList :learningModal="true" @learningModalSelect="learningModalSelect"></learningModalList>
   <!-- <SafetyLearningStatisticsList :learningModal="true" @learningModalSelect="learningModalSelect"/>-->
  </a-modal>
</template>

<script>
  import learningModalList from './learningModalList'
import SafetyLearningStatisticsList from '@/views/modules/businessProject/safetyLearning/SafetyLearningStatisticsList.vue'
export default {
  name: "",
  components: {
    learningModalList
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
    learningModalSelect(record) {
      this.$emit('setTypeDataId',record)
      this.visible = false
    }
  },
};
</script>

<style lang="" scoped>
</style>