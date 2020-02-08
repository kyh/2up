import React from 'react';
import styled, {
  StyledComponentProps,
  DefaultTheme
} from 'styled-components/macro';
import UIfx from 'uifx';
import { SoundMap } from 'styles/sounds';

const clickSound = new UIfx(SoundMap.click);

const border =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='116' height='36' viewBox='0 0 116 36'%3E%3Cpath fill='%231A1919' fill-rule='evenodd' d='M114.937,70.87 C115.008,71.193 114.741,71.02 114.74,70.87 C114.502,70.91 114.525,70.689 114.248,70.772 C114.038,70.506 113.523,70.762 113.361,70.87 C109.961,70.764 105.978,70.928 102.337,70.772 C100.671,70.646 99.68,71.199 98.006,71.066 C97.241,71.173 96.504,71.154 95.742,71.165 C95.619,71.166 95.579,71.262 95.545,71.264 C95.483,71.268 95.08,71.163 94.758,71.165 C94.677,71.165 94.662,71.27 94.56,71.264 C94.545,71.263 94.451,71.165 94.364,71.165 C94.238,71.165 94.203,71.262 94.167,71.264 C94.089,71.268 94.068,71.16 93.97,71.165 C93.338,71.193 92.558,71.264 91.706,71.264 C91.142,71.264 90.261,71.452 89.639,71.264 C89.105,71.103 88.121,71.227 87.277,71.264 C85.007,71.363 82.747,71.314 80.583,71.559 C79.273,71.469 78.093,71.35 76.646,71.264 C76.563,71.259 76.55,71.165 76.449,71.165 C76.368,71.165 76.352,71.268 76.252,71.264 C74.781,71.204 73.287,70.968 71.724,70.968 C68.651,70.968 65.452,70.961 62.275,71.066 C60.841,71.117 59.31,71.038 57.648,71.066 C56.698,71.268 54.603,71.08 53.415,71.361 C50.607,71.433 47.529,71.506 44.36,71.46 C41.419,71.418 38.416,71.289 35.599,71.657 C28.151,72.241 19.88,71.811 12.171,71.756 C11.604,71.52 10.891,71.645 10.104,71.657 C9.698,71.664 9.276,71.706 8.923,71.657 C8.593,71.611 8.329,71.473 8.037,71.361 C7.862,71.012 7.395,70.955 7.152,70.673 C6.543,68.689 6.628,66.012 6.364,63.684 C6.272,61.217 5.967,58.963 5.872,56.498 C5.913,53.898 5.403,51.849 5.479,49.215 C5.228,48.809 5.286,48.094 5.281,47.441 C5.27680414,45.535 5.254,43.609 5.38,41.832 C8.935,41.679 12.415,41.451 16.01,41.34 C16.276,41.113 16.96,41.305 17.389,41.24 C18.718,41.192 20.253,41.35 21.425,41.143 C23.075,40.955 25.037,41.079 26.838,41.044 C27.104,40.817 27.788,41.009 28.217,40.945 C31.212,41.154 34.646,41.033 37.666,40.945 C43.167,40.902 48.655,40.844 54.105,40.75 C54.628,40.88 54.841,40.342 55.089,40.75 L56.467,40.75 C62.39,40.707 68.365,40.737 74.284,40.553 C80.249,40.365 86.18,40.773 92.1,40.453 C92.77,40.67 93.599,40.727 94.364,40.848 C98.299,40.846 102.073,40.682 106.078,40.75 C106.938,40.854 107.186,40.348 108.046,40.453 C108.762,40.414 109.649,40.547 110.211,40.356 C110.37,40.383 110.381,40.262 110.507,40.257 L111.689,40.257 C112.149,40.157 112.015,40.652 112.476,40.553 C112.612,40.777 113.161,40.589 113.46,40.65 C113.655,40.816 114.075,40.758 114.346,40.848 C114.548,45.213 114.304,51.049 114.641,55.908 C114.831,58.343 115.061,60.738 115.036,63.39 C115.351,65.927 114.839,68.248 114.937,70.87 Z M117.004,70.968 C117.073,65.555 116.968,60.853 116.511,55.908 C116.287,55.772 116.475,55.223 116.413,54.924 L116.413,43.998 C116.413,42.787 116.494,41.615 116.314,40.453 C116.321,40.086 116.156,39.891 115.921,39.765 C115.772,39.52 115.781,39.117 115.429,39.076 C115.229,38.611 114.666,39.053 114.444,39.174 C114.213,39.144 114.075,39.019 113.756,39.076 C113.849,38.72 113.369,38.938 113.165,38.879 C112.331,38.711 111.053,38.746 110.211,38.879 C107.269,39.033 104.191,38.879 101.058,38.879 L91.607,38.879 C90.927,38.903 90.254,39.116 89.541,39.174 C88.787,39.235 88.042,39.111 87.277,39.076 C86.506,39.04 85.748,39.07 85.013,38.978 C84.247,38.88 83.546,38.729 82.848,38.683 L80.386,38.683 C80.261,38.688 80.25,38.809 80.091,38.781 C77.092,38.886 74.421,38.76 71.625,38.978 C66.309,39.205 60.57,39.012 55.089,39.076 C54.758,39.139 54.175,38.949 54.007,39.174 C51.247,39.467 48.136,38.928 45.344,39.272 C43.806,39.211 42.561,39.443 41.013,39.371 C40.85,39.378 40.685,39.361 40.521,39.371 C40.442,39.375 40.333,39.469 40.324,39.469 C40.098,39.482 40.102,39.256 39.93,39.469 C39.882,39.529 39.803,39.372 39.832,39.371 C39.673,39.379 39.609,39.379 39.536,39.469 C39.487,39.531 39.411,39.371 39.438,39.371 C38.951,39.374 38.465,39.532 37.765,39.371 C35.758,39.542 32.064,39.433 29.398,39.567 C27.267,39.506 25.132,39.501 22.999,39.567 C22.284,39.59 21.64,39.722 20.933,39.765 C18.067,39.937 15.301,39.711 12.467,39.666 C9.991,39.947 7.207,39.918 4.593,40.061 C4.01,40.397 3.254,40.559 2.821,41.044 C3.152,43.534 3.385,46.123 3.313,49.018 C3.485,51.607 3.707,54.405 3.707,57.188 C3.707,60.008 3.864,62.772 4.1,65.357 C4.05,66.818 4.492,67.788 4.494,69.196 C4.52,70.614 4.374,72.204 4.888,73.134 C5.167,73.544 6.034,73.365 6.561,73.528 C7.301,73.546 7.77,73.293 8.53,73.33 C9.273,73.278 9.587,73.834 10.301,73.528 L16.897,73.528 C17.812,73.393 18.738,73.268 19.653,73.134 C23.934,73.228 28.278,73.151 32.351,73.232 C32.708,73.239 32.998,73.353 33.138,73.33 C33.198,73.321 33.188,73.228 33.335,73.232 C33.381,73.232 33.39,73.353 33.532,73.33 C33.583,73.322 33.595,73.238 33.729,73.232 C33.76,73.231 33.794,73.352 33.926,73.33 C33.985,73.321 33.976,73.228 34.123,73.232 C34.207,73.234 34.188,73.396 34.32,73.232 C34.37,73.169 34.44,73.332 34.418,73.33 C35.438,73.398 36.337,73.369 37.371,73.33 C43.473,73.102 49.464,73.274 55.679,72.838 C61.515,72.395 67.824,73.129 73.889,72.74 C76.842,73.023 79.919,72.694 82.946,72.838 C82.956,72.839 83.047,72.926 83.143,72.937 C83.239,72.948 83.341,72.934 83.437,72.937 C86.441,73.039 89.186,72.669 92.1,72.74 C98.176,72.579 104.495,72.737 110.605,72.838 C111.682,72.865 112.396,72.528 113.559,72.643 C114.389,72.841 115.68,72.759 116.413,72.543 C116.395,71.803 117.216,71.902 117.004,70.968 L117.004,70.968 Z' transform='translate(-2 -38)'/%3E%3C/svg%3E";

const borderActive =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='116' height='36' viewBox='0 0 116 36'%3E%3Cpath fill='%231A1919' fill-rule='evenodd' d='M114.937,155.333 L114.937,157.696 C114.925,158.157 114.793,157.589 114.543,157.696 C114.459,157.55 114.226,157.554 114.05,157.499 C113.572,157.414 113.545,157.78 113.066,157.696 C112.121,157.663 111.088,157.478 110.015,157.696 C106.576,157.817 103.768,157.408 100.467,157.696 C100.016,157.851 100.285,157.287 99.975,157.303 C99.363,157.249 99.379,157.822 98.892,157.893 C98.121,157.844 97.5,157.945 96.825,157.991 C96.378,157.947 97.033,157.541 97.022,157.303 C97.28,157.129 97.28,156.59 97.022,156.416 C96.408,156.327 96.199,156.813 95.938,157.105 C95.676,157.399 95.489,157.783 95.151,157.991 C91.652,158.237 86.584,157.816 82.454,158.287 C82.468,157.906 82.786,157.831 82.748,157.401 C82.772,156.983 82.545,156.817 82.257,156.712 C81.8,156.683 81.781,157.088 81.665,157.401 C81.379,157.54 81.454,158.041 81.273,158.287 C80.267,158.526 79.009,158.196 77.926,158.188 C78.07,157.816 78.665,157.087 78.024,156.81 C77.188,156.581 76.939,157.749 76.351,158.091 C75.554,158.001 74.64,158.029 73.889,157.893 C73.475,157.909 73.892,157.741 73.889,157.598 C73.919,157.397 74.156,157.405 74.185,157.204 C74.373,156.933 74.587,156.687 74.776,156.416 C75.093,155.815 75.74,155.544 75.76,154.644 C75.314,154.199 74.631,154.779 74.284,155.038 C73.793,155.368 73.496,155.891 73.102,156.317 C72.785,156.788 72.297,157.087 72.216,157.795 L70.642,157.795 C70.113,157.704 70.836,157.483 70.74,157.204 C70.965,156.968 70.757,156.608 70.642,156.416 C69.924,156.289 69.795,156.751 69.361,156.908 C69.112,157.218 68.847,157.51 68.574,157.795 L66.803,157.795 C66.989,157.198 67.863,156.61 67.196,156.022 C66.557,156.007 66.456,156.53 66.015,156.712 C65.859,157.146 65.525,157.403 65.326,157.795 C65.122,157.853 64.68,157.673 64.637,157.893 C62.957,157.866 61.477,157.942 60.011,157.893 C59.48,158.029 59.598,157.519 59.124,157.598 C58.703,157.537 58.724,157.918 58.337,157.893 C57.728,157.878 57.499,157.926 57.156,157.991 C56.976,157.518 57.861,157.342 57.648,156.515 C57.289,156.101 56.469,156.372 56.369,156.81 C56.027,157.125 55.765,157.519 55.581,157.991 C54.51,158.035 53.549,158.191 52.432,158.188 C52.581,157.476 53.579,156.517 52.825,155.825 C51.991,155.747 51.966,156.476 51.545,156.81 C51.18,157.198 50.977,157.751 50.758,158.287 L48.985,158.287 C49.289,157.572 49.933,157.198 50.069,156.317 C49.592,155.623 48.812,156.448 48.494,156.81 C48.104,157.306 47.763,157.851 47.312,158.287 L45.443,158.287 C45.633,157.854 45.836,157.434 46.132,157.105 C46.187,156.537 46.692,156.419 46.623,155.728 C45.81,155.425 45.254,156.182 44.95,156.712 C44.455,157.135 44.214,157.813 43.769,158.287 C43.09,158.243 42.64,158.149 41.702,158.188 C41.911,157.84 42.028,157.399 42.293,157.105 C42.364,156.716 42.569,155.929 42.096,155.825 C41.363,155.782 41.366,156.474 41.013,156.81 C40.763,157.249 40.392,157.567 40.324,158.188 C39.753,158.282 38.806,158.304 37.863,158.287 C37.941,157.626 38.76,157.237 38.454,156.515 C38.106,155.969 37.31,156.408 37.075,156.81 C36.827,157.316 36.448,157.692 36.387,158.385 C35.269,158.448 34.261,158.622 33.138,158.68 C33.304,158.354 33.498,158.056 33.729,157.795 C33.78,157.386 34.226,157.372 34.123,156.81 C33.586,156.294 33.004,157.028 32.646,157.303 C32.359,157.77 31.975,158.141 31.761,158.68 C31.041,158.651 30.556,158.854 29.791,158.779 C29.911,158.241 30.112,157.787 30.383,157.401 C30.477,156.912 30.903,156.335 30.383,156.022 C29.812,155.837 29.282,156.48 29.102,157.007 C28.818,157.542 28.388,157.933 28.413,158.779 L24.968,158.779 C25.041,158.49 25.206,158.295 25.362,158.091 C25.437,157.804 25.518,157.524 25.756,157.401 C25.842,156.766 26.381,156.582 26.347,155.825 C26.321,155.472 25.617,155.445 25.362,155.63 C25.106,155.8 24.927,156.046 24.771,156.317 C24.383,156.816 24.157,157.476 23.787,157.991 C23.704,158.402 23.978,158.456 23.984,158.779 C22.862,158.851 22.045,158.616 20.933,158.68 C21.15,158.209 21.377,157.747 21.72,157.401 C21.856,156.916 22.452,156.58 22.114,155.925 C21.226,155.578 20.921,156.533 20.44,156.908 C20.111,157.53 19.641,158.012 19.358,158.68 L16.7,158.68 C16.885,158.274 17.19,157.99 17.29,157.499 C17.509,157.255 17.89,156.771 17.685,156.416 C16.936,156.022 16.64,156.862 16.306,157.204 C16.131,157.783 15.786,158.192 15.519,158.68 C14.43,158.719 13.594,158.506 12.467,158.581 C12.596,158.087 12.873,157.741 13.058,157.303 C13.196,156.817 13.638,156.636 13.55,155.925 C13.519,155.693 13.246,155.704 13.156,155.53 C12.337,155.599 12.087,156.233 11.68,156.712 C11.394,157.312 11.032,157.837 10.794,158.483 L8.923,158.483 C8.949,157.919 9.473,157.851 9.514,157.303 C9.834,157.031 9.986,156.594 10.203,156.22 C10.441,155.529 11.474,154.479 10.597,153.857 C9.909,153.76 9.835,154.276 9.514,154.546 C9.377,155 9.061,155.273 8.923,155.728 C8.652,156.046 8.486,156.471 8.234,156.81 C7.92,157.087 7.911,157.668 7.447,157.795 C7.146,157.538 7.032,157.094 6.955,156.613 C7.252,155.204 7.956,154.202 8.432,152.971 C8.717,152.567 9.063,152.226 9.219,151.692 C9.147,151.402 8.92,151.269 8.727,151.101 C7.484,151.368 7.293,152.686 6.66,153.562 C6.44,153.52 6.62,153.076 6.561,152.872 L6.561,152.085 C6.549,151.908 6.681,151.878 6.66,151.692 C6.774,151.183 6.979,150.764 7.152,150.313 C7.282,149.854 7.437,149.418 7.644,149.033 C7.803,148.013 8.416,147.443 8.432,146.278 C7.777,145.917 7.278,146.479 7.053,146.868 C6.838,147.376 6.503,147.762 6.364,148.345 C6.016,148.168 6.316,147.344 6.069,147.065 C6.083,146.525 6.079,146.005 5.971,145.589 L5.971,144.21 C6.049,143.869 5.824,143.832 5.872,143.521 L5.872,141.554 C5.591,139.964 5.526,138.159 5.479,136.336 C5.439,135.98 5.351,135.675 5.281,135.353 C5.292,133.099 5.229,130.77 5.38,128.658 C8.654,128.586 11.623,128.207 15.026,128.265 C15.397,128.176 15.86,128.18 16.207,128.067 C18.218,128.011 20.495,128.22 22.211,127.87 L26.445,127.87 C27.332,127.649 28.2,127.829 29.102,127.87 C31.466,127.979 33.875,127.883 36.288,127.772 C38.316,127.68 40.333,127.862 42.391,127.772 C45.226,127.647 48.094,127.661 50.955,127.674 C51.296,127.753 51.333,127.526 51.644,127.575 L54.105,127.575 C54.415,127.591 54.698,127.579 54.794,127.379 C55.007,127.461 55.13,127.634 55.483,127.575 L63.948,127.575 C64.289,127.654 64.327,127.429 64.637,127.478 C67.418,127.385 70.2,127.601 73.004,127.478 C79.39,127.195 85.808,127.563 92.1,127.28 C92.521,127.352 92.896,127.468 93.281,127.575 C97.589,127.813 102.053,127.447 106.57,127.575 C106.89,127.502 107.179,127.397 107.456,127.28 C109.059,127.407 110.222,127.093 111.689,127.083 C112.128,127.069 112.18,127.444 112.574,127.478 C113.284,127.424 113.761,127.603 114.346,127.674 C114.383,129.299 114.444,131.065 114.444,132.989 C114.444,135.079 114.367,137.546 114.543,139.486 C114.576,144.783 115.496,150.083 114.937,155.333 Z M117.004,157.795 C117.065,152.42 116.983,147.729 116.511,142.833 C116.332,141.603 116.413,140.366 116.413,139.092 L116.413,127.379 C116.215,127.215 116.338,126.731 116.02,126.689 C115.871,126.443 115.715,126.206 115.625,125.901 C115.374,125.871 115.311,125.69 115.036,125.704 C114.833,125.717 114.675,125.864 114.543,126 C114.232,126.049 114.195,125.823 113.854,125.901 C113.758,125.734 113.582,125.649 113.263,125.704 C112.422,125.572 111.145,125.538 110.31,125.704 C107.333,125.862 104.221,125.704 101.058,125.704 L91.607,125.704 C90.739,125.788 89.958,125.958 89.049,126 C86.816,126.002 84.791,125.795 82.848,125.509 L80.386,125.509 C80.261,125.513 80.25,125.635 80.091,125.606 C76.628,125.698 73.579,125.596 70.347,125.901 L54.892,125.901 C54.098,125.875 53.358,126.065 52.53,126.099 C50.099,126.196 47.458,125.762 45.048,126.099 C44.149,126.053 43.39,126.145 42.588,126.197 L41.309,126.197 C40.858,126.127 40.31,126.308 40.127,126.197 C38.996,126.296 37.779,126.193 36.485,126.296 L32.646,126.296 C32.282,126.358 31.665,126.167 31.465,126.394 C28.114,126.327 24.765,126.326 21.425,126.493 C20.79,126.711 19.76,126.534 18.964,126.592 C18.062,126.515 17.228,126.732 16.798,126.592 L14.238,126.592 C13.746,126.657 13.477,126.5 13.058,126.493 C12.694,126.555 12.078,126.364 11.876,126.592 C9.449,126.748 6.91,126.765 4.494,126.887 C4.005,127.284 3.214,127.379 2.821,127.87 C3.158,130.388 3.387,133.015 3.313,135.941 C3.858,141.107 3.545,147.129 4.1,152.282 C4.064,153.762 4.536,154.734 4.494,156.22 C4.529,157.628 4.352,159.249 4.986,160.059 C5.998,160.53 7.338,160.254 8.53,160.157 C9.177,160.067 9.313,160.489 9.908,160.452 C12.318,160.147 14.706,160.52 16.995,160.354 C17.727,160.301 18.43,160.138 19.16,160.059 C22.221,159.727 25.336,160.175 28.61,160.059 C29.73,160.12 31.097,159.933 32.055,160.157 C32.129,159.935 32.607,160.118 32.843,160.059 C33.066,160.2 33.505,160.074 33.63,160.059 C33.73,160.046 33.747,160.155 33.827,160.157 C33.926,160.159 33.944,160.059 34.024,160.059 C34.124,160.059 34.14,160.154 34.221,160.157 C34.319,160.16 34.291,160.066 34.32,160.059 C34.409,160.034 34.444,160.152 34.516,160.157 C35.089,160.189 35.576,160.157 36.091,160.157 C40.02,160.157 44.612,159.989 48.395,159.96 C52.976,159.953 57.382,159.337 61.881,159.566 C66.4,159.745 71.205,159.566 75.563,159.665 C77.844,159.696 79.908,159.651 82.355,159.665 C84.497,159.851 87.11,159.8 89.147,159.566 C96.07,159.483 102.954,159.472 109.818,159.665 C111.121,159.787 111.94,159.425 113.165,159.468 C114.181,159.583 115.531,159.66 116.413,159.369 C116.395,158.629 117.216,158.729 117.004,157.795 L117.004,157.795 Z' transform='translate(-2 -125)'/%3E%3C/svg%3E";

type Props = StyledComponentProps<
  'button',
  DefaultTheme,
  {
    onClick?: () => void;
    children?: React.ReactNode;
  } & StyledProps,
  never
>;

export const Button: React.FC<Props> = ({ onClick = () => {}, ...rest }) => {
  const onButtonClick = () => {
    clickSound.play();
    onClick();
  };
  return <StyledButton onClick={onButtonClick} {...rest} />;
};

type StyledProps = {
  fullWidth?: boolean;
};

export const StyledButton = styled.button<StyledProps>`
  padding: ${({ theme }) => theme.spacings(4)};
  border-image-slice: 4 4 3 5 fill;
  border-image-width: 5px;
  border-image-outset: 0;
  border-image-repeat: stretch stretch;
  border-image-source: url("${border}");
  transition: transform 0.2s ease;
  min-width: 100px;
  ${({ fullWidth }) => (fullWidth ? 'width: 100%;' : null)}
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      border-image-source: url("${border}");
    }
  }
  &:hover {
    border-image-source: url("${borderActive}");
  }
  &:active {
    transform: scale(0.9);
    border-image-source: url("${borderActive}");
  }
`;
