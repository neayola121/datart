/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ORIGINAL_TYPE_MAP } from 'app/pages/DashBoardPage/constants';
import { TabWidgetContent } from 'app/pages/DashBoardPage/pages/Board/slice/types';
import type {
  WidgetActionListItem,
  widgetActionType,
  WidgetMeta,
  WidgetProto,
  WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { getJsonConfigs } from 'app/pages/DashBoardPage/utils';
import { WHITE } from 'styles/StyleConstants';
import { uuidv4 } from 'utils/utils';
import {
  initBackgroundTpl,
  initBorderTpl,
  initPaddingTpl,
  initTitleTpl,
  initWidgetName,
  LoopFetchI18N,
  PaddingI18N,
  TitleI18N,
  widgetTpl,
} from '../../WidgetManager/utils/init';

const NameI18N = {
  zh: '标签卡',
  en: 'Tab',
};

const tabsI18N = {
  zh: {
    tabGroup: '标签页配置',
    alignTitle: '对齐方式',
    position: '标签位置',
    style: '样式',
    tab: '标签',
    dropdown: '下拉框',
    fontFamily: '字体',
    fontSize: '字号',
    color: '文字颜色',
    background: '背景颜色',
    width: '宽度',
    height: '高度',
    paddingTop: '上边距',
    paddingBottom: '下边距',
    paddingLeft: '左边距',
    paddingRight: '右边距',
    borderColor: '边框颜色',
    borderStyle: '边框样式',
    borderWidth: '边框宽度',
    dimensions: '尺寸',
    margins: '外边距',
  },
  en: {
    tabGroup: 'Tab Config',
    alignTitle: 'Align',
    position: 'Position',
    style: 'Style',
    tab: 'Tab',
    dropdown: 'Dropdown',
    fontFamily: 'Font Family',
    fontSize: 'Font Size',
    color: 'Text Color',
    background: 'Background Color',
    width: 'Width',
    height: 'Height',
    paddingTop: 'Margin Top',
    paddingBottom: 'Margin Bottom',
    paddingLeft: 'Margin Left',
    paddingRight: 'Margin Right',
    borderColor: 'Border Color',
    borderStyle: 'Border Style',
    borderWidth: 'Border Width',
    dimensions: 'Dimensions',
    margins: 'Margins',
  },
};

export const widgetMeta: WidgetMeta = {
  icon: 'tab-widget',
  originalType: ORIGINAL_TYPE_MAP.tab,
  canWrapped: false,
  controllable: false,
  linkable: false,
  canFullScreen: true,
  singleton: false,

  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        desc: '标签卡 容器组件可以切换',
        widgetName: NameI18N.zh,
        action: {},
        title: TitleI18N.zh,
        background: { backgroundGroup: '背景' },
        padding: PaddingI18N.zh,
        loopFetch: LoopFetchI18N.zh,
        border: { borderGroup: '边框' },
        tab: tabsI18N.zh,
      },
    },
    {
      lang: 'en-US',
      translation: {
        desc: 'Tab container',
        widgetName: NameI18N.en,
        action: {},
        title: TitleI18N.en,
        background: { backgroundGroup: 'Background' },
        padding: PaddingI18N.en,
        loopFetch: LoopFetchI18N.en,
        border: { borderGroup: 'Border' },
        tab: tabsI18N.en,
      },
    },
  ],
};

export const initTabsTpl = () => {
  return {
    label: 'tab.tabGroup',
    key: 'tabGroup',
    comType: 'group',
    rows: [
      {
        label: 'tab.style',
        key: 'style',
        default: 'tab',
        value: 'tab',
        comType: 'select',
        options: {
          translateItemLabel: true,
          items: [
            { label: 'tab.tab', value: 'tab' },
            { label: 'tab.dropdown', value: 'dropdown' },
          ],
        },
      },
      {
        label: 'tab.alignTitle',
        key: 'align',
        default: 'start',
        value: 'start',
        comType: 'select',
        options: {
          translateItemLabel: true,
          items: [
            { label: 'viz.common.enum.alignment.start', value: 'start' },
            { label: 'viz.common.enum.alignment.center', value: 'center' },
            { label: 'viz.common.enum.alignment.end', value: 'end' },
          ],
        },
        watcher: {
          deps: ['style'],
          action: props => ({ hide: props.style === 'dropdown' }),
        },
      },
      {
        label: 'tab.position',
        key: 'position',
        default: 'top',
        value: 'top',
        comType: 'select',
        options: {
          translateItemLabel: true,
          items: [
            { label: 'viz.common.enum.position.top', value: 'top' },
            { label: 'viz.common.enum.position.bottom', value: 'bottom' },
            { label: 'viz.common.enum.position.left', value: 'left' },
            { label: 'viz.common.enum.position.right', value: 'right' },
          ],
        },
        watcher: {
          deps: ['style'],
          action: props => ({ hide: props.style === 'dropdown' }),
        },
      },
      {
        label: 'tab.fontFamily',
        key: 'fontFamily',
        default: 'PingFang SC',
        value: 'PingFang SC',
        comType: 'fontFamily',
      },
      {
        label: 'tab.fontSize',
        key: 'fontSize',
        default: 14,
        value: 14,
        comType: 'inputNumber',
      },
      {
        label: 'tab.color',
        key: 'color',
        default: '#495057',
        value: '#495057',
        comType: 'fontColor',
      },
      {
        label: 'tab.background',
        key: 'background',
        default: '#ffffff',
        value: '#ffffff',
        comType: 'fontColor',
      },
      {
        label: 'tab.dimensions',
        key: 'dimensions',
        comType: 'group',
        options: { layout: 'horizontal', flatten: true, container: 'flat' },
        watcher: {
          deps: ['style'],
          action: props => ({ hide: props.style !== 'dropdown' }),
        },
        rows: [
          {
            label: 'tab.width',
            key: 'width',
            default: 200,
            value: 200,
            comType: 'inputNumber',
          },
          {
            label: 'tab.height',
            key: 'height',
            default: 32,
            value: 32,
            comType: 'inputNumber',
          },
        ],
      },
      {
        label: 'tab.margins',
        key: 'margins',
        comType: 'group',
        options: { flatten: true, container: 'flat' },
        watcher: {
          deps: ['style'],
          action: props => ({ hide: props.style !== 'dropdown' }),
        },
        rows: [
          {
            label: 'Row1',
            key: 'marginRow1',
            comType: 'group',
            options: { layout: 'horizontal', flatten: true, mode: 'inner' },
            rows: [
              {
                label: 'tab.paddingTop',
                key: 'paddingTop',
                default: 0,
                value: 0,
                comType: 'inputNumber',
              },
              {
                label: 'tab.paddingBottom',
                key: 'paddingBottom',
                default: 8,
                value: 8,
                comType: 'inputNumber',
              },
            ],
          },
          {
            label: 'Row2',
            key: 'marginRow2',
            comType: 'group',
            options: { layout: 'horizontal', flatten: true, mode: 'inner' },
            rows: [
              {
                label: 'tab.paddingLeft',
                key: 'paddingLeft',
                default: 0,
                value: 0,
                comType: 'inputNumber',
              },
              {
                label: 'tab.paddingRight',
                key: 'paddingRight',
                default: 0,
                value: 0,
                comType: 'inputNumber',
              },
            ],
          },
        ],
      },
      {
        label: 'tab.borderColor',
        key: 'borderColor',
        default: '#d9d9d9',
        value: '#d9d9d9',
        comType: 'fontColor',
        watcher: {
          deps: ['style'],
          action: props => {
            return {
              hide: props.style !== 'dropdown',
            };
          },
        },
      },
      {
        label: 'tab.borderStyle',
        key: 'borderStyle',
        default: 'solid',
        value: 'solid',
        comType: 'select',
        options: {
          items: [
            { label: '实线', value: 'solid' },
            { label: '虚线', value: 'dashed' },
            { label: '点线', value: 'dotted' },
            { label: '双实线', value: 'double' },
            { label: '无', value: 'none' },
          ],
        },
        watcher: {
          deps: ['style'],
          action: props => {
            return {
              hide: props.style !== 'dropdown',
            };
          },
        },
      },
      {
        label: 'tab.borderWidth',
        key: 'borderWidth',
        default: 1,
        value: 1,
        comType: 'inputNumber',
        watcher: {
          deps: ['style'],
          action: props => {
            return {
              hide: props.style !== 'dropdown',
            };
          },
        },
      },
    ],
  };
};

export type TabToolkit = WidgetToolkit & {
  getCustomConfig: (props) => {
    align: string;
    position: string;
    style: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    background: string;
    width: number;
    height: number;
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    borderColor: string;
    borderStyle: string;
    borderWidth: number;
  };
};
export const widgetToolkit: TabToolkit = {
  create: opt => {
    const widget = widgetTpl();
    widget.parentId = opt.parentId || '';
    widget.datachartId = opt.datachartId || '';
    widget.viewIds = opt.viewIds || [];
    widget.relations = opt.relations || [];
    widget.config.originalType = widgetMeta.originalType;
    widget.config.type = 'container';
    widget.config.name = opt.name || '';

    widget.config.customConfig.props = [
      { ...initTabsTpl() },
      { ...initTitleTpl() },
      { ...initPaddingTpl() },
      { ...initBackgroundTpl(WHITE) },
      { ...initBorderTpl() },
    ];

    const newTabId = `tab_${uuidv4()}`;
    const content: TabWidgetContent = {
      itemMap: {
        [newTabId]: {
          index: Date.now(),
          tabId: newTabId,
          name: 'tab',
          childWidgetId: '',
        },
      },
    };
    widget.config.content = content;
    return widget;
  },
  getName(key) {
    return initWidgetName(NameI18N, key);
  },
  getDropDownList(...arg) {
    const list: WidgetActionListItem<widgetActionType>[] = [
      {
        key: 'edit',
        renderMode: ['edit'],
      },
      {
        key: 'delete',
        renderMode: ['edit'],
      },
      {
        key: 'lock',
        renderMode: ['edit'],
      },
      {
        key: 'group',
        renderMode: ['edit'],
      },
    ];
    return list;
  },
  getConfigTpl() {
    return [
      { ...initTabsTpl() },
      { ...initTitleTpl() },
      { ...initPaddingTpl() },
      { ...initBackgroundTpl(WHITE) },
      { ...initBorderTpl() },
    ];
  },
  edit() { },
  save() { },
  // lock() {},
  // unlock() {},
  // copy() {},
  // paste() {},
  // delete() {},
  // changeTitle() {},
  // getMeta() {},
  // getWidgetName() {},
  // //
  getCustomConfig(props) {
    const [align, position, style, fontFamily, fontSize, color, background, dimensions, margins, borderColor, borderStyle, borderWidth] = getJsonConfigs(
      props,
      ['tabGroup'],
      ['align', 'position', 'style', 'fontFamily', 'fontSize', 'color', 'background', 'dimensions', 'margins', 'borderColor', 'borderStyle', 'borderWidth'],
    );
    const [width, height] = getJsonConfigs(
      props,
      ['tabGroup', 'dimensions'],
      ['width', 'height'],
    );
    const [marginRow1, marginRow2] = getJsonConfigs(
      props,
      ['tabGroup', 'margins'],
      ['marginRow1', 'marginRow2'],
    );
    const [paddingTop, paddingBottom] = getJsonConfigs(
      props,
      ['tabGroup', 'margins', 'marginRow1'],
      ['paddingTop', 'paddingBottom'],
    );
    const [paddingLeft, paddingRight] = getJsonConfigs(
      props,
      ['tabGroup', 'margins', 'marginRow2'],
      ['paddingLeft', 'paddingRight'],
    );

    return {
      align,
      position,
      style,
      fontFamily,
      fontSize,
      color,
      background,
      width,
      height,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      borderColor,
      borderStyle,
      borderWidth,
    };
  },
};

const tabProto: WidgetProto = {
  originalType: widgetMeta.originalType,
  meta: widgetMeta,
  toolkit: widgetToolkit,
};
export default tabProto;
