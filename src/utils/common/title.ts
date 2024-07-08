import { loadEnv } from 'vite';

// @ts-ignore
const getViteEnv = (mode, target) => {
  return loadEnv(mode, process.cwd())[target];
};

export default getViteEnv;
