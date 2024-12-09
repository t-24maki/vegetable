import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Ioniconsで利用可能なアイコン名の型を定義
type IconName = React.ComponentProps<typeof Ionicons>['name'];

// セクションの型を定義
interface Section {
  title: string;
  content: string | string[];
  icon: IconName;
}

const AppInfoScreen: React.FC = () => {
  const sections: Section[] = [
    {
      title: 'アプリの目的',
      content: 'ユーザーの家計の手助けや、日本のフードロス削減の取り組みの一環として「いま市場に多く出回り安く買える野菜／果物」を一目で確認できるアプリです。',
      icon: 'bulb-outline'
    },
    {
      title: '主な機能',
      content: [
        '野菜価格: 各野菜／果物の最新卸価格と変動率を一目で確認',
        '価格のトレンドグラフ: 過去1年間の価格推移を折れ線グラフで確認',
        'カスタムソート: 野菜を名前順や価格変動率順で並び替え可能',
      ],
      icon: 'list-outline'
    },
    {
      title: 'データソース',
      content: '農林水産省が月3回報告する「青果物卸売市場調査（旬別調査）」を元にしています。数値は主要卸売市場における価格に基づいており、店舗での価格とは異なります。',
      icon: 'server-outline'
    },
    {
      title: '価格比較について',
      content: '「先月との比」は、直前3回分の報告値の平均と比較した結果を示しています。「例年○月との比」は、2018〜2020年の同月平均と比較した結果を表示しています。',
      icon: 'bar-chart-outline'
    },
    {
      title: '利用上の注意',
      content: [
        '表示される価格は全国平均であり、地域差によっての違いは考慮されていません。',
        'アプリの使用によって生じたいかなる損害についても、開発者は責任を負いかねます。'
      ],
      icon: 'warning-outline'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name={section.icon} size={24} color="#3498db" />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
          {Array.isArray(section.content) ? (
            section.content.map((item, i) => (
              <View key={i} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.text}>{section.content}</Text>
          )}
        </View>
      ))}

      {/* <TouchableOpacity
        style={styles.contactButton}
        onPress={() => Linking.openURL('https://example.com/contact')}
      >
        <Ionicons name="mail-outline" size={24} color="#ffffff" />
        <Text style={styles.contactButtonText}>お問い合わせ</Text>
      </TouchableOpacity> */}

      <Text style={styles.version}></Text>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    lineHeight: 24,
    marginRight: 8,
    color: '#3498db',
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2c3e50',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#2c3e50',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactButton: {
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  contactButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    marginTop: 60,
    color: '#7f8c8d',
  },
});

export default AppInfoScreen;