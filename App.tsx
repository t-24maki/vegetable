import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AdManagerProvider } from './AdManager';
import Detail from './src/Detail';
import SettingsScreen from './src/SettingScreen';
import AppInfoScreen from './src/AppInfoScreen';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <AdManagerProvider>
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
            tabBarStyle: {
              height: 60, // タブバーの高さ
              paddingBottom: 15, // 必要に応じて調整
            },
          })}
        >
          <Tab.Screen name="野菜価格" component={Detail} />
          {/* <Tab.Screen name="設定" component={SettingsScreen} /> */}
          <Tab.Screen name="アプリ説明" component={AppInfoScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AdManagerProvider>
  );
};

export default App;