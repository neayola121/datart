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

import { ChartConfig } from 'app/types/ChartConfig';

const config: ChartConfig = {
  datas: [
    {
      label: 'metrics',
      key: 'metrics',
      required: true,
      type: 'aggregate',
      limit: 1,
    },
    {
      label: 'filter',
      key: 'filter',
      type: 'filter',
    },
  ],
  styles: [
    {
      label: 'liquid.title',
      key: 'liquid',
      comType: 'group',
      rows: [
        {
          label: 'liquid.max',
          key: 'max',
          default: 100,
          comType: 'inputNumber',
        },
        {
          label: 'liquid.shape',
          key: 'shape',
          default: 'circle',
          comType: 'select',
          options: {
            items: [
              { label: '圆形', value: 'circle' },
              { label: '矩形', value: 'rect' },
              { label: '圆角矩形', value: 'roundRect' },
              { label: '三角形', value: 'triangle' },
              { label: '菱形', value: 'diamond' },
              { label: '水滴', value: 'pin' },
              { label: '箭头', value: 'arrow' },
            ],
          },
        },
        {
          label: 'liquid.radius',
          key: 'radius',
          default: '80%',
          comType: 'marginWidth',
        },
        {
          label: 'liquid.waveColor',
          key: 'color',
          default: '#3B82F6',
          comType: 'fontColor',
        },
        {
          label: 'liquid.backgroundColor',
          key: 'backgroundColor',
          default: '#FFFFFF',
          comType: 'fontColor',
        },
      ],
    },
    {
      label: 'outline.title',
      key: 'outline',
      comType: 'group',
      rows: [
        {
          label: 'outline.show',
          key: 'show',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'outline.borderDistance',
          key: 'borderDistance',
          default: 0,
          comType: 'inputNumber',
        },
        {
          label: 'outline.borderWidth',
          key: 'borderWidth',
          default: 2,
          comType: 'inputNumber',
        },
        {
          label: 'outline.borderColor',
          key: 'borderColor',
          default: '#3B82F6',
          comType: 'fontColor',
        },
      ],
    },
    {
      label: 'label.title',
      key: 'label',
      comType: 'group',
      rows: [
        {
          label: 'label.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'viz.palette.style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '40',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#495057',
          },
        },
      ],
    },
  ],
  settings: [
    {
      label: 'viz.palette.setting.paging.title',
      key: 'paging',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.setting.paging.pageSize',
          key: 'pageSize',
          default: 1000,
          comType: 'inputNumber',
          options: {
            needRefresh: true,
            step: 1,
            min: 0,
          },
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        liquid: {
          title: '水波配置',
          shape: '形状',
          max: '目标值 (最大值)',
          radius: '半径',
          waveColor: '波浪颜色',
          backgroundColor: '背景颜色',
        },
        outline: {
          title: '轮廓',
          show: '显示轮廓',
          borderDistance: '边框间距',
          borderWidth: '边框宽度',
          borderColor: '边框颜色',
        },
        label: {
          title: '标签',
          showLabel: '显示标签',
        },
      },
    },
    {
      lang: 'en-US',
      translation: {
        liquid: {
          title: 'Liquid Config',
          shape: 'Shape',
          max: 'Max Value',
          radius: 'Radius',
          waveColor: 'Wave Color',
          backgroundColor: 'Background Color',
        },
        outline: {
          title: 'Outline',
          show: 'Show Outline',
          borderDistance: 'Border Distance',
          borderWidth: 'Border Width',
          borderColor: 'Border Color',
        },
        label: {
          title: 'Label',
          showLabel: 'Show Label',
        },
      },
    },
  ],
};

export default config;
