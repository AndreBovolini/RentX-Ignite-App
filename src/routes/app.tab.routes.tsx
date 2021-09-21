import React from 'react';

import HomeSvg from '../assets/home.svg';
import CarSvg from '../assets/car.svg';
import PeopleSvg from '../assets/people.svg';


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MyCars } from '../screens/MyCars';
import { AppStackRoutes } from './app.stack.routes';
import { useTheme } from 'styled-components';
import { Platform } from 'react-native';
import { Profile } from '../screens/Profile';

const { Navigator, Screen } = createBottomTabNavigator()

export function AppTabRoutes(){

    const theme = useTheme();

    return (
        <Navigator
            tabBarOptions={{
                activeTintColor: theme.colors.main,
                inactiveTintColor: theme.colors.text_detail,
                showLabel: false,
                style: {
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                    height: 78,
                    backgroundColor: theme.colors.background_primary
                }
            }}
        >
            <Screen 
                name="Home"
                component={AppStackRoutes}
                options={{
                    tabBarIcon: ({ color }) => {
                        return (
                            <HomeSvg width={24} height={24} fill={color} />
                        )
                    }
                }}
            />
             <Screen 
                name="MyCars"
                component={MyCars}
                options={{
                    tabBarIcon: ({ color }) => {
                        return (
                            <CarSvg width={24} height={24} fill={color}/>
                        )
                    }
                }}
            />
            <Screen 
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color }) => {
                        return (
                            <PeopleSvg width={24} height={24} fill={color}/>
                        )
                    }
                }}
            />
        </Navigator>
    )
}