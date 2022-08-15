import React, { useEffect, useState } from "react"
import { Image, Modal, ScrollView, TouchableOpacity, View, TextInput } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./modal-selector-styles"
import { IMAGES } from "../../theme/images"
import { Text } from "../text/text"
import { Button } from "../button/button"
import { COLOR } from "../../theme"

type ModalSelectortProps = {
    action: any
    options: any
    title: string
    value: any
    visible: boolean
    displaySelector: boolean
    setVisible: any
    closeOnClick?: boolean
    itemKey?: string
    alternativeStyle?: boolean
    searchAction?: any
}

export function ModalSelector(props: ModalSelectortProps) {
    const [SelectedValue, setSelectedValue] = useState(null)
    const [Search, setSearch] = useState('')
    const closeOnClick = false || props.closeOnClick
    const alternativeStyle = props.alternativeStyle
    useEffect(() => {
        if (props.value === null) {
            setSelectedValue(null)
        }
        setSearch('')
    }, [props.value])

    return (
        <>
            {props.displaySelector === true && <TouchableOpacity style={alternativeStyle === false ? styles.FEEDBACK_SELECTOR_CONTAINER : styles.FEEDBACK_SELECTOR_CONTAINER_ALTERNATIVE} onPress={() => props.setVisible(true)}>
                {props?.itemKey !== "title" && <Text>{SelectedValue === null ? props.title : SelectedValue.title}</Text>}
                {props?.itemKey === "title" && <Text>{SelectedValue === null ? (props.value === null ? props.title : props.value) : SelectedValue.title}</Text>}
                <Icon name={"expand-more"} size={20} color={COLOR.PALETTE.black} />
            </TouchableOpacity>}
            <Modal
                hardwareAccelerated
                animationType={"slide"}
                transparent={true}
                visible={props.visible}
                statusBarTranslucent
            >
                <View style={[styles.MODAL_BODY, { height: "90%" }]}>
                    <View style={styles.HEADER_CONTAINER} >
                    <View style={styles.CLOSE_MODAL_BUTTON} />
                        <Image source={IMAGES.logoFull} style={styles.FP_LOGO_MODAL} resizeMode='contain' />
                        <TouchableOpacity onPress={() => props.setVisible(false)} style={styles.CLOSE_MODAL_BUTTON}>
					<Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
					<Icon name={"close"} size={20} color={COLOR.PALETTE.black} />
				</TouchableOpacity>
                    </View>
                    <View style={styles.FIRST_TITLE_MODAL}>
                        <Text>{props.title}</Text>
                    </View>
                    <TextInput
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: COLOR.PALETTE.black,
                        }}
                        onChangeText={t => {
                            setSearch(t)
                            if (props.searchAction) props.searchAction(t)
                        }}
                        value={Search}
                        placeholder={'Search'}
                    />
                    <ScrollView style={[styles.FORM_CONTAINER, { marginTop: 10 }]}>
                        {props.options.map(option => {
                            let itemColor = COLOR.PALETTE.black
                            if (props?.itemKey === "title") {
                                if (SelectedValue && SelectedValue === option[props?.itemKey]) {
                                    itemColor = COLOR.PALETTE.green
                                }
                            } else {
                                if (SelectedValue && SelectedValue.id === option.id) {
                                    itemColor = COLOR.PALETTE.green
                                }
                            }

                            if (Search !== '' &&
                                !option?.title?.toLocaleLowerCase().includes(Search.toLocaleLowerCase()) &&
                                !option?.description?.toLocaleLowerCase().includes(Search.toLocaleLowerCase())
                            ) {
                                return null
                            }

                            return (
                                <TouchableOpacity
                                    key={"optiom-id-" + option.id}
                                    onPress={() => {
                                        if (props.closeOnClick === true) {
                                            props.setVisible(false)
                                            props.action(option)
                                            setSelectedValue(option)
                                        } else {
                                            setSelectedValue(option)
                                        }
                                    }}
                                    style={{
                                        alignItems: "flex-start",
                                        borderWidth: 0.5,
                                        borderColor: itemColor,
                                        marginVertical: 5,
                                        padding: 10,
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                    }}
                                >
                                    <Text style={{ color: itemColor, fontSize: 20, marginLeft: 10, marginRight: 20 }}>{option.title}</Text>
                                    {option.description !== "" && <Text style={{ color: itemColor, fontSize: 15, marginTop: 5 }}>{option.description}</Text>}
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            </Modal>
        </>
    )
}
