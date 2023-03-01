import {StyleSheet} from "react-native"
import {COLOR, TYPOGRAPHY} from "../../theme"

export default StyleSheet.create({
  BACK_BUTON_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16
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
  CANCEL_CONFIRM_BUTTON_CONTAINER: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
    marginTop: "auto"
  },
  CARD_ICON_STYLE: {
    height: 40,
    marginRight: "auto",
    resizeMode: "contain",
    width: 65
  },
  CLOSE_MODAL_BUTTON: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 70
  },
  CODE_INPUT_TEXT: {
    alignSelf: "center",
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    marginTop: 40,
    textAlign: "center"
  },
  CONTENT: {
    flex: 1,
    lineHeight: 18,
    marginHorizontal: 15,
    textAlign: "center"
  },
  CONTENT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    borderRadius: 10,
    elevation: 3,
    flex: 1,
    margin: 15,
    padding: 10,
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3
  },
  EDIT_PHOTO: {
    alignItems: "center",
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: 10,
    top: 0,
    width: 24
  },
  EMPTY_IMAGE: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 75,
    height: 150,
    justifyContent: "center",
    marginVertical: 24,
    width: 150
  },
  FEEDBACK_SELECTOR_CONTAINER: {
    alignItems: "center",
    backgroundColor: COLOR.PALETTE.transparent,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  FEEDBACK_SELECTOR_CONTAINER_ALTERNATIVE: {
    alignItems: "center",
    backgroundColor: COLOR.PALETTE.transparent,
    borderColor: COLOR.PALETTE.lightGrey,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    width: '100%',
  },
  FEEDBACK_SELECTOR_TEXT_CONTAINER: {
    alignItems: "center",
    backgroundColor: COLOR.PALETTE.lighterGrey2,
    borderRadius: 5,
    color: COLOR.PALETTE.black,
    marginTop: 20,
    minHeight: 150,
    padding: 10,
    textAlignVertical: "top"
  },
  FINPLAN_NAME: {
    color: COLOR.PALETTE.black,
    fontFamily: TYPOGRAPHY.primary,
    fontSize: 16,
    width: 200
  },
  FIRST_TITLE_MODAL: {
    alignSelf: "center",
    flexDirection: "row",
    marginTop: 10
  },
  FORM_CONTAINER: {
    flex: 1,
    marginTop: 20
  },
  FP_LOGO_MODAL: {
    alignSelf: "center",
    height: 38,
    width: 120,
  },
  HEADER_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
    },
  HEADER_SECTION_LIST_CONTAINER: {
    height: 24,
    justifyContent: "center"
  },
  HEADER_SECTION_LIST_TEXT: {
    color: COLOR.PALETTE.gray2,
    fontFamily: TYPOGRAPHY.primary,
    marginLeft: 20
  },
  IMAGE: {
    alignItems: "center",
    borderRadius: 60,
    height: 120,
    justifyContent: "center",
    width: 120
  },
  IMAGE_CONTAINER: {
    alignSelf: "center",
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 60,
    height: 120,
    marginTop: 20,
    position: "relative",
    width: 120
  },
  MODAL_BODY: {
    backgroundColor: COLOR.PALETTE.white,
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    bottom: 0,
    elevation: 5,
    height: "80%",
    padding: 20,
    paddingBottom: 0,
    position: "absolute",
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: "100%"
  },
  MODAL_INVITE_FRIENDS: {
    alignItems: "center",
    borderColor: COLOR.PALETTE.primary,
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10
  },
  MODAL_INVITE_FRIENDS_TEXT: {
    color: COLOR.PALETTE.primary,
    fontSize: 18
  },
  PAGINATOR_BUTTON: {
    alignItems: "center",
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 15,
    height: 30,
    justifyContent: "center",
    width: 30
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1
  },
  SECTION_LIST_ITEM_BODY: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10
  },
  SECTION_LIST_ITEM_BUTTON: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: "auto",
    marginRight: 20
  },
  SECTION_LIST_ITEM_BUTTON_TEXT: {
    color: COLOR.PALETTE.primary,
    fontFamily: TYPOGRAPHY.primary
  },
  SECTION_LIST_ITEM_IMAGE: {
    borderRadius: 16,
    height: 32,
    marginLeft: 25,
    width: 32
  },
  SECTION_LIST_ITEM_TEXT: {
    fontSize: 16,
    marginLeft: 10,
    maxWidth: 230
  },
  SELECTED_ITEM_IMAGE: {
    alignItems: "center",
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60
  },
  SELECTED_ITEM_TEXT: {
    fontSize: 22,
    marginLeft: 10,
    maxWidth: 250
  },
  SEPARATOR: {
    backgroundColor: COLOR.PALETTE.red,
    height: 1,
    marginVertical: 7
  },
  SUBTITLE: {
    color: COLOR.PALETTE.gray,
    fontSize: 14
  },
  SUBTITLE_BLACK: {
    color: COLOR.PALETTE.black,
    fontSize: 12
  },
  SUBTITLE_PRIMARY: {
    color: COLOR.PALETTE.primary,
    fontFamily: TYPOGRAPHY.primary,
    fontSize: 12
  },
  TITLE: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center"
  },
  TRANSACTION_CONTENT_CONTAINER: {
    alignItems: "center",
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  TRANSACTION_IMAGE_CONTAINER: {
    borderRadius: 25,
    height: 50,
    width: 50
  },
  WARNING_MESSAGE_CONTAINER: {
    alignItems: "center",
    borderColor: COLOR.PALETTE.green,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: "row",
    marginTop: 10,
    padding: 10
  },
  WARNING_MESSAGE_TEXT: {
    color: COLOR.PALETTE.primary,
    flex: 1,
    flexWrap: "wrap",
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 10
  },
  cellRoot: {
    alignItems: "center",
    borderBottomColor: COLOR.PALETTE.red,
    borderBottomWidth: 2,
    height: 40,
    justifyContent: "center",
    width: 30
  },
  cellText: {
    color: COLOR.PALETTE.pureblack,
    fontSize: 34,
    textAlign: "center"
  },
  codeFieldRoot: {
    backgroundColor: COLOR.PALETTE.white,
    borderColor: COLOR.PALETTE.red,
    borderRadius: 90,
    borderWidth: 1,
    elevation: 1,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: 230
  },
  focusCell: {
    borderBottomColor: COLOR.PALETTE.pureblack,
    borderBottomWidth: 2
  }
})
