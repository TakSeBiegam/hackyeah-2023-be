import { FieldResolveInput } from 'stucco-js';
import { ConversationReaction, resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'createBotDialogue', async (args) => {
    const o = await orm();
    if (!args.dialogueId) {
      return o('Conversations')
        .createWithAutoFields(
          '_id',
          'createdAt',
        )({
          payload: [
            { content: args.userPayload.payload, role: args.userPayload.role },
            { content: args.botPayload.payload, role: args.botPayload.role },
          ],
          reaction: ConversationReaction.NOTREACTED,
        })
        .then((r) => r.insertedId);
    } else {
      await o('Conversations').collection.updateOne(
        { _id: args.dialogueId },
        {
          payload: [
            { content: args.userPayload.payload, role: args.userPayload.role },
            { content: args.botPayload.payload, role: args.botPayload.role },
          ],
          reaction: ConversationReaction.NOTREACTED,
        },
      );
      return args.dialogueId;
    }
  })(input.arguments);
