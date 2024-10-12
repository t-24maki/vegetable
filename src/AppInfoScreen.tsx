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
      content: '主要な野菜の価格動向をリアルタイムで把握し、消費者や関係者に有用な情報を提供します。',
      icon: 'bulb-outline'
    },
    {
      title: '主な機能',
      content: [
        '野菜価格一覧: 各野菜の最新価格と変動率を一目で確認',
        '価格トレンドグラフ: 過去の価格推移を視覚的に表示',
        'カスタムソート: 野菜を名前順や価格変動率順で並び替え',
        '詳細情報: グラフ上の任意の点をタップして特定の日付の価格を確認'
      ],
      icon: 'list-outline'
    },
    {
      title: 'データソース',
      content: '農林水産省が定期的に報告する「青果物卸売市場調査」に基づいています。金額は卸売価格であり、店舗での価格とは異なる場合があります。',
      icon: 'server-outline'
    },
    {
      title: '価格比較について',
      content: '「例年○月との比較」は、2018〜2020年の同月平均と比較した結果を表示しています。',
      icon: 'bar-chart-outline'
    },
    {
      title: '利用上の注意',
      content: [
        '表示される価格は全国平均であり、地域によって実際の価格と異なる場合があります。',
        'このアプリは情報提供を目的としており、取引や投資の判断材料としての使用は推奨されません。',
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

      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => Linking.openURL('https://example.com/contact')}
      >
        <Ionicons name="mail-outline" size={24} color="#ffffff" />
        <Text style={styles.contactButtonText}>お問い合わせ</Text>
      </TouchableOpacity>

      <Text style={styles.version}>バージョン: 1.0.0</Text>
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
    marginTop: 20,
    color: '#7f8c8d',
  },
});

export default AppInfoScreen;