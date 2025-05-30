import { Fragment, defineComponent, h, ref } from 'vue';

import { Icon } from '../../../components';
import type { Icon as IconType } from '../../types';

h;
Fragment;

export interface BlockHandleProps {
  onAdd: () => void;
  addIcon: IconType;
  handleIcon: IconType;
}

export const BlockHandle = defineComponent<BlockHandleProps>({
  props: {
    onAdd: {
      type: Function,
      required: true,
    },
    addIcon: {
      type: Function,
      required: true,
    },
    handleIcon: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const addButton = ref<HTMLDivElement>();

    return () => {
      return (
        <>
          <div
            ref={addButton}
            class="operation-item"
            onPointerdown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addButton.value?.classList.add('active');
            }}
            onPointerup={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addButton.value?.classList.remove('active');
              props.onAdd();
            }}
          >
            <Icon icon={props.addIcon()} />
          </div>
          <div class="operation-item">
            <Icon icon={props.handleIcon()} />
          </div>
        </>
      );
    };
  },
});
