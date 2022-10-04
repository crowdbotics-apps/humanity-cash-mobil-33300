import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { Text, Screen, Button, TextInputComponent } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import Entypo from "react-native-vector-icons/Entypo"
import Ionicons from "react-native-vector-icons/Ionicons"
import styles from "./signup-style"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import { runInAction } from "mobx"
import { notifyMessage } from "../../utils/helpers"
import { COLOR } from '../../theme';
import { CheckBox } from 'react-native-elements'
import TouchID from 'react-native-touch-id'

const steps = [
  "email",
  "legal",
  "verify_email",
  "help",
  "email_confirmed",
  "create_password",
  "touch_id"
]

export const SignupScreen = observer(function SignupScreen() {
  const rootStore = useStores()
  const navigation = useNavigation()
  const { loginStore } = rootStore

  const [Loading, setLoading] = useState(false)

  const [Step, setStep] = useState(steps[0])
  const [ButtonDisabled, setButtonDisabled] = useState(true)

  const [Email, setEmail] = useState("")
  const [Phone, setPhone] = useState("")
  const [EmailError, setEmailError] = useState(false)
  const [EmailErrorMessage, setEmailErrorMessage] = useState("")
  const [Agree, setAgree] = useState(false)

  const [ShowTerms, setShowTerms] = useState(false)
  const [ShowPolicy, setShowPolicy] = useState(false)

  let CodeInp1, CodeInp2, CodeInp3, CodeInp4, CodeInp5, CodeInp6
  const [Code1, setCode1] = useState("")
  const [Code2, setCode2] = useState("")
  const [Code3, setCode3] = useState("")
  const [Code4, setCode4] = useState("")
  const [Code5, setCode5] = useState("")
  const [Code6, setCode6] = useState("")

  const [Pass, setPass] = useState("")
  const [PassConfirm, setPassConfirm] = useState("")
  const [HidePass, setHidePass] = useState(true)
  const [HidePassConfirm, setHidePassConfirm] = useState(true)
  const [MatchPassword, setMatchPassword] = useState(true)

  const renderStep = () => {
    let render
    switch (Step) {
      case "email":
        render = EmailStep()
        break
      case "legal":
        render = LegalStep()
        break
      case "verify_email":
        render = VerifyEmailStep()
        break
      case "help":
        render = HelpStep()
        break
      case "email_confirmed":
        render = EmailConfirmedStep()
        break
      case "create_password":
        render = CreatePasswordStep()
        break
    }
    return render
  }
  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

  const pressHandler = () => {
    TouchID.authenticate('to demo this react-native component', optionalConfigObject)
      .then(success => {
        Alert.alert('Authenticated Successfully');
      })
      .catch(error => {
        Alert.alert('Authentication Failed');
      });
  }

  const validateEmail = (email, agree) => {
    const valid = String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    if (valid) {
      agree ? setButtonDisabled(false) : setButtonDisabled(true)
      return true
    } else {
      setButtonDisabled(true)
      return false
    }
  }

  const register = () => {
    setLoading(true)
    loginStore.environment.api.userRegister({ email: Email }).then(result => {
      console.log('register ', result)
      setLoading(false)
      if (result.kind === "ok") {
        runInAction(() => {
          loginStore.setUser(result.response.user)
          loginStore.setApiToken(result.response.access_token)
        })
        setStep("verify_email")
      } else if (result.kind === "bad-data") {
        console.log(' result => ', result)
        notifyMessage("Please correct the errors and try again")
        setEmailError(true)
        setEmailErrorMessage(result.errors.email[0])
      } else {
        loginStore.reset()
        notifyMessage(null)
      }
    })
  }

  const sendVerificationCode = () => {
    setLoading(true)
    loginStore.environment.api.sendVerificaitonCode().then(() => {
      setLoading(false)
    })
  }

  const verifyUserAuthenticationCode = () => {
    const code = Code1 + Code2 + Code3 + Code4 + Code5 + Code6
    setLoading(true)
    loginStore.environment.api
      .verifyUserAuthenticationCode({ verification_code: code })
      .then(result => {
        setLoading(false)
        if (result.kind === "ok") {
          notifyMessage("Email verified", "success")
          setStep("email_confirmed")
        } else if (result.kind === "bad-data") {
          notifyMessage(result.errors.verification_code[0])
          setCode1('')
          setCode2('')
          setCode3('')
          setCode4('')
          setCode5('')
          setCode6('')
        } else {
          notifyMessage(null)
        }
      })
  }

  const setPassword = () => {
    setLoading(true)
    loginStore.environment.api
      .setUserPassword({ password: Pass, password_confirm: PassConfirm })
      .then(result => {
        console.log(' result ===>>> ', JSON.stringify(result, null, 2))
        setLoading(false)
        if (result.kind === "ok") {
          runInAction(() => {
            // loginStore.setUser(result.response.user)
            // loginStore.setApiToken(result.response.access_token)

            navigation.navigate("setupProfile", {})
            resetData()
          })
        } else if (result.kind === "bad-data") {
          notifyMessage(result.errors.password.shift())
        } else {
          loginStore.reset()
          notifyMessage(null)
        }
      })
  }

  const resetData = () => {
    loginStore.setStep('')
    loginStore.setSignupData({})

    setStep('email')
    setEmail('')
    setPhone('')
    setCode1('')
    setCode2('')
    setCode3('')
    setCode4('')
    setCode5('')
    setCode6('')
  }

  const EmailStep = () => (
    <View style={styles.STEP_CONTAINER}>
      <Text style={styles.STEP_TITLE}>Create account</Text>
      <Text style={styles.STEP_SUB_TITLE}>
        Hello! Tell us how to reach you. We will send a verification code to
        your email.
      </Text>

      <TextInputComponent
        label='EMAIL ADDRESS'
        errorLabel={EmailError
          ? EmailErrorMessage === ""
            ? "ENTER EMAIL ADDRESS"
            : EmailErrorMessage
          : ""}
        error={EmailError}
        onChangeText={t => {
          setEmail(t)
          setEmailError(!validateEmail(t, Agree))
        }}
        value={Email}
        placeholder={"myname@mail.com"}
      />
      {/* <TextInputComponent
        label='PHONE NUMBER'
        onChangeText={t => setPhone(t)}
        value={Phone}
        placeholder={"(555) 555-1234"}
      /> */}

    </View>
  )
  const LegalStep = () => (
    <View style={styles.STEP_CONTAINER}>
      <Text style={styles.STEP_TITLE}>Legal</Text>
      <View style={styles.LINE} />
      <ScrollView>
        {!ShowTerms ? (
          <TouchableOpacity
            onPress={() => setShowTerms(!ShowTerms)}
            style={styles.TERMS_CLOSE_CONTAINER}
          >
            <Text style={styles.TERMS_TITLE}>{"Terms & Conditions"}</Text>
            <Entypo
              name={"chevron-down"}
              size={23}
              color={"black"}
              style={{ marginRight: 20 }}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.TERMS_OPEN_CONTAINER}>
            <TouchableOpacity
              onPress={() => setShowTerms(!ShowTerms)}
              style={styles.TERMS_OPEN_TITLE_CONTAINER}
            >
              <Text style={styles.TERMS_TITLE}>{"Terms & Conditions"}</Text>
              <Entypo
                name={"chevron-up"}
                size={23}
                color={"black"}
                style={{ marginRight: 20 }}
              />
            </TouchableOpacity>
            <Text style={styles.TERMS_OPEN_CONTENT}>
              {`
ARTICLE I: General

Section 1: Name -  The name of the corporation will be BerkShares, Inc., a non-profit corporation organized under the laws of the Commonwealth of Massachusetts.
Section 2: Area - The corporation will focus its activities in the Berkshire Region.
Section 3: Offices - The principal office of the corporation will be at 140 Jug End Road, South Egremont, Massachusetts 01258 (mailing address: P O Box 125, Great Barrington, MA 01230) or at some other physical location as determined by the Board of Trustees.

ARTICLE II: Purpose

Section 1: Purpose - The Purpose of BerkShares, Inc. is to initiate, encourage and administer educational and practical programs for the furtherance of regional economic self-reliance in the Berkshire Region.

By pooling capital and human resources, BerkShares, Inc. seeks to facilitate the formation of small businesses, cottage industries, farms and cooperatives that would enable local communities to develop greater self-reliance. Basic human needs in the areas of food, shelter, energy, environment, employment, transportation, health care, education, cultural activities and social services could thus be increasingly met through local efforts. It is intended that such a program would encourage use of land in harmony with ecological principles. It would also encourage the development of alternative exchange instruments and of community associations that would foster and support initiative in these areas.

ARTICLE III: Membership

Section 1: General Membership - The membership of BerkShares, Inc. will be open to all residents of the Berkshire Region who are interested in the promotion of local and regional economic self-sufficiency. All Members will be considered in good standing if they have paid an annual membership fee as established by the Board of Trustees.
            `}
            </Text>
          </View>
        )}
        {!ShowPolicy ? (
          <TouchableOpacity
            onPress={() => setShowPolicy(!ShowPolicy)}
            style={styles.POLICY_CLOSE_CONTAINER}
          >
            <Text style={styles.TERMS_TITLE}>{"Privacy Policy"}</Text>
            <Entypo
              name={"chevron-down"}
              size={23}
              color={"black"}
              style={{ marginRight: 20 }}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.POLICY_OPEN_CONTAINER}>
            <TouchableOpacity
              onPress={() => setShowPolicy(!ShowPolicy)}
              style={styles.TERMS_OPEN_TITLE_CONTAINER}
            >
              <Text style={styles.TERMS_TITLE}>{"Privacy Policy"}</Text>
              <Entypo
                name={"chevron-up"}
                size={23}
                color={"black"}
                style={{ marginRight: 20 }}
              />
            </TouchableOpacity>
            <Text style={styles.TERMS_OPEN_CONTENT}>
              {`
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.

            `}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
  const VerifyEmailStep = () => (
    <View style={styles.STEP_CONTAINER}>
      <Text style={styles.STEP_TITLE}>Verify your email</Text>
      <Text
        style={styles.STEP_SUB_TITLE}
      >{`We have sent an email with a verification code to ${Email}. Please check your spam if you haven’t received it.`}</Text>
      <View style={styles.CODE_CONFIRMATION_CONTAINER}>
        <View style={styles.CODE_CONFIRMATION_INPUT_CONTAINER}>
          <TextInput
            placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
            keyboardType="numeric"
            style={styles.CODE_CONFIRMATION_INPUT}
            ref={ref => (CodeInp1 = ref)}
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
  )
  const HelpStep = () => (
    <View style={styles.STEP_CONTAINER}>
      <Text style={styles.STEP_TITLE}>Need help?</Text>
      <Text style={styles.STEP_SUB_TITLE}>
        {
          "If you need help, have questions, complaints, remarks, or just like to chat, please send an email to berkshares@humanitycash.com"
        }
      </Text>
    </View>
  )
  const EmailConfirmedStep = () => (
    <View style={styles.STEP_CONTAINER}>
      <Text style={styles.STEP_TITLE}>You email address is confirmed!</Text>
    </View>
  )
  const CreatePasswordStep = () => (
    <View style={styles.STEP_CONTAINER}>
      <Text style={styles.STEP_TITLE}>Create a password</Text>
      <Text style={styles.STEP_SUB_TITLE}>
        {"Create a password to secure your account."}
      </Text>

      <View style={styles.PASS_REQUIREMENTS_CONTAINER}>
        <Text style={styles.INPUT_LABEL_STYLE}>PASSWORD</Text>
        <Text style={styles.PASS_REQUIREMENTS}>
          AT LEAST 12 CHARACTERS LONG, 1 NUMBER AND 1 SYMBOL
        </Text>
      </View>
      {/* green */}

      <View style={styles.INPUT_STYLE_CONTAINER}>
        <TextInput
          style={styles.PASS_INPUT_STYLE}
          onChangeText={t => [setPass(t)]}
          value={Pass}
          secureTextEntry={HidePass}
          placeholder={"*********"}
          placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
        />
        <TouchableOpacity onPress={() => setHidePass(!HidePass)}>
          <Ionicons name="eye" color={"#39534440"} size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
        <Text style={styles.INPUT_LABEL_STYLE}>CONFIRM PASSWORD</Text>
        <Text style={styles.INPUT_LABEL_ERROR}>
          {!MatchPassword ? "NO MATCH" : ""}
        </Text>
      </View>
      <View
        style={
          !MatchPassword
            ? styles.INPUT_STYLE_CONTAINER_ERROR
            : styles.INPUT_STYLE_CONTAINER
        }
      >
        <TextInput
          style={styles.PASS_INPUT_STYLE}
          onChangeText={t => [setPassConfirm(t)]}
          value={PassConfirm}
          placeholder={"*********"}
          secureTextEntry={HidePassConfirm}
          placeholderTextColor={COLOR.PALETTE.placeholderTextColor}
        />
        <TouchableOpacity onPress={() => setHidePassConfirm(!HidePassConfirm)}>
          <Ionicons name="eye" color={"#39534440"} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const backButtonHandler = () => {
    switch (Step) {
      case "email":
        navigation.navigate("splash", {})
        break
      case "legal":
        setStep("email")
        break
      case "verify_email":
        setStep("email")
        break
      case "help":
        setStep("verify_email")
        break
      case "email_confirmed":
        setStep("verify_email")
        break
      case "create_password":
        setStep("email_confirmed")
        break
      case "touch_id":
        setStep("create_password")
        break
    }
  }
  const nextButtonHandler = () => {
    const signupData = { Email, Phone, Code1, Code2, Code3, Code4, Code5, Code6, }
    loginStore.setSignupData(signupData)
    switch (Step) {
      case "email":
        register()
        // loginStore.setStep('signup')
        // setStep("verify_email")
        break
      case "verify_email":
        if (Code1 && Code2 && Code3 && Code4 && Code5 && Code6) {
          verifyUserAuthenticationCode()
          // setStep("email_confirmed")
        }
        break
      case "email_confirmed":
        setStep("create_password")
        break
      case "create_password":
        if (Pass !== PassConfirm) {
          setMatchPassword(false)
        } else {
          setPassword()
          setMatchPassword(true)
          // pressHandler()
          // setStep('touch_id')
        }
        break;
      case "touch_id":
        navigation.navigate("setupProfile", {})
        loginStore.setStep('')
        break;
    }
  }

  const sendCodeAgainHandler = () => sendVerificationCode()

  useEffect(() => {
    const data = loginStore.getSignupData
    if (data?.Email) setEmail(data.Email)
    if (data?.Phone) setPhone(data.Phone)
    if (data?.Code1) setCode1(data.Code1)
    if (data?.Code2) setCode2(data.Code2)
    if (data?.Code3) setCode3(data.Code3)
    if (data?.Code4) setCode4(data.Code4)
    if (data?.Code5) setCode5(data.Code5)
    if (data?.Code6) setCode6(data.Code6)
  }, [])

  return (
    <Screen showHeader={true} preset="fixed" statusBar={"dark-content"} unsafe={true}>
      {/* <View style={styles.ROOT}> */}
      <View style={styles.ROOT}>
        <View style={styles.STEP_CONTAINER}>
          <TouchableOpacity
            onPress={() => backButtonHandler()}
            style={styles.BACK_BUTON_CONTAINER}
          >
            <Icon name={"arrow-back"} size={23} color={"black"} />
            <Text style={styles.BACK_BUTON_LABEL}>{" Back"}</Text>
          </TouchableOpacity>
          <ScrollView>
            {renderStep()}
          </ScrollView>
        </View>
        {Step === "email" && (
          <View style={styles.AGREE_CONTAINER}>
            <CheckBox
              checked={Agree}
              onPress={() => [
                setAgree(!Agree),
                validateEmail(Email, !Agree)
              ]}
              checkedColor={COLOR.PALETTE.green}
            />
            <Text style={styles.AGREE_LABEL}>
              {
                "By checking this box, you agree to our partner Humanity Cash's "
              }
              <Text
                style={styles.AGREE_LABEL_LINK}
                onPress={() => setStep("legal")}
              >
                {"Terms & Conditions"}
              </Text>
              {" "}and{" "}
              <Text
                style={styles.AGREE_LABEL_LINK}
                onPress={() => setStep("legal")}
              >
                {"Privacy Policy"}
              </Text>
            </Text>
          </View>
        )}
        {Step === "verify_email" && (
          <View style={styles.NEED_HELP_CONTAINER}>
            <Text onPress={() => sendCodeAgainHandler()} style={styles.NEED_HELP_LINK}>
              Send code again
            </Text>
          </View>
        )}
        {Step !== "legal" && (
          <Button
            buttonStyle={{
              backgroundColor: (ButtonDisabled || Loading) ? `${COLOR.PALETTE.green}40` : COLOR.PALETTE.green,
            }}
            onPress={() => nextButtonHandler()}
            buttonLabel={'Next'}
            disabled={ButtonDisabled || Loading}
            loading={Loading}
          />
        )}
      </View>
    </Screen>
  )
})
