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

import migrateWidgetConfig from '../BoardConfig/migrateWidgetConfig';
import { APP_VERSION_RC_1 } from '../constants';

describe('Widget Config Migration Tests', () => {
  describe('RC.1 Custom Tab Config', () => {
    test('should return empty array if input is not an array', () => {
      const inputWidget = '' as any;
      const result = migrateWidgetConfig(inputWidget);
      expect(result).toEqual([]);
    });

    test('should not migrate widget when name is not tab', () => {
      const inputWidget = [
        {
          config: {
            name: 'w1',
            originalType: 'linkedChart',
          },
        },
        {
          config: {
            name: 'w2',
            originalType: 'group',
          },
        },
      ];
      const result = migrateWidgetConfig(inputWidget as any[]);
      expect(result).toEqual(inputWidget);
    });

    test('should not migrate widget when custom props is empty', () => {
      const inputWidget = [
        {
          config: {
            name: 'w1',
            originalType: 'tab',
          },
        },
        {
          config: {
            name: 'w2',
            originalType: 'tab',
          },
        },
      ];
      const result = migrateWidgetConfig(inputWidget as any[]);
      expect(result).toEqual(inputWidget);
    });

    test('should not migrate widget when custom props is empty', () => {
      const inputWidget = [
        {
          config: {
            name: 'w1',
            originalType: 'tab',
            customConfig: {},
          },
        },
      ];
      const result = migrateWidgetConfig(inputWidget as any[]);
      expect(result?.[0]?.config?.customConfig).toEqual({});
    });

    test('should not migrate widget when custom props has tab group', () => {
      const inputWidget = [
        {
          config: {
            name: 'w1',
            originalType: 'tab',
            customConfig: {
              props: [
                {
                  label: 'tab.tabGroup',
                  key: 'tabGroup',
                  comType: 'group',
                  rows: [],
                },
              ],
            },
          },
        },
      ];
      const result = migrateWidgetConfig(inputWidget as any[]);
      expect(result?.[0]?.config?.customConfig?.props?.length).toBe(1);
      expect(result?.[0]?.config?.customConfig?.props?.[0]).toEqual({
        label: 'tab.tabGroup',
        key: 'tabGroup',
        comType: 'group',
        rows: [],
      });
    });

    test('should not migrate widget when custom props has tab group', () => {
      const inputWidget = [
        {
          config: {
            name: 'w1',
            originalType: 'tab',
            customConfig: {
              props: [
                {
                  label: 'tab.tabGroup',
                  key: 'tabGroup',
                  comType: 'group',
                  rows: [],
                },
              ],
            },
          },
        },
      ];
      const result = migrateWidgetConfig(inputWidget as any[]);
      expect(result).toEqual(inputWidget);
    });

    test('should migrate widget when custom props has no tab group', () => {
      const oldTabConfig = {
        label: 'tab.alignTitle',
        key: 'align',
        default: 'start',
        value: 'end',
        comType: 'select',
        options: {
          translateItemLabel: true,
          items: [
            {
              label: 'viz.common.enum.alignment.start',
              value: 'start',
            },
            {
              label: 'viz.common.enum.alignment.center',
              value: 'center',
            },
            {
              label: 'viz.common.enum.alignment.end',
              value: 'end',
            },
          ],
        },
      };
      const inputWidget = [
        {
          config: {
            name: 'w1',
            originalType: 'tab',
            customConfig: {
              props: [
                {
                  label: 'tab.tabTitle',
                  key: 'tabTitle',
                  comType: 'group',
                  rows: [],
                },
              ],
            },
          },
        },
        {
          config: {
            name: 'w2',
            originalType: 'tab',
            customConfig: {
              props: [
                {
                  label: 'tab.tabGroup',
                  key: 'tabGroup',
                  comType: 'group',
                  rows: [oldTabConfig],
                },
              ],
            },
          },
        },
      ];
      const result = migrateWidgetConfig(inputWidget as any[]);
      expect((result?.[0] as any)?.version).toEqual(APP_VERSION_RC_1);
      expect(result?.[0]?.config?.customConfig?.props?.length).toBe(2);
      expect(result?.[0]?.config?.customConfig?.props?.[0]).toEqual({
        label: 'tab.tabGroup',
        key: 'tabGroup',
        comType: 'group',
        rows: [
          {
            comType: 'select',
            default: 'tab',
            key: 'style',
            label: 'tab.style',
            options: {
              items: [
                { label: 'tab.tab', value: 'tab' },
                { label: 'tab.dropdown', value: 'dropdown' },
              ],
              translateItemLabel: true,
            },
            value: 'tab',
          },
          {
            comType: 'select',
            default: 'start',
            key: 'align',
            label: 'tab.alignTitle',
            options: {
              items: [
                // 修正点1：更新 label 为 viz.common.enum.alignment.*
                { label: 'viz.common.enum.alignment.start', value: 'start' },
                { label: 'viz.common.enum.alignment.center', value: 'center' },
                { label: 'viz.common.enum.alignment.end', value: 'end' },
              ],
              translateItemLabel: true,
            },
            value: 'start', // 修正点2：align 的 value 应该是 start
            watcher: {
              action: expect.any(Function),
              deps: ['style'],
            },
          },
          // 修正点3：新增 position 配置对象
          {
            comType: 'select',
            default: 'top',
            key: 'position',
            label: 'tab.position',
            options: {
              items: [
                { label: 'viz.common.enum.position.top', value: 'top' },
                { label: 'viz.common.enum.position.bottom', value: 'bottom' },
                { label: 'viz.common.enum.position.left', value: 'left' },
                { label: 'viz.common.enum.position.right', value: 'right' },
              ],
              translateItemLabel: true,
            },
            value: 'top',
            watcher: {
              action: expect.any(Function),
              deps: ['style'],
            },
          },
          {
            comType: 'fontFamily',
            default: 'PingFang SC',
            key: 'fontFamily',
            label: 'tab.fontFamily',
            value: 'PingFang SC',
          },
          {
            comType: 'inputNumber',
            default: 14,
            key: 'fontSize',
            label: 'tab.fontSize',
            value: 14,
          },
          {
            comType: 'fontColor',
            default: '#495057',
            key: 'color',
            label: 'tab.color',
            value: '#495057',
          },
          {
            comType: 'fontColor',
            default: '#ffffff',
            key: 'background',
            label: 'tab.background',
            value: '#ffffff',
          },
          {
            comType: 'group',
            key: 'dimensions',
            label: 'tab.dimensions',
            options: {

              container: 'flat',
              flatten: true,
              layout: 'horizontal',
            },
            rows: [
              {
                comType: 'inputNumber',
                default: 200,
                key: 'width',
                label: 'tab.width',
                value: 200,
              },
              {
                comType: 'inputNumber',
                default: 32,
                key: 'height',
                label: 'tab.height',
                value: 32,
              },
            ],
            watcher: {
              action: expect.any(Function),
              deps: ['style'],
            },
          },
          {
            comType: 'group',
            key: 'margins',
            label: 'tab.margins',
            options: {

              container: 'flat',
              flatten: true,
            },
            rows: [
              {
                comType: 'group',
                key: 'marginRow1',
                label: 'Row1',
                options: {
                  flatten: true,
                  layout: 'horizontal',
                  mode: 'inner',
                },
                rows: [
                  {
                    comType: 'inputNumber',
                    default: 0,
                    key: 'paddingTop',
                    label: 'tab.paddingTop',
                    value: 0,
                  },
                  {
                    comType: 'inputNumber',
                    default: 8,
                    key: 'paddingBottom',
                    label: 'tab.paddingBottom',
                    value: 8,
                  },
                ],
              },
              {
                comType: 'group',
                key: 'marginRow2',
                label: 'Row2',
                options: {
                  flatten: true,
                  layout: 'horizontal',
                  mode: 'inner',
                },
                rows: [
                  {
                    comType: 'inputNumber',
                    default: 0,
                    key: 'paddingLeft',
                    label: 'tab.paddingLeft',
                    value: 0,
                  },
                  {
                    comType: 'inputNumber',
                    default: 0,
                    key: 'paddingRight',
                    label: 'tab.paddingRight',
                    value: 0,
                  },
                ],
              },
            ],
            watcher: {
              action: expect.any(Function),
              deps: ['style'],
            },
          },
          {
            comType: 'fontColor',
            default: '#d9d9d9',
            key: 'borderColor',
            label: 'tab.borderColor',
            value: '#d9d9d9',
            watcher: {
              action: expect.any(Function),
              deps: ['style'],
            },
          },
          {
            comType: 'select',
            default: 'solid',
            key: 'borderStyle',
            label: 'tab.borderStyle',
            options: {
              items: [
                { label: '实线', value: 'solid' },
                { label: '虚线', value: 'dashed' },
                { label: '点线', value: 'dotted' },
                { label: '双实线', value: 'double' },
                { label: '无', value: 'none' },
              ],
            },
            value: 'solid',
            watcher: {
              action: expect.any(Function),
              deps: ['style'],
            },
          },
          {
            comType: 'inputNumber',
            default: 1,
            key: 'borderWidth',
            label: 'tab.borderWidth',
            value: 1,
            watcher: {
              action: expect.any(Function),
              deps: ['style'],
            },
          },
        ],
      });
      expect(result?.[0]?.config?.customConfig?.props?.[1]).toEqual({
        label: 'tab.tabTitle',
        key: 'tabTitle',
        comType: 'group',
        rows: [],
      });
      expect(result?.[1]?.config?.customConfig?.props?.[0]?.rows).toEqual([
        oldTabConfig,
      ]);
    });
  });
});
