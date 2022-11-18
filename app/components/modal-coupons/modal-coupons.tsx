import React, {useState} from "react";
import { Text, View, Modal, TouchableOpacity } from "react-native";
import { useStores } from "../../models";
import {addConsumerCoupon, deleteConsumerCoupon} from '../../utils/coupons';
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../connect-bank-modal/styles";

type ConnectBankModalProps = {
  couponsConfig?: any,
  setCouponsConfig?: any,
  visible?: boolean,
  onPressHome?: any,
  buttonStyle?: any,
  buttonAction?: any,
  couponSelected: any,
  goBack?: any,
  mode?: string,
}


export function ConfirmCouponModal(props: ConnectBankModalProps) {

    const [loading, setLoading] = useState(false);

    const {loginStore} = useStores();

    const postCoupon = (): Promise<void> => {
        setLoading(true);
        return addConsumerCoupon(props.couponSelected.id, props, loginStore)
        .then(() => {setLoading(false); props.setCouponsConfig({...props.couponsConfig, ShowConfirmCoupon: !props.visible})})
        .catch(error => console.log('Algo falló en el POST de cupones: ' + error.message))
    }

    const deleteCoupon = (): Promise<void[]> => {
        setLoading(true)
        return deleteConsumerCoupon(props.couponSelected.id, props, loginStore)
        .then(() => [setLoading(false), props.setCouponsConfig({...props.couponsConfig, ShowConfirmCoupon: !props.visible})])
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
                            {props.mode === 'ADD' ? 'Add this coupon' : 'Delete this from your coupons'}
                        </Text>
						<TouchableOpacity 
                          style={[styles.MODAL_BUTTON, {backgroundColor: loginStore.getAccountColor, opacity: loading ? 0.5 : 1 }]} 
                          onPressIn={() => props.mode === 'ADD' ? postCoupon() : deleteCoupon()}
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
