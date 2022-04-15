import { ViewStyle, TextStyle } from "react-native"
import { COLOR, TYPOGRAPHY } from "../../theme"

/**
 * All text will start off looking like this.
 */
const BASE_VIEW: ViewStyle = {
  paddingVertical: 8,
  paddingHorizontal: 8,
  borderRadius: 22,
  justifyContent: "center",
  alignItems: "center",
  minHeight: 47,
  minWidth: 130
}

const BASE_TEXT: TextStyle = {
  paddingHorizontal: 12,
  paddingVertical: 4,
  fontFamily: TYPOGRAPHY.primaryBold
}

/**
 * All the variations of text styling within the app.
 *
 * You want to customize these to whatever you need in your app.
 */
export const viewPresets: Record<string, ViewStyle> = {
  /**
   * A smaller piece of secondard information.
   */
  primary: { ...BASE_VIEW, backgroundColor: COLOR.PALETTE.primary } as ViewStyle,

  secondary: {
    ...BASE_VIEW,
    backgroundColor: COLOR.PALETTE.white,
    borderColor: COLOR.PALETTE.black,
    borderWidth: 1
  } as ViewStyle,

  terciary: {
    ...BASE_VIEW,
    backgroundColor: COLOR.PALETTE.black,
    borderColor: COLOR.PALETTE.black,
    borderWidth: 1
  } as ViewStyle,

  disabled: { ...BASE_VIEW, backgroundColor: COLOR.PALETTE.primaryDisabled } as ViewStyle,

  /**
   * A button without extras.
   */
  link: {
    ...BASE_VIEW,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: "flex-start",
  } as ViewStyle,
}

export const textPresets: Record<ButtonPresetNames, TextStyle> = {
  primary: { ...BASE_TEXT, fontSize: 18, color: COLOR.PALETTE.white } as TextStyle,
  secondary: { ...BASE_TEXT, fontSize: 18, color: COLOR.PALETTE.black } as TextStyle,
  terciary: { ...BASE_TEXT, fontSize: 18, color: COLOR.PALETTE.primary } as TextStyle,
  link: {
    ...BASE_TEXT,
    color: COLOR.text,
    paddingHorizontal: 0,
    paddingVertical: 0,
  } as TextStyle,
}

/**
 * A list of preset names.
 */
export type ButtonPresetNames = keyof typeof viewPresets
