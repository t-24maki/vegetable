import React, { useState, useMemo } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, G, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

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
    } else if (yRange >= 500) {
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

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const closestPoint = data.reduce((closest, point) => {
      const distance = Math.sqrt(Math.pow(xScale(point.x) - locationX, 2) + Math.pow(yScale(point.y) - locationY, 2));
      return distance < closest.distance ? { point, distance } : closest;
    }, { point: data[0], distance: Infinity });

    setSelectedPoint(closestPoint.point);
  };

  // Area path for gradient background
  const areaPath = useMemo(() => {
    const linePath = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ');
    return `${linePath} L ${xScale(data[data.length - 1].x)} ${height - padding} L ${xScale(data[0].x)} ${height - padding} Z`;
  }, [data, height, padding]);

  const xTicks = Array.from({ length: 5 }, (_, i) => xMin + (xMax - xMin) * i / 4);
  const yTicks = Array.from({ length: Math.floor((yMax - yMin) / yTickInterval) + 1 }, (_, i) => yMin + i * yTickInterval);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear().toString().substr(-2)}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 8,
      }}>
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#2196F3" stopOpacity="1" />
              <Stop offset="1" stopColor="#4CAF50" stopOpacity="1" />
            </LinearGradient>
            
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#2196F3" stopOpacity="0.2" />
              <Stop offset="1" stopColor="#4CAF50" stopOpacity="0.05" />
            </LinearGradient>
          </Defs>

          {yTicks.map((tick, index) => (
            <Line
              key={`grid-${index}`}
              x1={leftPadding}
              y1={yScale(tick)}
              x2={width - padding}
              y2={yScale(tick)}
              stroke="#E0E0E0"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          ))}

          <Path
            d={areaPath}
            fill="url(#areaGradient)"
          />

          <Path
            d={data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x)} ${yScale(p.y)}`).join(' ')}
            stroke="url(#lineGradient)"
            strokeWidth="3"
            fill="none"
          />

          <Line
            x1={leftPadding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#90A4AE"
            strokeWidth="2"
          />

          <Line
            x1={leftPadding}
            y1={padding}
            x2={leftPadding}
            y2={height - padding}
            stroke="#90A4AE"
            strokeWidth="2"
          />

          {xTicks.map((tick, index) => (
            <G key={`x-tick-${index}`}>
              <Line
                x1={xScale(tick)}
                y1={height - padding}
                x2={xScale(tick)}
                y2={height - padding + 5}
                stroke="#90A4AE"
              />
              <SvgText
                x={xScale(tick)}
                y={height - padding + 20}
                fontSize="12"
                fill="#546E7A"
                textAnchor="middle"
              >
                {formatDate(tick)}
              </SvgText>
            </G>
          ))}

          {yTicks.map((tick, index) => (
            <G key={`y-tick-${index}`}>
              <SvgText
                x={leftPadding - 8}
                y={yScale(tick) + 4}
                fontSize="12"
                fill="#546E7A"
                textAnchor="end"
              >
                {formatNumber(tick)}
              </SvgText>
            </G>
          ))}

        <G rotation="-90" origin={`${padding-20}, ${height / 2}`}>
          <SvgText
            x={padding-20}
            y={height / 2}
            fontSize="12"
            fill="#546E7A"
            textAnchor="middle"
          >
            価格(円/kg)
          </SvgText>
        </G>

          {data.map((point, index) => (
            <Circle
              key={`point-${index}`}
              cx={xScale(point.x)}
              cy={yScale(point.y)}
              r="3"
              fill="#FFFFFF"
              stroke="#2196F3"
              strokeWidth="2"
            />
          ))}

          {selectedPoint && (
            <Circle
              cx={xScale(selectedPoint.x)}
              cy={yScale(selectedPoint.y)}
              r="5"
              fill="#FF5722"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          )}
        </Svg>

        {selectedPoint && (
          <View style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: 12,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 12, color: '#546E7A', marginRight: 8 }}>時期:</Text>
              <Text style={{ fontSize: 14, color: '#263238', fontWeight: '600' }}>
                20{formatDate(selectedPoint.x)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 12, color: '#546E7A', marginRight: 8 }}>価格:</Text>
              <Text style={{ fontSize: 14, color: '#263238', fontWeight: '600' }}>
                {formatNumber(selectedPoint.y)}円/kg
              </Text>
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
  },
  infoBox: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#546E7A',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#263238',
    fontWeight: '600',
  },
});

export default SVGLineChart;