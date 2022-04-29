import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { Image, TouchableOpacity, View, Modal } from "react-native";
import { COLOR, IMAGES } from "../../theme";
import { ButtonIcon } from "../../components/button-icon/button-icon";
import styles from './home-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import { CheckBox } from 'react-native-elements'

const userData = {
	profile: {
		name: 'rafa',
		last_name: 'Clemente',
		mail: 'rafael@mail.com'
	},
	bankInfo: {
		bankName: 'nombre'
	}
}

export const HomeScreen = observer(function HomeScreen() {
	const navigation = useNavigation()

	const [ShowBankModal, setShowBankModal] = useState(false)
	const [ShowBankStepModal, setShowBankStepModal] = useState(false)
	const [ModalAgree, setModalAgree] = useState(false)

	useEffect(() => {
		if (!userData.profile.name) navigation.navigate("setupProfile", {})
		else if (!userData.bankInfo.bankName) setShowBankModal(true)
		navigation.navigate("return", {})
		console.log(' ===>>> ', IMAGES.avBass)
	}, [])

	const bankModal = () => (
		<Modal visible={ShowBankModal} transparent>
			<View style={styles.ROOT_MODAL}>
				<TouchableOpacity onPress={() => setShowBankModal(false)} style={styles.CLOSE_MODAL_BUTTON}>
					<Text style={styles.BACK_BUTON_LABEL}>{`Close `}</Text>
					<Icon name={"close"} size={20} color={'#8B9555'} />
				</TouchableOpacity>
				<View style={styles.MODAL_CONTAINER}>
					{ShowBankStepModal
						? <View style={styles.MODAL_CONTENT}>
							<Text style={styles.STEP_TITLE}>Currents uses Dwolla to link your personal bank account.</Text>

							<View style={styles.AGREE_CONTAINER}>
								<CheckBox
									checked={ModalAgree}
									onPress={() => setModalAgree(!ModalAgree)}
									checkedColor={COLOR.PALETTE.green}
								/>
								<Text style={styles.AGREE_LABEL}>{`By checking this box, you agree to the `}
									<Text style={styles.AGREE_LABEL_LINK} onPress={() => console.log('dwolla')}>
										{"Dwolla Terms of Service "}
									</Text>
									{`and `}
									<Text style={styles.AGREE_LABEL_LINK}	onPress={() => console.log('dwolla')}>
										{"Dwolla Privacy Policy"}
									</Text>
								</Text>
							</View>


							<TouchableOpacity style={styles.MODAL_BUTTON} onPress={() => navigation.navigate("splash", {})}>
								<Text style={styles.SUBMIT_BUTTON_LABEL}>Link my bank account</Text>
							</TouchableOpacity>
						</View>
						: <View style={styles.MODAL_CONTENT}>
							<Text style={styles.STEP_TITLE}>Whoooops. You have to link your bank account first</Text>
							<Text style={styles.STEP_SUB_TITLE_MODAL}>Before you can load your wallet you have to first link your bank account. </Text>
							<TouchableOpacity style={styles.MODAL_BUTTON} onPress={() => setShowBankStepModal(true)}>
								<Text style={styles.SUBMIT_BUTTON_LABEL}>Link my bank account</Text>
							</TouchableOpacity>
						</View>
					}

				</View>
				<View />
			</View>
		</Modal>
	)

	return (
		<Screen
			// preset='scroll'
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
		>
			<View style={styles.ROOT}>
				<View>
					<TouchableOpacity onPress={() => navigation.navigate("login", {})} style={styles.BACK_BUTON_CONTAINER}>
						<Icon name={"arrow-back"} size={23} color={'#8B9555'} />
						<Text style={styles.BACK_BUTON_LABEL}>{` Log out`}</Text>
					</TouchableOpacity>
					<View style={styles.STEP_CONTAINER}>
						<Text style={styles.STEP_TITLE}>Home</Text>
					</View>
				</View>
			</View>
			{bankModal()}
		</Screen>
	)
})
