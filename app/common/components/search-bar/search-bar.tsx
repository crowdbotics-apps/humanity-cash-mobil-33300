import {ImageStyle, StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle} from "react-native";
import {Icon} from "../icon/icon";
import * as React from "react";
import styles from "./searchbar-styles";
import {TextField} from "../text-field/text-field";
import {SearchbarProps} from "./searchbar-props";

export function SearchBar(props: SearchbarProps) {
    return (
        <View style={[styles.SEARCH_CONTAINER, props.style]}>
            <TouchableOpacity onPress={() => {
                if(props.onPressSearchIcon){
                    props.onPressSearchIcon()
                }
            }}>
                <Icon icon={"search"}  style={[styles.ICON_LEFT, props.iconLeftStyle]} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                <TextField
                    style={[{ fontSize: 16}, props.textStyle]}
                    label={props.placeholder || "search"}
                    value={props.value}
                    textInputStyle={{borderBottomWidth:0}}
                    onChangeText={(txt:string) =>props.onChangeText(txt)}
                    returnKeyType={"done"}
                />
            </View>
            {props.showCloseIcon && (
                <TouchableOpacity onPress={() => {
                    if(props.onPressCloseIcon){
                        props.onPressCloseIcon()
                    }
                }}>
                    <Icon icon={"close"} style={[styles.ICON_RIGHT, props.iconRightStyle]} />
                </TouchableOpacity>

            )}
        </View>
    )
}
