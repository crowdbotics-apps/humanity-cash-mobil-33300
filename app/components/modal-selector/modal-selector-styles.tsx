import {StyleSheet} from "react-native"
import {COLOR, TYPOGRAPHY} from "../../theme"

export default StyleSheet.create({
  ROOT: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white
  },
  CONTENT_CONTAINER: {
    flex: 1,
    margin: 15,
    borderRadius: 10,
    shadowOffset: {width: 1, height: 1},
    shadowColor: COLOR.PALETTE.black,
    shadowOpacity: 0.3,
    elevation: 3,
    padding: 10,
    backgroundColor: COLOR.PALETTE.white
  },
  TITLE: {
    textAlign: "center",
    fontSize: 20,
    marginTop: 10
  },
  SEPARATOR: {
    height: 1,
    backgroundColor: "#EEEDED",
    marginVertical: 7
  },
  CONTENT: {
    textAlign: "center",
    marginHorizontal: 15,
    lineHeight: 18,
    flex: 1
  },
  IMAGE_CONTAINER: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLOR.PALETTE.primary,
    alignSelf: "center",
    marginTop: 20,
    position: "relative"
  },
  IMAGE: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center"
  },
  EDIT_PHOTO: {
    position: "absolute",
    top: 0,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLOR.PALETTE.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  BUTTONS_CONTAINER: {
    flexDirection: "row",
    marginTop: 20
  },
  BUTTON_OVERWRITE: {
    minHeight: 32,
    minWidth: 150
  },
  BUTTON_OVERWRITE_TEXT: {
    fontSize: 12
  },
  SUBTITLE: {
    fontSize: 14,
    color: COLOR.PALETTE.gray
  },
  SUBTITLE_BLACK: {
    fontSize: 12,
    color: COLOR.PALETTE.black
  },
  SUBTITLE_PRIMARY: {
    fontSize: 12,
    color: COLOR.PALETTE.primary,
    fontFamily: TYPOGRAPHY.primaryBold
  },
  MODAL_BODY: {
    height: "80%",
    width: "100%",
    backgroundColor: COLOR.PALETTE.white,
    padding: 20,
    paddingBottom: 0,
    position: "absolute",
    bottom: 0,
    elevation: 5,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  FP_LOGO_MODAL: {
    // width: 34,
    height: 35,
    alignSelf: "center"
  },
  FIRST_TITLE_MODAL: {
    flexDirection: "row",
    marginTop: 10,
    alignSelf: "center"
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 230,
    marginLeft: "auto",
    marginRight: "auto",
    borderWidth: 1,
    borderRadius: 90,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: "#E9E9E9",
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: COLOR.PALETTE.white
  },
  cellRoot: {
    width: 30,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 2
  },
  cellText: {
    color: "#000",
    fontSize: 34,
    textAlign: "center"
  },
  focusCell: {
    borderBottomColor: "#000000",
    borderBottomWidth: 2
  },
  CODE_INPUT_TEXT: {
    alignSelf: "center",
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    marginTop: 40,
    textAlign: "center"
  },
  FORM_CONTAINER: {
    marginTop: 20,
    flex: 1
  },
  CANCEL_CONFIRM_BUTTON_CONTAINER: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    marginBottom: 50
  },
  EMPTY_IMAGE: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLOR.PALETTE.primary,
    alignSelf: "center",
    marginVertical: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  PAGINATOR_BUTTON: {
    width: 30,
    height: 30,
    backgroundColor: COLOR.PALETTE.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15
  },
  HEADER_SECTION_LIST_TEXT: {
    marginLeft: 20,
    fontFamily: TYPOGRAPHY.primaryBlack,
    color: COLOR.PALETTE.gray2
  },
  HEADER_SECTION_LIST_CONTAINER: {
    height: 24,
    justifyContent: "center"
  },
  SECTION_LIST_ITEM_BODY: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10
  },
  SECTION_LIST_ITEM_IMAGE: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 25
  },
  SECTION_LIST_ITEM_TEXT: {
    fontSize: 16,
    marginLeft: 10,
    maxWidth: 230
  },
  SECTION_LIST_ITEM_BUTTON: {
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: 20,
    alignItems: "center"
  },
  SECTION_LIST_ITEM_BUTTON_TEXT: {
    color: COLOR.PALETTE.primary,
    fontFamily: TYPOGRAPHY.primaryBold
  },
  FEEDBACK_SELECTOR_CONTAINER: {
    backgroundColor: 'transparent',
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  FEEDBACK_SELECTOR_CONTAINER_ALTERNATIVE: {
    backgroundColor: 'transparent',
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderColor: COLOR.PALETTE.lightGrey,
    alignItems: "center",
  },
  FEEDBACK_SELECTOR_TEXT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.lighterGrey2,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    textAlignVertical: "top",
    marginTop: 20,
    minHeight: 150,
    color: COLOR.PALETTE.black
  },
  WARNING_MESSAGE_CONTAINER: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: COLOR.PALETTE.green,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginTop: 10
  },
  WARNING_MESSAGE_TEXT: {
    color: COLOR.PALETTE.primary,
    fontSize: 14,
    flex: 1,
    flexWrap: "wrap",
    marginLeft: 10,
    lineHeight: 18
  },
  MODAL_INVITE_FRIENDS: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLOR.PALETTE.primary,
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 20
  },
  MODAL_INVITE_FRIENDS_TEXT: {
    color: COLOR.PALETTE.primary,
    fontSize: 18
  },
  TRANSACTION_IMAGE_CONTAINER: {
    width: 50,
    height: 50,
    borderRadius: 25
  },
  TRANSACTION_CONTENT_CONTAINER: {
    width: 50,
    height: 50,
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  FINPLAN_NAME: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    fontFamily: TYPOGRAPHY.primaryBold,
    width: 200
  },
  SELECTED_ITEM_IMAGE: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLOR.PALETTE.primary,
    alignItems: "center",
    justifyContent: "center"
  },
  SELECTED_ITEM_TEXT: {
    fontSize: 22,
    marginLeft: 10,
    maxWidth: 250
  },
  CARD_ICON_STYLE: {
    width: 65,
    height: 40,
    resizeMode: "contain",
    marginRight: "auto"
  }
})
