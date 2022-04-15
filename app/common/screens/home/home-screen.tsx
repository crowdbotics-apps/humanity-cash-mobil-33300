import {observer} from "mobx-react-lite";
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useRef, useState} from "react";
import {Button, Icon, Screen, Text} from "../../components";
import {Image, TouchableOpacity, View} from "react-native";
import {COLOR, IMAGES} from "../../theme";
import {ButtonIcon} from "../../components/button-icon/button-icon";
import styles from './home-style';


import {icons} from "../../components/icon/icons";
import {transform} from "@babel/core";
// import setConnected = MapboxGL.setConnected;
import {RESOURCES} from "./home-data";
import {useLoginStore} from "../../utils/custom_hooks";
// import {MapResource} from "../../components/map-source/map-source";




const BATHROOM = [-76.30748411492345, 36.907571047369025]
const INITIAL = [-76.3070636534724, 36.90686794486544]

const ICON_MARGIN = 12

export const HomeScreen = observer(function HomeScreen() {
    const navigation = useNavigation()
    const [coordinates, setCoordinates] = useState(INITIAL);
    const inputEl = useRef(null);
    const [ZoomLevel, setZoomLevel] = useState(16)
    const [ShowPumpOut, setShowPumpOut] = useState(false)
    const [ShowFuel, setShowFuel] = useState(false)
    const [ShowElectricity, setShowElectricity] = useState(false)
    const [CurrentIndex, setCurrentIndex] = useState(0)
    const loginStore = useLoginStore()


    const fuelIconPress = ()=>{
        let newIndex = 0
        if(ShowFuel){
            newIndex = CurrentIndex + 1
            if(newIndex === RESOURCES.fuel.length){
                newIndex = 0

            }
            setZoomLevel(18)
        }else{
            setZoomLevel(16)
        }

        setCoordinates([RESOURCES.fuel[newIndex].lon, RESOURCES.fuel[newIndex].lat])
        setCurrentIndex(newIndex)
        setShowFuel(true)
        setShowElectricity(false)
        setShowPumpOut(false)
    }

    const pumOutIconPress = ()=>{
        let newIndex = 0
        if(ShowPumpOut){
            newIndex = CurrentIndex + 1
            if(newIndex === RESOURCES.pumpOuts.length){
                newIndex = 0
            }
            setZoomLevel(18)
        }else{
            setZoomLevel(16)
        }
        setCoordinates([RESOURCES.pumpOuts[newIndex].lon, RESOURCES.pumpOuts[newIndex].lat])
        setCurrentIndex(newIndex)
        setShowFuel(false)
        setShowElectricity(false)
        setShowPumpOut(true)
    }

    const electricityIconPress = ()=>{
        let newIndex = 0
        if(ShowElectricity){
            newIndex = CurrentIndex + 1
            if(newIndex === RESOURCES.electricity.length){
                newIndex = 0

            }
            setZoomLevel(18)
        }else{
            setZoomLevel(16)
        }
        setCoordinates([RESOURCES.electricity[newIndex].lon, RESOURCES.electricity[newIndex].lat])
        setCurrentIndex(newIndex)
        setShowFuel(false)
        setShowElectricity(true)
        setShowPumpOut(false)
    }

    const logout = () => {
        navigation.navigate("login")
        loginStore.reset()
    }


    return (

        <Screen preset="scroll" statusBar={"dark-content"} showHeader={false}>
            <View style={styles.NAV_BAR}>
                <ButtonIcon icon={'profile'} style={{tintColor: COLOR.PALETTE.white}}
                            touchableStyle={{marginLeft: ICON_MARGIN}} onPress={()=>{
                    logout()
                }} />

                <View style={styles.MIDDLE_NAV_BAR}>
                    <Text style={styles.MIDDLE_NAV_BAR_TEXT}>marina name</Text>
                    <Icon icon={'down'}  containerStyle={{alignSelf:"center"}} style={styles.DOWN_ICON} />
                </View>

                <ButtonIcon icon={'settings'} style={{tintColor: COLOR.PALETTE.white}}
                            touchableStyle={{marginRight:ICON_MARGIN}} onPress={()=>{
                    alert("not implemented yet!!")
                }} />
            </View>

            <View style={styles.TOP_RIGHT_MENU_CONTAINER}>
                <ButtonIcon icon={'electricity'} style={{tintColor: COLOR.PALETTE.white}} touchableStyle={{marginTop:ICON_MARGIN, borderRadius: 90}} onPress={()=>{
                    electricityIconPress()
                }} />

                <ButtonIcon icon={'fuel'} style={{tintColor: COLOR.PALETTE.white}} touchableStyle={{marginTop:ICON_MARGIN, borderRadius: 90}} onPress={()=>{
                    fuelIconPress()
                }} />

                <ButtonIcon icon={'pumpOut'} style={{tintColor: COLOR.PALETTE.white}}  touchableStyle={{marginTop:ICON_MARGIN, borderRadius: 90}} onPress={()=>{
                    pumOutIconPress()
                }} />

                <ButtonIcon icon={'paperPlane'}  style={{tintColor: COLOR.PALETTE.white}}   touchableStyle={{marginTop:ICON_MARGIN, borderRadius: 90}} onPress={()=>{
                    setCoordinates(INITIAL)
                    setZoomLevel(20)

                }} />
            </View>

            <View style={styles.DOWN_RIGHT_MENU_CONTAINER}>
                <ButtonIcon icon={'map'} style={{tintColor: COLOR.PALETTE.marina_dark}}
                            touchableStyle={styles.SERVICE_BUTTON}
                            onPress={()=>{
                                alert("not implemented yet!!")
                            }} />


                <ButtonIcon icon={'plus'} style={{tintColor: COLOR.PALETTE.marina_dark}}
                            touchableStyle={styles.SERVICE_BUTTON}
                            onPress={async ()=>{
                                console.log("entranding")


                                let zoom = await inputEl.current.getZoom()
                                if(zoom <= 20){
                                    setZoomLevel(zoom + 1)
                                }


                                // if(inputEl.current){
                                //     // @ts-ignore
                                //     console.log(inputEl.current)
                                // }



                            }} />

                <ButtonIcon icon={'minus'} style={{tintColor: COLOR.PALETTE.marina_dark}}
                            touchableStyle={styles.SERVICE_BUTTON}
                            onPress={async ()=>{

                                let zoom = await inputEl.current.getZoom()
                                if(zoom >= 12){
                                    setZoomLevel(zoom - 1)
                                }
                            }} />
            </View>


            <View style={styles.page}>
                <View style={styles.container}>

                </View>
            </View>


        </Screen>
    )
})
