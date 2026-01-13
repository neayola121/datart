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
import type {
    WidgetActionListItem,
    widgetActionType,
    WidgetMeta,
    WidgetProto,
    WidgetToolkit,
} from 'app/pages/DashBoardPage/types/widgetTypes';
import { PRIMARY } from 'styles/StyleConstants';
import {
    initBackgroundTpl,
    initBorderTpl,
    initPaddingTpl,
    initTitleTpl,
    initWidgetName,
    PaddingI18N,
    TitleI18N,
    widgetTpl,
    InteractionI18N,
} from '../../WidgetManager/utils/init';

const NameI18N = {
    zh: '跳转按钮',
    en: 'Jump Button',
};

export const initJumpInteractionTpl = () => {
    return [
        {
            label: 'drillThrough.title',
            key: 'drillThrough',
            comType: 'checkboxModal',
            default: false,
            options: { modalSize: 'middle' },
            rows: [
                {
                    label: 'drillThrough.title',
                    key: 'setting',
                    comType: 'interaction.drillThrough',
                },
            ],
        },
    ];
};

export const widgetMeta: WidgetMeta = {
    icon: 'query-widget', // Using query-widget icon as placeholder
    originalType: ORIGINAL_TYPE_MAP.jumpBtn,
    canWrapped: true,
    controllable: false,
    linkable: false,
    canFullScreen: false,
    singleton: false, // Jump buttons can be multiple

    i18ns: [
        {
            lang: 'zh-CN',
            translation: {
                desc: '跳转按钮',
                widgetName: NameI18N.zh,
                action: {},
                title: TitleI18N.zh,
                background: { backgroundGroup: '背景' },
                padding: PaddingI18N.zh,
                border: { borderGroup: '边框' },
                ...InteractionI18N.zh,
            },
        },
        {
            lang: 'en-US',
            translation: {
                desc: 'Jump Button',
                widgetName: NameI18N.en,
                action: {},
                title: TitleI18N.en,
                background: { backgroundGroup: 'Background' },
                padding: PaddingI18N.en,
                border: { borderGroup: 'Border' },
                ...InteractionI18N.en,
            },
        },
    ],
};

export const widgetToolkit: WidgetToolkit = {
    create: opt => {
        const widget = widgetTpl();
        widget.id = widgetMeta.originalType + widget.id;
        widget.parentId = opt.parentId || '';
        widget.datachartId = opt.datachartId || '';
        widget.viewIds = opt.viewIds || [];
        widget.relations = opt.relations || [];
        widget.config.originalType = widgetMeta.originalType;
        widget.config.name = opt.name || initWidgetName(NameI18N);
        widget.config.type = 'button'; // Using generic button type

        // Default size
        widget.config.rect.width = 100;
        widget.config.rect.height = 60;
        widget.config.pRect.width = 2;
        widget.config.pRect.height = 1;

        widget.config.customConfig.props = [
            { ...initTitleTpl() },
            { ...initPaddingTpl() },
            { ...initBorderTpl() },
            { ...initBackgroundTpl(PRIMARY) },
        ];

        // Add interaction config
        widget.config.customConfig.interactions = initJumpInteractionTpl();

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
    edit() { },
    save() { },
};

const jumpBtnProto: WidgetProto = {
    originalType: widgetMeta.originalType,
    meta: widgetMeta,
    toolkit: widgetToolkit,
};
export default jumpBtnProto;
