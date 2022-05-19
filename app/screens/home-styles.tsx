import { StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY } from '../theme';

export default StyleSheet.create({
  ROOT: {
    backgroundColor: COLOR.PALETTE.white
  },
  BLUR_STYLES: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 9999
  },
  MODAL_BODY: {
    height: '80%',
    width: '100%',
    backgroundColor: COLOR.PALETTE.white,
    padding: 20,
    paddingBottom: 0,
    position: 'absolute',
    bottom: 0,
    elevation: 5,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2
  },
  LOGO_MODAL: {
    width: 34,
    height: 35,
    alignSelf: 'center',
  },
  FIRST_TITLE_MODAL: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'center',
  },
  COLOR_PRIMARY: {
    color: COLOR.PALETTE.primary
  },
  FORM_CONTAINER: {
    marginTop: 20,
    flex: 1
  },
  FORGOT_PASSWORD_LINK: {
    color: COLOR.PALETTE.primary,
    marginTop: 10,
    fontSize: 14
  },
  FORGOT_PASSWORD_TEXT: {
    fontSize: 12,
    marginTop: 15,
    marginBottom: 20
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 230,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    borderRadius: 90,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#E9E9E9',
    shadowColor: COLOR.PALETTE.black,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: COLOR.PALETTE.white
  },
  cellRoot: {
    width: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 2
  },
  cellText: {
    color: '#000',
    fontSize: 34,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#000000',
    borderBottomWidth: 2
  },
  SOCIAL_BUTTON_TEXT: {
    color: COLOR.PALETTE.primary,
    marginTop: 15,
    fontSize: 14
  },
  CANCEL_CONFIRM_BUTTON_CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 50
  },
  CODE_INPUT_TEXT: {
    alignSelf: 'center',
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    marginTop: 40,
    textAlign: 'center',
  },
  BUTTONS_CONTAINER: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 15
  },
  BUTTON_OVERWRITE: {
    minHeight: 32,
    minWidth: 150,
    paddingHorizontal: 0
  },
  BUTTON_OVERWRITE_TEXT: {
    fontSize: 12
  },
  SEPARATOR: {
    height: 1,
    backgroundColor: '#EEEDED',
    marginVertical: 7
  },
  SUBTITLE_PRIMARY: {
    fontSize: 14,
    color: COLOR.PALETTE.black,
    fontFamily: TYPOGRAPHY.primaryBold,
    marginRight: 'auto',
  },
  CARD_CONTAINER: {
    margin: 15,
    borderRadius: 10,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: COLOR.PALETTE.black,
    shadowOpacity: 0.3,
    elevation: 3,
    padding: 10,
    backgroundColor: COLOR.PALETTE.white
  },
  FINPLAN_IMAGE_CONTAINER: {
    width: 60,
    height: 60,
    borderRadius: 30
  },
  FINPLAN_CONTENT_CONTAINER: {
    width: 60,
    height: 60,
    backgroundColor: COLOR.PALETTE.primary,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  IMAGE_CONTENT_CONTAINER: {
    width: 50,
    height: 50,
    backgroundColor: COLOR.PALETTE.white,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: COLOR.PALETTE.lightGrey
  },
  IMAGE_CONTAINER_C: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLOR.PALETTE.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FINPLAN_NAME: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    fontFamily: TYPOGRAPHY.primaryBold,
    width: 200
  },
  FINPLAN_SUBTITLE: {
    fontSize: 14,
    color: COLOR.PALETTE.black,
    width: 200,
    marginVertical: 6
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
    alignItems: 'center',
    justifyContent: 'center'
  },
})
