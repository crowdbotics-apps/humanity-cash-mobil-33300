import { StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY } from '../theme';

export default StyleSheet.create({
  ADDRESS: {
    color: COLOR.PALETTE.black,
    fontSize: 12
  },
  BUTTONS_CONTAINER: {
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 90,
    marginTop: 'auto'
  },
  CARD_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    borderRadius: 10,
    elevation: 3,
    flex: 1,
    margin: 15,
    padding: 10,
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3
  },
  CARD_ICON_STYLE: {
    height: 40,
    marginRight: 'auto',
    resizeMode: 'contain',
    width: 65,
  },
  CODE_INPUT_TEXT: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: 40,
    textAlign: 'center',
  },
  CONTAINER:{
    alignItems:"center",
    borderRadius:8,
    borderWidth:0,
    height: 20,
    marginTop:20,
    minWidth:150,
  },
  CONTENT: {
    flex: 1,
    lineHeight: 18,
    marginHorizontal: 15,
    textAlign: 'center'
  },
  EDIT_PHOTO: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 0,
    width: 24,
  },
  EMPTY_IMAGE: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 75,
    height: 150,
    justifyContent: 'center',
    marginVertical: 24,
    width: 150,
  },
  FEEDBACK_SELECTOR_CONTAINER: {
    backgroundColor: COLOR.PALETTE.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderColor: COLOR.PALETTE.gray,
    borderRadius: 0,
    borderRightWidth:0,
    borderLeftWidth:0,
    borderTopWidth:0,
    borderWidth: 1.3,
    alignItems: 'center',
    // marginTop: 15
    marginTop: 0
  },
  FEEDBACK_SELECTOR_TEXT_CONTAINER: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.lighterGrey2,
    borderColor: COLOR.PALETTE.lighterGrey,
    borderRadius: 5,
    borderWidth: 1,
    color: COLOR.PALETTE.black,
    marginTop: 20,
    minHeight: 150,
    padding: 10,
    textAlignVertical: 'top'
  },
  FINPLAN_NAME: {
    color: COLOR.PALETTE.black,
    fontFamily: TYPOGRAPHY.primaryBold,
    fontSize: 16,
    width: 200
  },
  FIRST_TITLE_MODAL: {
    alignSelf: 'center',
    flexDirection: 'row',
    fontFamily: TYPOGRAPHY.primary,
    marginTop: 10,
  },
  FORM_CONTAINER: {
    flex: 1,
    marginTop: 10
  },
  HEADER_SECTION_LIST_CONTAINER: {
    height: 24,
    justifyContent: 'center',
  },
  HEADER_SECTION_LIST_TEXT: {
    color: COLOR.PALETTE.gray2,
    fontFamily: TYPOGRAPHY.primaryBlack,
    marginLeft: 20
  },
  IMAGE: {
    alignItems: 'center',
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  IMAGE_CONTAINER: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 60,
    height: 120,
    marginTop: 20,
    position: 'relative',
    width: 120,
  },
  LOGO_MODAL: {
    alignSelf: 'center',
    height: 35,
    width: 34,
  },
  MODAL_BODY: {
    alignSelf:"center",
    backgroundColor: COLOR.PALETTE.background,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    bottom: 0,
    elevation: 5,
    height: '90%',
    padding: 20,
    paddingBottom: 0,
    position: 'absolute',
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '100%'
  },
  MODAL_INVITE_FRIENDS: {
    alignItems: 'center',
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
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1
  },
  SECTION_LIST_ITEM_BODY: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  },
  SECTION_LIST_ITEM_BUTTON: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 20,
  },
  SECTION_LIST_ITEM_BUTTON_TEXT: {
    color: COLOR.PALETTE.primary,
    fontFamily: TYPOGRAPHY.primaryBold
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
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  SELECTED_ITEM_TEXT: {
    fontSize: 22,
    marginLeft: 10,
    maxWidth: 250
  },
  SEPARATOR: {
    backgroundColor: '#EEEDED',
    height: 1,
    marginVertical: 7
  },
  SUBTITLE: {
    color: COLOR.PALETTE.gray,
    fontSize: 14
  },
  SUBTITLE_PRIMARY: {
    color: COLOR.PALETTE.primary,
    fontFamily: TYPOGRAPHY.primaryBold,
    fontSize: 12
  },
  TITLE: {
    fontSize: 20,
    marginTop: 10,
    textAlign: 'center'
  },
  TRANSACTION_CONTENT_CONTAINER: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    width: 50
  },
  TRANSACTION_IMAGE_CONTAINER: {
    borderRadius: 25,
    height: 50,
    width: 50
  },
  WARNING_MESSAGE_CONTAINER: {
    alignItems: 'center',
    borderColor: COLOR.PALETTE.primary,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    marginTop: 10,
    padding: 10
  },
  WARNING_MESSAGE_TEXT: {
    color: COLOR.PALETTE.primary,
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 14,
    lineHeight: 18,
    marginLeft: 10
  },
  cellRoot: {
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 30
  },
  cellText: {
    color: '#000',
    fontSize: 34,
    textAlign: 'center',
  },
  codeFieldRoot: {
    backgroundColor: COLOR.PALETTE.white,
    borderColor: '#E9E9E9',
    borderRadius: 90,
    borderWidth: 1,
    elevation: 1,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: 230
  },
  focusCell: {
    borderBottomColor: '#000000',
    borderBottomWidth: 2
  }
})
