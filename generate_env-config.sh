#!/bin/bash

########################################
# Create a file based on the environment variables
# given by the dockerc run -e parameter
########################################
cat <<EOF
export const environment = {
  PRODUCTION: ${PRODUCTION},
  API_BASE_URL: "${API_BASE_URL}",
  IDENTITY_API_PATH: "${IDENTITY_API_PATH}",
  CUSTOMER_API_PATH: "${CUSTOMER_API_PATH}",
  COM_API_PATH: "${COM_API_PATH}",
  LOANAPP_API_PATH: "${LOANAPP_API_PATH}",
  CORE_API_PATH: "${CORE_API_PATH}",
  PAYMENT_API_PATH: "${PAYMENT_API_PATH}",
  ZALO_URL: "${ZALO_URL}",
  FB_MESSENGER_URL: "${FB_MESSENGER_URL}"
};
EOF
