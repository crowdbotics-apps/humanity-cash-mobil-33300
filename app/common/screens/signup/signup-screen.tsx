import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StatusBar, View, Keyboard } from 'react-native';
import {
  Text,
  TextField,
  Icon,
  Button,
  Screen,
  Checkbox,
} from '../../components';
import styles from './signup-style';
import { StackActions, useNavigation } from '@react-navigation/native';
import { ButtonBase } from '../../components/button-base/button-base';
import { TouchableOpacity } from 'react-native';
import { COLOR, IMAGES, TYPOGRAPHY } from '../../theme';
import { FooterAuth } from '../../components/footer-auth/footer-auth';
import { LeftImageCard } from '../../components/left-image-card/left-image-card';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {isEmpty} from 'lodash'
import {useStores} from "../../models";
import {runInAction} from "mobx";
import {notifyMessage, processApiResult} from "../../utils/helpers";
import {keys as getKeys} from "lodash"
import {useLoginStore, useUserApi} from "../../utils/custom_hooks";
interface SignupFields {
  email: string;
  password: string;
  password_confirm: string;
  phone_number: string;
  name: string;
}

const INITIAL_VALUES = {
  email: '',
  password: '',
  password_confirm: '',
  phone_number: '',
  name: ''
}

const SignupSchema = Yup.object().shape({
  phone_number: Yup.number().required('Required'),
  password: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password_confirm: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  name: Yup.string().required('Required'),
});

export const SignupScreen = observer(function SignupScreen() {
  const navigation = useNavigation()
  const userApi = useUserApi()
  const [AcceptTerms, setAcceptTerms] = useState(false)
  const [Loading,setLoading] = useState(false)
  const [errors, setErrors] = useState<SignupFields>(INITIAL_VALUES)
  const loginStore = useLoginStore()

  // const [keyboardStatus, setKeyboardStatus] = useState(true)

  // useEffect(() => {
  //   const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
  //     setKeyboardStatus(true)
  //   })
  //   const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
  //     setKeyboardStatus(false)
  //   })
  //
  //   return () => {
  //     showSubscription.remove()
  //     hideSubscription.remove()
  //   }
  // }, [])
  //


  const onAccept = () => {
    setAcceptTerms(!AcceptTerms)
  }

  const onSuccess = (result:any)=>{
    runInAction(() => {
      loginStore.setUser(result.response)
      loginStore.setApiToken(result.response.token.access)
      loginStore.setRegistered(true)
    })
    setLoading(false)
    navigation.navigate("userStatus")
  }
  const onBadData = (result:any)=>{
    setErrors(result.errors)
    setLoading(false)
  }

  const onError = ()=>{
    setLoading(false)
  }


  const submit = (values:any)=>{
    setLoading(true)
    userApi.userRegister(values).then(result => {
      processApiResult(result, onSuccess, onBadData, onError)
    }).catch(reason => {
      console.log(reason)
      setLoading(false)
    })
  }

  const doSignUp = (validateForm:any, handleSubmit:any)=>{
    // navigation.navigate({ key: 'primaryStack' })
    validateForm().then((result:any) => {
      setErrors(result)
      if(isEmpty(result)){
        handleSubmit()
      }
    });

  }

  return (
    <Screen
      style={styles.ROOT}
      preset='scroll'
      statusBar={'dark-content'}
      showHeader={false}
    >
      <View style={styles.MAIN_CONTAINER}>
        <View style={{ marginTop: '20%' }} />
        <View style={{ flexDirection: 'column', display: 'flex' }}>
          <Text style={styles.TITLE}>Create your account</Text>
        </View>

        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={SignupSchema}
            onSubmit={values =>  submit(values)}
            // validate={values => {
            //   console.log('VALIDATE', values)
            // }}
          >


            {
              ({
              validateForm,
              handleSubmit,
              handleChange,
              values,
            }) => (
              <>
                <TextField
                  style={[{ width: '100%', marginTop: 30 }]}
                  value={values.name}
                  label='username'
                  errorText={errors.name ? errors.name : null}
                  onChangeText={handleChange('name')}
                  keyboardType={'default'}
                  autoCapitalize={'none'}
                  returnKeyType='done'
                />

                <TextField
                  style={[{ width: '100%', marginTop: 10 }]}
                  value={values.email}
                  label='email'
                  errorText={errors.email ? errors.email : null}
                  onChangeText={handleChange('email')}
                  keyboardType={'email-address'}
                  autoCapitalize={'none'}
                  returnKeyType='done'
                />

                <TextField
                  style={[{ width: '100%', marginTop: 10 }]}
                  value={values.phone_number}
                  label='phone number'
                  errorText={errors.phone_number ? errors.phone_number : null}
                  onChangeText={handleChange('phone_number')}
                  keyboardType={'phone-pad'}
                  autoCapitalize={'none'}
                  returnKeyType='done'
                />

                <TextField
                  style={[{ width: '100%', marginTop: 10 }]}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  secureTextEntry={true}
                  label='password'
                  errorText={errors.password ? errors.password : null}
                  keyboardType={'default'}
                  autoCapitalize={'none'}
                  returnKeyType='done'
                />

                <TextField
                  style={[{ width: '100%', marginTop: 10 }]}
                  value={values.password_confirm}
                  secureTextEntry={true}
                  label='password confirm'
                  errorText={
                    errors.password_confirm ? errors.password_confirm : null
                  }
                  keyboardType={'default'}
                  onChangeText={handleChange('password_confirm')}
                  autoCapitalize={'none'}
                  returnKeyType='done'
                />

                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                  <View style={{ margin: 10, alignSelf: 'center' }}>
                    <Checkbox
                      textLabel={false}
                      fillStyle={{ width: 15, height: 15 }}
                      outlineStyle={{
                        borderColor: COLOR.PALETTE.gray,
                        width: 22,
                        height: 22,
                      }}
                      value={AcceptTerms}
                      onToggle={() => {
                        onAccept()
                      }}
                    />
                  </View>

                  <View style={[styles.TEXT_CONTAINER, { width: '85%' }]}>
                    <View>
                      <Text style={[styles.TEXT]}>I accept </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => alert('not implemented yet!!!')}
                    >
                      <Text style={[styles.ACTION_TEXT]}>
                        The Privacy Policy
                      </Text>
                    </TouchableOpacity>
                    <View>
                      <Text style={[styles.TEXT]}> and </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => alert('not implemented yet!!!')}
                    >
                      <Text style={[styles.ACTION_TEXT]}>Terms & </Text>
                    </TouchableOpacity>
                    <View style={{ flexGrow: 1 }} />
                    <TouchableOpacity
                      style={[]}
                      onPress={() => alert('not implemented yet!!!')}
                    >
                      <Text style={[styles.ACTION_TEXT]}> Conditions </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <LeftImageCard
                  source={IMAGES.icon_paper_plane}
                  style={{ height: 75, marginBottom: 40 }}
                  showRightIcon={false}
                  title='Send your friends a magic link to join our community'
                  onPress={() => alert('not implemented yet!!!')}
                />
                <FooterAuth
                  onPress={() => doSignUp(validateForm, handleSubmit)}
                  loading={Loading}
                  text='Already have an account?'
                  actionText='sign in'
                  onPressText={() => navigation.navigate('login')}
                  title='sign up'
                  preset={AcceptTerms ? 'primary' : 'disabled'}
                />
              </>
            )}
          </Formik>
        </View>
      </View>
      <View style={{ display: 'flex', flexGrow: 1 }} />
    </Screen>
  )
})
