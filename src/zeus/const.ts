/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Query:{
		getUniByTags:{

		}
	},
	Mutation:{
		createBotDialogue:{
			payload:"BotDialogueInput"
		},
		reactOnConversation:{

		}
	},
	BotDialogueInput:{
		role:"DialogueRole"
	},
	DialogueRole: "enum" as const,
	ConversationReaction: "enum" as const
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		getUniByTags:"Path",
		listUnis:"University",
		listTags:"String"
	},
	Mutation:{
		createBotDialogue:"String",
		useFineTuneJob:"Boolean",
		reactOnConversation:"Boolean"
	},
	University:{
		name:"String",
		paths:"String"
	},
	Path:{
		name:"String",
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
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}