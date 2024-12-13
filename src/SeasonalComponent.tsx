import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

// 月ごとの旬を定義（1-12の配列で、旬の月にはtrueを設定）
const seasonalMonthData = {
    // 果物
    'いちご': [true, true, true, true, false, false, false, false, false, false, false, true],
    // 12-4月が旬。促成栽培が一般的で、冬から春にかけてが最盛期
  
    'みかん': [true, true, false, false, false, false, false, false, false, true, true, true],
    // 10-2月が旬。晩秋から冬にかけて最も美味しい時期
  
    'りんご': [true, false, false, false, false, false, false, false, true, true, true, true],
    // 9-1月が旬。品種により収穫時期は異なるが、秋から冬が主力
  
    'バナナ': [true, true, true, true, true, true, true, true, true, true, true, true],
    // 輸入果物のため年中供給。旬の概念なし
  
    // 葉物野菜
    'キャベツ': [false, false, true, true, true, false, false, false, true, true, true, false],
    // 春（3-5月）と秋（9-11月）が旬。寒玉と春系で時期が分かれる
  
    'はくさい': [true, true, false, false, false, false, false, false, true, true, true, true],
    // 晩秋から冬（10-2月）が旬。寒さに当たることで甘みが増す
  
    'レタス': [false, false, false, true, true, true, false, false, true, true, false, false],
    // 春（4-6月）と秋（9-10月）が旬。夏は高温で栽培が難しい
  
    // 根菜類
    'だいこん': [true, true, false, false, false, false, false, false, true, true, true, true],
    // 晩秋から冬（10-2月）が旬。寒さで甘みが増す
  
    'にんじん': [true, true, true, false, false, false, false, false, true, true, true, true],
    // 冬から春（12-3月）と秋（9-11月）が旬
  
    'たまねぎ': [false, false, false, false, true, true, true, false, false, false, false, false],
    // 5-7月が旬。春から初夏にかけての新タマネギが最も甘い
  
    'ばれいしょ': [false, false, false, false, true, true, true, false, false, false, false, false],
    // 5-7月が旬。春から初夏にかけての新ジャガが最も人気
  
    // 果菜類
    'きゅうり': [false, false, false, false, true, true, true, true, true, false, false, false],
    // 5-9月が旬。夏野菜の代表格
  
    'トマト': [false, false, false, false, true, true, true, true, false, false, false, false],
    // 5-8月が旬。真夏が最盛期
  
    'ねぎ': [true, true, true, false, false, false, false, false, true, true, true, true],
    // 秋から冬（9-3月）が旬。寒さで甘みが増す
  };

  interface SeasonalIndicatorProps {
    itemName: string;
    isLocked?: boolean;
  }
  
  const SeasonalIndicator = ({ itemName, isLocked }: SeasonalIndicatorProps) => {
    const currentMonth = new Date().getMonth();
    const itemSeasonalData = seasonalMonthData[itemName];
    
    if (!itemSeasonalData || !itemSeasonalData[currentMonth] || isLocked) return null;
  
    return (
      <Image 
        source={require('../assets/shun.png')} 
        style={styles.shunImage}
        resizeMode="contain"
      />
    );
  };

const styles = StyleSheet.create({
shunImage: {
    width: 40,  // 画像サイズに応じて調整してください
    height: 40, // 画像サイズに応じて調整してください
    marginLeft: 3,
    },
});

export default SeasonalIndicator;