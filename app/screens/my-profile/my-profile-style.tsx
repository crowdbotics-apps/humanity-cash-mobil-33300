import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  BACK_BUTON_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16
  },
  BACK_IMAGE_BOX: {
    borderRadius: 3,
    height: 150,
    width: METRICS.screenWidth * 0.95,
  },
  BACK_IMAGE_CONTAINER: {
    alignItems: 'flex-end',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.lightGreen,
    borderRadius: 3,
    height: 150,
    marginTop: 15,
    width: METRICS.screenWidth * 0.95,
  },
  BIG_INPUT_STYLE: {
    alignSelf: 'center',
    height: 120,
    width: METRICS.screenWidth * 0.90,
  },
  BIG_INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    flexDirection: 'row',
    height: 120,
    justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  BUSINESS_IMAGES_CONTAINER: {},
  CONTAINER: {},
  EDIT_CONTAINER: {
    marginBottom: 80
  },
  HEADER: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
  },
  IMAGE_BOX: {
    borderRadius: 42,
    height: 84,
    width: 84
  },
  IMAGE_BOX_LABEL: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  IMAGE_BOX_VALIDATION: {
    color: `${COLOR.PALETTE.strongGreen}70`,
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  IMAGE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.lightGreen,
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    width: 84,
  },
  IMAGE_CONTAINER_MARGIN: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.white,
    borderRadius: 45,
    height: 90,
    justifyContent: 'center',
    marginTop: -45,
    width: 90
  },
  INPUT_LABEL_ERROR: {
    color: COLOR.PALETTE.pink,
    fontSize: 10,
  },
  INPUT_LABEL_STYLE: {
    color: COLOR.PALETTE.black,
    fontSize: 10,
  },
  INPUT_LABEL_STYLE_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: METRICS.screenWidth * 0.95
  },
  INPUT_STYLE: {
    alignSelf: 'center',
    height: 55,
    width: METRICS.screenWidth * 0.90,
  },
  INPUT_STYLE_CONTAINER: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  INPUT_STYLE_CONTAINER_ERROR: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderColor: COLOR.PALETTE.pink,
    borderRadius: 3,
    borderWidth: 0.8,
    flexDirection: 'row',
    height: 55,
    justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95
  },
  LINE: {
    alignSelf: 'center',
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    marginVertical: 10,
    width: METRICS.screenWidth * 0.95
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between'
  },
  ROOT_CONTAINER: {
    backgroundColor: COLOR.PALETTE.white,
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  SELECTS_CONTAINER: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_ICON: {
    alignItems: 'center',
    height: 55,
     justifyContent: 'center',
    marginTop: 10,
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_ICON_2: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 55,
    justifyContent: 'space-between',
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_INPUT_STYLE_CONTAINER: {
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderRadius: 3,
    height: 55,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_INPUT_STYLE_CONTAINER_OPEN: {
    alignSelf: 'center',
    backgroundColor: `${COLOR.PALETTE.green}25`,
    borderColor: COLOR.PALETTE.orange,
    borderRadius: 3,
    borderWidth: 0.8,
    marginTop: 10,
    width: METRICS.screenWidth * 0.95,
  },
  SELECT_LABEL: {
    color: COLOR.PALETTE.orange,
    fontSize: 16,
    marginLeft: 20
  },
  STEP_SUB_TITLE: {
    color: COLOR.PALETTE.black,
    fontSize: 16,
    marginBottom: 20,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90
  },
  STEP_TITLE: {
    color: COLOR.PALETTE.green,
    fontSize: 32,
    marginLeft: 10,
    marginTop: 10
  }
})