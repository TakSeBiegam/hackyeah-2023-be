import { FieldResolveInput } from 'stucco-js';
import { ConversationReaction, resolverFor } from '../zeus';
import { orm } from '../utils/db/orm';

export const handler = (input: FieldResolveInput) =>
  resolverFor('Mutation', 'reactOnConversation', async (args) => {
    const o = await orm();
    const conversation = o('Conversations').collection.findOne({ _id: args.conversationId });
    if (!conversation) {
      throw new Error('conversation does not exist');
    }
    return await o('Conversations')
      .collection.updateOne(
        { _id: args.conversationId },
        {
          $set: {
            reaction: args.reaction ? ConversationReaction.LIKE : ConversationReaction.DISLIKE,
          },
        },
      )
      .then((r) => r.modifiedCount !== 0);
  })(input.arguments);
