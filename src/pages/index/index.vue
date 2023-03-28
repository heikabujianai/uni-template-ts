<template>
  <layout-view>
    {{ content }}
  </layout-view>
</template>

<script lang="ts" setup>
import {uploadExample} from "@/service";
import {ref} from "vue";
import LayoutView from "@/components/layoutView/layoutView.vue";

const content = ref<string>("");
uni.chooseImage({
  success: res => {
    console.log(res);
    uploadExample<{ url: string }>({name: "file", filePath: res.tempFilePaths}).then(data => {
      console.log("example=>", data);
      // content.value = data;
    }).catch(err => {
      console.log("err=>", err);
    });
  },
});
</script>

<style lang="scss" scoped>

</style>
