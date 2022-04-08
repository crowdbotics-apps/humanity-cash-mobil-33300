import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {TouchableOpacity, View} from 'react-native';
import {Screen, Text, TextField} from '../../components';
import styles from './login-style';
import {useNavigation} from "@react-navigation/native";
import {FooterAuth} from "../../components/footer-auth/footer-auth";
import {processApiResult} from "../../utils/helpers";
import {useLoginStore, useUserApi} from "../../utils/custom_hooks";
import {runInAction} from "mobx";
import {USER_PROFILE} from "../../models/login-store/login-store";


export const LoginScreen = observer(function LoginScreen( ) {
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [errors, setErrors] = useState<{email:string, password:string}| any>({})
    const navigation = useNavigation()
    const [isValid, setisValid] = useState(true)
    const [Loading, setLoading] = useState(false)
    const loginStore = useLoginStore()
    const userApi = useUserApi()

    useEffect(() => {
        if (loginStore.id){
            if(loginStore.hasProfile){
                navigation.navigate("home")
            }else{
                navigation.navigate("userStatus")
            }
        }

    }, [])

    const validateForm = ()=>{
        setisValid(!!Email && !!Password)
    }

    const onSuccess = (result:any)=>{
        runInAction(() => {
            loginStore.setUser(result.response)
            loginStore.setApiToken(result.response.token.access)
            loginStore.setRegistered(true)
        })

        if(loginStore.hasProfile){
            navigation.navigate("home")
        }else{
            navigation.navigate("userStatus")
        }
    }

    const onBadData = (result:any)=>{
        setErrors(result.errors)
        setLoading(false)
    }

    const onError = ()=>{
        setLoading(false)
    }

    const submit = ()=>{
        userApi.login({email: Email, password: Password}).then(result => {
            processApiResult(result, onSuccess, onBadData, onError)
        }).catch(reason => {
            setLoading(false)
        })
    }


    useEffect(() => {
        validateForm()

    }, [Email, Password])

    return (
        <Screen style={styles.ROOT} preset="scroll" statusBar={"dark-content"} showHeader={false}>
            <View style={styles.MAIN_CONTAINER}>
                <View style={{marginTop: "50%"}}/>
                <View style={{flexDirection:"column", display: "flex"}}>
                    <Text style={styles.TITLE}>Welcome back!!!</Text>
                </View>
                <View style={{display:"flex", flexDirection:"column"}}>
                    <TextField style={[{width: "100%", marginTop:30}]}
                               value={Email}
                               label="email"
                               errorText={errors.email? errors.email : undefined}
                               onChangeText={text => setEmail(text)}
                               keyboardType={"email-address"}
                               autoCapitalize={"none"}
                               returnKeyType="done"
                    />

                    <TextField style={[{width: "100%", marginTop:30}]}
                               value={Password}
                               secureTextEntry={true}
                               label="password"
                               errorText={errors.password? errors.password : undefined}
                               onChangeText={text => setPassword(text)}
                               keyboardType={"default"}
                               autoCapitalize={"none"}
                               returnKeyType="done"
                    />
                    <TouchableOpacity style={{marginTop:20,   alignSelf:"flex-end",}} onPress={()=>{
                        navigation.navigate("resetPassword")
                    }}>
                        <Text style={styles.FORGOT_PASSWORD} >Forgot password?</Text>
                    </TouchableOpacity>

                </View>
                <View style={{marginTop: "50%"}}/>


            </View>

                <View style={{width: "100%"}}>
                    <FooterAuth onPress={()=>submit()}
                                title="sign in" text="Don’t have an account?"
                                actionText="sign up" onPressText={()=>navigation.navigate("signup")}
                                preset={isValid?'primary':'disabled'}
                    />
                </View>


        </Screen>
    )
})
