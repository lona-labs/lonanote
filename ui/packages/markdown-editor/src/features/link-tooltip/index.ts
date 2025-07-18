import { MarkdownFeature } from '..';
import { featureConfig } from '../../core/slice';
import { confirmIcon, copyIcon, editIcon, removeIcon } from '../../icons';
import type { DefineFeature } from '../types';
import { configureLinkTooltip, linkTooltipConfig, linkTooltipPlugin } from './link-tooltip';

interface LinkTooltipConfig {
  linkIcon: string;
  editButton: string;
  removeButton: string;
  confirmButton: string;
  inputPlaceholder: string;
  onCopyLink: (link: string) => void;

  hoverShow: boolean;
  selectionShow: boolean;
  onClickLink: (link: string) => void;
  onEditClick: (link: string) => Promise<string | false>;
}

export type LinkTooltipFeatureConfig = Partial<LinkTooltipConfig>;

export const defineLinkTooltip: DefineFeature<LinkTooltipFeatureConfig> = (editor, config) => {
  editor
    .config(featureConfig(MarkdownFeature.LinkTooltip))
    .config(configureLinkTooltip)
    .config((ctx) => {
      ctx.update(linkTooltipConfig.key, (prev) => ({
        ...prev,
        linkIcon: config?.linkIcon ?? copyIcon,
        editButton: config?.editButton ?? editIcon,
        removeButton: config?.removeButton ?? removeIcon,
        confirmButton: config?.confirmButton ?? confirmIcon,
        inputPlaceholder: config?.inputPlaceholder ?? 'Paste link...',
        onCopyLink: config?.onCopyLink ?? (() => {}),
        onClickLink: config?.onClickLink ?? null,
        onEditClick: config?.onEditClick ?? null,
        hoverShow: config?.hoverShow == null ? true : config?.hoverShow,
        selectionShow: config?.selectionShow == null ? true : config?.selectionShow,
      }));
    })
    .use(linkTooltipPlugin);
  return config;
};
