import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import { View, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native"
import { Text, Button, Screen } from "../../components"
import Icon from "react-native-vector-icons/MaterialIcons"
import styles from "./legal-style"
import { COLOR } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "../../models"
import Entypo from "react-native-vector-icons/Entypo"


export const LegalScreen = observer(function LegalScreen() {
  const navigation = useNavigation()
  const rootStore = useStores()
  const { loginStore } = rootStore

  const [ShowTerms, setShowTerms] = useState(false)
  const [ShowPolicy, setShowPolicy] = useState(false)

  return (
    <Screen
      preset="fixed"
      statusBar={"dark-content"}
      style={styles.ROOT}
      showHeader
    >
      <TouchableOpacity style={styles.HEADER} onPress={() => navigation.navigate("settings")}>
        <Icon name={"arrow-back"} size={23} color={COLOR.PALETTE.black} />
        <Text style={styles.BACK_BUTON_LABEL}>{` Back`}</Text>
      </TouchableOpacity>
      <KeyboardAvoidingView enabled style={styles.ROOT}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.ROOT_CONTAINER}>
            <View style={styles.CONTAINER}>

              <Text style={[styles.STEP_TITLE, { color: loginStore.getAccountColor }]}>Legal</Text>
              <View style={styles.LINE} />
              {!ShowTerms ? (
                <TouchableOpacity
                  onPress={() => setShowTerms(!ShowTerms)}
                  style={styles.TERMS_CLOSE_CONTAINER}
                >
                  <Text style={styles.TERMS_TITLE}>{"Terms & Conditions"}</Text>
                  <Entypo
                    name={"chevron-down"}
                    size={23}
                    color={"black"}
                    style={{ marginRight: 20 }}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.TERMS_OPEN_CONTAINER}>
                  <TouchableOpacity
                    onPress={() => setShowTerms(!ShowTerms)}
                    style={styles.TERMS_OPEN_TITLE_CONTAINER}
                  >
                    <Text style={styles.TERMS_TITLE}>{"Terms & Conditions"}</Text>
                    <Entypo
                      name={"chevron-up"}
                      size={23}
                      color={"black"}
                      style={{ marginRight: 20 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.TERMS_OPEN_CONTENT}>
                    {`
ARTICLE I: General

Section 1: Name -  The name of the corporation will be BerkShares, Inc., a non-profit corporation organized under the laws of the Commonwealth of Massachusetts.
Section 2: Area - The corporation will focus its activities in the Berkshire Region.
Section 3: Offices - The principal office of the corporation will be at 140 Jug End Road, South Egremont, Massachusetts 01258 (mailing address: P O Box 125, Great Barrington, MA 01230) or at some other physical location as determined by the Board of Trustees.

ARTICLE II: Purpose

Section 1: Purpose - The Purpose of BerkShares, Inc. is to initiate, encourage and administer educational and practical programs for the furtherance of regional economic self-reliance in the Berkshire Region.

By pooling capital and human resources, BerkShares, Inc. seeks to facilitate the formation of small businesses, cottage industries, farms and cooperatives that would enable local communities to develop greater self-reliance. Basic human needs in the areas of food, shelter, energy, environment, employment, transportation, health care, education, cultural activities and social services could thus be increasingly met through local efforts. It is intended that such a program would encourage use of land in harmony with ecological principles. It would also encourage the development of alternative exchange instruments and of community associations that would foster and support initiative in these areas.

ARTICLE III: Membership

Section 1: General Membership - The membership of BerkShares, Inc. will be open to all residents of the Berkshire Region who are interested in the promotion of local and regional economic self-sufficiency. All Members will be considered in good standing if they have paid an annual membership fee as established by the Board of Trustees.
            `}
                  </Text>
                </View>
              )}
              {!ShowPolicy ? (
                <TouchableOpacity
                  onPress={() => setShowPolicy(!ShowPolicy)}
                  style={styles.TERMS_CLOSE_CONTAINER}
                >
                  <Text style={styles.TERMS_TITLE}>{"Privacy Policy"}</Text>
                  <Entypo
                    name={"chevron-down"}
                    size={23}
                    color={"black"}
                    style={{ marginRight: 20 }}
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.POLICY_OPEN_CONTAINER}>
                  <TouchableOpacity
                    onPress={() => setShowPolicy(!ShowPolicy)}
                    style={styles.TERMS_OPEN_TITLE_CONTAINER}
                  >
                    <Text style={styles.TERMS_TITLE}>{"Privacy Policy"}</Text>
                    <Entypo
                      name={"chevron-up"}
                      size={23}
                      color={"black"}
                      style={{ marginRight: 20 }}
                    />
                  </TouchableOpacity>
                  <Text style={styles.TERMS_OPEN_CONTENT}>
                    {`
Privacy Policy

BerkShares, Inc. 

Last Updated November 23, 2021

Effective November 23, 2021

BerkShares Privacy Policy

 

BerkShares, Inc. (“BerkShares”) is committed to protecting your privacy and earning your trust. This Privacy Policy discloses our privacy practices for personal information we collect when you use or access our products, services, features, or content through any BerkShares website (including https://berkshares.org/, the “BerkShares Site”), any BerkShares application or service (“BerkShares Services”), or when you apply or express interest in employment with BerkShares (“BerkShares Employment”).

 

We may, in our sole discretion, change this Privacy Policy from time to time by posting a revised version at https://www.berkshares.org/about/privacy-policy/. 

What information may BerkShares collect?
Identifiers, such as a real name, postal address, phone number, email address, account name, or other similar identifiers, as may be required by law or regulation.

Internet activity, including IP address, type of device, operating system, browser, UR data, and similar data.

Inferences about preferences from cookies and site usage, including those used to gauge interest in obtaining BerkShares Services.

Financial information, such as your full bank account number if you choose to use it with the BerkShares Services.

Detailed personal information, such as your date of birth or social security number, as may be required by law or regulation. 

Other personal information provided by third party service providers such as credit bureaus and identity verification services.

Information that you provide to BerkShares when interacting with our customer support team or other team members via phone, email, online form, or other correspondence.

Personal information stored with third parties that you choose to provide to BerkShares, such as information you may have in a third party application that you may choose to utilize through an integration that BerkShares has developed with the third party application.  By linking your third party accounts, you authorize BerkShares to have access to this information and you agree that BerkShares may collect and use this information in accordance with this Privacy Policy.

Email and/or phone number for your contacts that you enter into BerkShares payment flows. We use this information to notify your contacts that you have sent them a payment and/or payment request.

Information about your transactions and payment activity such as the amount, date, time, recipient for each transaction.

If you use a device to access the BerkShares Sites or BerkShares Services, we collect information about your device, including the type of device (Computer vs. iPhone vs. Android), operating system, mobile phone number, browser type and language, the URL that you came from and the next URL that you visit, and device identifiers (such as IMEI and MAC address)

With your permission, we may collect your device location so that we can offer you location-based features such as the ability to send funds to nearby BerkShares users.

BerkShares uses analytics software to allow us to better understand the functionality of the BerkShares Sites and Services. This software may record information such as how often you use the BerkShares Sites and Services, the events that occur with such use, aggregated usage, and performance data. We may combine this automatically collected log information with other information we collect about you in order to provide and improve the BerkShares Sites and the BerkShares Services.

How does BerkShares use the personal information that it collects?
BerkShares collects your personal information to do the following:

 

Customize and improve your BerkShares experience with the BerkShares Sites and the BerkShares Services.

Provide the BerkShares Services to you.

Validate your account.

Notify you about your account activity.

Process transactions and collect fees.

Provide customer support and resolve disputes.

Verify your identity and account information

Identify, prevent, and report potentially prohibited, fraudulent, or illegal activities.

Notify you about important changes to the BerkShares Services and/or BerkShares’ terms and conditions.

Provide you with news, offers, and information about the BerkShares Services based on your communications preferences.

Any other purpose that we disclose to you in the course of providing the BerkShares Sites, BerkShares Services, or BerkShares Employment to you.

 

How does BerkShares share my personal information?

On an ongoing basis, we may share your personal information as follows:

When creating a BerkShares Wallet, we store your account details (such as username and password), personal and/or business information, financial account information, and other information with external service providers, such as Amazon Web Services (“AWS”) and third-party payment processors. Third-party payment processors may need to store and access your personal identifiable information and financial account information in order to process payments for you to fund and redeem your BerkShares Wallet. These companies are authorized to use your personal information only as necessary to provide these services to us. Please also read AWS’ privacy policy, which are incorporated here by reference. 

If your payment to another BerkShares user fails, we may provide that user with details of the unsuccessful payment.

With third parties to provide, maintain, and improve the BerkShares Services, including fraud prevention, identity verification, analytics and marketing services, and financial institutions and other partners that are part of the payment process.  These companies are authorized to use your personal information only as necessary to provide these services to us.

At times, we may need to share your information with law enforcement or government officials. We will only do this when we are compelled to do so by a specific regulation, subpoena, court order or formal request, or if we believe disclosure is reasonably necessary to comply with any applicable law, legal process, or government request. We may also release your information in order to investigate or bring legal action against someone who may be violating our rights, our terms and conditions, or the rights of others; or to protect the safety and security of BerkShares, our users, or the public.

BerkShares may also share aggregated, non-personally identifiable information with third parties for auditing, analytics, maintenance, security, or other related business purposes as determined appropriate by BerkShares. To the extent third party analytics software is used to improve the functionality of the BerkShares Sites, the providers of the software may receive information about your use and interaction with the software in order to assist BerkShares with providing and improving the BerkShares Sites and the BerkShares Services.

Other than as stated in this Privacy Policy, BerkShares does not disclose or sell any of your personal information to third parties without your consent. These third parties may include integration partners providing you with additional products and services connected to the BerkShares application. Please note that third parties, such as merchants that you pay, integrating service providers and third party websites that you visit, have their own privacy policies. BerkShares is not responsible for the policies and practices of such third parties and we encourage you to review their privacy policies.

BerkShares may also release your information to a third party if we are involved in a merger, acquisition, or sale of all or a portion of our stock or assets. If this occurs, you will be notified of any change to this Privacy Policy, as well as any choices you may have regarding your personal information.

Your BerkShares wallet is a digital wallet that runs on a public blockchain network. Every digital wallet has an alphanumeric address which is publicly queryable on a blockchain network. No personally identifiable information is ever shared publicly; however, in certain cases, it may be possible for an actor to deduce from publicly available data on a blockchain ledger, by analyzing transactions associated with a digital wallet’s public address, the identity of the owner of the BerkShares wallet. BerkShares takes all reasonable efforts to avoid enabling tracking of user identity, but by using your BerkShares wallet, you acknowledge and hold BerkShares harmless for any third party interpretation of publicly available information. 

Your access and use of the BerkShares Sites, and submission of this data to us, constitutes your acceptance of this Privacy Policy and consent to the uses set forth in this Privacy Policy.

How can I limit how BerkShares uses my personal information?
 All financial companies need to share customers’ personal information to run their everyday business. In the section below, we list the reasons financial companies can share their customers’ personal information; the reasons we choose to share; and whether you can limit this sharing.



 

To limit our sharing, fill out and mail the Privacy Form. 

 

Please note: If you are a new customer, we can begin sharing your information from the date you received notice. When you are no longer our customer, we continue to share your information as described in this notice. However, you can contact us at any time to limit our sharing.

Does BerkShares sell my personal information?
No. BerkShares does not sell your personal information.

Will BerkShares refuse service, charge me a different rate, or provide different quality service if I decline to provide certain data?
In order to use BerkShares Services to transfer funds through the U.S. monetary system, a user must comply with applicable federal laws and rules.  These applicable laws and rules may require the disclosure and retention of information regarding the identity of senders and recipients of funds. BerkShares does not base its prices or the quality of its services on the exercise or non-exercise of legal privacy rights.

How does BerkShares use cookies and web beacons?
As reflected above, BerkShares and its marketing, analytics and fraud prevention service providers use technologies such as cookies, beacons, tags, and scripts, to analyze trends, administer the website, track users’ movements around the website, and to gather demographic information about BerkShares’ user base, and we may receive such information on an individual and aggregated basis from such providers.

 

We use cookies to provide you with a personalized experience by recognizing you when you return to the BerkShares Sites; better understand our users by tracking how they use the BerkShares Services; improve the design and content of the BerkShares Sites by tracking how users interact with the BerkShares Sites; and identify and prevent fraudulent activity. You can change your browser settings to refuse cookies.

 

We may gather certain information about our website visitors automatically and store it in log files. This information may include Internet protocol (IP) addresses, browser type, internet service provider (ISP), referring/exit pages, operating system, date/time stamp, and/or clickstream data. We may combine this automatically collected log information with other information we collect about you in order to provide and improve the BerkShares Services.

 

The BerkShares Sites may include social media features that allow you to “Like” or share content on third party sites. These features may be hosted by the third party sites or the BerkShares Sites, and may collect your IP address, the BerkShares Site page you are visiting, and may set a cookie to enable the feature to function. This Privacy Policy does not apply to third party cookies, web beacons, social media features and widgets (such as the Facebook Like button), or other tracking technologies used by third parties. BerkShares is not responsible for the privacy policies and practices of such third parties.

How do I opt-out of receiving promotional emails from BerkShares?
 If you prefer not to receive promotional emails from BerkShares, click on the unsubscribe link at the bottom of any promotional email that we send you to remove your email address from future promotional email campaigns. If you have difficulty with the unsubscribe process, contact us at info@berkshares.org.

What security precautions does BerkShares take to protect me?
We have security measures in place to protect your personal information, including the use of industry-standard data encryption technology and internal policies and restrictions regarding the storage of and access to your personal information. We store personal identifiable information and other sensitive data with AWS and necessary payments partners for the highest industry-standard encryption technology and generally do not store sensitive information on our own servers. Please note that no data transmission over the Internet or method of electronic storage can be guaranteed to be 100% secure. BerkShares’ servers and business operations are entirely located in the United States. If you have any questions about the security of your personal information, you can contact us at info@berkshares.org.

How do I update my information?
 If your information changes, you can correct it in your account settings within the BerkShares application or by contacting us at info@berkshares.org.

If you wish to close your account or request that we no longer use your information to provide you the BerkShares Services, contact us at info@berkshares.org. and we will respond to you in a reasonable timeframe.  We will retain your information for as long as your account is active or as needed to provide you the BerkShares Services, or to the extent required by applicable law or rule.

            `}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
})
