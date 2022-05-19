import {observer} from "mobx-react-lite";
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {Button, Screen, Text} from "../../components";

export const FilesScreen = observer(function FilesScreen() {
    const navigation = useNavigation()
    return (
        <Screen preset="scroll" showHeader={false}>
        <Text style={{marginTop: "20%"}}>EXAMPLE</Text>
        </Screen>
    )
})
