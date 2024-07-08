<script setup lang="ts">
  import { SubjectItem } from '@/api/subject';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { FileItem, RequestOption, UploadRequest } from '@arco-design/web-vue';

  const queryData = useRoute().query as SubjectItem;
  const router = useRouter();

  function loadAnswerSheet() {}
  function handleUploadSuccess(file: FileItem) {}
</script>

<template>
  <div>
    <a-layout>
      <a-layout-header>
        <a-card>
          <header text="center">
            <strong text="3xl">{{ queryData.name }}</strong
            ><br />
          </header>
        </a-card>
      </a-layout-header>
      <br />
      <a-layout-content>
        <a-card class="py-5">
          <header flex="~ justify-between">
            <strong text="2xl">答题卡预设</strong><br />
            <a-upload
              w="fit"
              action="/"
              accept="image/*"
              @success="handleUploadSuccess"
            />
          </header>
          <span
            block
            w="full"
            h="0.6"
            bg="gray-200"
            m="t-4 b-4"
          />
          <section flex="~ row wrap justify-around"> </section>
        </a-card>
      </a-layout-content>
    </a-layout>
  </div>
</template>
