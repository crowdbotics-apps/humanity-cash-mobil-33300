import React, { useEffect, useState } from "react";
import { Text, View, Modal, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../connect-bank-modal/styles";

type ConnectBankModalProps = {
  visible?: boolean,
  onPressHome?: any,
  buttonStyle?: any,
  buttonAction?: any,
}


export function ConfirmCoupon(props: ConnectBankModalProps) {
    
    console.log('MODAL')
	return (
		<Modal visible transparent>
			<View style={styles.ROOT_MODAL}>
				<TouchableOpacity onPress={props.buttonAction} style={styles.CLOSE_MODAL_BUTTON}>
					<Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
					<Icon name={"close"} size={20} color={'#fff'} />
				</TouchableOpacity>
				<View style={styles.MODAL_CONTAINER}>
					<View style={styles.MODAL_CONTENT}>
						<Text style={styles.STEP_TITLE}>Add this Coupon</Text>
						<TouchableOpacity style={[styles.MODAL_BUTTON]} onPress={() => console.log('hola')}>
							<Text style={styles.SUBMIT_BUTTON_LABEL}>Confirm</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View />
			</View>
		</Modal>
	)
}
