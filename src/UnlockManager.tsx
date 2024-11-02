import AsyncStorage from '@react-native-async-storage/async-storage';

interface UnlockData {
  [vegetableName: string]: {
    unlockedUntil: number;
  };
}

const UNLOCK_DURATION = 12 * 60 * 60 * 1000; // 12時間（ミリ秒）
const UNLOCKED_VEGETABLES_KEY = 'unlockedVegetables';

export class UnlockManager {
  static async getUnlockStatus(vegetableName: string): Promise<boolean> {
    try {
      const unlockedVegetables = await AsyncStorage.getItem(UNLOCKED_VEGETABLES_KEY);
      if (!unlockedVegetables) return false;
      
      const unlockData: UnlockData = JSON.parse(unlockedVegetables);
      const vegetableData = unlockData[vegetableName];
      
      if (!vegetableData) return false;
      
      if (Date.now() > vegetableData.unlockedUntil) {
        const newUnlockData = { ...unlockData };
        delete newUnlockData[vegetableName];
        await AsyncStorage.setItem(UNLOCKED_VEGETABLES_KEY, JSON.stringify(newUnlockData));
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
    }
  }

  static getRemainingTime(unlockedUntil: number): string {
    const remaining = unlockedUntil - Date.now();
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}:${minutes}`;
  }
}