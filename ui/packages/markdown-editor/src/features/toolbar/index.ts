import type { Ctx } from '@milkdown/kit/ctx';
import { TooltipProvider, tooltipFactory } from '@milkdown/kit/plugin/tooltip';
import type { EditorState, PluginView, Selection } from '@milkdown/kit/prose/state';
import { TextSelection } from '@milkdown/kit/prose/state';
import type { EditorView } from '@milkdown/kit/prose/view';
import debounce from 'lodash/debounce';
import { type App, type ShallowRef, createApp, ref, shallowRef } from 'vue';

import { MarkdownFeature } from '..';
import { featureConfig } from '../../core/slice';
import { addViewEvent, addViewScrollEvent } from '../../utils';
import type { GroupBuilder } from '../../utils';
import type { DefineFeature } from '../types';
import { Toolbar } from './component';
import type { ToolbarItem } from './config';

interface ToolbarConfig {
  boldIcon: string;
  codeIcon: string;
  italicIcon: string;
  linkIcon: string;
  strikethroughIcon: string;
  latexIcon: string;
  buildToolbar: (builder: GroupBuilder<ToolbarItem>) => void;
}

export type ToolbarFeatureConfig = Partial<ToolbarConfig>;

const toolbarTooltip = tooltipFactory('CREPE_TOOLBAR');

class ToolbarView implements PluginView {
  #tooltipProvider: TooltipProvider;
  #content: HTMLElement;
  #app: App;
  #selection: ShallowRef<Selection>;
  #show = ref(false);

  // ==== 修改 ====
  #removeOnScroll: (() => void) | null;
  #removeMousedownListener: (() => void) | null = null;
  #removeMouseupListener: (() => void) | null = null;
  #debouncedUpdate: (view: EditorView, prevState?: EditorState) => void;

  constructor(ctx: Ctx, view: EditorView, config?: ToolbarFeatureConfig) {
    const content = document.createElement('div');
    content.className = 'milkdown-toolbar';
    this.#selection = shallowRef(view.state.selection);
    const app = createApp(Toolbar, {
      ctx,
      hide: this.hide,
      config,
      selection: this.#selection,
      show: this.#show,
    });
    app.mount(content);
    this.#content = content;
    this.#app = app;

    this.#tooltipProvider = new TooltipProvider({
      content: this.#content,
      debounce: 20,
      offset: 10,
      shouldShow(view: EditorView) {
        const { doc, selection } = view.state;
        const { empty, from, to } = selection;

        const isEmptyTextBlock =
          !doc.textBetween(from, to).length && selection instanceof TextSelection;

        const isNotTextBlock = !(selection instanceof TextSelection);

        const activeElement = (view.dom.getRootNode() as ShadowRoot | Document).activeElement;
        const isTooltipChildren = content.contains(activeElement);

        const notHasFocus = !view.hasFocus() && !isTooltipChildren;

        const isReadonly = !view.editable;

        if (notHasFocus || isNotTextBlock || empty || isEmptyTextBlock || isReadonly) return false;

        return true;
      },
    });
    this.#tooltipProvider.onShow = () => {
      this.#show.value = true;
    };
    this.#tooltipProvider.onHide = () => {
      this.#show.value = false;
    };
    // this.update(view);

    // ==== 修改 ====
    this.#debouncedUpdate = debounce((view: EditorView, prevState?: EditorState) => {
      this.#update(view, prevState);
    }, 150);

    this.#update(view);

    this.#removeOnScroll = addViewScrollEvent(view, () => {
      this.#update(view);
    });

    const onMouseUp = () => {
      this.#debouncedUpdate(view);
    };
    const onMouseDown = () => {
      this.hide();
    };
    this.#removeMouseupListener = addViewEvent(window, 'mouseup', onMouseUp);
    this.#removeMousedownListener = addViewEvent(view.dom, 'mousedown', onMouseDown);
  }

  // ==== 修改 ====
  #update = (view: EditorView, prevState?: EditorState) => {
    this.#tooltipProvider.update(view, prevState);
    this.#selection.value = view.state.selection;
  };

  // update = (view: EditorView, prevState?: EditorState) => {
  //   this.#tooltipProvider.update(view, prevState);
  //   this.#selection.value = view.state.selection;
  // };

  destroy = () => {
    // ==== 修改 ====
    if (this.#removeOnScroll) {
      this.#removeOnScroll();
    }
    if (this.#removeMouseupListener) {
      this.#removeMouseupListener();
    }
    if (this.#removeMousedownListener) {
      this.#removeMousedownListener();
    }

    this.#tooltipProvider.destroy();
    this.#app.unmount();
    this.#content.remove();
  };

  hide = () => {
    this.#tooltipProvider.hide();
  };
}

export const defineToolbar: DefineFeature<ToolbarFeatureConfig> = (editor, config) => {
  editor
    .config(featureConfig(MarkdownFeature.Toolbar))
    .config((ctx) => {
      ctx.set(toolbarTooltip.key, {
        view: (view) => new ToolbarView(ctx, view, config),
      });
    })
    .use(toolbarTooltip);

  return config;
};
