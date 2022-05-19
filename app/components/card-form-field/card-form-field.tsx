import * as React from "react"
import {StyleProp, View, ViewStyle} from "react-native"
import {COLOR} from "../../theme";
import styles from "./card-field-style";
import {Text} from "../text/text";
import {FormRowPresets} from "../form-row/form-row.presets";

interface CardFieldProps {
    label: string
    text: string
    containerStyle?: StyleProp<ViewStyle>
    textContainerStyle?: StyleProp<ViewStyle>
}


export function CardFormField(props: CardFieldProps) {

    return (
        <View style={[styles.CONTAINER, props.containerStyle]}>
            <View  style={[styles.TEXT_CONTAINER, props.textContainerStyle]}>
                <Text style={{fontSize: 14, color: COLOR.PALETTE.dark_gray}}>{props.label}</Text>
                <Text style={{fontSize: 18, color: COLOR.PALETTE.marina_dark}} >{props.text}</Text>
            </View>
        </View>)
}
