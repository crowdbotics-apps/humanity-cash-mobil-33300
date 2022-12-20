import React, {useState} from "react";
import { Text, View, Modal, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
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

    const {couponSelected} = props;

    const {loginStore} = useStores();

    const ContainerStyle: ViewStyle = {
        ...styles.MODAL_CONTAINER_COUPON,
        height: '50%',
    };

    const ContentStyle: ViewStyle = {
        position: 'absolute',
        height: '95%',
        justifyContent: 'space-around',
        top: 10,       
    };

    const MarginTextStyle: TextStyle = {
        color: 'black'
    };

    const TitleStyle: TextStyle = {
        ...styles.STEP_TITLE,
        textAlign: 'center'
    };

    const DateStyle : ViewStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    };

    const ButtonStyle: ViewStyle = {
        backgroundColor: loginStore.getAccountColor,
        opacity: loading ? 0.5 : 1,
        ...styles.MODAL_BUTTON,
        ...MarginTextStyle,
        marginBottom: 0,
    }

    const postCoupon = (): Promise<void> => {
        setLoading(true);
        return addConsumerCoupon(couponSelected.id, props, loginStore)
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
                <View style={ContainerStyle}>
                    <View style={[styles.MODAL_CONTENT, ContentStyle]}>
                        <View style={DateStyle}>
                            <Text style={MarginTextStyle}>Valid from: {couponSelected?.start_date}</Text>
                            <Text style={MarginTextStyle}>To: {couponSelected?.end_date}</Text>
                        </View>
                        <Text style={TitleStyle}>{couponSelected?.title}</Text>
                        <Text style={MarginTextStyle}>Promo Type: {couponSelected?.type_of_promo}</Text>
                        <Text style={MarginTextStyle}>
                            Promo Discount:
                            {` ${couponSelected?.discount_input}`}
                            {couponSelected?.type_of_promo === 'Discount percentage' && '%'}
                            {couponSelected?.type_of_promo === 'Discount dollar amount' && '$'}
                        </Text>
                        <Text style={MarginTextStyle}>
                            Description:
                            {couponSelected?.description ? ` ${couponSelected.description}` : ' No description'}
                        </Text>
                        <TouchableOpacity
                            style={ButtonStyle}
                            onPressIn={() => props.mode === 'ADD' ? postCoupon() : deleteCoupon()}
                            disabled={loading}
                        >
                            <Text style={styles.SUBMIT_BUTTON_LABEL}>{props.mode === 'ADD' ? 'Add this coupon' : 'Delete this from your coupons'}</Text>
                        </TouchableOpacity>
					</View>
				</View>
				<View />
			</View>
		</Modal>
	)
}
