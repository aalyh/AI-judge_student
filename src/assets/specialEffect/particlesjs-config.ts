/**
 * tsParticles_Engine配置项文档
 * @link https://particles.js.org/docs/interfaces/tsParticles_Engine.Options_Interfaces_Particles_IParticlesOptions.IParticlesOptions.html
 *
 * particles.vue3组件的实际配置项, 不要看node_modules里的, 那里面好像是直接用的particles.js中的配置
 * 但这个轮子 —— particles.vue3, 实际上配置项的数据结构和particles.js有出入, 有效配置要自己去官网看, 配好了复制过来
 * @link https://particles.js.org/samples/index.html#Bubble
 */

const theme = {
  gray: {
    color: '#1b1e34',
    stroke: '#293145',
  },
  blue: {
    color: '#5d6a8c', // #5c6c94
    stroke: '#293145',
  },
};

const useTheme: keyof typeof theme = 'blue';

const particlesConfig = {
  particles: {
    number: {
      value: 6,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: theme[useTheme].color,
    },
    shape: {
      type: 'polygon',
      // 这里和ts文档里的有出入, 实际上需要写在options里才会生效
      options: {
        polygon: {
          // 多边形边数
          sides: 6,
        },
      },
    },
    // 边框配置也要写在外面
    stroke: {
      width: 0,
      color: theme[useTheme].stroke,
    },
    opacity: {
      value: 0.3,
      random: true,
      anim: {
        enable: false,
        speed: 1,
        opacity_min: 0.1,
        sync: false,
      },
    },
    size: {
      value: 160,
      random: false,
      anim: {
        enable: true,
        speed: 10,
        size_min: 40,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
      distance: 200,
      color: '#ffffff',
      opacity: 1,
      width: 2,
    },
    move: {
      enable: true,
      speed: 5,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200,
      },
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: false,
        mode: 'grab',
      },
      onclick: {
        enable: false,
        mode: 'push',
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 400,
        line_linked: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 400,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      push: {
        particles_nb: 4,
      },
      remove: {
        particles_nb: 2,
      },
    },
  },
  retina_detect: true,
};

export default particlesConfig;
