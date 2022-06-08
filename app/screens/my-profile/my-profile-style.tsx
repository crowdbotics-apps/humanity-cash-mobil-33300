import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY, METRICS } from '../../theme';

export default StyleSheet.create({
  ROOT: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white,
    justifyContent: 'space-between'
  },
  CONTAINER: {},
  ROOT_CONTAINER: {
    flex: 1,
    backgroundColor: COLOR.PALETTE.white,
    justifyContent: 'space-between',
    minHeight: METRICS.screenHeight,
  },
  HEADER: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  STEP_TITLE: {
    fontSize: 32,
    color: COLOR.PALETTE.green,
    marginLeft: 10,
    marginTop: 10
  },
  STEP_SUB_TITLE: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    marginLeft: 10,
    width: METRICS.screenWidth * 0.90,
    marginBottom: 20
  },
  BACK_BUTON_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.black
  },
  LINE: {
    width: METRICS.screenWidth * 0.95,
    backgroundColor: COLOR.PALETTE.strongGreen,
    height: 1,
    alignSelf: 'center',
    marginVertical: 10
  },
  EDIT_CONTAINER: {
    marginBottom: 80
  },
  IMAGE_CONTAINER: {
    alignItems: 'center',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLOR.PALETTE.lightGreen,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  BACK_IMAGE_BOX: {
    width: METRICS.screenWidth * 0.95,
    height: 150,
    borderRadius: 3,
  },
  IMAGE_BOX: {
    width: 84,
    height: 84,
    borderRadius: 42
  },
  IMAGE_BOX_LABEL: {
    fontSize: 16,
    color: COLOR.PALETTE.black,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 15
  },
  IMAGE_BOX_VALIDATION: {
    fontSize: 12,
    color: `${COLOR.PALETTE.strongGreen}70`,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 15
  },
  INPUT_LABEL_STYLE_CONTAINER: {
    flexDirection: 'row',
    width: METRICS.screenWidth * 0.95,
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: 20
  },
  INPUT_LABEL_STYLE: {
    fontSize: 10,
    color: COLOR.PALETTE.black,
  },
  INPUT_LABEL_ERROR: {
    fontSize: 10,
    color: COLOR.PALETTE.pink,
  },
  INPUT_STYLE_CONTAINER_ERROR: {
    borderRadius: 3,
    height: 55,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
    borderColor: COLOR.PALETTE.pink,
    borderWidth: 0.8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  INPUT_STYLE_CONTAINER: {
    borderRadius: 3,
    height: 55,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  INPUT_STYLE: {
    height: 55,
    width: METRICS.screenWidth * 0.90,
    alignSelf: 'center',
  },
  BUSINESS_IMAGES_CONTAINER: {

  },
  BACK_IMAGE_CONTAINER: {
    marginTop: 15,
    alignItems: 'flex-end',
    alignSelf: 'center',
    width: METRICS.screenWidth * 0.95,
    height: 150,
    borderRadius: 3,
    backgroundColor: COLOR.PALETTE.lightGreen,
  },
  IMAGE_CONTAINER_MARGIN: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLOR.PALETTE.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: -45
  },
  BIG_INPUT_STYLE: {
    height: 120,
    width: METRICS.screenWidth * 0.90,
    alignSelf: 'center',
  },
  BIG_INPUT_STYLE_CONTAINER: {
    borderRadius: 3,
    height: 120,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  SELECT_INPUT_STYLE_CONTAINER_OPEN: {
    borderRadius: 3,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
    borderColor: COLOR.PALETTE.orange,
    borderWidth: 0.8,
  },
  SELECT_INPUT_STYLE_CONTAINER: {
    borderRadius: 3,
    height: 55,
    width: METRICS.screenWidth * 0.95,
    backgroundColor: `${COLOR.PALETTE.green}25`,
    alignSelf: 'center',
    marginTop: 10,
  },
  SELECT_ICON: {
    width: METRICS.screenWidth * 0.95,
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
  },
  SELECT_LABEL: {
    color: COLOR.PALETTE.orange,
    fontSize: 16,
    marginLeft: 20
  },









})