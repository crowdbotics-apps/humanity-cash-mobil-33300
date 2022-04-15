import React from "react"
import {KeyboardTypeOptions, View} from "react-native"
import styles from "./text-field-row-styles"
import { Text } from "../text/text"
import {TextField} from "../text-field/text-field";

type TextFieldRowProps = {
    label: string
    placeholder: string
    value: string
    keyboardType?:  KeyboardTypeOptions | undefined;
    onchangeText(text: string): void
    onBlur(aux: any): void
    errorText?:string
}



export function TextFieldRow(props: TextFieldRowProps) {


    return (
        <View style={[styles.FORM_CONTAINER, {flexDirection:"row"}]}>
            <View style={{width: "20%", alignSelf:"center", marginTop:10 }}>
                <Text style={{ fontWeight: "bold"}}>{props.label}</Text>
            </View>
            <View style={{width: "75%"}}>
                <TextField style={[styles.TEXT_FIELD, {width: "100%"}]}
                           value={props.value}
                           label={props.placeholder}
                            errorText={props.errorText}
                           onBlur={(aux)=>{
                               // console.log("onblur", aux)
                               if(props.onBlur)
                                props.onBlur(aux)
                           }}
                           onChangeText={text => {
                               props.onchangeText(text)
                           }}
                           keyboardType={props.keyboardType ? props.keyboardType : "default"}
                           autoCapitalize={"none"}
                           returnKeyType="done"
                />
            </View>
        </View>
    )
}
