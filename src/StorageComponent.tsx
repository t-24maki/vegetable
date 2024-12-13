import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 日持ち情報のデータ定義
export const storageData: { [key: string]: {
  duration: string;
  location: string;
  tips: string;
}} = {
  'いちご': {
    duration: '3-4日',
    location: '冷蔵庫の野菜室',
    tips: '洗わずにラップで包んで保存。使う直前に洗う'
  },
  'みかん': {
    duration: '2-3週間',
    location: '冷暗所',
    tips: '新聞紙に包んで風通しの良い場所で保存'
  },
  'りんご': {
    duration: '2-3週間',
    location: '冷蔵庫',
    tips: 'ポリ袋に入れて野菜室で保存'
  },
  'キャベツ': {
    duration: '1-2週間',
    location: '冷蔵庫の野菜室',
    tips: 'ラップで包んで保存。外葉は剥がさない'
  },
  'はくさい': {
    duration: '1週間',
    location: '冷蔵庫の野菜室',
    tips: 'ラップや新聞紙で包んで立てて保存'
  },
  'レタス': {
    duration: '4-5日',
    location: '冷蔵庫の野菜室',
    tips: 'ラップで包み、立てて保存'
  },
  'だいこん': {
    duration: '2-3週間',
    location: '冷蔵庫の野菜室',
    tips: '葉を切り、新聞紙で包んで保存'
  },
  'にんじん': {
    duration: '2-3週間',
    location: '冷蔵庫の野菜室',
    tips: '新聞紙で包んで保存。葉は切り落とす'
  },
  'たまねぎ': {
    duration: '1-2ヶ月',
    location: '冷暗所',
    tips: '風通しの良い冷暗所で網袋に入れて保存'
  },
  'ばれいしょ': {
    duration: '1-2ヶ月',
    location: '冷暗所',
    tips: '新聞紙で包み、光を避けて保存'
  },
  'きゅうり': {
    duration: '4-5日',
    location: '冷蔵庫の野菜室',
    tips: 'ラップで包まず、新聞紙で包んで保存'
  },
  'トマト': {
    duration: '4-5日',
    location: '冷蔵庫',
    tips: 'ヘタを上にして常温か冷蔵で保存'
  },
  'ねぎ': {
    duration: '1-2週間',
    location: '冷蔵庫の野菜室',
    tips: '新聞紙で包んで立てて保存'
  },
  'バナナ': {
    duration: '5-7日',
    location: '室温',
    tips: '他の果物から離して保存。完熟したら冷蔵可'
  }
};

interface StorageComponentProps {
  itemName: string;
}

const StorageComponent: React.FC<StorageComponentProps> = ({ itemName }) => {
  const info = storageData[itemName];
  
  if (!info) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>保存方法</Text>
      <View style={styles.infoGrid}>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>日持ち目安</Text>
            <Text style={styles.value}>{info.duration}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="location-outline" size={20} color="#007AFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>保存場所</Text>
            <Text style={styles.value}>{info.location}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>保存のコツ</Text>
            <Text style={styles.value}>{info.tips}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  label: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#333333',
  },
});

export default StorageComponent;