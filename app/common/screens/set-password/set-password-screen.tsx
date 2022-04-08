import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {StatusBar, View, Keyboard} from 'react-native';
import  {Text, TextField, Icon, Button, Screen} from '../../components';
import styles from './set-password-style';
import {StackActions, useNavigation} from "@react-navigation/native";
import {ButtonBase} from "../../components/button-base/button-base";


export const SetPasswordScreen = observer(function SetPasswordScreen( ) {
    const [Password, setPassword] = useState("")
    const [PasswordError, setPasswordError] = useState("")
    const [PasswordConfirm, setPasswordConfirm] = useState("")
    const [PasswordConfirmError, setPasswordConfirmError] = useState("")
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
        if(Password !== "" && PasswordConfirm !== ""){
            setPasswordConfirmError(PasswordConfirm !== Password ?"Passwords mismatch" : "")
            // if(Password.length < 8 ){
            //     errors.push("")
            // }
        }else{
            setPasswordError("")
            setPasswordConfirmError("")
        }
        setisValid(PasswordConfirmError  === "" && PasswordError === "")
    }

    useEffect(() => {
        validateForm()
    }, [PasswordConfirm, Password])

    return (
        <Screen style={styles.ROOT} preset="scroll" statusBar={"dark-content"} showHeader={false}>
            <View style={styles.MAIN_CONTAINER}>
                <View style={{ height:"20%"}}/>

                <Text style={styles.TITLE}>Set a new password</Text>
                <Text style={styles.SUB_TITLE}>Password must be at least 8 characters long and can't
                    be things like"password", "12345678" or "abcdefgh"</Text>

                <TextField style={[{width: "100%", marginTop:30, }]}
                           value={Password}
                           secureTextEntry={true}
                           errorText={PasswordError || null}
                           label="password"
                           onChangeText={text => setPassword(text)}
                           keyboardType={"default"}
                           autoCapitalize={"none"}
                           returnKeyType="done"
                />

                <TextField style={[{width: "100%", marginTop:30, }]}
                           value={PasswordConfirm}
                           secureTextEntry={true}
                           label="password confirm"
                           errorText={PasswordConfirmError || null}
                           onChangeText={text => setPasswordConfirm(text)}
                           keyboardType={"default"}
                           autoCapitalize={"none"}
                           returnKeyType="done"
                />
                {/*<TextField style={[{width: "100%", marginTop:30, }]}*/}
                {/*           value={PasswordConfirm}*/}
                {/*           secureTextEntry={true}*/}
                {/*           label="confirm password"*/}
                {/*           onChangeText={text => setPasswordConfirm(text)}*/}
                {/*           keyboardType={"default"}*/}
                {/*           autoCapitalize={"none"}*/}
                {/*           returnKeyType="done"*/}
                {/*/>*/}
                <View style={{width: "100%", marginBottom:65, marginTop: 100, alignSelf:"center"}}>
                    {(!keyboardShow || true) && (
                        <ButtonBase title="sign in" onPress={()=>{
                            navigation.dispatch(StackActions.replace('login'))
                        }} preset={isValid?"primary":"disabled"}/>
                    )}

                </View>
            </View>
        </Screen>
    )
})
