import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-charts-wrapper';

interface PriceData {
  [key: string]: {
    [date: string]: number;
  };
}

const { height: screenHeight } = Dimensions.get('window');

const PriceTrendChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVegetable, setSelectedVegetable] = useState<string>('');
  const [vegetables, setVegetables] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://analysis-navi.com/vegetable/trend.json', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'React-Native-App'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Raw response:', text);  // ログ出力を追加

      const json: PriceData = JSON.parse(text);
      console.log('Parsed data:', json);  // ログ出力を追加

      const vegList = Object.keys(json);
      setVegetables(vegList);
      setSelectedVegetable(vegList[0]);
      processData(json, vegList[0]);
    } catch (error) {
      console.error('Error fetching or parsing data: ', error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const processData = (data: PriceData, vegetable: string) => {
    const vegData = data[vegetable];
    const values = Object.entries(vegData).map(([date, price]) => ({
      x: convertDate(date),
      y: price
    }));

    console.log('Processed values:', values);  // ログ出力を追加

    setChartData({
      dataSets: [{
        values: values,
        label: vegetable,
        config: {
          color: 'blue',
          drawCircles: false,
          lineWidth: 2,
        },
      }],
    });
  };

  const convertDate = (date: string): number => {
    const [year, month] = date.split('/');
    const [monthPart, _] = month.split('_');
    const monthNum = parseInt(monthPart, 10);
    if (isNaN(monthNum)) {
      console.error('Invalid month:', month);  // エラーログを追加
      return 0;  // エラーの場合は0を返す
    }
    return new Date(`20${year}-${monthNum.toString().padStart(2, '0')}-01`).getTime();
  };

  const handleVegetableChange = (itemValue: string) => {
    setSelectedVegetable(itemValue);
    if (chartData && chartData.rawData) {
      processData(chartData.rawData, itemValue);
    }
  };

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!chartData) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>農産物価格トレンド</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedVegetable}
              onValueChange={handleVegetableChange}
              style={styles.picker}
            >
              {vegetables.map((veg) => (
                <Picker.Item key={veg} label={veg} value={veg} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.chartContainer}>
          <LineChart
            style={styles.chart}
            data={chartData}
            xAxis={{
              valueFormatter: 'date',
              valueFormatterPattern: 'yyyy/MM',
              granularityEnabled: true,
              granularity: 1,
              position: 'BOTTOM',
            }}
            yAxis={{
              left: {
                axisMinimum: 0,
              },
              right: {
                enabled: false,
              },
            }}
            legend={{
              enabled: true,
              textSize: 12,
              form: 'SQUARE',
              formSize: 14,
              xEntrySpace: 10,
              yEntrySpace: 5,
              wordWrapEnabled: true,
            }}
            chartDescription={{ text: '' }}
            animation={{
              durationX: 0,
              durationY: 1500,
              easingY: 'EaseInOutQuart',
            }}
            drawGridBackground={false}
            drawBorders={false}
            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={true}
            doubleTapToZoomEnabled={true}
            dragDecelerationEnabled={true}
            dragDecelerationFrictionCoef={0.99}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  contentContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    height: 50,
  },
  chartContainer: {
    height: screenHeight * 0.5, // 画面の高さの50%
    marginTop: 20,
  },
  chart: {
    flex: 1,
  },
});

export default PriceTrendChart;