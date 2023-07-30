import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const DrilldownChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);

      // Sample data for the chart
      const data = {
        categories: [
          { name: 'Category 1' },
          { name: 'Category 2' },
          { name: 'Category 3' },
        ],
        series: [
          {
            name: 'Level 1',
            data: [
              { name: 'Subcategory 1', value: 10 },
              { name: 'Subcategory 2', value: 20 },
              { name: 'Subcategory 3', value: 30 },
            ],
          },
        ],
      };

      const getSeriesData = (level: number) => {
        switch (level) {
          case 0:
            return data.series[level].data;
          case 1:
            // Sample data for the second level of the chart
            return [
              { name: 'Subcategory A', value: 15 },
              { name: 'Subcategory B', value: 25 },
            ];
          case 2:
            // Sample data for the third level of the chart
            return [
              { name: 'Subcategory X', value: 8 },
              { name: 'Subcategory Y', value: 12 },
              { name: 'Subcategory Z', value: 18 },
            ];
          default:
            return [];
        }
      };

      const option: echarts.EChartOption<echarts.EChartOption.SeriesBar> = {
        xAxis: [{
          type: 'category',
          data: getSeriesData(currentLevel).map((item: any) => item.name),
        }],
        yAxis: [{ // Add a dummy yAxis configuration
          type: 'value',
        }],
        series: [
          {
            type: 'bar',
            data: getSeriesData(currentLevel).map((item: any) => ({
              ...item,
              itemStyle: {
                color: '#1890ff',
              },
            })),
            emphasis: {
              itemStyle: {
                color: '#40a9ff',
              },
            },
            label: {
              show: true,
              position: 'top',
            },
          },
        ],
      };

      chart.setOption(option);

      // Handle drilldown event
      chart.on('click', (params: any) => {
        if (params.componentType === 'series') {
          const { name } = params;

          if (name === 'Subcategory 1' && currentLevel === 0) {
            setCurrentLevel(1);
          } else if (name === 'Subcategory 2' && currentLevel === 0) {
            setCurrentLevel(2);
          }
        }
      });

      return () => {
        chart.dispose();
      };
    }
  }, [currentLevel]);

  const handleBackClick = () => {
    setCurrentLevel(currentLevel - 1);
  };

  return (
    <div className="flex flex-col items-center bg-blue-200 p-4 rounded-lg shadow-lg">
      <div
        ref={chartRef}
        className="w-full bg-gray-200 rounded-lg shadow-md p-4 mb-4 transition-all duration-300 hover:shadow-xl"
        style={{ height: '400px' }}
      />
      {currentLevel > 0 && (
        <button
          onClick={handleBackClick}
          className="bg-pink-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded shadow-md transition-colors duration-300"
        >
          Back
        </button>
      )}
    </div>
  );
};

export default DrilldownChart;