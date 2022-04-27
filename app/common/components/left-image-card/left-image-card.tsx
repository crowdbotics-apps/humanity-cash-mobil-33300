import React from "react"
import {Image, ImageSourcePropType, Modal, StyleProp, TextStyle, TouchableOpacity, View} from "react-native"
import styles from "./left-image-card-styles"
import { Text } from "../text/text"
import {COLOR} from "../../theme";
import {Icon} from "../icon/icon";

type LeftImageCardProps = {
    title: string,
    style?: StyleProp<TextStyle>
    description?: string
    source: ImageSourcePropType
    showRightIcon?:Boolean
    onPress(): void
}

export function LeftImageCard(props: LeftImageCardProps) {

    return (
        <TouchableOpacity style={[styles.CARD_CONTAINER, props.style]} onPress={()=>{props.onPress()}}>
            <View style={{ flexDirection:"column"}}>
                <View style={{display:"flex", flexDirection:"row"}}>
                    <Image source={props.source} style={[styles.CARD_IMAGE,{alignSelf:"center"}]} />
                    <Text style={[styles.CARD_HEADER_TEXT, {
                        width: props.showRightIcon?"83%":"86%"
                    }]}>{props.title}</Text>
                </View>
                {props.description &&(
                    <View style={{ marginTop:8}}>
                        <Text style= {{fontSize: 16, color: COLOR.PALETTE.marina_dark}}>{props.description}</Text>
                    </View>
                )}
            </View>
            {props.showRightIcon &&(
                <>
                    <View style={styles.FORWARD_CONTAINER}>
                        <Icon style={styles.FORWARD_ICON} icon={"forward"}/>
                    </View>
                </>
            )}

        </TouchableOpacity>
    )
}
