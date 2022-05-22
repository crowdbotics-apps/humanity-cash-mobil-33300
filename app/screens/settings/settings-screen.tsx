import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity } from 'react-native';
import {
  Text,
  Button,
  Screen,
} from '../../components';
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from './settings-style';
import { COLOR } from '../../theme';
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"

export const SettingsScreen = observer(function SettingsScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [Username, setUsername] = useState('')
  const [Pass, setPass] = useState('')
  const [HidePass, setHidePass] = useState(true)
  const [Loading, setLoading] = useState(false)

  return (
    <Screen
      preset="fixed"
      statusBar={"dark-content"}
      unsafe={true}
      showHeader
    >
      <View style={styles.ROOT}>
        <View style={styles.CONTAINER}>
          <TouchableOpacity onPress={() => navigation.navigate("home", {})} style={styles.BACK_BUTON_CONTAINER}>
            <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
            <Text style={styles.BACK_BUTON_LABEL}>{` Home`}</Text>
          </TouchableOpacity>
          <View style={styles.STEP_CONTAINER}>
            <Text style={styles.STEP_TITLE}>Settings</Text>
            <Text style={styles.LINE} />

            <Button
              buttonStyle={styles.BUTTON_STYLE}
              buttonLabelStyle={{ color: COLOR.PALETTE.green }}
              onPress={() => navigation.navigate("myProfile", {})}
              buttonLabel={'My profile'}
              disabled={Loading}
              loading={Loading}
            />
            <Button
              buttonStyle={styles.BUTTON_STYLE}
              buttonLabelStyle={{ color: COLOR.PALETTE.green }}
              onPress={() => { }}
              buttonLabel={'Bank account'}
              disabled={Loading}
              loading={Loading}
            />
            <Button
              buttonStyle={styles.BUTTON_STYLE}
              buttonLabelStyle={{ color: COLOR.PALETTE.green }}
              onPress={() => { }}
              buttonLabel={'Static QR '}
              disabled={Loading}
              loading={Loading}
            />
            <Button
              buttonStyle={styles.BUTTON_STYLE}
              buttonLabelStyle={{ color: COLOR.PALETTE.green }}
              onPress={() => navigation.navigate("legal", {})}
              buttonLabel={'Legal'}
              disabled={Loading}
              loading={Loading}
            />
            <Button
              buttonStyle={styles.BUTTON_STYLE}
              buttonLabelStyle={{ color: COLOR.PALETTE.green }}
              onPress={() => navigation.navigate("security", {})}
              buttonLabel={'Security'}
              disabled={Loading}
              loading={Loading}
            />
          </View>
        </View>
        <View style={styles.CONTAINER}>
          <View style={styles.NEED_HELP_CONTAINER}>
            <Text onPress={() => { }} style={styles.NEED_HELP_LINK}>Delete account</Text>
          </View>
        </View>
      </View>
    </Screen>
  )
})
