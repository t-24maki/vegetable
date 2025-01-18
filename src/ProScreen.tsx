import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProStatus } from './contexts/ProContext';

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

  const openPrivacyPolicy = () => {
    Linking.openURL('https://t-24maki.github.io/vegetable-support/privacy-policy_JP.html'); // プライバシーポリシーのURLを設定
  };

  const openTermsOfUse = () => {
    Linking.openURL('https://www.apple.com/legal/internet-services/itunes/jp/terms.html'); // 利用規約のURLを設定
  };

  const renderSubscriptionDetails = () => (
    <View style={styles.subscriptionDetails}>
      <Text style={styles.subscriptionDetailTitle}>サブスクリプション詳細</Text>
      
      {/* サブスクリプションの詳細情報 */}      
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>期間:</Text>
        <Text style={styles.detailValue}>1ヶ月間</Text>
      </View>
      
      <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>価格:</Text>
        <Text style={styles.detailValue}>¥300/月</Text>
      </View>

      {/* 自動更新に関する説明 */}
      <Text style={styles.autoRenewalInfo}>
        ※ サブスクリプションは自動的に更新されます。更新は現在の期間が終了する24時間前までにキャンセルできます。
      </Text>
      
      {/* リンク */}
      <View style={styles.legalLinks}>
        <TouchableOpacity onPress={openPrivacyPolicy}>
          <Text style={styles.legalLinkText}>プライバシーポリシー</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openTermsOfUse}>
          <Text style={styles.legalLinkText}>利用規約</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProContent = () => (
    <View style={styles.content}>
      <View style={styles.proHeader}>
        <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
        <Text style={styles.proHeaderTitle}>Proモードをご利用中</Text>
      </View>
      
      <Text style={styles.proDescription}>
        すべての機能をご利用いただけます。ご利用ありがとうございます！
      </Text>

      <View style={styles.featureSection}>
        <Text style={styles.sectionTitle}>利用可能な機能</Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>広告なしですべての野菜・果物の情報にアクセス可能</Text>
        </View>

      </View>

      {renderSubscriptionDetails()}
    </View>
  );

  const renderFreeContent = () => (
    <View style={styles.content}>
      <View style={styles.header}>
        <Ionicons name="star" size={48} color="#FFD700" />
        <Text style={styles.headerTitle}>Proモードのご案内</Text>
      </View>

      {/* <Text style={styles.description}>
        すべての野菜・果物の情報が確認し放題！
      </Text> */}

      <View style={styles.featureSection}>
        {/* <Text style={styles.sectionTitle}>Pro版の特徴</Text> */}
        
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>広告視聴なしで、全ての野菜・果物の情報が確認し放題！</Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>その他、便利機能を随時追加予定</Text>
        </View>
      </View>

      {renderSubscriptionDetails()}

      <TouchableOpacity
        style={styles.purchaseButton}
        onPress={handlePurchasePress}
      >
        <Text style={styles.purchaseButtonText}>Proモードにする</Text>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isProUser ? renderProContent() : renderFreeContent()}
        {/* Admob用の余白 */}
        <View style={styles.adSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    // iOSとAndroidで適切な余白を設定
    paddingBottom: 90 ,
  },
  adSpace: {
    height:50,
  },
  subscriptionDetails: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  subscriptionDetailTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666666',
  },
  detailValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  autoRenewalInfo: {
    fontSize: 14,
    color: '#666666',
    marginTop: 16,
    lineHeight: 20,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  legalLinkText: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
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