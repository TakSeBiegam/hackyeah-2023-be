#!/bin/sh
helm ls
helm -n "${NAMESPACE}" upgrade \
	--install \
	-f "${VALUES:-./hackyeah-values.yaml}" \
	--set "image.tag=$TAG" \
	--set "mongo.url=${MONGO_URL}" \
	--set "openai.key=${OPENAI_API_KEY}" \
	"${RELEASE}" ./hackyeah_values
