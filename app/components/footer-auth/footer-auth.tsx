import React from "react";
import styles from "./footer-auth-style"
import {Text, TouchableOpacity, View} from "react-native";
import {ButtonBase} from "../button-base/button-base";

type FooterAuthProps = {
    preset: string,
    title?: string
    loading?: boolean
    text?: string
    actionText: string
    onPress(): void
    onPressText(): void
}

export function FooterAuth(props: FooterAuthProps) {
    return (
        <View>
            <View style={styles.BUTTON_CONTAINER}>
                <ButtonBase title={props.title} loading={props.loading} onPress={()=>props.onPress()} preset={props.preset}/>
            </View>

            <View style={styles.TEXT_CONTAINER}>
                <Text style={styles.TEXT}>{props.text}</Text>
                <TouchableOpacity style={styles.TOUCHABLE} onPress={()=>props.onPressText()}>
                    <Text style={styles.ACTION_TEXT}>{props.actionText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}