import React, { useState, useMemo } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, G } from 'react-native-svg';

interface DataPoint {
  x: number;
  y: number;
}

interface SVGLineChartProps {
  data: DataPoint[];
  width: number;
  height: number;
  padding: number;
  xAxisLabel: string;
  yAxisLabel: string;
}

const SVGLineChart: React.FC<SVGLineChartProps> = ({ data, width, height, padding, xAxisLabel, yAxisLabel }) => {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null);

  // 左側のパディングを増やす
  const leftPadding = padding + 20;

  const { xMin, xMax, yMin, yMax, yTickInterval } = useMemo(() => {
    const xMin = Math.min(...data.map(d => d.x));
    const xMax = Math.max(...data.map(d => d.x));
    const yMinRaw = Math.min(...data.map(d => d.y));
    const yMaxRaw = Math.max(...data.map(d => d.y));
    const yRange = yMaxRaw - yMinRaw;

    let yTickInterval: number;
    if (yRange >= 3000) {
      yTickInterval = 500;
    } else if (yRange >= 1500) {
      yTickInterval = 200;
    } else if (yRange >= 600) {
      yTickInterval = 100;
    } else if (yRange >= 100) {
      yTickInterval = 50;
    } else {
      yTickInterval = 10;
    }

    const yMin = Math.floor(yMinRaw / yTickInterval) * yTickInterval;
    const yMax = Math.ceil(yMaxRaw / yTickInterval) * yTickInterval;

    return { xMin, xMax, yMin, yMax, yTickInterval };
  }, [data]);

  const xScale = (x: number) => (x - xMin) / (xMax - xMin) * (width - leftPadding - padding) + leftPadding;
  const yScale = (y: number) => height - ((y - yMin) / (yMax - yMin) * (height - 2 * padding) + padding);

  const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ');

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const closestPoint = data.reduce((closest, point) => {
      const distance = Math.sqrt(Math.pow(xScale(point.x) - locationX, 2) + Math.pow(yScale(point.y) - locationY, 2));
      return distance < closest.distance ? { point, distance } : closest;
    }, { point: data[0], distance: Infinity });

    setSelectedPoint(closestPoint.point);
  };

  // X軸の目盛りを生成
  const xTicks = Array.from({ length: 5 }, (_, i) => xMin + (xMax - xMin) * i / 4);

  // Y軸の目盛りを動的な間隔で生成
  const yTicks = Array.from({ length: Math.floor((yMax - yMin) / yTickInterval) + 1 }, (_, i) => yMin + i * yTickInterval);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear().toString().substr(-2)}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  // 数値を3桁カンマ区切りにフォーマットする関数
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View>
        <Svg width={width} height={height}>
          {/* X軸 */}
          <Line x1={leftPadding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="black" />
          <SvgText x={width / 2} y={height - 5} fontSize="12" textAnchor="middle">{xAxisLabel}</SvgText>

          {/* X軸の目盛り */}
          {xTicks.map((tick, index) => (
            <React.Fragment key={index}>
              <Line
                x1={xScale(tick)}
                y1={height - padding}
                x2={xScale(tick)}
                y2={height - padding + 5}
                stroke="black"
              />
              <SvgText
                x={xScale(tick)}
                y={height - padding + 15}
                fontSize="10"
                textAnchor="middle"
              >
                {formatDate(tick)}
              </SvgText>
            </React.Fragment>
          ))}

          {/* Y軸 */}
          <Line x1={leftPadding} y1={padding} x2={leftPadding} y2={height - padding} stroke="black" />
          
          {/* Y軸のラベル */}
          <G rotation="-90" origin={`${padding-20}, ${height / 2}`}>
            <SvgText
              x={padding}
              y={height / 2}
              fontSize="12"
              textAnchor="middle"
            >
              価格(円/kg)
            </SvgText>
          </G>

          {/* Y軸の目盛り */}
          {yTicks.map((tick, index) => (
            <React.Fragment key={index}>
              <Line
                x1={leftPadding - 5}
                y1={yScale(tick)}
                x2={leftPadding}
                y2={yScale(tick)}
                stroke="black"
              />
              <SvgText
                x={leftPadding - 10}
                y={yScale(tick)}
                fontSize="10"
                textAnchor="end"
              >
                {formatNumber(tick)}
              </SvgText>
            </React.Fragment>
          ))}

          {/* データポイントをつなぐライン */}
          <Path d={linePath} fill="none" stroke="blue" strokeWidth="2" />

          {/* データポイント */}
          {data.map((point, index) => (
            <Circle
              key={index}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r="4"
              fill="blue"
            />
          ))}

          {/* 選択されたポイントのハイライト */}
          {selectedPoint && (
            <Circle
              cx={xScale(selectedPoint.x)}
              cy={yScale(selectedPoint.y)}
              r="6"
              fill="red"
            />
          )}
        </Svg>

        {/* 選択されたポイントの情報表示 */}
        {selectedPoint && (
          <View style={styles.infoBox}>
            <Text>時期: 20{formatDate(selectedPoint.x)}</Text>
            <Text>価格: {formatNumber(selectedPoint.y)}円/kg</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  infoBox: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default SVGLineChart;