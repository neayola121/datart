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
import { ChartDataSectionType } from 'app/constants';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import { BrokerContext, BrokerOption } from 'app/types/ChartLifecycleBroker';
import { getStyles, toFormattedValue, transformToDataSet } from 'app/utils/chartHelper';
import { init } from 'echarts';
import 'echarts-liquidfill';
import Chart from '../../../models/Chart';
import Config from './config';

class LiquidChart extends Chart {
    config = Config;
    chart: any = null;

    constructor() {
        super(
            'liquid',
            '水波图',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>',
        );
        this.meta.requirements = [
            {
                group: 0,
                aggregate: 1,
            },
        ];
    }

    onMount(options: BrokerOption, context: BrokerContext) {
        if (
            options.containerId === undefined ||
            !context.document ||
            !context.window
        ) {
            return;
        }

        this.chart = init(
            context.document.getElementById(options.containerId)!,
            'default',
        );
    }

    onUpdated(options: BrokerOption, context: BrokerContext) {
        if (!options.dataset || !options.dataset.columns || !options.config) {
            return;
        }

        const newOptions = this.getOptions(options.dataset, options.config);
        this.chart?.setOption(Object.assign({}, newOptions), true);
    }

    onUnMount(options: BrokerOption, context: BrokerContext) {
        this.chart?.dispose();
    }

    onResize(options: BrokerOption, context: BrokerContext) {
        this.chart?.resize({ width: context?.width, height: context?.height });
    }

    getOptions(dataset: ChartDataSetDTO, config: ChartConfig) {
        const styleConfigs = config.styles || [];
        const dataConfigs = config.datas || [];

        const aggregateConfigs = dataConfigs
            .filter(c => c.type === ChartDataSectionType.Aggregate)
            .flatMap(config => config.rows || []);

        const chartDataSet = transformToDataSet(
            dataset.rows,
            dataset.columns,
            dataConfigs,
        );

        const series = this.getSeries(
            styleConfigs,
            chartDataSet,
            aggregateConfigs,
        );

        return {
            series,
            tooltip: {
                show: true,
                formatter: (params) => {
                    const { seriesName, value } = params;
                    const format = aggregateConfigs?.[0]?.format;
                    const formattedValue = toFormattedValue(value, format);
                    return `${seriesName}: ${formattedValue}`;
                }
            },
        };
    }

    private getSeries(
        styleConfigs,
        chartDataSet: IChartDataSet<string>,
        aggregateConfigs,
    ) {
        const [
            max,
            shape,
            radius,
            color,
            backgroundColor,
        ] = getStyles(
            styleConfigs,
            ['liquid'],
            ['max', 'shape', 'radius', 'color', 'backgroundColor'],
        );
        const [
            showOutline,
            borderDistance,
            borderWidth,
            borderColor,
        ] = getStyles(
            styleConfigs,
            ['outline'],
            ['show', 'borderDistance', 'borderWidth', 'borderColor'],
        );
        const [showLabel, font] = getStyles(
            styleConfigs,
            ['label'],
            ['showLabel', 'font'],
        );

        const value = chartDataSet?.[0]?.getCell(aggregateConfigs[0]);
        let parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            parsedValue = 0;
        }

        // Calculate percentage if max is provided and > 0
        if (max && max > 0) {
            parsedValue = parsedValue / max;
        }

        const format = aggregateConfigs?.[0]?.format;

        return [
            {
                type: 'liquidFill',
                data: [parsedValue],
                shape: shape || 'circle',
                radius: radius || '80%',
                color: [color],
                backgroundStyle: {
                    color: backgroundColor,
                },
                outline: {
                    show: showOutline,
                    borderDistance: borderDistance || 0,
                    itemStyle: {
                        borderColor: borderColor,
                        borderWidth: borderWidth || 0,
                    },
                },
                label: {
                    show: showLabel,
                    fontSize: font?.fontSize || 40,
                    color: font?.color || '#495057',
                    fontFamily: font?.fontFamily,
                    fontWeight: font?.fontWeight,
                    fontStyle: font?.fontStyle,
                    formatter: (param) => {
                        return toFormattedValue(param.value, format);
                    }
                },
                tooltip: {
                    show: true,
                    formatter: (param) => {
                        const { name, value } = param;
                        const formattedValue = toFormattedValue(value, format);
                        return `${name}<br/>${formattedValue}`;
                    }
                }
            },
        ];
    }
}

export default LiquidChart;
