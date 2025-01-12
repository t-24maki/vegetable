import React, { useEffect, useState, useCallback, useMemo, createContext, useContext, ReactNode, useRef } from 'react';
import { View, Platform, AppState, Alert, StyleSheet, SafeAreaView  } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  RewardedInterstitialAd,
  AdEventType,
  RewardedAdEventType,
  RewardedAdReward,
  MobileAds,
  
} from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import NetInfo from '@react-native-community/netinfo';
import Constants from 'expo-constants';

// 広告関連の設定
const AD_CONFIG = {
  INTERSTITIAL_INTERVAL: 5 * 60 * 1000, // インタースティシャル広告の表示間隔（5分）
  MAX_RETRY_ATTEMPTS: 2, // 最大再試行回数
  RETRY_DELAY: 3000, // 再試行までの遅延時間（3秒）
  AD_LOAD_TIMEOUT: 5000, // 広告ロードのタイムアウト時間（5秒）
  INITIAL_AD_DELAY: 10 * 60 * 1000, // アプリ起動後の初回広告表示までの遅延時間（10分）
  AD_UNIT_IDS: __DEV__
    ? {
        // 開発環境用のテスト広告ID
        BANNER: TestIds.BANNER,
        INTERSTITIAL: TestIds.INTERSTITIAL,
        REWARDED_INTERSTITIAL: TestIds.REWARDED_INTERSTITIAL,
      }
    : {
        // 本番環境用の広告ID（実際のIDに置き換える必要があります）
        BANNER: Platform.select({
          ios: Constants.expoConfig?.extra?.adUnitIds?.banner?.ios,
          android: Constants.expoConfig?.extra?.adUnitIds?.banner?.android,
        }) as string,
        INTERSTITIAL: Platform.select({
          ios: Constants.expoConfig?.extra?.adUnitIds?.interstitial?.ios,
          android: Constants.expoConfig?.extra?.adUnitIds?.interstitial?.android,
        }) as string,
        REWARDED_INTERSTITIAL: Platform.select({
          ios: Constants.expoConfig?.extra?.adUnitIds?.rewardedInterstitial?.ios,
          android: Constants.expoConfig?.extra?.adUnitIds?.rewardedInterstitial?.android,
        }) as string,
      },
};

// AdManagerProviderのプロパティ型定義
interface AdManagerProviderProps {
  children: ReactNode;
}

// AdManagerContextの型定義
type AdManagerContextType = {
  showInterstitialAd: () => Promise<void>;
  showRewardedInterstitialAd: () => Promise<boolean>;
  interstitialAdReady: boolean;
  rewardedInterstitialAdReady: boolean;
  loadRewardedInterstitialAd: () => Promise<void>; 
  
};

// AdManagerContextの作成
const AdManagerContext = createContext<AdManagerContextType>({
  showInterstitialAd: async () => {},
  showRewardedInterstitialAd: async () => false,
  interstitialAdReady: false,
  rewardedInterstitialAdReady: false,
  loadRewardedInterstitialAd: async () => {}, 
});

// AdManagerProviderコンポーネント
export const AdManagerProvider: React.FC<AdManagerProviderProps> = ({ children }) => {
  // 状態変数の定義
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [interstitialAdReady, setInterstitialAdReady] = useState(false);
  const [rewardedInterstitialAdReady, setRewardedInterstitialAdReady] = useState(false);
  const [appStartTime, setAppStartTime] = useState<number | null>(null);

  // refの定義
  const trackingAuthorized = useRef(false);
  const interstitial = useRef<InterstitialAd | null>(null);
  const rewardedInterstitial = useRef<RewardedInterstitialAd | null>(null);

// ATT要求を別関数として分離
const requestATTPermission = async () => {
  if (Platform.OS === 'ios') {
    const { status } = await requestTrackingPermissionsAsync();
    trackingAuthorized.current = status === 'granted';
    console.log('ATT status:', status);
    return status;
  }
  return 'not_ios';
};

// AdMob初期化関数を修正
const initializeAdMob = useCallback(async (retryAttempt = 0): Promise<boolean> => {
  try {
    await MobileAds().initialize();
    setSdkInitialized(true);
    console.log('AdMob SDKが正常に初期化されました');
    return true;
  } catch (error) {
    console.error(`AdMob SDKの初期化中にエラーが発生しました (試行 ${retryAttempt + 1}/${AD_CONFIG.MAX_RETRY_ATTEMPTS}):`, error);

    if (retryAttempt < AD_CONFIG.MAX_RETRY_ATTEMPTS - 1) {
      console.log(`${AD_CONFIG.RETRY_DELAY / 1000}秒後に再試行します...`);
      await new Promise(resolve => setTimeout(resolve, AD_CONFIG.RETRY_DELAY));
      return initializeAdMob(retryAttempt + 1);
    } else {
      console.error('最大試行回数に達しました。AdMob SDKの初期化に失敗しました。');
      return false;
    }
  }
}, []);

// 初期化処理を修正
useEffect(() => {
  const initializeApp = async () => {
    // 1. まずATTを要求
    await requestATTPermission();
    
    // 2. その後でAdMobを初期化
    await initializeAdMob();
  };

  initializeApp();

  const unsubscribe = NetInfo.addEventListener(state => {
    setIsOnline(!!state.isConnected);
  });

  return () => {
    unsubscribe();
  };
}, [initializeAdMob]);

  // 広告のロードをタイムアウト付きで実行する関数
  const loadAdWithTimeout = useCallback((loadFunction: () => void) => {
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('広告のロードがタイムアウトしました'));
      }, AD_CONFIG.AD_LOAD_TIMEOUT);

      loadFunction();
      clearTimeout(timer);
      resolve();
    });
  }, []);

  // 広告のロードを再試行する関数
  const loadAdWithRetry = useCallback(async (
    loadFunction: () => void,
    setReadyState: React.Dispatch<React.SetStateAction<boolean>>,
    maxRetries = AD_CONFIG.MAX_RETRY_ATTEMPTS,
    delay = AD_CONFIG.RETRY_DELAY
  ) => {
    let retries = 0;
    const attemptLoad = async () => {
      try {
        await loadAdWithTimeout(loadFunction);
        setReadyState(true);
      } catch (error) {
        console.error('広告のロードに失敗:', error);
        setReadyState(false);
        if (retries < maxRetries) {
          retries++;
          console.log(`${retries}回目の再試行を${delay}ms後に行います`);
          setTimeout(attemptLoad, delay);
        } else {
          console.error('最大再試行回数に達しました');
          Alert.alert(
            "広告読み込み失敗",
            "広告の読み込みに失敗しました。申し訳ありませんが、後でもう一度お試しください。",
            [{ text: "OK" }]
          );
        }
      }
    };
    attemptLoad();
  }, [loadAdWithTimeout]);

  // インタースティシャル広告のロード
  const loadInterstitialAd = useCallback(() => {
    console.log('インタースティシャル広告のロードを開始します');
    loadAdWithRetry(
      () => {
        interstitial.current?.load();
        console.log('インタースティシャル広告のロードを開始しました');
      },
      setInterstitialAdReady
    );
  }, [loadAdWithRetry]);

// リワード付きインタースティシャル広告のロード
const loadRewardedInterstitialAd = useCallback(async () => {
  console.log('リワード付きインタースティシャル広告のロードを開始します');
  return new Promise<void>((resolve, reject) => {
    if (!rewardedInterstitial.current) {
      rewardedInterstitial.current = RewardedInterstitialAd.createForAdRequest(
        AD_CONFIG.AD_UNIT_IDS.REWARDED_INTERSTITIAL,
        {
          requestNonPersonalizedAdsOnly: !trackingAuthorized.current,
        }
      );
    }

    const loadedListener = rewardedInterstitial.current.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('リワード付きインタースティシャル広告が実際にロードされました');
        setRewardedInterstitialAdReady(true);
        loadedListener();
        resolve();
      }
    );

    const errorListener = rewardedInterstitial.current.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('リワード付きインタースティシャル広告のロードエラー:', error);
        setRewardedInterstitialAdReady(false);
        errorListener();
        reject(error);
      }
    );

    try {
      rewardedInterstitial.current.load();
    } catch (error) {
      console.error('広告ロード時のエラー:', error);
      reject(error);
    }
  });
}, []);

// 広告のセットアップ
useEffect(() => {
  if (sdkInitialized) {
    // インタースティシャル広告の設定
    interstitial.current = InterstitialAd.createForAdRequest(AD_CONFIG.AD_UNIT_IDS.INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: !trackingAuthorized.current,
    });

    // リワード付きインタースティシャル広告の設定
    rewardedInterstitial.current = RewardedInterstitialAd.createForAdRequest(AD_CONFIG.AD_UNIT_IDS.REWARDED_INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: !trackingAuthorized.current,
    });

    // イベントリスナーの設定
    const interstitialListener = interstitial.current.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialAdReady(true);
      console.log('インタースティシャル広告のロードが完了しました');
    });

    const rewardedInterstitialListener = rewardedInterstitial.current.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setRewardedInterstitialAdReady(true);
      console.log('リワード付きインタースティシャル広告のロードが完了しました');
    });

    // 広告のロード
    loadInterstitialAd();
    loadRewardedInterstitialAd();

    // クリーンアップ関数
    return () => {
      interstitialListener();
      rewardedInterstitialListener();
    };
  }
}, [sdkInitialized, loadInterstitialAd, loadRewardedInterstitialAd]);

  // アプリ起動時間の管理
  useEffect(() => {
    setAppStartTime(Date.now());

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && appStartTime === null) {
        setAppStartTime(Date.now());
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // インタースティシャル広告を表示できるかどうかのチェック
  const canShowInterstitial = useCallback(() => {
    if (appStartTime === null) return false;
    return Date.now() - appStartTime >= AD_CONFIG.INITIAL_AD_DELAY;
  }, [appStartTime]);

  // 広告を表示する関数
  const showAd = useCallback(async (
    adRef: React.MutableRefObject<InterstitialAd | RewardedInterstitialAd | null>,
    setReadyState: React.Dispatch<React.SetStateAction<boolean>>,
    adType: string
  ) => {
    if (!isOnline || !adRef.current) {
      console.log(`オフライン状態または${adType}広告が準備できていないため、広告をスキップします`);
      return false;
    }

    if (adType === 'INTERSTITIAL' && !canShowInterstitial()) {
      console.log('アプリ起動から10分が経過していないため、インタースティシャル広告をスキップします');
      return false;
    }

    const lastShownTimeKey = `last${adType}Time`;
    const lastShownTime = await AsyncStorage.getItem(lastShownTimeKey);
    const currentTime = Date.now();

    if (!lastShownTime || currentTime - parseInt(lastShownTime) > AD_CONFIG.INTERSTITIAL_INTERVAL) {
      try {
        await adRef.current.show();
        AsyncStorage.setItem(lastShownTimeKey, currentTime.toString()).catch(console.error);
        setReadyState(false);
        return true;
      } catch (error) {
        console.error(`${adType}広告の表示に失敗:`, error);
        setReadyState(false);
        return false;
      }
    }
    return false;
  }, [isOnline, canShowInterstitial]);

// インタースティシャル広告を表示する関数
const showInterstitialAd = useCallback(async () => {
  if (await showAd(interstitial, setInterstitialAdReady, 'INTERSTITIAL')) {
    return new Promise<void>((resolve) => {
      const unsubscribe = interstitial.current?.addAdEventListener(AdEventType.CLOSED, () => {
        unsubscribe?.();
        // 広告が閉じられた後に新しい広告をロード
        loadInterstitialAd();
        resolve();
      });
    });
  } else {
    // 広告が表示されなかった場合も、新しい広告をロード
    loadInterstitialAd();
  }
}, [showAd, loadInterstitialAd]);


// showRewardedInterstitialAd関数も修正
const showRewardedInterstitialAd = useCallback(async (): Promise<boolean> => {
  console.log('広告表示開始: 準備状態=', rewardedInterstitialAdReady);
  
  if (!rewardedInterstitialAdReady || !rewardedInterstitial.current) {
    console.log('広告がロードされていないため、ロードを試みます');
    try {
      await loadRewardedInterstitialAd();
      // ロード完了を待つ
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('広告ロードに失敗:', error);
      Alert.alert(
        "エラー",
        "広告の準備に失敗しました。もう一度お試しください。",
        [{ text: "OK" }]
      );
      return false;
    }
  }

  let rewardEarned = false;
  return new Promise<boolean>((resolve) => {
    const rewardListener = rewardedInterstitial.current?.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward: RewardedAdReward) => {
        console.log('報酬獲得:', reward);
        rewardEarned = true;
      }
    );

    const closedListener = rewardedInterstitial.current?.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('広告が閉じられました');
        setRewardedInterstitialAdReady(false);
        loadRewardedInterstitialAd(); // 次の広告をプリロード
        resolve(rewardEarned);
        closedListener?.();
        rewardListener?.();
      }
    );

    const errorListener = rewardedInterstitial.current?.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('広告表示エラー:', error);
        setRewardedInterstitialAdReady(false);
        loadRewardedInterstitialAd();
        resolve(false);
        errorListener?.();
      }
    );

    try {
      console.log('広告表示を実行します');
      rewardedInterstitial.current?.show().catch((error) => {
        console.error('広告表示に失敗:', error);
        setRewardedInterstitialAdReady(false);
        loadRewardedInterstitialAd();
        resolve(false);
      });
    } catch (error) {
      console.error('予期せぬエラー:', error);
      resolve(false);
    }
  });
}, [rewardedInterstitialAdReady, loadRewardedInterstitialAd]);


// useEffectでの初期設定も修正
useEffect(() => {
  if (sdkInitialized) {
    // 初期化時に広告をロード
    const initAds = async () => {
      try {
        await loadRewardedInterstitialAd();
        console.log('初期広告のロードに成功しました');
      } catch (error) {
        console.error('初期広告のロードに失敗:', error);
      }
    };
    initAds();
  }
}, [sdkInitialized]);


  // バナー広告のレンダリング
  const renderBannerAd = useMemo(() => {
    return (
      <View 
        accessible={true}
        accessibilityLabel="広告"
        accessibilityRole="none"
        accessibilityHint="この領域には広告が表示されています"
        style={styles.bannerContainer} 
      >
        <BannerAd
          unitId={AD_CONFIG.AD_UNIT_IDS.BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: !trackingAuthorized.current,
          }}
          onAdLoaded={() => console.log('バナー広告のロードが完了しました')}
        />
      </View>
    );
  }, []);


 // コンテキスト値の生成
 const contextValue = useMemo(() => ({
  showInterstitialAd,
  showRewardedInterstitialAd,
  interstitialAdReady,
  rewardedInterstitialAdReady,
  loadRewardedInterstitialAd,
}), [showInterstitialAd, showRewardedInterstitialAd, interstitialAdReady, rewardedInterstitialAdReady, loadRewardedInterstitialAd]);

// AdManagerProviderのレンダリング
return (
  <AdManagerContext.Provider value={contextValue}>
    {children}
    {isOnline && sdkInitialized && renderBannerAd}
  </AdManagerContext.Provider>
);
};

// AdManagerContextを使用するためのカスタムフック
export const useAdManager = () => useContext(AdManagerContext);

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    bottom: 60, // タブバーの高さに応じて調整
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});