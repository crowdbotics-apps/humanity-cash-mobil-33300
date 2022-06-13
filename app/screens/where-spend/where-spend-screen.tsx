import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
// import styles from "./where-spend-style"
import styles from "./where-spend"
import { COLOR, IMAGES } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import Entypo from "react-native-vector-icons/Entypo"
import { useStores } from "../../models"

const industry_types = [
  {
    type: 'Arts & entertainment',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
    ]
  },
  {
    type: 'Communication & education',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
    ]
  },
  {
    type: 'Food & drink',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      },
    ]
  },
  {
    type: 'Health & wellness',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      }
    ]
  },
  {
    type: 'Lodging',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      }
    ]
  },
  {
    type: 'Shopping',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      }
    ]
  },
  {
    type: 'Services',
    business: [
      {
        name: 'DORY & GINGER',
        image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg'
      }
    ]
  },
]

const merchant_of_the_month = {
  name: 'DORY & GINGER',
  image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
  about: 'We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.'
}

export const WhereSpendScreen = observer(function WhereSpendScreen() {
  const rootStore = useStores()
  const navigation = useNavigation()
  const { loginStore } = rootStore
  const [Search, setSearch] = useState('')

  const RenderTopMonth = () => (
    <View style={styles.INDUSTRY_CONTAINER}>
      <Text style={styles.INDUSTRY_TITLE}>MERCHANT OF THE MONTH</Text>
      <View style={styles.LINE} />
      <View style={styles.BUSINESS_CONTAINER}>
        <View style={styles.TOP_MONTH}>
          <Text style={styles.MONTH_BUSINESS_NAME}>{merchant_of_the_month.name}</Text>
          <Text style={styles.MONTH_BUSINESS_ABOUT}>{merchant_of_the_month.about}</Text>
        </View>
          <Image
            source={{ uri: merchant_of_the_month.image }}
            resizeMode='cover'
            style={styles.MONTH_BUSINESS_IMAGE}
          />
      </View>
    </View>
  )

  const RenderCategories = () => {
    return (
      industry_types.map((i, key) => (
        <View style={styles.INDUSTRY_CONTAINER} key={key + '_industry'}>
          <Text style={styles.INDUSTRY_TITLE}>{i.type}</Text>
          <View style={styles.LINE} />
          <ScrollView horizontal style={styles.BUSINESS_CONTAINER}>
            {i.business.map((b, key2) => (
              <View style={styles.BUSINESS} key={key + '' + key2}>
                <Image
                  source={{ uri: b.image }}
                  resizeMode='cover'
                  style={styles.BUSINESS_IMAGE}
                />
                <Text style={styles.BUSINESS_NAME}>{b.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      ))
    )
  }

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
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.ROOT}
      >
        <ScrollView bounces={false}>
          <View style={styles.ROOT_CONTAINER}>
            <View style={styles.CONTAINER}>
              <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("home", {})}>
                <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
                <Text style={styles.BACK_BUTON_LABEL}>{` Home`}</Text>
              </TouchableOpacity>
              <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>{'Where to spend'}</Text>
              <View style={styles.LINE} />
              <Text style={styles.STEP_SUB_TITLE}>We are here to help you with anything and everything on the Currents app.</Text>
             
              <View style={styles.SEARCH_INPUT_CONTAINER}>
                <View style={styles.SEARCH_INPUT_STYLE_CONTAINER}>
                  <Icon name={"search"} size={25} color={COLOR.PALETTE.black} />
                  <TextInput
                    style={styles.SEARCH_INPUT_STYLE}
                    onChangeText={t => setSearch(t)}
                    value={Search}
                    placeholder={`Search`}
                  />
                </View>
                <View style={styles.SEARCH_INPUT_ADJUSTMENTS}>
                  <Image source={IMAGES.shortIcon} resizeMode='contain' style={{ width: 20, height: 20 }} />
                </View>
              </View>

              {RenderTopMonth()}
              {RenderCategories()}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Button
        buttonStyle={{
          backgroundColor: COLOR.PALETTE.blue,
          bottom: 5,
          position: 'absolute'
        }}
        onPress={() => { }}
        buttonLabel={''}
        hideButton
        showBottonMenu
      />
    </Screen>
  )
})
