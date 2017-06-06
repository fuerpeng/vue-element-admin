<template>
  <div class="components-container">
    <VueUEditor @ready="editorReady" style="width: 900px;height:300px"></VueUEditor>
  </div>
</template>
<script>
    import VueUEditor from 'components/UEditor/UEditor';
    export default {
      components: { VueUEditor },
      data() {
        return {
        }
      },
      methods: {
        editorReady (editorInstance) {
        editorInstance.setContent('');
          editorInstance.addListener('contentChange', () => {
            console.log('编辑器内容发生了变化：', editorInstance.getContent());
          });
        }
      }
    };
</script>

