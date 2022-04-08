import React from "react"
import { Text, View, StyleSheet } from "react-native"
import {
  PlaidLink,
  usePlaidEmitter,
  LinkEvent,
  LinkExit,
  LinkSuccess,
  LinkEventName,
  LinkTokenConfiguration
} from "react-native-plaid-link-sdk"
import { Button } from "../button/button"
import { COLOR } from "../../theme"
import Icon from "react-native-vector-icons/MaterialIcons"

type PlaidComponentProps = {
  tokenConfig: LinkTokenConfiguration,
  onPress(): any,
  onSuccess(publicToken: string, metadataJson: string): any,
  onOpenEvent(): any
}

const PlaidComponent = (props: PlaidComponentProps) => {
  usePlaidEmitter((event: LinkEvent) => {
    if (event.eventName === LinkEventName.OPEN) {
      props.onOpenEvent()
    }
  })
  return (
    <PlaidLink
      tokenConfig={props.tokenConfig}
      onSuccess={(success: LinkSuccess) => {
        props.onSuccess(success.publicToken, success.metadata.metadataJson)
      }}
      onExit={(exit: LinkExit) => {
        console.log('exit', exit)
      }}
      onPress={props.onPress}
    >
      <Button
        disabled
        preset={"primary"}
        text={"OPEN PLAID LINK"}
        style={{ marginVertical: 10, marginTop: 70 }}
        iconLeft={<Icon name={"control-point"} size={20} color={COLOR.PALETTE.white} />}
      />
    </PlaidLink>
  )
}

export default PlaidComponent
