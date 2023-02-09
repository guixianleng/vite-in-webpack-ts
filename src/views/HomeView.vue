<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <crf-button type="primary" @click="dialogVisible = true">sgsg</crf-button>
    <crf-empty></crf-empty>
    <crf-dict-select v-model="code" code="ruleType" />

    <crf-dialog
      v-model="dialogVisible"
      icon="icon-a-16xinxi"
      title="健康预测模型详情"
      width="500px"
    >
    </crf-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const code = ref<string>('');
const dialogVisible = ref<boolean>(false);
</script>
