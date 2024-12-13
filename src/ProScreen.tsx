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

const ProScreen: React.FC = () => {
  const handlePurchasePress = () => {
    Alert.alert(
      'Pro版の購入',
      '準備中です。今しばらくお待ちください。',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleRestorePress = () => {
    Alert.alert(
      '購入の復元',
      '準備中です。今しばらくお待ちください。',
      [{ text: 'OK', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="star" size={48} color="#FFD700" />
          <Text style={styles.headerTitle}>Proモードのご案内</Text>
        </View>

        <View style={styles.content}>
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
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
});

export default ProScreen;