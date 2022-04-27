module.exports = {
  root: true,
  extends: "@react-native-community",
  rules: {
    "quotes": [2, "double", {
      "avoidEscape": true
    }],
    "comma-dangle": ["error", "never"],
    semi: [2, "never"],
    "prettier/prettier": [
      "error",
      {
        semi: false,
        parser: "babel",
        trailingComma: "none",
        arrowParens: "avoid"
      },
    ]
  }
}
