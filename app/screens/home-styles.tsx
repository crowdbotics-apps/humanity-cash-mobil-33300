import { StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY } from '../theme';

export default StyleSheet.create({
  BLUR_STYLES: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 9999
  },
  BUTTONS_CONTAINER: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 20
  },
  BUTTON_OVERWRITE: {
    minHeight: 32,
    minWidth: 150,
    paddingHorizontal: 0
  },
  BUTTON_OVERWRITE_TEXT: {
    fontSize: 12
  },
  CANCEL_CONFIRM_BUTTON_CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
    marginTop: 'auto'
  },
  CARD_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    borderRadius: 10,
    elevation: 3,
    margin: 15,
    padding: 10,
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3
  },
  CODE_INPUT_TEXT: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: 40,
    textAlign: 'center',
  },
  COLOR_PRIMARY: {
    color: COLOR.PALETTE.primary
  },
  FINPLAN_CONTENT_CONTAINER: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 30,
    borderWidth: 1,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  FINPLAN_IMAGE_CONTAINER: {
    borderRadius: 30,
    height: 60,
    width: 60
  },
  FINPLAN_NAME: {
    color: COLOR.PALETTE.black,
    fontFamily: TYPOGRAPHY.primary,
    fontSize: 16,
    width: 200
  },
  FINPLAN_SUBTITLE: {
    color: COLOR.PALETTE.black,
    fontSize: 14,
    marginVertical: 6,
    width: 200
  },
  FIRST_TITLE_MODAL: {
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  FORGOT_PASSWORD_LINK: {
    color: COLOR.PALETTE.primary,
    fontSize: 14,
    marginTop: 10
  },
  FORGOT_PASSWORD_TEXT: {
    fontSize: 12,
    marginBottom: 20,
    marginTop: 15
  },
  FORM_CONTAINER: {
    flex: 1,
    marginTop: 20
  },
  IMAGE_CONTAINER_C: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.white,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  IMAGE_CONTENT_CONTAINER: {
    alignItems: 'center',
    backgroundColor: COLOR.PALETTE.white,
    borderColor: COLOR.PALETTE.lightGrey,
    borderRadius: 25,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: 50
  },
  LOGO_MODAL: {
    alignSelf: 'center',
    height: 35,
    width: 34,
  },
  MODAL_BODY: {
    backgroundColor: COLOR.PALETTE.white,
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    bottom: 0,
    elevation: 5,
    height: '80%',
    padding: 20,
    paddingBottom: 0,
    position: 'absolute',
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width: '100%'
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.white
  },
  SEPARATOR: {
    backgroundColor: COLOR.PALETTE.red,
    height: 1,
    marginVertical: 7
  },
  SOCIAL_BUTTON_TEXT: {
    color: COLOR.PALETTE.primary,
    fontSize: 14,
    marginTop: 15
  },
  SUBTITLE_PRIMARY: {
    color: COLOR.PALETTE.black,
    fontFamily: TYPOGRAPHY.primary,
    fontSize: 14,
    marginRight: 'auto',
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
  cellRoot: {
    alignItems: 'center',
    borderBottomColor: COLOR.PALETTE.red,
    borderBottomWidth: 2,
    height: 40,
    justifyContent: 'center',
    width: 30
  },
  cellText: {
    color: COLOR.PALETTE.pureblack,
    fontSize: 34,
    textAlign: 'center',
  },
  codeFieldRoot: {
    backgroundColor: COLOR.PALETTE.white,
    borderColor: COLOR.PALETTE.red,
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
    borderBottomColor: COLOR.PALETTE.pureblack,
    borderBottomWidth: 2
  },
})
