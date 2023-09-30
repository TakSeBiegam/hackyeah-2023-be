/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Query:{
		getUniByTags:{

		},
		sendBotMessage:{

		}
	}
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		getUniByTags:"University",
		sendBotMessage:"String",
		listUnis:"University"
	},
	University:{
		name:"String",
		tags:"String"
	}
}

export const Ops = {
query: "Query" as const
}