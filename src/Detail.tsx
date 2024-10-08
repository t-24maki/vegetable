import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image, 
  ImageSourcePropType,
  Modal,
  FlatList as ModalFlatList,
  ListRenderItem
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SVGLineChart from './SVGLineChart';

interface PriceData {
  [key: string]: {
    [date: string]: number;
  };
}

interface RateData {
  [key: string]: {
    [rateType: string]: number;
  };
}

interface VegetableItem {
  name: string;
  isExpanded: boolean;
  lastMonthRate?: number;
  lastYearRate?: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const arrowUp = require('../assets/arrow-up.png');
const arrowUpMiddle = require('../assets/arrow-upmiddle.png');
const arrowMiddle = require('../assets/arrow-middle.png');
const arrowDownMiddle = require('../assets/arrow-downmiddle.png');
const arrowDown = require('../assets/arrow-down.png');

const getTrendArrow = (rate: number): ImageSourcePropType => {
  if (rate > 1.5) return arrowUp;
  if (rate > 1.2) return arrowUpMiddle;
  if (rate > 0.8) return arrowMiddle;
  if (rate > 0.5) return arrowDownMiddle;
  return arrowDown;
};

const RateHeader: React.FC<{ rateTypes: { lastMonth: string; lastYear: string } }> = ({ rateTypes }) => (
  <View style={styles.rateHeaderContainer}>
    <View style={styles.rateHeaderColumn}>
      <Text style={styles.rateHeaderLabel}>{rateTypes.lastMonth}</Text>
    </View>
    <View style={styles.rateHeaderColumn}>
      <Text style={styles.rateHeaderLabel}>{rateTypes.lastYear}</Text>
    </View>
  </View>
);

const RateDisplay: React.FC<{ rate?: number }> = ({ rate }) => {
  const image = rate ? getTrendArrow(rate) : arrowMiddle;
  
  return (
    <View style={styles.rateColumn}>
      <View style={styles.rateValueContainer}>
        <Image source={image} style={styles.trendArrow} />
        <Text style={styles.rateValue}>
          {rate ? (rate * 100).toFixed(1) + '%' : 'N/A'}
        </Text>
      </View>
    </View>
  );
};

type SortOption = '50音順' | `${string}（高い順）` | `${string}（低い順）`;

const SortButton: React.FC<{ sortOption: SortOption; onPress: () => void }> = ({ sortOption, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.sortButton}>
    <View style={styles.sortButtonContent}>
      <Ionicons name="funnel-outline" size={24} color="#007AFF" />
      <Text style={styles.sortButtonText}>並び替え: </Text>
      <Text style={styles.sortButtonSelectedText}>{sortOption}</Text>
      <Ionicons name="chevron-down-outline" size={24} color="#007AFF" />
    </View>
  </TouchableOpacity>
);

const PriceTrendChart: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [rateData, setRateData] = useState<RateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vegetables, setVegetables] = useState<VegetableItem[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('50音順');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showSortModal, setShowSortModal] = useState(false);
  const [rateTypes, setRateTypes] = useState<{ lastMonth: string; lastYear: string }>({ lastMonth: '', lastYear: '' });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    sortVegetables();
  }, [sortOption, sortOrder]);

  const fetchData = async () => {
    try {
      const [priceResponse, rateResponse] = await Promise.all([
        fetch('https://analysis-navi.com/vegetable/trend.json', {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'React-Native-App'
          },
        }),
        fetch('https://analysis-navi.com/vegetable/rate.json', {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'React-Native-App'
          },
        })
      ]);

      if (!priceResponse.ok || !rateResponse.ok) {
        throw new Error(`HTTP error! status: ${priceResponse.status}, ${rateResponse.status}`);
      }

      const priceJson: PriceData = await priceResponse.json();
      const rateJson: RateData = await rateResponse.json();

      setPriceData(priceJson);
      setRateData(rateJson);

      // rateデータの項目名を動的に取得
      const rateTypes = Object.keys(Object.values(rateJson)[0]);
      const lastMonthRateKey = rateTypes.find(type => type.includes('先月')) || '';
      const lastYearRateKey = rateTypes.find(type => type.includes('例年') || type.includes('昨年')) || '';

      const vegList = Object.keys(priceJson).map(veg => ({
        name: veg,
        isExpanded: false,
        lastMonthRate: rateJson[veg]?.[lastMonthRateKey],
        lastYearRate: rateJson[veg]?.[lastYearRateKey]
      }));

      // 50音順でソート
      const sortedVegList = vegList.sort((a, b) => a.name.localeCompare(b.name, 'ja'));

      setVegetables(sortedVegList);
      setRateTypes({ lastMonth: lastMonthRateKey, lastYear: lastYearRateKey });

      // ここでソートオプションを設定（既に '50音順' に設定されているはずですが、明示的に設定）
      setSortOption('50音順');

    } catch (error) {
      console.error('Error fetching or parsing data: ', error);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const processData = (vegetable: string) => {
    if (!priceData) return [];

    const vegData = priceData[vegetable];
    return Object.entries(vegData)
      .map(([date, price]) => ({
        x: convertDate(date),
        y: price
      }))
      .sort((a, b) => a.x - b.x);
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

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortVegetables = () => {
    const sorted = [...vegetables].sort((a, b) => {
      switch (sortOption) {
        case '50音順':
          return a.name.localeCompare(b.name, 'ja');
        case `${rateTypes.lastMonth}（高い順）`:
          return (b.lastMonthRate || 0) - (a.lastMonthRate || 0);
        case `${rateTypes.lastMonth}（低い順）`:
          return (a.lastMonthRate || 0) - (b.lastMonthRate || 0);
        case `${rateTypes.lastYear}（高い順）`:
          return (b.lastYearRate || 0) - (a.lastYearRate || 0);
        case `${rateTypes.lastYear}（低い順）`:
          return (a.lastYearRate || 0) - (b.lastYearRate || 0);
        default:
          return 0;
      }
    });
    setVegetables(sorted);
  };

  const renderSortOption: ListRenderItem<SortOption> = ({ item }) => (
    <TouchableOpacity
      style={styles.sortOptionItem}
      onPress={() => {
        setSortOption(item);
        setShowSortModal(false);
      }}
    >
      <Text style={styles.sortOptionText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }: { item: VegetableItem; index: number }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.itemHeader}>
        <View style={styles.itemTitleContainer}>
          <Text style={styles.itemTitle}>{item.name}</Text>
        </View>
        <View style={styles.ratesContainer}>
          <RateDisplay rate={item.lastMonthRate} />
          <RateDisplay rate={item.lastYearRate} />
        </View>
        <Ionicons
          name={item.isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={24}
          color="#007AFF"
        />
      </TouchableOpacity>
      {item.isExpanded && (
        <View style={styles.chartContainer}>
          <SVGLineChart
            data={processData(item.name)}
            width={screenWidth - 40}
            height={screenHeight * 0.3}
            padding={40}
            xAxisLabel=""
            yAxisLabel=""
          />
        </View>
      )}
    </View>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!priceData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const sortOptions: SortOption[] = [
    '50音順',
    `${rateTypes.lastMonth}（高い順）`,
    `${rateTypes.lastMonth}（低い順）`,
    `${rateTypes.lastYear}（高い順）`,
    `${rateTypes.lastYear}（低い順）`
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>野菜価格</Text>
        <SortButton sortOption={sortOption} onPress={() => setShowSortModal(true)} />
        <RateHeader rateTypes={rateTypes} />
        <FlatList
          data={vegetables}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>並び替え方法を選択</Text>
            <ModalFlatList
              data={sortOptions}
              renderItem={renderSortOption}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles.closeModalButtonText}>キャンセル</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  sortButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  sortButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  sortButtonSelectedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sortOptionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sortOptionText: {
    fontSize: 16,
  },
  closeModalButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 50, // Ioniconsのスペースを考慮
    marginBottom: 8,
    marginRight: 10, // 右端の余白を追加
  },
  rateHeaderColumn: {
    width: 80,
    alignItems: 'center',
  },
  rateHeaderLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: 'bold',
  },
  ratesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginRight: 10,
  },
  rateColumn: {
    alignItems: 'center',
    width: 80,
    marginHorizontal: 5,
  },
  rateValueContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 40,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    zIndex: 2,
  },
  trendArrow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.8,
    zIndex: 1,
    resizeMode: 'contain',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  rateLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  itemTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  rateText: {
    fontSize: 12,
    color: '#666666',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
  },
});

export default PriceTrendChart;