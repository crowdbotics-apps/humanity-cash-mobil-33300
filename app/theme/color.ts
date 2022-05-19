/**
 * Roles for colors.  Prefer using these over the PALETTE.  It makes it easier
 * to change things.
 *
 * The only roles we need to place in here are the ones that span through the app.
 *
 * If you have a specific use-case, like a spinner color.  It makes more sense to
 * put that in the <Spinner /> component.
 */
import {PALETTE} from "./palette";

export const COLOR = {
  /**
   * The PALETTE is available to use, but prefer using the name.
   */
  PALETTE,
  /**
   * A helper for making something see-thru. Use sparingly as many layers of transparency
   * can cause older Android devices to slow down due to the excessive compositing required
   * by their under-powered GPUs.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The screen background.
   */
  background: PALETTE.background,
  /**
   * The main tinting color.
   */
  primary: PALETTE.pacific_blue,
  /**
   * The main tinting color, but darker.
   */
  primaryDarker: PALETTE.marina_dark,
  /**
   * A subtle color used for borders and lines.
   */
  line: PALETTE.offWhite,
  /**
   * The default color of text in many components.
   */
  text: PALETTE.marina_dark,
  /**
   * Secondary information.
   */
  dim: PALETTE.lightGrey,
  /**
   * Error messages and icons.
   */
  error: PALETTE.angry,

  /**
   * Storybook background for Text stories, or any stories where
   * the text color is color.text, which is white by default, and does not show
   * in Stories against the default white background
   */
  storybookDarkBg: PALETTE.black,

  /**
   * Storybook text color for stories that display Text components against the
   * white background
   */
  storybookTextColor: PALETTE.black,
}
