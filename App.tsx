import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Detail from './src/Detail';
import SettingsScreen from './src/SettingScreen';
import AppInfoScreen from './src/AppInfoScreen'; // 新しく追加

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === '野菜価格') {
              iconName = focused ? 'leaf' : 'leaf-outline';
            } else if (route.name === '設定') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'アプリ説明') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="野菜価格" component={Detail} />
        <Tab.Screen name="設定" component={SettingsScreen} />
        <Tab.Screen name="アプリ説明" component={AppInfoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;