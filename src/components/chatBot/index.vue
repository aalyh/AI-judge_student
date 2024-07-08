<script setup lang="ts">
  import { getChatResponse } from '@/api/chatBot';
  import useLoading from '@/hooks/loading';
  import DisplayLatex from '@/components/latex/index.vue';
  import { debounce } from 'lodash';
  import { ref, watch, nextTick, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import preContent from './preContent';

  interface chatListItem {
    text: string;
    isBot: boolean;
  }

  const props = defineProps<{
    examId: number;
  }>();

  const chatWindowVisible = ref(false);
  const setChatWindowVisible = (state: boolean) => {
    chatWindowVisible.value = state;
  };

  const chatListDom = ref<HTMLDivElement | null>(null);
  const editedDom = ref();
  const content = ref('');
  const containerHeight = ref(0);
  const chatListContainer = ref();
  const { loading: inputLoading, setLoading: setInputLoading } = useLoading(false);
  const chatList = ref<chatListItem[]>([]);

  const questionList = ref<string[]>([]);
  const handleChooseQuestion = (question: string) => {
    editedDom.value.innerText += question;
  };
  const isFocus = ref(false);
  const setIsFocus = (state: boolean) => {
    isFocus.value = state;
  };
  const handleEdit = debounce((e) => {
    content.value = e.target.innerText;
  });

  const sendContent = () => {
    const text = editedDom.value.innerText;
    if (!text) {
      Message.error('请先输入问题');
      return;
    }
    chatList.value.push({
      isBot: false,
      text,
    });
    setInputLoading(true);
    getChatResponse({ examId: props.examId, content: text, userId: 0 })
      .then((res) => {
        const { success, data } = res;
        if (success) {
          editedDom.value.innerText = '';
          chatList.value.push({
            isBot: true,
            text: data.content,
          });
        }
      })
      .finally(() => {
        setInputLoading(false);
      });
  };

  watch(
    () => chatList.value.length,
    (newVal) => {
      nextTick(() => {
        setTimeout(() => {
          chatListDom.value?.scrollTo({
            top: chatListDom.value.scrollHeight,
            behavior: 'smooth',
          });
        }, 400);
      });
    },
  );

  watch(
    () => chatWindowVisible.value,
    (newVal) => {
      if (newVal) {
        nextTick(() => {
          containerHeight.value = chatListContainer.value.clientHeight;
        });
      }
    },
  );

  // 获取智能预设问题文本
  const defaultQuestion = ['本堂考试, 同学们表现得怎么样? ', '同学们进步多吗?', '同学们还需要在哪些知识点上针对性巩固?'];
  const { loading: preQuestionLoading, setLoading: setPreQLoading } = useLoading(false);
  const getPreQuestionList = () => {
    setPreQLoading(true);
    getChatResponse({
      examId: +props.examId,
      content: preContent,
      userId: 0,
    })
      .then(({ success, data }) => {
        if (success) {
          const json = data.content.replace(/```|json|\(|\)|\n/g, '').trim();
          const arr = JSON.parse(json);
          setPreQLoading(false);
          arr.forEach((preQuestion: string, index: number) => {
            const delay = index === 0 ? 0 : 200 * index;
            setTimeout(() => {
              questionList.value.push(preQuestion);
            }, delay);
          });
        } else {
          questionList.value = defaultQuestion;
        }
      })
      .finally(() => {
        setPreQLoading(false);
      });
  };

  onMounted(() => {
    chatList.value.push({
      isBot: true,
      text: '您好, 我是易智小助手, 关于这场考试, 您有什么想要咨询的吗? ',
    });
    if (!questionList.value.length) {
      getPreQuestionList();
    }
  });
</script>

<template>
  <div>
    <a-popover>
      <div class="chatEntry">
        <icon-robot
          :size="50"
          color="white"
          @click="setChatWindowVisible(true)"
        />
      </div>
      <template #content> 点击和AI小助理对话, 了解更多有关本场考试的AI分析 </template>
    </a-popover>

    <!--聊天区主体-->
    <Teleport to="body">
      <Transition name="glassify-fade">
        <!--遮罩层-->
        <main
          v-show="chatWindowVisible"
          class="mask glassify"
          @scroll.stop
        >
          <!--聊天区-->
          <div class="chatContainer shadow-gray">
            <header>
              <strong>AI小助理</strong>
              <div>
                <a-button @click="setChatWindowVisible(false)">
                  <template #icon>
                    <icon-close :size="20" />
                  </template>
                </a-button>
              </div>
            </header>
            <main>
              <!--侧边栏-->
              <aside class="flex flex-col">
                <div class="aiAvatar">
                  <icon-robot :size="100" />
                  <h2 class="tip"><i class="i-tabler:adjustments-star mr-2"></i>易智Bot</h2>
                </div>
                <h3 class="text-center text-neutral-500">智能提问</h3>
                <a-spin
                  class="wh-full preSpin"
                  :loading="preQuestionLoading"
                  tip="智能预设问题生成中"
                >
                  <div class="preList">
                    <section class="questionList">
                      <TransitionGroup name="fade-in">
                        <div
                          v-for="(item, index) in questionList"
                          :key="index"
                          class="questionItem"
                          @click="handleChooseQuestion(item)"
                        >
                          {{ item }}
                        </div>
                      </TransitionGroup>
                    </section>
                  </div>
                </a-spin>
              </aside>
              <!--对话区-->
              <div class="chatArea">
                <section
                  ref="chatListContainer"
                  class="history"
                >
                  <div
                    ref="chatListDom"
                    class="listContainer"
                    :style="{
                      maxHeight: containerHeight + 'px',
                    }"
                  >
                    <TransitionGroup name="chat-in">
                      <div
                        v-for="(item, index) in chatList"
                        :key="index"
                        class="chatItem"
                        :class="[`${item.isBot ? 'botChat bot-enter' : 'userChat user-enter'}`]"
                      >
                        <div class="avatar">
                          <icon-robot
                            v-if="item.isBot"
                            :size="32"
                          />
                          <icon-user
                            v-else
                            :size="32"
                          />
                        </div>
                        <div
                          class="chatContent"
                          :style="{
                            marginLeft: `${item.isBot ? 10 : 0}px `,
                            marginRight: `${item.isBot ? 0 : 10}px`,
                          }"
                        >
                          <DisplayLatex
                            :class="{
                              'pl-6': item.isBot,
                              'userText': !item.isBot,
                            }"
                            :latex="item.text"
                          />
                        </div>
                      </div>
                    </TransitionGroup>
                  </div>
                </section>
                <div
                  class="inputArea"
                  :class="{
                    editing: isFocus,
                  }"
                >
                  <a-spin
                    :loading="inputLoading"
                    class="w-1/1 h-1/1"
                    tip="AI正在分析本堂考试信息, 整理回答, 请稍后....."
                  >
                    <div
                      ref="editedDom"
                      class="editedDiv"
                      contenteditable="true"
                      @input="handleEdit"
                      @focus="setIsFocus(true)"
                      @blur="setIsFocus(false)"
                      @keydown.enter="sendContent"
                    ></div>
                    <div
                      :style="{ opacity: inputLoading ? 0 : 1 }"
                      class="sendBtn"
                      @click="sendContent"
                    >
                      <i class="i-tabler:send"></i>
                    </div>
                  </a-spin>
                </div>
              </div>
            </main>
          </div>
        </main>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="less">
  :deep(.preSpin) {
    .arco-spin-mask {
      background-color: transparent;
    }
  }
  :deep(.arco-spin-icon) {
    font-size: 2em;
    color: #9a8fe7;
  }
  :deep(.arco-spin-tip) {
    font-size: 1.2em;
    color: #9a8fe7;
  }
  .userText {
    font-size: 1.2em;
    font-weight: 700;
    color: #7f7f7f;
  }
  .chatEntry {
    position: fixed;
    cursor: pointer;
    bottom: 2.5vh;
    right: 1.5vw;
    padding: 10px;
    border-radius: 50%;
    background-color: #9a8fe7;
  }
  .glassify {
    background-color: rgba(167, 167, 167, 0.644); /* 可调整透明度和颜色 */
    backdrop-filter: blur(5px); /* 毛玻璃效果 */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 1;
    z-index: 1000; /* 保证其在顶层显示 */
    transition: all 0.4s ease; /* 添加过渡效果 */
  }
  .fade-in-enter-active {
    transition: transform 0.3s ease;
    transform: translateX(-100%);
  }

  .glassify-fade-enter-active,
  .glassify-fade-leave-active {
    opacity: 0;
  }

  .botChat {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .userChat {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
  }

  .mask {
    --c-rounded: 20px;
    --c-pxy: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .chatContainer {
      width: 60%;
      aspect-ratio: 16/11;
      background-color: rgb(245, 245, 245);
      border-radius: var(--c-rounded);
      padding: var(--c-pxy);
      display: flex;
      flex-direction: column;
      header {
        height: 7%;
        border-radius: var(--c-rounded);
        padding: var(--c-pxy);
        font-size: 900;
        color: black;
        font-size: 1.3em;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      main {
        flex: 1;
        border-radius: var(--c-rounded);
        padding: var(--c-pxy);
        display: flex;
        justify-content: flex-start;
        aside {
          width: 20%;
          height: 100%;
          border-radius: var(--c-rounded);
          .aiAvatar {
            width: 100%;
            height: 180px;
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: flex-start;
            padding: 10px 0;
          }
          .preList {
            flex: 1;
            width: 100%;
            overflow-y: auto;
            .questionList {
              width: 100%;
              height: auto;
              overflow-x: hidden;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: flex-start;
              margin-bottom: 15px;
              .questionItem {
                word-wrap: break-word;
                word-break: break-all;
                padding: 8px 5px;
                border-radius: 3px;
                font-size: 1.2em;
                font-weight: bold;
                background-color: transparent;
                margin-bottom: 10px;
                color: #5d5d5d;
                cursor: pointer;
                transition: all 0.3s ease;
                &:hover {
                  background-color: #a8a8a8;
                  color: white;
                }
              }
            }
          }
        }
        .chatArea {
          flex: 1;
          background-color: #e8e8e8;
          padding: var(--c-pxy);
          margin-left: var(--c-pxy);
          border-radius: var(--c-rounded);
          .history {
            width: 100%;
            height: 85%;
            margin-bottom: 5px;
            padding: 0 10px;
            .listContainer {
              width: 100%;
              height: auto;
              overflow-y: auto;
              position: relative;
              padding: 0 15px;
              .chatItem {
                width: 100%;
                height: auto;
                margin-bottom: 20px;
                .avatar {
                  padding: 10px;
                  height: min-content;
                  border-radius: 50%;
                  border: 3px solid #8876ff;
                  background-color: white;
                }
                .chatContent {
                  max-width: 60%;
                  white-space: pre-line;
                  word-break: break-all;
                  word-wrap: normal;
                  padding: 15px;
                  background-color: white;
                  border-radius: 10px;
                  font-size: 1.2em;
                  line-height: 1.3em;
                }
              }
            }
          }
          .inputArea {
            margin-top: 25px;
            width: 100%;
            height: 11%;
            border-radius: var(--c-rounded);
            background-color: white;
            padding: 10px 15px;
            transition: border-color 0.3s ease;
            border: 3px solid transparent;
            position: relative;
            .editedDiv {
              width: 90%;
              height: 100%;
              overflow-y: auto;
              word-break: break-all;
              word-wrap: normal;
              font-size: 1.2em;
              font-weight: 700;
              color: #7f7f7f;
              font-family: sans-serif;
              border: 2px solid transparent;
              overflow-y: auto;
              &:focus {
                outline: none;
              }
            }
            .sendBtn {
              position: absolute;
              opacity: 1;
              transform: translateY(40%);
              top: 0%;
              cursor: pointer;
              padding: 8px;
              background-color: #e6e6e6;
              border-radius: 10%;
              transition:
                color 0.3s ease,
                backgound-color 0.3s ease;
              right: 3%;
              color: gray;
              i {
                font-size: 2.3rem;
              }
              &:hover {
                background-color: #9a8fe7;
                color: white;
              }
            }
          }
        }
      }
    }
  }
  .editing {
    border: 3px solid rgb(120, 143, 247) !important;
    box-shadow: 0 0 0 2px rgba(219, 193, 252, 0.107);
  }
</style>
