import React, {useEffect, useState} from "react"
import {Image, Modal, ScrollView, TouchableOpacity, View} from "react-native"
// import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "../../screens/settings-styles"
import { IMAGES } from "../../theme/images"
import { Text } from "../text/text"
import { Button } from "../button/button"
import {COLOR, TYPOGRAPHY} from "../../theme"
import {Icon} from "../icon/icon";

type ModalSelectortProps = {
    action: any
    options: any
    title: string
    value: boolean
    visible: boolean
    displaySelector: boolean
    setVisible: any
    required?:boolean
    onClose?(value:any): any
    onSelect?(value:any): any
    onPress?(): any

}

export function ModalSelector(props: ModalSelectortProps) {
    const [SelectedValue, setSelectedValue] = useState(null)

    useEffect(() => {
        if (props.value === null){
            setSelectedValue(null)
        }
    }, [props.value])

    return (
        <>
            {props.displaySelector === true && <TouchableOpacity style={styles.FEEDBACK_SELECTOR_CONTAINER} onPress={() => {
                if(props.onPress){
                    props.onPress()
                }
                props.setVisible(true)
            }}>
                <Text style={{color: SelectedValue === null ? COLOR.PALETTE.gray : COLOR.PALETTE.marina_dark,
                    fontSize: 14, fontFamily: TYPOGRAPHY.primary}}>{SelectedValue === null ? props.title : SelectedValue.title}</Text>
                <Icon icon={"down"} style={{width: 20, height: 35}} />
            </TouchableOpacity> }
            <Modal
                hardwareAccelerated
                animationType={"slide"}
                transparent={true}
                visible={props.visible}
                statusBarTranslucent
            >

                <View style={[styles.MODAL_BODY, {height: "90%"}]}>
                    <Image source={IMAGES.logoHeader} style={styles.LOGO_MODAL} />
                    <View style={styles.FIRST_TITLE_MODAL}>
                        <Text>{props.title}</Text>
                    </View>
                    <ScrollView style={[styles.FORM_CONTAINER, {marginTop: 10}]}>
                        {props.options.map(option => {
                            let itemColor = COLOR.PALETTE.marina_dark
                            // let backGroundColor = COLOR.PALETTE.background
                            if (SelectedValue && SelectedValue.id === option.id) {
                                itemColor = COLOR.PALETTE.primary

                                // backGroundColor = COLOR.PALETTE.white
                            }
                            return (
                                <TouchableOpacity
                                    key={"optiom-id-" + option.id}
                                    onPress={() => {
                                        if (props.onSelect){
                                            props.onSelect(props.value)
                                        }
                                        props.setVisible(false)
                                        setSelectedValue(option)
                                        props.action(option)
                                    }}


                                    style={{
                                        alignItems: "center",
                                        alignSelf:"center",
                                        borderWidth: 1,
                                        borderColor: itemColor,
                                        backgroundColor: COLOR.PALETTE.background,
                                        marginVertical: 5,
                                        padding: 5,
                                        width: "80%",
                                        height: 35,
                                        borderRadius: 5,
                                        // borderTopWidth:0,
                                        // borderRightWidth:0,
                                        // borderLeftWidth:0
                                    }}
                                >
                                    <Text style={{color: itemColor, fontSize: 14}}>{option.title}</Text>
                                    {option.description !== "" && <Text style={{color: itemColor, fontSize: 15,
                                        marginTop: 5, fontFamily: TYPOGRAPHY.primary}}>{option.description}</Text>}
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                    <View style={[styles.CANCEL_CONFIRM_BUTTON_CONTAINER, {flexDirection:"column-reverse"}]}>


                        <Button
                            style={{borderRadius:8, backgroundColor:COLOR.PALETTE.navy,  height: 20, padding: 0, marginTop:15, alignItems:"center"}}
                            text={"close"}
                            textStyle={{
                                fontFamily: TYPOGRAPHY.primary,
                                fontSize: 18,
                                paddingTop: 0,
                            }}
                            preset={'primary'}
                            onPress={() => {
                                if (props.onClose){
                                    props.onClose(props.value)
                                }
                                props.setVisible(false)
                            }}
                        />

                        {!props.required &&(
                            <Button
                                style={{borderRadius:8, height: 20, padding: 0, marginTop:15, alignItems:"center"}}
                                text={"clear"}
                                textStyle={{
                                    fontFamily: TYPOGRAPHY.primary,
                                    fontSize: 18,
                                    paddingTop: 0,
                                }}
                                // style={styles.BUTTON}
                                preset={'secondary'}
                                onPress={() => {
                                    if (props.onSelect){
                                        props.onSelect(props.value)
                                    }
                                    setSelectedValue(null)
                                }}
                            />

                        )}


                        {/*<Button*/}
                        {/*    style={{borderRadius:8, height: 20, padding: 0, marginTop:15, alignItems:"center"}}*/}
                        {/*    text={"select"}*/}
                        {/*    textStyle={{*/}
                        {/*      fontFamily: TYPOGRAPHY.primary,*/}
                        {/*      fontSize: 18,*/}
                        {/*      paddingTop: 0,*/}
                        {/*    }}*/}
                        {/*    // style={styles.BUTTON}*/}
                        {/*    preset={'primary'}*/}
                        {/*    onPress={() => {*/}
                        {/*      props.setVisible(false)*/}
                        {/*      props.action(SelectedValue)*/}
                        {/*    }}*/}
                        {/*/>*/}


                    </View>
                </View>
            </Modal>
        </>
    )
}
