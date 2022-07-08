import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./legal-style"
import { COLOR } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import Entypo from "react-native-vector-icons/Entypo"


export const LegalScreen = observer(function LegalScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
	const { loginStore } = rootStore

  const [ShowTerms, setShowTerms] = useState(false)
  const [ShowPolicy, setShowPolicy] = useState(false)

  return (
    <Screen
      // preset='scroll'
      preset="fixed"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      <KeyboardAvoidingView
        enabled
        // behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.ROOT}
      >
        <ScrollView bounces={false}>
          <View style={styles.ROOT_CONTAINER}>
            <View style={styles.CONTAINER}>

              <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("settings", {})}>
                <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
                <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>

              </TouchableOpacity>

              <Text style={[styles.STEP_TITLE, {color: loginStore.getAccountColor}]}>Legal</Text>
              <View style={styles.LINE} />

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
                  style={styles.TERMS_CLOSE_CONTAINER}
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


            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
})
