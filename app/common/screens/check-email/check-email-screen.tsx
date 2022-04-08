import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {StatusBar, View, Keyboard, Modal, Image} from 'react-native';
import  {Text, TextField, Icon, Button, Screen} from '../../components';
import styles from './check-email-style';
import {StackActions, useNavigation} from "@react-navigation/native";
import {TouchableOpacity} from "react-native";
import {COLOR, IMAGES, TYPOGRAPHY} from "../../theme";
import {FooterAuth} from "../../components/footer-auth/footer-auth";
import {CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell} from "react-native-confirmation-code-field";

export const CheckEmailScreen = observer(function CheckEmailScreen( {route}) {
    const navigation = useNavigation()
    const [keyboardShow, setkeyboardShow] = useState(false)
    const [OtpModalVisible, setOtpModalVisible] = useState(false)
    const [Loading, setLoading] = useState(false)
    const { Email } = route.params;

    // OTP code
    const [value, setValue] = useState("")
    const ref = useBlurOnFulfill({value, cellCount: 4})
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue
    })

    const _keyboardDidShow = () => setkeyboardShow(true)
    const _keyboardDidHide = () => setkeyboardShow(false)

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow)
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide)

        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow)
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide)
        };
    }, [])


    const verifyOTP = () => {
        Keyboard.dismiss()
        setLoading(true)
        setLoading(false)
        navigation.navigate('setPassword')
        // loginStore.environment.api.verifyOtp({otp: value}).then(result => {
        //     setLoading(false)
        //     if (result.kind === "ok") {
        //         resetPasswordModalPress()
        //     } else if (result.kind === "bad-data") {
        //         notifyMessage(result.errors)
        //     } else {
        //         notifyMessage(null)
        //     }
        // })
    }


    return (
        <Screen style={styles.ROOT} preset="scroll" showHeader={false}>
            <View style={styles.MAIN_CONTAINER}>
                <View style={{marginTop: "60%"}}/>
                <View style={{flexDirection:"column", display: "flex"}}>
                    <Text style={styles.TITLE}>Check your email</Text>
                    <Text style={styles.SUB_TITLE}>We have sent  you a password recover instructions to your email</Text>
                </View>
                <View style={{display:"flex", flexDirection:"column", marginTop: 10}}>

                </View>

            </View>
            <View style={{display: "flex", flexGrow:1}}/>

            {!keyboardShow && (
                <FooterAuth onPress={()=>{
                    setOtpModalVisible(true)
                }} text="Did not recive the email?"
                            actionText="try again" onPressText={()=>navigation.navigate("resetPassword", {Email: Email})}
                            title="enter token"
                            preset={'primary'}
                />
            )}


            {/* OTP modal*/}
            <Modal
                hardwareAccelerated
                animationType={"fade"}
                transparent={true}
                visible={OtpModalVisible}
                statusBarTranslucent
            >
                <View style={[styles.MODAL_BODY,{  height: "90%"}]}>
                    <Image source={IMAGES.logoHeader} style={styles.MARINA_LOGO}/>
                    <View style={styles.FIRST_TITLE_MODAL}>
                        <Text style={{fontSize:24,    color: COLOR.PALETTE.marina_dark}}>Token Verification</Text>
                    </View>
                    <Text style={styles.CODE_INPUT_TEXT}>
                        Please type the token verification code sent to: <Text style={{color: COLOR.PALETTE.marina_dark}}>{Email}</Text>
                    </Text>
                    <View style={styles.FORM_CONTAINER}>
                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            onChangeText={setValue}
                            cellCount={4}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({index, symbol, isFocused}) => (
                                <View
                                    onLayout={getCellOnLayoutHandler(index)}
                                    key={index}
                                    style={[styles.cellRoot, isFocused && styles.focusCell]}>
                                    <Text style={styles.cellText}>
                                        {symbol || (isFocused ? <Cursor/> : null)}
                                    </Text>
                                </View>
                            )}
                        />
                        <TouchableOpacity style={{alignSelf:"center"}} onPress={()=>{
                            alert("not implemented yet")
                        }}>
                            <Text style={{color:COLOR.PALETTE.marina_dark}}>resend code</Text>
                        </TouchableOpacity>

                        <View style={styles.CANCEL_CONFIRM_BUTTON_CONTAINER}>
                            <Button
                                text={"CANCEL"}
                                textStyle={{fontSize: 16}}
                                style={{marginTop: 15, borderRadius: 8, height: 40, width: "45%"}}
                                preset={"secondary"}
                                loading={Loading}
                                onPress={() =>  {
                                    setOtpModalVisible(false)
                                    // forgotPasswordModalPress()
                                }}
                            />
                            <Button
                                textStyle={{fontSize: 16}}
                                text={"CONTINUE"}
                                style={{marginTop: 15, borderRadius: 8, height: 40, width: "45%"}}
                                disabled={value === ""}
                                preset={value === "" ? "disabled" : "primary"}
                                loading={Loading}
                                onPress={() => {
                                    verifyOTP()
                                }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

        </Screen>
    )
})
