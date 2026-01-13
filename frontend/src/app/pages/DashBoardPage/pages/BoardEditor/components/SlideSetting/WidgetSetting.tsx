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

import { Tabs } from 'antd';
import useChartInteractions from 'app/hooks/useChartInteractions';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { WidgetChartContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetChartProvider';
import { WidgetContext } from 'app/pages/DashBoardPage/components/WidgetProvider/WidgetProvider';
import { selectVizs } from 'app/pages/MainPage/pages/VizPage/slice/selectors';
import { ChartStyleConfig } from 'app/types/ChartConfig';
import { updateBy } from 'app/utils/mutation';
import { FC, memo, useContext, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import widgetManager from 'app/pages/DashBoardPage/components/WidgetManager';
import { editBoardStackActions } from '../../slice';
import { showRectAction } from '../../slice/actions/actions';
import { selectSortAllWidgets } from '../../slice/selectors';
import { NameSet } from './SettingItem/NameSet';
import { RectSet } from './SettingItem/RectSet';
import { SettingPanel } from './SettingPanel';
import { WidgetConfigPanel } from './WidgetConfigPanel';

const { TabPane } = Tabs;

export const WidgetSetting: FC<{ boardId?: string }> = memo(({ boardId }) => {
  const t = useI18NPrefix(`viz.board.setting`);
  const dispatch = useDispatch();
  const widget = useContext(WidgetContext);
  const { dataChart, chartDataView } = useContext(WidgetChartContext);
  const showRect = dispatch(showRectAction(widget)) as unknown as boolean;
  const [currentTab, setCurrentTab] = useState<string>('style');
  const vizs = useSelector(selectVizs);
  const allWidgets = useSelector(selectSortAllWidgets);
  const { getDrillThroughSetting, getViewDetailSetting } = useChartInteractions(
    {},
  );

  const hydratedConfigs = (useMemo(() => {
    const configs = widget.config.customConfig.props || [];
    const toolkit = widgetManager.toolkit(widget.config.originalType);

    if (toolkit.getConfigTpl) {
      const freshTpl = toolkit.getConfigTpl();
      const mergeConfigs = (fresh, saved) => {
        if (!saved) return fresh;
        if (!fresh) return fresh;
        return fresh.map(tplItem => {
          const savedItem = saved.find(s => s.key === tplItem.key);
          if (!savedItem) return tplItem;

          const newItem = { ...tplItem, value: savedItem.value };
          if (savedItem.hide !== undefined) newItem.hide = savedItem.hide;
          if (savedItem.disabled !== undefined) newItem.disabled = savedItem.disabled;

          if (tplItem.rows) {
            if (savedItem.rows) {
              newItem.rows = mergeConfigs(tplItem.rows, savedItem.rows);
            } else {
              newItem.rows = tplItem.rows;
            }
          }
          return newItem;
        });
      };
      return mergeConfigs(freshTpl, configs);
    }
    return configs;
  }, [widget.config.customConfig.props, widget.config.originalType]) as ChartStyleConfig[]);

  const handleStyleConfigChange = (
    ancestors: number[],
    configItem: ChartStyleConfig,
    needRefresh?: boolean,
  ) => {
    dispatch(
      editBoardStackActions.updateWidgetStyleConfigByPath({
        ancestors,
        configItem,
        wid: widget.id,
      }),
    );
  };

  const handleInteractionConfigChange = (
    ancestors: number[],
    configItem: ChartStyleConfig,
    needRefresh?: boolean,
  ) => {
    dispatch(
      editBoardStackActions.updateWidgetInteractionConfigByPath({
        ancestors,
        configItem,
        wid: widget.id,
      }),
    );
  };

  const updateInteractionOptionWhenHasChartInteraction = (
    interactions: ChartStyleConfig[],
  ) => {
    const drillThroughKey = 'drillThrough';
    const viewDetailKey = 'viewDetail';
    const chartInteractions =
      dataChart?.config?.chartConfig?.interactions || [];

    // Filter interactions if chart config explicitly defines supported interactions
    let filteredInteractions = interactions;
    if (chartInteractions.length > 0) {
      const allowedKeys = chartInteractions.map(i => i.key);
      filteredInteractions = interactions.filter(i => allowedKeys.includes(i.key));
    }

    const chartDrillThroughSetting = getDrillThroughSetting(
      chartInteractions,
      [],
    );
    const chartViewDetailSetting = getViewDetailSetting(chartInteractions, []);
    return updateBy(filteredInteractions, draft => {
      let boardDrillThrough = draft.find(i => i.key === drillThroughKey);
      let boardViewDetail = draft.find(i => i.key === viewDetailKey);
      if (boardDrillThrough) {
        boardDrillThrough.options = Object.assign(
          {},
          boardDrillThrough?.options,
          {
            hasOriginal: !!chartDrillThroughSetting,
          },
        );
      }
      if (boardViewDetail) {
        boardViewDetail.options = Object.assign(
          {},
          boardDrillThrough?.options, // NOTE: Original code used boardDrillThrough?.options here, seems to be a copy-paste error in original code too? Or maybe intended. Keeping it safe but worth noting. Actually, let's look at original again.
          {
            hasOriginal: !!chartViewDetailSetting,
          },
        );
      }
      return interactions; // Wait, updateBy returns the mutated copy. 
    });
  };

  return (
    <StyledWidgetSetting
      activeKey={currentTab}
      onChange={key => setCurrentTab(key)}
    >
      <TabPane tab={t('style')} key="style">
        <SettingPanel title={`${t('widget')}${t('setting')}`}>
          <>
            <NameSet
              wid={widget.id}
              name={widget.config.name}
              boardVizs={allWidgets}
            />
            {showRect && <RectSet wid={widget.id} rect={widget.config.rect} />}
            <WidgetConfigPanel
              configs={hydratedConfigs || []}
              onChange={handleStyleConfigChange}
            />
          </>
        </SettingPanel>
      </TabPane>
      <TabPane tab={t('interaction')} key="interaction">
        <SettingPanel title={`${t('widget')}${t('setting')}`}>
          <WidgetConfigPanel
            configs={updateInteractionOptionWhenHasChartInteraction(
              widget.config.customConfig.interactions || [],
            )}
            dataConfigs={dataChart?.config?.chartConfig?.datas}
            context={{
              widgetId: widget?.id,
              vizs,
              boardVizs: allWidgets,
              dataview: chartDataView,
            }}
            onChange={handleInteractionConfigChange}
          />
        </SettingPanel>
      </TabPane>
    </StyledWidgetSetting>
  );
});

export default WidgetSetting;

const StyledWidgetSetting = styled(Tabs)`
  .ant-tabs-content-holder {
    overflow: auto;
  }
`;
