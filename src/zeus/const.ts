/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Query:{
		suggestionUnivesties:{

		}
	},
	Mutation:{
		createBotDialogue:{
			userPayload:"DialogueInput",
			botPayload:"DialogueInput"
		},
		reactOnConversation:{

		}
	},
	DialogueInput:{
		role:"DialogueRole"
	},
	DialogueRole: "enum" as const,
	ConversationReaction: "enum" as const
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		suggestionUnivesties:"Path",
		listUnis:"University",
		listJobs:"Job"
	},
	Mutation:{
		createBotDialogue:"String",
		useFineTuneJob:"Boolean",
		reactOnConversation:"Boolean",
		testEndpoint:"Boolean"
	},
	University:{
		name:"String",
		paths:"Path"
	},
	Path:{
		_id:"String",
		name:"String",
		university:"University",
		tags:"String"
	},
	Conversation:{
		_id:"String",
		createdAt:"String",
		payload:"ConversationPayload",
		reaction:"ConversationReaction"
	},
	ConversationPayload:{
		role:"DialogueRole",
		content:"String"
	},
	Job:{
		_id:"String",
		tuneId:"String",
		file:"String",
		createdAt:"String",
		conversationCountWhenCreated:"Int"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}