import { FileItem } from '@arco-design/web-vue';

// 接收上传的文件并封如formData
const getFileFormData = (file: FileItem, params?: Record<string, any>): FormData => {
  const fd = new FormData();
  fd.append('file', file);
  if (params) {
    Object.entries(params).forEach((entry) => {
      fd.append(entry[0], entry[1]);
    });
  }
  return fd;
};

export default getFileFormData;
