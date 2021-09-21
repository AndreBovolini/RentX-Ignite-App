import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';

import { ImageSlider } from '../../components/ImageSlider';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon'
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate
} from 'react-native-reanimated'

import {
Container,
Header,
CarImages,
Details,
Description,
Brand,
Name,
Rent,
Period,
Price,
About,
Accessories,
Footer,
OfflineInfo
} from './styles';
import { Button } from '../../components/Button';
import { CarDTO } from '../../dtos/CarDTO';
import { Car as ModelCar} from '../../databases/model/Cars'
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';
import { api } from '../../services/api';
import  { useNetInfo } from '@react-native-community/netinfo';



interface Params {
    car: ModelCar
}

export function CarDetails() {
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO)

    const theme = useTheme();
    const netInfo = useNetInfo();

    const scrollY = useSharedValue(0)
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y
        console.log(event.contentOffset.y)
    })

    const headerStyleAnimation = useAnimatedStyle(() => {
        return {
            height: interpolate(
                scrollY.value,
                [0, 200],
                [200, 70],
                Extrapolate.CLAMP
            )
        }
    })

    const sliderCarsStyleAnimation = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, 150],
                [1, 0],
                Extrapolate.CLAMP
            )
        }
    })

    const route = useRoute()
    const { car } = route.params as Params;

    const navigation = useNavigation();

    function handleConfirmRental(){
        navigation.navigate("Scheduling", {
            car
        })
    }

    function handleBack(){
        navigation.goBack()
    }

    useEffect(() => {
        async function fetchCarUpdated() {
            const response = await api.get(`cars/${car.id}`)
            setCarUpdated(response.data)
        }

        if (netInfo.isConnected) {
            fetchCarUpdated()
        }
    }, [netInfo.isConnected])


return (
    <Container>
        <StatusBar barStyle="dark-content" translucent backgroundColor={"transparent"}/>
        <Animated.View
            style={[headerStyleAnimation, styles.header, { backgroundColor: theme.colors.background_seondary}]}
        >
        <Header>
            <BackButton onPress={handleBack}/>
        </Header>
        

        <Animated.View style={sliderCarsStyleAnimation}>
            <ImageSlider imagesUrl={
                !!carUpdated.photos ?
                carUpdated.photos : [{id: car.thumbnail, photo: car.thumbnail}]
            }/>
        </Animated.View>
        </Animated.View>

        <Animated.ScrollView
            contentContainerStyle={{
                paddingHorizontal: 24,
                paddingVertical: getStatusBarHeight() + 160,
                
            }}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
        >
            <Details>
                <Description>
                    <Brand>{car.brand}</Brand>
                    <Name>{car.name}</Name>
                </Description>

                <Rent>
                    <Period>{car.period}</Period>
                    <Price>{`R$ ${
                        netInfo.isConnected === true ? car.price : '...'
                    }`}</Price>
                </Rent>
            </Details>

          {
              carUpdated.accessories &&
                <Accessories>
                {
                    carUpdated.accessories.map(accesory => (
                        <Accessory 
                            key={accesory.type}
                            name={accesory.name}
                            icon={getAccessoryIcon(accesory.type)}
                        />
                    ))
                }
            </Accessories>
          }

            <About>
            {car.about}
            </About>
        </Animated.ScrollView>

        <Footer>
            <Button title={'Escolher período do aluguel'} onPress={handleConfirmRental} enabled={netInfo.isConnected === true}/>

            {
                netInfo.isConnected === false &&
                <OfflineInfo>
                    Conect-se a internet para ver mais detalhes e agendar seu carro
                </OfflineInfo>
            }
        </Footer>

    </Container>
  );
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        overflow: "hidden",
        zIndex: 1,
    },
})