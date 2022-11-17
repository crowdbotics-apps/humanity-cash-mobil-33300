import React, { useEffect, useState } from "react";
import { Text, View, Modal, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useStores } from "../../models";
import { COLOR } from "../../theme";
import styles from "../connect-bank-modal/styles";

type ConnectBankModalProps = {
  visible?: boolean,
  onPressHome?: any,
  buttonStyle?: any,
  buttonAction?: any,
  couponSelected: any,
  goBack?: any
}


export function ConfirmCoupon(props: ConnectBankModalProps) {

    const {loginStore} = useStores();
    
    const addConsumerCoupon =  (coupon_id: number) => loginStore.environment.api.getProfileConsumer()
        .then((response) => {
            console.log('CONSUMER Id ======> ', response.kind)
            loginStore.environment.api
            .postConsumerCoupon({
                consumer: response.data.consumer, 
                coupon: coupon_id, 
                active: true
            })
            .then(res => {
                console.log('addConsumerCoupon =====> ', res.kind);
                props.goBack()
            })
            .catch(err => console.log(err.mmesage))

    }).catch(error => console.log(error.message))
        
    

	return (
		<Modal visible transparent>
			<View style={styles.ROOT_MODAL_COUPON}>
				<TouchableOpacity onPress={props.buttonAction} style={styles.CLOSE_MODAL_BUTTON}>
					<Text style={styles.BACK_BUTON_LABEL_COUPON}>{`Close `}</Text>
					<Icon name={"close"} size={20} color={'#fff'} />
				</TouchableOpacity>
				<View style={styles.MODAL_CONTAINER}>
					<View style={styles.MODAL_CONTENT}>
						<Text style={styles.STEP_TITLE}>Add this Coupon</Text>
						<TouchableOpacity style={[styles.MODAL_BUTTON]} onPress={() => addConsumerCoupon(props.couponSelected.id)}>
							<Text style={styles.SUBMIT_BUTTON_LABEL}>Confirm</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View />
			</View>
		</Modal>
	)
}
