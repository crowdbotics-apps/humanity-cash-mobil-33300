import React, { useEffect, useState } from "react"
import { Text, View, Modal, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "./styles"
import { COLOR } from "../../theme"

type ConnectBankModalProps = {
  visible?: boolean,
  onPressHome?: any,
  buttonStyle?: any,
  buttonAction?: any,
}


export function ConnectBankModal(props: ConnectBankModalProps) {
	
	return (
		<Modal visible={props.visible} transparent>
			<View style={styles.ROOT_MODAL}>
				<TouchableOpacity onPress={props.onPressHome} style={styles.CLOSE_MODAL_BUTTON}>
					<Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
					<Icon name={"close"} size={20} color={'#fff'} />
				</TouchableOpacity>
				<View style={styles.MODAL_CONTAINER}>
					<View style={styles.MODAL_CONTENT}>
						<Text style={styles.STEP_TITLE}>Whoooops. You have to link your bank account first</Text>
						<Text style={styles.STEP_SUB_TITLE_MODAL}>Before you can load your wallet you have to first link your bank account. </Text>
						<TouchableOpacity style={[styles.MODAL_BUTTON, props.buttonStyle]} onPress={props.buttonAction}>
							<Text style={styles.SUBMIT_BUTTON_LABEL}>Link my bank account</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View />
			</View>
		</Modal>
	)
}
