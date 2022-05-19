import {Icon} from "../icon/icon";
import {TYPOGRAPHY} from "../../theme";
import {Button} from "../button/button";
import React from "react";
import styles from "./button-base-style"
import {StyleProp, ViewStyle} from "react-native";

type ButtonBaseProps = {
    preset: string,
    loading?: boolean
    title?: string
    containerStyle?: StyleProp<ViewStyle>
    onPress(): void
}

export function ButtonBase(props: ButtonBaseProps) {
        return <Button
            style={[styles.CONTAINER, props.containerStyle]}
            text={props.title? props.title: "continue"}
            loading={!!props.loading}
            iconRight={(
                <Icon
                    icon={"nextWhite"}
                    style={{height: 22}}
                />
            )}
            textStyle={styles.TEXT}
            preset={props.preset ||'primary'}
            onPress={() => {
                props.onPress()
            }}
        />;
}