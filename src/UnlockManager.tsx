import AsyncStorage from '@react-native-async-storage/async-storage';

interface UnlockData {
  [vegetableName: string]: {
    unlockedUntil: number;
  };
}

//const UNLOCK_DURATION = 1 * 60 * 1000; // ミリ秒
const UNLOCK_DURATION = 12 * 60 * 60 * 1000; // ミリ秒
const UNLOCKED_VEGETABLES_KEY = 'unlockedVegetables';
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5分ごとにクリーンアップ

export class UnlockManager {
  private static cleanupTimer: NodeJS.Timeout | null = null;
  private static isInitialized = false;

  static initialize() {
    if (this.isInitialized) return;
    
    this.startCleanupTimer();
    this.isInitialized = true;
  }

  private static async cleanup() {
    try {
      const unlockedVegetables = await AsyncStorage.getItem(UNLOCKED_VEGETABLES_KEY);
      if (!unlockedVegetables) return;

      const unlockData: UnlockData = JSON.parse(unlockedVegetables);
      const currentTime = Date.now();
      let hasChanges = false;

      // 期限切れのアンロック情報を削除
      Object.entries(unlockData).forEach(([vegetableName, data]) => {
        if (currentTime > data.unlockedUntil) {
          delete unlockData[vegetableName];
          hasChanges = true;
        }
      });

      // 変更があった場合のみ保存
      if (hasChanges) {
        await AsyncStorage.setItem(UNLOCKED_VEGETABLES_KEY, JSON.stringify(unlockData));
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }

  private static startCleanupTimer() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.cleanupTimer = setInterval(() => this.cleanup(), CLEANUP_INTERVAL);
  }

  static async getUnlockStatus(vegetableName: string): Promise<boolean> {
    try {
      const unlockedVegetables = await AsyncStorage.getItem(UNLOCKED_VEGETABLES_KEY);
      if (!unlockedVegetables) return false;
      
      const unlockData: UnlockData = JSON.parse(unlockedVegetables);
      const vegetableData = unlockData[vegetableName];
      
      if (!vegetableData) return false;
      
      // 期限切れの場合
      if (Date.now() > vegetableData.unlockedUntil) {
        // 即座にクリーンアップを実行
        await this.cleanup();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Unlock status check failed:', error);
      return false;
    }
  }

  static async unlockVegetable(vegetableName: string): Promise<void> {
    try {
      const unlockedVegetables = await AsyncStorage.getItem(UNLOCKED_VEGETABLES_KEY);
      const unlockData: UnlockData = unlockedVegetables ? JSON.parse(unlockedVegetables) : {};
      
      unlockData[vegetableName] = {
        unlockedUntil: Date.now() + UNLOCK_DURATION
      };
      
      await AsyncStorage.setItem(UNLOCKED_VEGETABLES_KEY, JSON.stringify(unlockData));
    } catch (error) {
      console.error('Failed to unlock vegetable:', error);
      throw error; // エラーを上位に伝播させる
    }
  }

  static getRemainingTime(unlockedUntil: number): string {
    const remaining = unlockedUntil - Date.now();
    if (remaining <= 0) return '期限切れ';
    
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}時間${minutes}分`;
  }

  static destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.isInitialized = false;
  }
}