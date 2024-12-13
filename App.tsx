import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AdManagerProvider } from './AdManager';
import Detail from './src/Detail';
import ProScreen from './src/ProScreen';
import AppInfoScreen from './src/AppInfoScreen';
import { ProProvider } from './src/ProContext';

const Tab = createBottomTabNavigator();

const App: React.FC = () => {
  return (
    <ProProvider>
    <AdManagerProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === '野菜価格') {
                iconName = focused ? 'leaf' : 'leaf-outline';
              } else if (route.name === 'Pro版') {
                iconName = focused ? 'star' : 'star-outline';
              } else if (route.name === 'アプリ説明') {
                iconName = focused ? 'information-circle' : 'information-circle-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarStyle: {
              height: 60,
              paddingBottom: 15,
            },
          })}
        >
          <Tab.Screen name="野菜価格" component={Detail} />
          <Tab.Screen name="Pro版" component={ProScreen} />
          <Tab.Screen name="アプリ説明" component={AppInfoScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </AdManagerProvider>
    </ProProvider>
  );
};

export default App;