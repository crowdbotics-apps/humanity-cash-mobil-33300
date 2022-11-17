import React, { useState } from "react";
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
  goBack?: any,
  mode?: any
}


export function ConfirmCoupon(props: ConnectBankModalProps) {

    const [loading, setLoading] = useState(false)

    const {loginStore} = useStores();

    const modalMode: string = loginStore.getConsumerCoupons.find(c => c.id_cupon === props.couponSelected.id) ? 'delete' : 'add';
    
    const addConsumerCoupon =  (coupon_id: number) => {

        setLoading(true);

        loginStore.environment.api.getProfileConsumer()
        .then((response) => {

            loginStore.environment.api
            .postConsumerCoupon({
                consumer: response.data.consumer, 
                coupon: coupon_id, 
                active: true
            }).then(() => {

                setLoading(false);
                props.goBack();
            }).catch(err => console.log(err.mmesage))

        }).catch(error => console.log(error.message))
    }

	return (
		<Modal visible transparent>
			<View style={styles.ROOT_MODAL_COUPON}>
				<TouchableOpacity onPress={props.buttonAction} style={styles.CLOSE_MODAL_BUTTON}>
					<Text style={styles.BACK_BUTON_LABEL_COUPON}>{`Close `}</Text>
					<Icon name={"close"} size={20} color={'#fff'} />
				</TouchableOpacity>
				<View style={styles.MODAL_CONTAINER_COUPON}>
					<View style={styles.MODAL_CONTENT}>
						<Text style={styles.STEP_TITLE}>
                            {props.mode === 'add' ? 'Add this coupon' : 'Delete this from your courpons'}
                        </Text>
						<TouchableOpacity 
                          style={[styles.MODAL_BUTTON, {backgroundColor: loginStore.getAccountColor, opacity: loading ? 0.5 : 1 }]} 
                          onPress={() => props.mode === 'add' ? addConsumerCoupon(props.couponSelected.id) : null}
                          disabled={loading ? true : false}
                          
                        >
							<Text style={[styles.SUBMIT_BUTTON_LABEL]}>Confirm</Text>

						</TouchableOpacity>
					</View>
				</View>
				<View />
			</View>
		</Modal>
	)
}
