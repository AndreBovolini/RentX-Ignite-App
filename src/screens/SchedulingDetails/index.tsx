import React, { useEffect, useState } from 'react';
import { Accessory } from '../../components/Accessory';
import { BackButton } from '../../components/BackButton';
import { Feather } from '@expo/vector-icons'
import { ImageSlider } from '../../components/ImageSlider';
import { useNavigation, useRoute } from '@react-navigation/native'
import { format } from 'date-fns'
import { Alert } from 'react-native'
import  { useNetInfo } from '@react-native-community/netinfo';


import {
Container,
Header,
CarImages,
Content,
Details,
Description,
Brand,
Name,
Rent,
Period,
Price,
Accessories,
Footer,
RentalPeriod,
CalendarIcon,
DateInfo,
DateTitle,
DateValue,
RentalPrice,
RentalPriceLabel,
RentalPriceDetail,
RentalPriceQuota,
RentalPriceTotal,
} from './styles';
import { Button } from '../../components/Button';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { CarDTO } from '../../dtos/CarDTO';
import { getAccessoryIcon } from '../../utils/getAccessoryIcon';
import { getPlatformDate } from '../../utils/getPlatformDate';
import { api } from '../../services/api';

interface Params {
    car: CarDTO
    dates: string[];
}

interface RentalPeriod {
    start: string;
    end: string;
}

export function SchedulingDetails() {
    const [loading, setLoading] = useState(false)
    const [rentalPeriod, setRentalPeriod] = useState<RentalPeriod>({} as RentalPeriod)
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO)

    const theme = useTheme()

    const route = useRoute()
    const { car, dates } = route.params as Params;

    const rentTotal = Number(dates.length * car.price)

    const navigation = useNavigation();
    const netInfo = useNetInfo();

    async function handleConfirmRental(){
        setLoading(true)

        console.warn(car.id, new Date(dates[0]),new Date(dates[dates.length - 1]),rentTotal)

        await api.post(`rentals`, {
            user_id: 1,
            car_id: car.id,
            startDate: new Date(dates[0]),
            endDate: new Date(dates[dates.length - 1]),
            total: rentTotal
        }).then(() => navigation.navigate("Confirmation", {
            nextScreenRoute: "Home",
            title: 'Carro Alugado!',
            message: `Agora você só precisa ir\naté a concessionária da RENTX\npegar o seu automóvel`
        }))
        .catch((error) => {setLoading(false); console.warn(error)
            
    })
    }

    function handleBack(){
        navigation.goBack()
    }

    useEffect(() => {
        setRentalPeriod({
            start: format(getPlatformDate(new Date(dates[0])), 'dd/MM/yyyy'),
            end: format(getPlatformDate(new Date(dates[dates.length - 1])), 'dd/MM/yyyy')
        })
    }, [])

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
        <Header>
            <BackButton onPress={handleBack}/>
        </Header>

        <CarImages>
            <ImageSlider imagesUrl={
                !!carUpdated.photos ?
                carUpdated.photos : [{id: car.thumbnail, photo: car.thumbnail}]
            }/>
        </CarImages>

        <Content>
            <Details>
                <Description>
                    <Brand>{car.brand}</Brand>
                    <Name>{car.name}</Name>
                </Description>

                <Rent>
                    <Period>{car.period}</Period>
                    <Price>{car.price}</Price>
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

            <RentalPeriod>
                <CalendarIcon>
                    <Feather 
                    name='calendar'
                    size={RFValue(24)}
                    color={theme.colors.shape}
                    />
                </CalendarIcon>

                <DateInfo>
                    <DateTitle> De </DateTitle>
                        <DateValue>
                            {rentalPeriod.start}
                        </DateValue>
                   
                </DateInfo>

                <Feather
                name='chevron-right'
                size={RFValue(10)}
                color={theme.colors.text}
                />

                <DateInfo>
                    <DateTitle>Até</DateTitle>
                        <DateValue> 
                           {rentalPeriod.end}
                        </DateValue>
                    
                </DateInfo>

            </RentalPeriod>

            <RentalPrice>
                <RentalPriceLabel>Total</RentalPriceLabel>
                <RentalPriceDetail>
                    <RentalPriceQuota>{`R$ ${car.price} x${dates.length} diárias`}</RentalPriceQuota>
                    <RentalPriceTotal>{`R$ ${rentTotal}`}</RentalPriceTotal>
                </RentalPriceDetail>
            </RentalPrice>


        </Content>

        <Footer>
            <Button title={'Alugar agora'} onPress={handleConfirmRental} color={theme.colors.success} loading={loading} enabled={!loading}/>
        </Footer>

    </Container>
  );
}