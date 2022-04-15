import {ImageStyle, StyleProp, TextStyle, ViewStyle} from "react-native";

export interface SearchbarProps {
    value?: string

    placeholder?:string

    showCloseIcon?: boolean
    /**
     * An optional style override useful for the text field.
     */
    textStyle?: StyleProp<TextStyle>
    /**
     * An optional style override useful for the left button icon.
     */
    iconLeftStyle?: StyleProp<ImageStyle>
    /**
     * An optional style override useful for the right button icon.
     */
    iconRightStyle?: StyleProp<ImageStyle>
    /**
     * An optional style for the component
     */
    style?: StyleProp<ViewStyle>

    onPressSearchIcon?():any

    onPressCloseIcon?():any

    onChangeText(txt: string):any
}
