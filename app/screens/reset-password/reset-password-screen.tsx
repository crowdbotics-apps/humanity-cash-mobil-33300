import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {StatusBar, View, Keyboard} from 'react-native';
import  {Text, TextField, Icon, Button, Screen} from '../../components';
import styles from './reset-password-style';
import {StackActions, useNavigation} from "@react-navigation/native";
import {ButtonBase} from "../../components/button-base/button-base";
import {TouchableOpacity} from "react-native";
import {COLOR, TYPOGRAPHY} from "../../theme";
import {FooterAuth} from "../../components/footer-auth/footer-auth";

export const ResetPasswordScreen = observer(function ResetPasswordScreen( ) {
    const [Email, setEmail] = useState("")
    const navigation = useNavigation()
    const [keyboardShow, setkeyboardShow] = useState(false)
    const [isValid, setisValid] = useState(true)

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

    const validateForm = ()=>{
        setisValid(!!Email)
    }
    useEffect(() => {
        validateForm()
    }, [Email])

    return (
        <Screen style={styles.ROOT} preset="scroll" showHeader={false}>
            <View style={styles.MAIN_CONTAINER}>
                <View style={{marginTop: "65%"}}/>
                <View style={{flexDirection:"column", display: "flex"}}>
                    <Text style={styles.TITLE}>Reset your password</Text>
                    <Text style={styles.SUB_TITLE}>Enter your email to reset your password</Text>
                </View>
                <View style={{display:"flex", flexDirection:"column", marginTop: 10}}>
                    <TextField style={[{width: "100%"}]}
                               value={Email}
                               label="email"
                               onChangeText={text => setEmail(text)}
                               keyboardType={"email-address"}
                               autoCapitalize={"none"}
                               returnKeyType="done"
                    />

                </View>

            </View>
            <View style={{display: "flex", flexGrow:1, marginTop:20}}/>

            {!keyboardShow && (
                <FooterAuth onPress={()=>navigation.navigate("checkEmail", {Email:Email})} text="Never mind"
                            actionText="go back" onPressText={()=>navigation.navigate("login")}
                            title="reset password"
                            preset={isValid?'primary':'disabled'}
                />
            )}
        </Screen>
    )
})
