import React, {useEffect, useState} from "react"
import {ImageStyle, StyleProp, View} from "react-native"
import styles from "./select-field-row-styles"
// import { Text } from "../text/text"
import {ModalSelector} from "../modal-selector/modal-selector";
import {COLOR, TYPOGRAPHY} from "../../theme";
import {Text} from "../text/text";

type SelectFieldRowProps = {
    label: string
    placeholder: string
    errorText?: string
    value: any
    containerStyle?: StyleProp<ImageStyle>
    options:any
    required?:boolean
    action:any
    visible:boolean
    setVisible:any
    onBlur?(handler: any): any
    onPress?(): any

}



export function SelectFieldRow(props: SelectFieldRowProps) {
    const [ErrorText, setErrorText] = useState<null|string|undefined>(null)

    const onClose = (value:any)=>{
        if(props.required){
            setErrorText('Required')
        }
    }
    useEffect(() => {

    },[])

    const onSelect = (value:any)=>{
        setErrorText("")
    }
    return (
        <View style={[styles.FORM_CONTAINER, {flexDirection:"row", marginBottom: 30}, props.containerStyle]}>
            <View style={{width: "20%", alignSelf:"center", }}>
                <Text style={{ fontWeight: "bold"}}>{props.label}</Text>
            </View>
            <View style={{width: "75%"}}>
                <ModalSelector
                    onPress={props.onPress}
                    options={props.options}
                    required={props.required}
                    action={props.action}
                    title={props.placeholder}
                    value={props.value}
                    visible={props.visible}
                    onClose={onClose}
                    onSelect={onSelect}
                    setVisible={props.setVisible}
                    displaySelector
                />
                { props.errorText && (
                    <Text style={{
                        marginTop: 4,
                        fontFamily: TYPOGRAPHY.primaryLight,
                        fontSize: 11,
                        color: COLOR.PALETTE.angry
                    }}>{props.errorText}</Text>
                )}

            </View>


        </View>
    )
}
