import React, { createContext, useContext, useState, useEffect } from 'react';
import Purchases, { CustomerInfo, PurchasesOffering } from 'react-native-purchases';
import { Alert } from 'react-native';

interface ProContextType {
  isProUser: boolean;
  isLoading: boolean;
  purchasePro: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const ProContext = createContext<ProContextType | undefined>(undefined);

const REVENUE_CAT_API_KEY = 'appl_juQbAHhppckYQbFCCgEEnHypUXX'; // 環境変数から取得することを推奨

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProUser, setIsProUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // RevenueCatの初期化
  const initializeRevenueCat = async () => {
    try {
      await Purchases.configure({ apiKey: REVENUE_CAT_API_KEY });
      await checkProStatus();
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      Alert.alert('エラー', '初期化に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  // Pro権限の確認
  const checkProStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const hasProAccess = customerInfo.entitlements.active['pro'] !== undefined;
      setIsProUser(hasProAccess);
    } catch (error) {
      console.error('Failed to check pro status:', error);
      setIsProUser(false);
    }
  };

  // 利用可能な商品の取得
  const getOfferings = async (): Promise<PurchasesOffering | null> => {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current;
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return null;
    }
  };

  // Pro版の購入処理
  const purchasePro = async () => {
    try {
      setIsLoading(true);
      const offerings = await getOfferings();
      
      if (!offerings?.monthly) {
        throw new Error('Monthly subscription not found');
      }

      const { customerInfo } = await Purchases.purchasePackage(offerings.monthly);
      const hasProAccess = customerInfo.entitlements.active['pro'] !== undefined;
      setIsProUser(hasProAccess);

      if (hasProAccess) {
        Alert.alert('成功', 'Proモードの購入が完了しました！');
      } else {
        Alert.alert('エラー', '購入処理は完了しましたが、Pro権限が有効になっていません');
      }
    } catch (error: any) {
      // ユーザーによるキャンセルの場合は無視
      if (!error.userCancelled) {
        console.error('Failed to purchase:', error);
        Alert.alert('エラー', '購入処理中にエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 購入の復元処理
  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      const customerInfo = await Purchases.restorePurchases();
      const hasProAccess = customerInfo.entitlements.active['pro'] !== undefined;
      setIsProUser(hasProAccess);

      if (hasProAccess) {
        Alert.alert('成功', '購入を復元しました！');
      } else {
        Alert.alert('お知らせ', '復元可能な購入情報が見つかりませんでした');
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      Alert.alert('エラー', '購入の復元中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 初期化
  useEffect(() => {
    initializeRevenueCat();
  }, []);

  // 定期的なステータスチェック（オプション）
  useEffect(() => {
    const checkStatusInterval = setInterval(checkProStatus, 60000); // 1分ごと
    return () => clearInterval(checkStatusInterval);
  }, []);

  return (
    <ProContext.Provider 
      value={{ 
        isProUser,
        isLoading,
        purchasePro,
        restorePurchases
      }}
    >
      {children}
    </ProContext.Provider>
  );
};

// カスタムフック
export const useProStatus = () => {
  const context = useContext(ProContext);
  if (context === undefined) {
    throw new Error('useProStatus must be used within a ProProvider');
  }
  return context;
};

export default ProContext;