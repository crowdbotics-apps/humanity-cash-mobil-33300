import React, { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Image } from "react-native"
import { Text, Button, Screen, TextInputComponent } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
// import styles from "./where-spend-style"
import styles from "./where-spend"
import { COLOR, IMAGES, METRICS } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import Entypo from "react-native-vector-icons/Entypo"
import { useStores } from "../../models"
import { CheckBox } from 'react-native-elements'
import MapView, { Marker } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation';

const industryTypes = [
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

const merchantOfTheMonth = {
  name: 'DORY & GINGER',
  image: 'https://st.depositphotos.com/1010710/2187/i/600/depositphotos_21878395-stock-photo-spice-store-owner.jpg',
  about: 'We have treasures for your home and lifestyle, along with the perfect gift for that special someone or that occasion that begs for something unique.'
}

export const WhereSpendScreen = observer(function WhereSpendScreen() {
  const rootStore = useStores()
  const navigation = useNavigation()
  const { loginStore } = rootStore
  const [Search, setSearch] = useState('')
  const [ShowMap, setShowMap] = useState(false)
  const [Location, setLocation] = useState('')
  const [DistanceFilter, setDistanceFilter] = useState('')
  const [ShowFilter, setShowFilter] = useState(false)
  const [Region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  })
  const [Latitud, setLatitud] = useState(null)
  const [Longitud, setLongitud] = useState(null)

  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        const location = {
          latitude,
          longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.09,
        }
        setRegion(location)
        setLatitud(location.latitude)
        setLongitud(location.longitude)
      },
      console.warn,
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
    )
  })

  const RenderTopMonth = () => (
    <View style={styles.INDUSTRY_CONTAINER}>
      <Text style={styles.INDUSTRY_TITLE}>MERCHANT OF THE MONTH</Text>
      <View style={styles.LINE} />
      <View style={styles.BUSINESS_CONTAINER}>
        <View style={styles.TOP_MONTH}>
          <Text style={styles.MONTH_BUSINESS_NAME}>{merchantOfTheMonth.name}</Text>
          <Text style={styles.MONTH_BUSINESS_ABOUT}>{merchantOfTheMonth.about}</Text>
        </View>
        <Image
          source={{ uri: merchantOfTheMonth.image }}
          resizeMode='cover'
          style={styles.MONTH_BUSINESS_IMAGE}
        />
      </View>
    </View>
  )

  const RenderCategories = () => {
    return (
      industryTypes.map((i, key) => (
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

  const Filters = () => <View style={styles.FILTER_CONTAINER}>
    <Text style={styles.DISTANCE_FILTER_LABEL}>Distance</Text>
    <View style={styles.DISTANCES_CONTAINER}>
      <CheckBox
        checked={DistanceFilter === '1'}
        onPress={() => setDistanceFilter('1')}
        checkedColor={loginStore.getAccountColor}
      />
      <Text style={styles.DISTANCE_LABEL}>1 mi</Text>
      <CheckBox
        checked={DistanceFilter === '5'}
        onPress={() => setDistanceFilter('5')}
        checkedColor={loginStore.getAccountColor}
      />
      <Text style={styles.DISTANCE_LABEL}>5 mi</Text>
      <CheckBox
        checked={DistanceFilter === '10'}
        onPress={() => setDistanceFilter('10')}
        checkedColor={loginStore.getAccountColor}
      />
      <Text style={styles.DISTANCE_LABEL}>10 mi</Text>
    </View>
    <TextInputComponent
      label='Distance'
      onChangeText={t => setDistanceFilter(t)}
      value={DistanceFilter}
      placeholder={"Custom distance"}
      labelContainerStyle={{ display: 'none' }}
    />
    <Text
      onPress={() => [setShowMap(true), setShowFilter(false)]}
      style={[styles.FIND_MAP, { color: loginStore.getAccountColor }]}
    >Find Location on Google Maps</Text>
    <Text onPress={() => setDistanceFilter('')} style={styles.CLEAR_FILTERS}>Clear filters</Text>
    <View style={styles.LINE} />
  </View>

  const MapContainer = () =>
    <View style={styles.ROOT_CONTAINER}>
      <View style={styles.CONTAINER}>
        <TouchableOpacity style={styles.HEADER} onPress={() => setShowMap(false)}>
          <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
          <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
        </TouchableOpacity>

        <TextInputComponent
          label='Location'
          onChangeText={t => setLocation(t)}
          value={Location}
          placeholder={"Enter Location"}
        />
        <Button
          buttonStyle={{
            backgroundColor: COLOR.PALETTE.blue,
            width: METRICS.screenWidth * 0.8,
            marginTop: 20,

          }}
          onPress={() => { }}
          buttonLabel={'Confirm Location'}

        />
      </View>
      <MapView
        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{
          // height: METRICS.screenHeight - 200,
          flex: 1,
          width: METRICS.screenWidth,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        showsUserLocation
        loadingEnabled
        zoomEnabled
        zoomControlEnabled
        initialRegion={Region}
      >
        
        <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324
          }}
        />
      </MapView>
    </View>



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
        {ShowMap
          ? MapContainer()
          : <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
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
                  <TouchableOpacity style={styles.SEARCH_INPUT_ADJUSTMENTS} onPress={() => setShowFilter(!ShowFilter)}>
                    <Image source={IMAGES.shortIcon} resizeMode='contain' style={{ width: 20, height: 20 }} />
                  </TouchableOpacity>
                </View>
                {ShowFilter && Filters()}
                {RenderTopMonth()}
                {RenderCategories()}
              </View>
            </View>
          </ScrollView>
        }
      </KeyboardAvoidingView>
      <Button
        // onPress={() => {}}
        buttonLabel={''}
        hideButton
        showBottonMenu={!ShowMap}
        accountType={loginStore.getSelectedAccount}
      />
    </Screen>
  )
})
