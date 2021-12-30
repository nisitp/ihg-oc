"use strict"

module.exports = {
  "extends": "stylelint-config-standard",
  "plugins": [
    "stylelint-scss"
  ],
  "rules": {
    "at-rule-no-unknown": null,
    "block-no-empty": null,
    "scss/at-rule-no-unknown": true,
    "at-rule-empty-line-before": null,
    "at-rule-empty-line-before": [
      "always", {
        "ignoreAtRules": [ "else" ]
      }
    ],
    "block-opening-brace-space-before": "always",
    "block-closing-brace-newline-after": [
      "always", {
        "ignoreAtRules": [ "if", "else" ]
      }
    ],
    "at-rule-name-space-after": "always",
    "scss/at-else-closing-brace-newline-after": "always-last-in-chain",
    "scss/at-else-closing-brace-space-after": "always-intermediate",
    "scss/at-else-empty-line-before": "never",
    "scss/at-if-closing-brace-newline-after": "always-last-in-chain",
    "scss/at-if-closing-brace-space-after": "always-intermediate",
    "at-rule-empty-line-before": null,
    "function-name-case": null,
    "no-empty-source": null,
    "no-descending-specificity": null,
    "max-empty-lines": null,
    "no-eol-whitespace": [ true, { "severity": "warning" }],
    "rule-empty-line-before": [ "always", { "ignore": ["after-comment", "first-nested"],  "severity": "warning" }],    
    "declaration-empty-line-before": [ "always", { "except": ["after-comment", "after-declaration", "first-nested"],  "severity": "warning" }],
    "declaration-block-semicolon-newline-after": [ "always", { "severity": "warning"}],
    "font-family-no-missing-generic-family-keyword": null,
    "no-eol-whitespace": [ true, { "severity": "warning" }],
    "block-closing-brace-newline-before": [ "always", { "severity": "warning" }],
    "block-closing-brace-empty-line-before": [ "never", { "severity": "warning" }],
    "selector-type-no-unknown": null
  }
}
