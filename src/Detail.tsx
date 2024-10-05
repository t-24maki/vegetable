import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  processColor,
} from 'react-native';
import {  Marker,LineChart } from 'react-native-charts-wrapper';

interface PriceData {
  [key: string]: {
    [date: string]: number;
  };
}

interface VegetableItem {
  name: string;
  isExpanded: boolean;
}

const { height: screenHeight } = Dimensions.get('window');

const PriceTrendChart: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vegetables, setVegetables] = useState<VegetableItem[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number } | null>(null);
  const chartRef = useRef(null);

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

      const json: PriceData = await response.json();
      setPriceData(json);

      const vegList = Object.keys(json).map(veg => ({ name: veg, isExpanded: false }));
      setVegetables(vegList);
    } catch (error) {
      console.error('Error fetching or parsing data: ', error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const processData = (vegetable: string) => {
    if (!priceData) return null;

    const vegData = priceData[vegetable];
    const values = Object.entries(vegData)
      .map(([date, price]) => ({
        x: convertDate(date),
        y: price
      }))
      .sort((a, b) => a.x - b.x);

    return {
      dataSets: [{
        values: values,
        label: vegetable,
        config: {
          color: processColor('blue'),
          drawValues: false,
          drawCircles: false,
          lineWidth: 2,
          drawHighlightIndicators: true,
          highlightColor: processColor('red'),
        },
      }],
    };
  };

  const convertDate = (date: string): number => {
    const [year, month] = date.split('/');
    const [monthPart, period] = month.split('_');
    const monthNum = parseInt(monthPart, 10);
    let dayOffset = 0;
    switch (period) {
      case '上': dayOffset = 5; break;
      case '中': dayOffset = 15; break;
      case '下': dayOffset = 25; break;
    }
    return new Date(`20${year}-${monthNum.toString().padStart(2, '0')}-${dayOffset.toString().padStart(2, '0')}`).getTime();
  };

  const toggleExpand = (index: number) => {
    const updatedVegetables = vegetables.map((item, idx) => 
      idx === index ? { ...item, isExpanded: !item.isExpanded } : item
    );
    setVegetables(updatedVegetables);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const handleSelect = (event) => {
    const { nativeEvent } = event;
    console.log('Select event:', nativeEvent);
    if (nativeEvent && nativeEvent.data) {
      const { x, y } = nativeEvent.data;
      console.log('Selected point:', { x, y });
      setSelectedPoint({ x, y });
    } else {
      console.log('No data in select event');
      setSelectedPoint(null);
    }
  };
  
  const renderItem = ({ item, index }: { item: VegetableItem; index: number }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.name}</Text>
      </TouchableOpacity>
      {item.isExpanded && (
        <View style={styles.chartContainer}>
          <LineChart
            style={styles.chart}
            data={processData(item.name)}
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
            legend={{ enabled: false }}
            chartDescription={{ text: '' }}
            touchEnabled={true}
            dragEnabled={true}
            scaleEnabled={true}
            scaleXEnabled={true}
            scaleYEnabled={true}
            pinchZoom={true}
            doubleTapToZoomEnabled={true}
            highlightPerTapEnabled={true}
            highlightPerDragEnabled={false}
            onSelect={handleSelect}
            ref={chartRef}
            onChange={(event) => console.log('Chart changed:', event.nativeEvent)}
            onTouchStart={() => console.log('Touch started')}
            onTouchMove={() => console.log('Touch moved')}
            onTouchEnd={() => console.log('Touch ended')}
          />
          {selectedPoint && (
            <View style={[styles.markerContainer, { position: 'absolute', left: 10, top: 10 }]}>
              <Text style={styles.markerText}>{formatDate(selectedPoint.x)}</Text>
              <Text style={styles.markerText}>¥{Math.round(selectedPoint.y)}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!priceData) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>農産物価格トレンド</Text>
        <FlatList
          data={vegetables}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
  },
  markerText: {
    color: 'black',
    fontSize: 12,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  itemHeader: {
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    height: screenHeight * 0.4,
    padding: 10,
  },
  chart: {
    flex: 1,
  },
});

export default PriceTrendChart;