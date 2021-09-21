import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { Feather } from '@expo/vector-icons';
import { TextInputProps } from 'react-native';


import {
Container,
InputText,
IconContainer,
ChangeVisibilityButton
} from './styles';


interface InputProps extends TextInputProps {
    iconName: React.ComponentProps<typeof Feather>['name'];
    value?: string;
}

export function InputPassword({
    iconName,
    value,
    ...rest
} : InputProps ) {
    const [isVisible, setIsVisible] = useState(false)
    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const theme = useTheme();

    function handleInputFocus() {
        setIsFocused(true)
    }

    function handleInputBlur() {
        setIsFocused(false)
        setIsFilled(!!value)
    }

    const handleShowPassword = () => {
        setIsVisible(!isVisible);
    }

return (
    <Container >
        <IconContainer isFocused={isFocused}>
        <Feather
            name={iconName}
            size={24}
            color={isFocused || isFilled ? theme.colors.main : theme.colors.text_detail}
        />
        </IconContainer>

        <InputText {...rest} 
            secureTextEntry={isVisible}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            isFocused={isFocused}
            autoCorrect={false}
        />

        <ChangeVisibilityButton onPress={handleShowPassword}>
            <IconContainer  isFocused={isFocused}>
            <Feather
                name={isVisible ?  "eye" : 'eye-off'}
                size={24}
                color={theme.colors.text_detail}
            />
        </IconContainer>
        </ChangeVisibilityButton>
    </Container>
  );
}