import { observer } from "mobx-react-lite";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Screen, Text } from "../../components";
import { ActivityIndicator, TextInput, TouchableOpacity, View, Modal, Platform, KeyboardAvoidingView } from "react-native";
import { COLOR, IMAGES, METRICS } from "../../theme";
import { ButtonIcon } from "../../components/button-icon/button-icon";
import styles from './load-wallet-style';
import Icon from "react-native-vector-icons/MaterialIcons"
import Entypo from "react-native-vector-icons/Entypo"
import { CheckBox } from 'react-native-elements'
import { PALETTE } from "../../theme/palette";

export const LoadWalletScreen = observer(function LoadWalletScreen() {
	const navigation = useNavigation()


	const [Amount, setAmount] = useState('')
	const [ShowModal, setShowModal] = useState(false)
	const [TransactionConfirm, setTransactionConfirm] = useState(false)
	const [TransactionFinished, setTransactionFinished] = useState(false)

	const ConfirmModal = () => (
		<Modal visible={ShowModal} transparent>
			{TransactionConfirm
				? <View style={styles.LOADING_RETURN}>
					{TransactionFinished
						? [
							<Text key={'congrat_title'} style={styles.PENDING_TITLE}>{`Congratulations! You 
have topped up 
C$ ${Amount}`}
							</Text>,
							<Text key={'congrat_sub_title'} style={styles.SUB_TITLE}>Currents will soon be available in your wallet!</Text>,
							<Button
								key={'congrat_button'}
								buttonStyle={{
									backgroundColor: COLOR.PALETTE.green,
									top: METRICS.screenHeight - 80,
									position: 'absolute'
								}}
								onPress={() => [
									setTransactionConfirm(false),
									setShowModal(false),
									setTransactionFinished(false),
									setAmount(''),
									navigation.navigate("home", {})
								]}
								buttonLabel={'Explore BerkShares'}
							/>
						]
						: [
							<Text key={'pending_title'} style={styles.PENDING_TITLE}>Pending...</Text>,
							<Text key={'pending_sub_title'} style={styles.SUB_TITLE}>This usually takes 5-6 seconds</Text>,
							<ActivityIndicator key={'pending_ind'} style={styles.ACTIVITY} size="large" color={'black'} />
						]
					}

				</View>
				: <View style={styles.ROOT_MODAL}>
					<View style={styles.HEADER_ACTIONS}>
						<TouchableOpacity onPress={() => setShowModal(false)} style={styles.CLOSE_MODAL_BUTTON}>
							<Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.white} style={{ marginLeft: 10 }} />
							<Text style={styles.BACK_BUTON_LABEL_MODAL}>{` Back`}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setShowModal(false)} style={styles.CLOSE_MODAL_BUTTON}>
							<Text style={styles.BACK_BUTON_LABEL_MODAL}>{`Close `}</Text>
							<Icon name={"close"} size={23} color={COLOR.PALETTE.white} />
						</TouchableOpacity>
					</View>
					<View style={styles.MODAL_CONTAINER}>
						<View style={styles.MODAL_CONTENT}>
							<Text style={styles.STEP_TITLE}>Please confirm your transaction.</Text>
							<Text style={styles.STEP_SUB_TITLE_MODAL}>{`You will load up B$ ${Amount} to your wallet.`}</Text>
							<TouchableOpacity
								style={styles.MODAL_BUTTON}
								onPress={() => {
									setTransactionConfirm(true)
									setTimeout(function () {
										setTransactionFinished(true)
									}, 5000)
								}}
							>
								<Text style={styles.SUBMIT_BUTTON_LABEL}>Confirm</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View />
				</View>
			}


		</Modal>
	)

	return (
		<Screen
			showHeader
			preset="fixed"
			statusBar={'dark-content'}
			unsafe={true}
		>
			<KeyboardAvoidingView
				enabled
				behavior={Platform.OS === 'ios' ? 'padding' : null}
				style={styles.ROOT}
			>
				<View style={styles.HEADER_ACTIONS}>
					{!ShowModal &&
						<TouchableOpacity onPress={() => navigation.navigate("home", {})} style={styles.BACK_BUTON_CONTAINER}>
							<Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
							<Text style={styles.BACK_BUTON_LABEL}>{` Home`}</Text>
						</TouchableOpacity>
					}
				</View>

				<View style={styles.STEP_CONTAINER}>
					<Text style={styles.STEP_TITLE}>Load Wallet</Text>
					<Text style={styles.LINE} />
					<Text style={styles.SUB_TITLE}>
						{`Specify the amount of Currents 
(C$ 1 = USD 1) you would like to load up. `}
					</Text>

					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
					</View>

					<View style={styles.INPUT_AMOUNT_STYLE_CONTAINER}>
						<Button
							buttonStyle={(Amount === '50' || Amount === '50.00') ? styles.BUTTON_AMOUNT_ACTIVE : styles.BUTTON_AMOUNT}
							buttonLabelStyle={{ color: (Amount === '50' || Amount === '50.00') ? COLOR.PALETTE.white : COLOR.PALETTE.green }}
							onPress={() => setAmount('50.00')}
							buttonLabel={'C$ 50'}
						/>
						<Button
							buttonStyle={(Amount === '100' || Amount === '100.00') ? styles.BUTTON_AMOUNT_ACTIVE : styles.BUTTON_AMOUNT}
							buttonLabelStyle={{ color: (Amount === '100' || Amount === '100.00') ? COLOR.PALETTE.white : COLOR.PALETTE.green }}
							onPress={() => setAmount('100.00')}
							buttonLabel={'C$ 100'}
						/>
						<Button
							buttonStyle={(Amount === '200' || Amount === '200.00') ? styles.BUTTON_AMOUNT_ACTIVE : styles.BUTTON_AMOUNT}
							buttonLabelStyle={(Amount === '200' || Amount === '200.00') ? { color: COLOR.PALETTE.white } : { color: COLOR.PALETTE.green }}
							onPress={() => setAmount('200.00')}
							buttonLabel={'C$ 200'}
						/>
					</View>

					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.INPUT_LABEL_STYLE}>AMOUNT</Text>
						<Text style={styles.INPUT_LABEL_STYLE}>MAX. C$ 2,000</Text>
					</View>
					<View style={styles.INPUT_STYLE_CONTAINER}>
						<TextInput
							style={styles.INPUT_STYLE}
							keyboardType='numeric'
							onChangeText={t => {
								if (t) t = t.split(' ')[1]
								else t = ''
								setAmount(t)
							}}
							value={(Amount && Amount.split(' ')[0] == `C$ `) ? Amount : `C$ ` + Amount}
							placeholder={`Amount`}
						/>
					</View>

					<View style={styles.INPUT_LABEL_STYLE_CONTAINER}>
						<Text style={styles.COSTS_LABEL}>Total costs</Text>
						<Text style={styles.COSTS_LABEL}>{`$ ${Amount}`}</Text>
					</View>

				</View>
				<Button
					buttonStyle={{
						backgroundColor: COLOR.PALETTE.green,
						top: METRICS.screenHeight - 100,
						position: 'absolute'
					}}
					onPress={() => setShowModal(true)}
					buttonLabel={'Load up'}
				/>
				{ConfirmModal()}
			</KeyboardAvoidingView>
		</Screen>
	)
})
