import {Icon} from "../icon/icon";
import React from "react";
import styles from "./button-icon-style"
import {ImageStyle, StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewStyle} from "react-native";
import {IconTypes} from "../icon/icons";

type ButtonIconProps = {
    containerStyle?: StyleProp<ViewStyle>
    style?: StyleProp<ImageStyle>
    touchableStyle?: StyleProp<ViewStyle>
    icon: IconTypes
    onPress(): void
}

export function ButtonIcon(props: ButtonIconProps) {
    return (
        <TouchableOpacity style={[styles.TOUCHABLE, props.touchableStyle]} onPress={props.onPress}>
            <Icon icon={props.icon}
                  style={[styles.ICON, props.style]}
                  containerStyle={[styles.ICON_CONTAINER, props.containerStyle]}/>
        </TouchableOpacity>
    )
}