import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProStatus } from './ProContext';

const ProScreen: React.FC = () => {
  const { isProUser, purchasePro, restorePurchases } = useProStatus();

  const handlePurchasePress = async () => {
    try {
      await purchasePro();
    } catch (error) {
      Alert.alert(
        'エラー',
        '購入処理中にエラーが発生しました。',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const handleRestorePress = async () => {
    try {
      await restorePurchases();
    } catch (error) {
      Alert.alert(
        'エラー',
        '購入の復元中にエラーが発生しました。',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  // 開発用のProステータストグル機能
  // const handleToggleProStatus = () => {
  //   setIsProUser(!isProUser);
  // };

  const renderProContent = () => (
    <View style={styles.content}>
      <View style={styles.proHeader}>
        <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
        <Text style={styles.proHeaderTitle}>Pro版をご利用中</Text>
      </View>
      
      <Text style={styles.proDescription}>
        すべての機能をご利用いただけます。ご利用ありがとうございます！
      </Text>

      <View style={styles.featureSection}>
        <Text style={styles.sectionTitle}>利用可能な機能</Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>広告なしでアプリを利用可能</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>すべての野菜・果物の情報にアクセス可能</Text>
        </View>
      </View>

      <View style={styles.subscriptionInfo}>
        <Text style={styles.subscriptionText}>契約プラン：月額プラン</Text>
        <Text style={styles.subscriptionPrice}>¥300/月</Text>
      </View>
    </View>
  );

  const renderFreeContent = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Ionicons name="star" size={48} color="#FFD700" />
        <Text style={styles.headerTitle}>Proモードのご案内</Text>
      </View>

      <Text style={styles.description}>
        すべての野菜・果物の情報が確認し放題！
      </Text>

      <View style={styles.featureSection}>
        <Text style={styles.sectionTitle}>Pro版の特徴</Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>広告視聴なしで全ての野菜の情報が分かる</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>その他、便利な機能を随時追加予定</Text>
        </View>
      </View>

      <View style={styles.pricingSection}>
        <Text style={styles.priceLabel}>価格</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>¥300</Text>
          <Text style={styles.period}>/月</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.purchaseButton}
        onPress={handlePurchasePress}
      >
        <Text style={styles.purchaseButtonText}>Pro版を購入</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.restoreButton}
        onPress={handleRestorePress}
      >
        <Text style={styles.restoreButtonText}>購入を復元</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 開発用のProステータストグルボタン */}
      {/* <TouchableOpacity
        style={styles.debugButton}
        onPress={handleToggleProStatus}
      >
        <Text style={styles.debugButtonText}>
          {isProUser ? '[開発用] Pro → 無料版に切替' : '[開発用] 無料版 → Proに切替'}
        </Text>
      </TouchableOpacity> */}

      <ScrollView>
        {isProUser ? renderProContent() : renderFreeContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // 開発用ボタンのスタイル
  debugButton: {
    backgroundColor: '#FFE0E0',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#FF0000',
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  proHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#E8F5E9',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 12,
  },
  proHeaderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 12,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  proDescription: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  featureSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  pricingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  period: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 4,
  },
  purchaseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  restoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  subscriptionInfo: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  subscriptionText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 8,
  },
  subscriptionPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
});

export default ProScreen;