<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <transition name="modal-animation">
        <div v-show="modalActive" class="modal" @click.self="close">
            <transition name="modal-animation-inner">
                <div v-show="modalActive" class="modal-inner">
                    <img v-if="isSuccess" src="../../public/tick-100.png" alt="Success">
                    <img v-else src="../../public/error-100.png" alt="Error">
                    <!-- Modal Content -->
                    <slot />
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
import { watch, onBeforeUnmount } from "vue";

export default {
    props: ["modalActive", "isSuccess"],
    setup(props, { emit }) {
        const close = () => {
            emit("close");
        };

    let timer = null;

    const startTimer = () => {
      timer = setTimeout(close, 300000);
    };

    const stopTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    watch(
      () => props.modalActive,
      (newVal) => {
        if (newVal) {
          startTimer();
        } else {
          stopTimer();
        }
      }
    );

    onBeforeUnmount(() => {
      stopTimer();
    });

    return { close };
  },
};
</script>

<style lang="scss" scoped>
.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-animation-inner-leave-to {
  transform: scale(0.8);
}

.modal {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px;
  box-sizing: border-box;
  background-color: transparent;

    .modal-inner {
        position: relative;
        max-width: 640px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: #fff;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .icon-container {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            // i {
            //     font-size: 50%; // To bằng một nửa popup
            // }
        }
    }
}
</style>
