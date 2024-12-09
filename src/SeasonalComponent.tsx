import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 月ごとの旬を定義（1-12の配列で、旬の月にはtrueを設定）
const seasonalMonthData = {
  'だいこん': [false, false, false, false, false, false, true, true, true, true, true, true],
  'きゅうり': [false, false, false, false, true, true, true, true, false, false, false, false],
  'なす': [false, false, false, false, false, true, true, true, true, false, false, false],
  'トマト': [false, false, false, false, true, true, true, true, false, false, false, false],
  'ピーマン': [false, false, false, false, true, true, true, true, true, false, false, false],
  'かぼちゃ': [false, false, false, false, false, true, true, true, true, false, false, false],
  'ほうれんそう': [true, true, true, false, false, false, false, false, true, true, true, true],
  'ブロッコリー': [true, true, true, false, false, false, false, false, false, true, true, true],
  'アスパラガス': [false, false, true, true, true, false, false, false, false, false, false, false],
  'いちご': [true, true, true, true, false, false, false, false, false, false, false, true],
  'みかん': [false, false, false, false, false, false, false, false, false, true, true, true],
  'ぶどう': [false, false, false, false, false, false, false, true, true, true, false, false],
  // 必要に応じて他の野菜・果物を追加
};

const SeasonalIndicator = ({ itemName }: { itemName: string }) => {
  const currentMonth = new Date().getMonth(); // 0-11の値
  const itemSeasonalData = seasonalMonthData[itemName];
  
  if (!itemSeasonalData || !itemSeasonalData[currentMonth]) return null;

  return (
    <View style={styles.seasonalBadge}>
      <Text style={styles.seasonalText}>旬</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  seasonalBadge: {
    backgroundColor: '#22c55e', // green-600相当
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  seasonalText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default SeasonalIndicator;