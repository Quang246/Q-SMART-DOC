<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <transition name="modal-animation">
        <div v-show="modalActive" class="modal" @click.self="close">
            <transition name="modal-animation-inner">
                <div v-show="modalActive" class="modal-inner">
                    <i @click="close" class="far fa-times-circle"></i>
                    <div class="modal-header">
                        <h5 class="modal-title"><slot name="message"></slot></h5>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="close">Không</button>
                        <button type="button" class="btn btn-primary" @click="onAgree">Đồng ý</button>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        modalActive: {
            type: Boolean,
            required: true
        },
        autoClose: {
            type: Boolean,
            default: false
        },
        autoCloseDelay: {
            type: Number,
            default: 3000
        }
    },
    watch: {
        modalActive(newValue) {
            if (newValue && this.autoClose) {
                setTimeout(() => {
                    this.close();
                }, this.autoCloseDelay);
            }
        }
    },
    methods: {
        close() {
            this.$emit("close");
        },
        onAgree() {
            this.$emit("agree");
            this.close();
        }
    }
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
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.7);

    .modal-inner {
        position: relative;
        max-width: 640px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: #fff;
        padding: 16px;

        i {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 20px;
            cursor: pointer;

            &:hover {
                color: crimson;
            }
        }

        button {
            border: none;
            cursor: pointer;
        }
    }
}
</style>
