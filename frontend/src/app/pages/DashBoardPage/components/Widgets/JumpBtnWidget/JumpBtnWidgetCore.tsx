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

import { Tooltip } from 'antd';
import { selectOrgId } from 'app/pages/MainPage/slice/selectors';
import { darken, getLuminance, lighten } from 'polished';
import { memo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components/macro';
import {
    getWidgetBaseStyle,
    getWidgetTitle,
} from '../../WidgetManager/utils/utils';
import { WidgetContext } from '../../WidgetProvider/WidgetProvider';

export const JumpBtnWidgetCore: React.FC<{}> = memo(() => {
    const widget = useContext(WidgetContext);
    const history = useHistory();
    const orgId = useSelector(selectOrgId);

    const onJump = e => {
        e.stopPropagation();

        const interactions = widget.config.customConfig.interactions;
        if (!interactions) return;

        const drillThrough = interactions.find(i => i.key === 'drillThrough');

        const isEnabled =
            drillThrough?.value !== undefined
                ? drillThrough.value
                : drillThrough?.default;

        if (!isEnabled) return;

        const setting = drillThrough?.rows?.find(r => r.key === 'setting');
        const rules = setting?.value?.rules;

        if (!rules || rules.length === 0) return;

        const rule = rules.find(r => r.event === 'left') || rules[0];

        if (!rule) return;

        const { category, action } = rule;
        let relId, url;

        if (category === 'jumpToUrl') {
            url = rule.jumpToUrl?.url;
            if (!url) return;
            if (action === 'window') {
                window.open(url, '_blank');
            } else {
                window.location.href = url;
            }
        } else if (category === 'jumpToDashboard' || category === 'jumpToChart') {
            relId = rule[category]?.relId;
            if (!relId) return;
            const jumpPath = `/organizations/${orgId}/vizs/${relId}`;

            if (action === 'window') {
                const width = 1024;
                const height = 768;
                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2;
                window.open(jumpPath, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
            } else if (action === 'dialog') {
                // Dialog support is complex, fallback to redirect or ignore for now
                history.push(jumpPath);
            } else {
                history.push(jumpPath);
            }
        }
    };

    const title = getWidgetTitle(widget.config.customConfig.props);
    title.title = widget.config.name;
    const { background } = getWidgetBaseStyle(widget.config.customConfig.props);

    return (
        <Wrapper color={background.color} onClick={onJump}>
            <span
                style={{
                    color: title.font.color,
                    fontSize: title.font.fontSize,
                    fontWeight: title.font.fontWeight,
                    fontFamily: title.font.fontFamily,
                }}
            >
                {title.title}
            </span>
        </Wrapper>
    );
});

const Wrapper = styled.div<{ color: string }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  &:hover {
    background: ${p =>
        getLuminance(p.color) > 0.5
            ? darken(0.05, p.color)
            : lighten(0.05, p.color)};
  }
`;
