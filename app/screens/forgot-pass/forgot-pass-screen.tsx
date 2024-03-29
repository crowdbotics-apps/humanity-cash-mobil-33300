import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, View, TouchableOpacity, Image, ScrollView, Alert, Platform } from "react-native"
import { Text, Button, Screen, Checkbox, TextInputComponent } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import Ionicons from "react-native-vector-icons/Ionicons"
import styles from "./forgot-pass-style"
import { COLOR, IMAGES } from "../../theme"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import { useStores } from "../../models"
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"

import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"

export const ForgotPassScreen = observer(function ForgotPassScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const isFocused = useIsFocused();

  const { loginStore } = rootStore

  const [Step, setStep] = useState("email")

  const [Username, setUsername] = useState("")

  // const [Pass, setPass] = useState("")
  // const [PassConfirm, setPassConfirm] = useState("")
  const [HidePass, setHidePass] = useState(true)
  const [HidePassConfirm, setHidePassConfirm] = useState(true)
  const [MatchPassword, setMatchPassword] = useState(true)
  const [PasswordError, setPasswordError] = useState(false)
  const [PasswordErrorMessage, setPasswordErrorMessage] = useState('')
  const [Token, setToken] = useState('')

  let CodeInp2, CodeInp3, CodeInp4, CodeInp5, CodeInp6
  const [Code1, setCode1] = useState("")
  const [Code2, setCode2] = useState("")
  const [Code3, setCode3] = useState("")
  const [Code4, setCode4] = useState("")
  const [Code5, setCode5] = useState("")
  const [Code6, setCode6] = useState("")

  const [Loading, setLoading] = useState(false)
  const [UsernameError, setUsernameError] = useState(false)
  const [UsernameErrorMessage, setUsernameErrorMessage] = useState("")

  useEffect(() => {
		if (!isFocused) {
      setStep("email")
      setUsername("")
      // setPass("")
      // setPassConfirm("")
      setHidePass(true)
      setHidePassConfirm(true)
      setMatchPassword(true)
      setPasswordError(false)
      setPasswordErrorMessage('')
      setToken('')
      setCode1("")
      setCode2("")
      setCode3("")
      setCode4("")
      setCode5("")
      setCode6("")
      setLoading(false)
      setUsernameError(false)
      setUsernameErrorMessage("")
      formik.resetForm()
		}
	}, [isFocused])


  const initialValues = { password: "", password_confirm: "" }

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required"),
      password_confirm: Yup.string()
      .required("Password confirmation is required"),
  })

  const formik = useFormik({
    initialValues,
    validateOnChange: false,
    validationSchema,
    onSubmit: (values) => setPassword(values),
  })


  const sendVerificationCode = () => {
    setLoading(true)
    loginStore.environment.api.forgotPassword({ email: Username }).then(result => {
      setUsernameError(false)
      setLoading(false)
      if (result.kind === "ok") {
        if (result?.response?.detail) notifyMessage(result.response.detail)
        setStep('code')
      } else if (result.kind === "bad-data") {
        if (result?.errors?.length > 0) {
          setUsernameError(true)
          setUsernameErrorMessage(result?.errors?.[0])
        }
        notifyMessage("Please correct the errors and try again")
      }
    })
  }

  const setPassword = (data) => {
    // if (!Pass) {
    //   notifyMessage("Password can't be blank")
    //   return
    // }
    // if (Pass !== PassConfirm) {
    //   notifyMessage("Password don't match")
    //   return
    // }
    setLoading(true)
    loginStore.environment.api
      .passwordSet({ ...data, token: Token, email: Username })
      .then(result => {
        setLoading(false)
        if (result.kind === "ok") {
          runInAction(() => {
            setStep('email')
            notifyMessage("You’ve successfully changed your password!")
            navigation.navigate('login')
          })
        } else if (result.kind === "bad-data") {
          if (result?.errors?.password) {
            setPasswordError(true)
            setPasswordErrorMessage(result?.errors?.password)
          } else notifyMessage(result?.errors?.shift())
        }
      })
  }

  const verifyUserResetCode = () => {
    const code = Code1 + Code2 + Code3 + Code4 + Code5 + Code6
    setLoading(true)
    loginStore.environment.api
      .verifyUserResetCode({ verification_code: code ,email: Username })
      .then(result => {
        setLoading(false)
        if (result.kind === "ok") {
          setCode1("")
          setCode2("")
          setCode3("")
          setCode4("")
          setCode5("")
          setCode6("")
          setToken(result.response.token)
          setStep("new_pass")
        } else if (result.kind === "bad-data") {
          notifyMessage(result.errors.verification_code[0])
        } else {
          notifyMessage(null)
        }
      })
  }

  const renderStep = () => {
    let step = <View style={styles.STEP_CONTAINER}>
      <View style={styles.STEP_CONTAINER}>
        <Text style={styles.STEP_TITLE}>Forgot password</Text>
        <Text style={styles.STEP_SUB_TITLE}>Enter the email address so we can verify your identity</Text>

      </View>
      <TextInputComponent
        label='EMAIL ADDRESS'
        errorLabel={UsernameError
          ? UsernameErrorMessage === ""
            ? "ENTER EMAIL ADDRESS"
            : UsernameErrorMessage
          : ""}
        error={UsernameError}
        onChangeText={t => setUsername(t)}
        value={Username}
        placeholder={"EMAIL ADDRESS"}
      />
    </View>

    if (Step === 'code') {
      step = <View style={styles.STEP_CONTAINER}>
        <Text style={styles.STEP_TITLE}>Verify your email address</Text>
        <Text style={styles.STEP_SUB_TITLE}>
          {`We have sent an email with a verification code to ${Username}. Please check your spam if you haven’t received it.`}
        </Text>
        <View style={styles.CODE_CONFIRMATION_CONTAINER}>
          <View style={styles.CODE_CONFIRMATION_INPUT_CONTAINER}>
            <TextInput
              placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
              keyboardType="numeric"
              style={styles.CODE_CONFIRMATION_INPUT}
              onFocus={() => setCode1("")}
              onChangeText={t => [setCode1(t), CodeInp2.focus()]}
              value={Code1}
            />
          </View>
          <View style={styles.CODE_CONFIRMATION_INPUT_CONTAINER}>
            <TextInput
              placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
              keyboardType="numeric"
              style={styles.CODE_CONFIRMATION_INPUT}
              ref={ref => (CodeInp2 = ref)}
              onFocus={() => setCode2("")}
              onChangeText={t => [setCode2(t), CodeInp3.focus()]}
              value={Code2}
            />
          </View>
          <View style={styles.CODE_CONFIRMATION_INPUT_CONTAINER}>
            <TextInput
              placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
              keyboardType="numeric"
              style={styles.CODE_CONFIRMATION_INPUT}
              ref={ref => (CodeInp3 = ref)}
              onFocus={() => setCode3("")}
              onChangeText={t => [setCode3(t), CodeInp4.focus()]}
              value={Code3}
            />
          </View>
          <View style={styles.SHORT_LINE} />
          <View style={styles.CODE_CONFIRMATION_INPUT_CONTAINER}>
            <TextInput
              placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
              keyboardType="numeric"
              style={styles.CODE_CONFIRMATION_INPUT}
              ref={ref => (CodeInp4 = ref)}
              onFocus={() => setCode4("")}
              onChangeText={t => [setCode4(t), CodeInp5.focus()]}
              value={Code4}
            />
          </View>
          <View style={styles.CODE_CONFIRMATION_INPUT_CONTAINER}>
            <TextInput
              placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
              keyboardType="numeric"
              style={styles.CODE_CONFIRMATION_INPUT}
              ref={ref => (CodeInp5 = ref)}
              onFocus={() => setCode5("")}
              onChangeText={t => [setCode5(t), CodeInp6.focus()]}
              value={Code5}
            />
          </View>
          <View style={styles.CODE_CONFIRMATION_INPUT_CONTAINER}>
            <TextInput
              placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
              keyboardType="numeric"
              style={styles.CODE_CONFIRMATION_INPUT}
              ref={ref => (CodeInp6 = ref)}
              onFocus={() => setCode6("")}
              onChangeText={t => [setCode6(t)]}
              value={Code6}
            />
          </View>
        </View>
      </View>
    }

    if (Step === 'new_pass') {
      step = <View style={styles.STEP_CONTAINER}>
      <Text style={styles.STEP_TITLE}>Create a password</Text>
      <Text style={styles.STEP_SUB_TITLE}>
        {"Create a password to secure your account."}
      </Text>
        <FormikProvider value={formik}>

          <View style={styles.PASS_REQUIREMENTS_CONTAINER}>
            <Text style={styles.INPUT_LABEL_STYLE}>PASSWORD</Text>
            <Text style={styles.PASS_REQUIREMENTS}>
              AT LEAST 12 CHARACTERS LONG, 1 NUMBER AND 1 SYMBOL
            </Text>
          </View>
          {/* green */}
          <View style={(!MatchPassword || PasswordError) ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
            <TextInput
              style={styles.PASS_INPUT_STYLE}
              // onChangeText={t => [setPass(t)]}
              // value={Pass}
              onChangeText={formik.handleChange('password')}
              value={formik.values.password}
              secureTextEntry={HidePass}
              placeholder={"*********"}
              placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
            />
            <TouchableOpacity style={styles.SHOW_PASS_CONTAINER} onPress={() => setHidePass(!HidePass)}>
              <Ionicons name="eye" color={"#39534440"} size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
            <Text style={styles.INPUT_LABEL_STYLE}>CONFIRM PASSWORD</Text>
            <Text style={styles.INPUT_LABEL_ERROR}>
              {!MatchPassword
                ? "NO MATCH"
                : PasswordError
                  ? PasswordErrorMessage
                  : ""
              }
            </Text>
          </View>
          <View style={(!MatchPassword || PasswordError) ? styles.INPUT_STYLE_CONTAINER_ERROR : styles.INPUT_STYLE_CONTAINER}>
            <TextInput
              style={styles.PASS_INPUT_STYLE}
              // onChangeText={t => [setPassConfirm(t)]}
              // value={PassConfirm}
              onChangeText={formik.handleChange('password_confirm')}
              value={formik.values.password_confirm}
              placeholder={"*********"}
              secureTextEntry={HidePassConfirm}
              placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
            />
            <TouchableOpacity style={styles.SHOW_PASS_CONTAINER} onPress={() => setHidePassConfirm(!HidePassConfirm)}>
              <Ionicons name="eye" color={"#39534440"} size={20} />
            </TouchableOpacity>
          </View>
        </FormikProvider>
      </View>
    }

    if (Step === 'sucess') {
      step = <View style={styles.STEP_CONTAINER}>
        <View style={styles.STEP_CONTAINER}>
          <Text style={styles.STEP_TITLE}>Forgot password</Text>
          <Text style={styles.STEP_SUB_TITLE}>Enter the email address so we can verify your identity</Text>
        </View>
        <TextInputComponent
          label='EMAIL ADDRESS'
          errorLabel={UsernameError
            ? UsernameErrorMessage === ""
              ? "ENTER EMAIL ADDRESS"
              : UsernameErrorMessage
            : ""}
          error={UsernameError}
          onChangeText={t => setUsername(t)}
          value={Username}
          placeholder={"EMAIL ADDRESS"}
        />
      </View>
    }

    return step
  }

  const NextButtonHandler = () => {
    if (Step === 'email') sendVerificationCode()
    if (Step === 'code') verifyUserResetCode()
    if (Step === 'new_pass') {
      setPasswordError(false)
      setPasswordErrorMessage('')

      if (formik?.errors?.password) {
        setPasswordError(true)
        setPasswordErrorMessage(formik?.errors?.password)
      } else {
        setPasswordError(false)
        setPasswordErrorMessage('')
      }

      if (formik?.values.password !== formik?.values.password_confirm) {
        setMatchPassword(false)
      } else {
        formik.handleSubmit()
        setMatchPassword(true)
      }
    }
  }

  return (
    <Screen
      preset="fixed"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      <View style={styles.HEADER_ACTIONS}>
        {Step !== "code"
          ? <View style={styles.BACK_BUTON_CONTAINER} />
          : <TouchableOpacity onPress={() => setStep('email')} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"arrow-back"} size={23} color={'black'} />
            <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
          </TouchableOpacity>
        }
        {Step !== "code"
          // @ts-ignore
          ? <TouchableOpacity onPress={() => navigation.navigate('login')} style={styles.BACK_BUTON_CONTAINER}>
            <Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
            <Icon name={"close"} size={23} color={'black'} />
          </TouchableOpacity>
          : <View style={styles.BACK_BUTON_CONTAINER} />
        }

      </View>

      <ScrollView bounces={false}>
        {renderStep()}
      </ScrollView>
      {Step === "code" && (
        <View style={styles.NEED_HELP_CONTAINER}>
          <Text onPress={() => sendVerificationCode()} style={styles.NEED_HELP_LINK}>
            Send code again
          </Text>
        </View>
      )}
      <Button
        buttonStyle={{ backgroundColor: Loading ? `${COLOR.PALETTE.green}40` : COLOR.PALETTE.green }}
        onPress={() => NextButtonHandler()}
        buttonLabel={"Next"}
        disabled={Loading}
        loading={Loading}
      />
    </Screen>
  )
})
