import { Animated, StyleSheet } from 'react-native';
import { COLOR, TYPOGRAPHY } from '../../theme';

export default StyleSheet.create({
  TEXT_CONTAINER: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignSelf: 'center',
    borderColor: 'green',
    alignItems: 'center',
    overflow: 'scroll',
    paddingTop: 10,
    paddingBottom: 10
  },
  TEXT: {
    fontFamily: TYPOGRAPHY.primary,
    fontSize: 12,
    color: COLOR.PALETTE.gray,
  },
  ACTION_TEXT: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.primary,
    color: COLOR.PALETTE.marina_dark,
  },

  MAIN_CONTAINER: {
    flexDirection: 'column',
    display: 'flex',
    width: '90%',
    height: '80%',
  },
  ROOT: {
    backgroundColor: COLOR.PALETTE.background,
    alignItems: 'center',
  },
  TITLE: {
    color: COLOR.PALETTE.marina_dark,
    fontSize: 25,
    fontFamily: TYPOGRAPHY.primary,
    marginTop: 22,
    marginLeft: 0,
    marginRight: 22,
    marginBottom: 10
  },
})
