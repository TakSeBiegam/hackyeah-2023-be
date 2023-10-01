import { FieldResolveInput } from 'stucco-js';
import { resolverFor } from '../zeus/index.js';
import { orm } from '../utils/db/orm.js';
import { openai } from '../utils/finetuning.js';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'suggestionUnivesties', async (args) => {
    const conversation = await orm().then((o) => o('Conversations').collection.findOne({ _id: args.contextId }));
    console.log(conversation);
    if (!conversation) {
      throw new Error('cannot find conversation');
    }
    const userDialogues = conversation.payload
      .filter((dialogue) => dialogue.role === 'user')
      .map((filteredDialogues) => filteredDialogues.content);
    console.log(userDialogues);
    const chatRespond = await openai.chat.completions.create({
      messages: userDialogues.map((singleDialogue) => ({
        role: 'user',
        content: `pick the most correct tag in english that best fit to my text:
        "${userDialogues}"
        and give me output as clean json text in form:
        {
          tags: string[]
        }
        `,
      })),
      model: 'gpt-3.5-turbo',
    });
    console.log(chatRespond.choices[0].message.content);
    if (!chatRespond.choices[0].message.content) {
      throw new Error('bot suggestion is empty');
    }
    const o = await orm();
    const tags = JSON.parse(chatRespond.choices[0].message.content) as { tags: string[] };
    const unies = await o('Paths')
      .collection.aggregate([
        {
          $match: {
            tags: {
              $in: tags.tags,
            },
          },
        },
        {
          $addFields: {
            matchingTags: {
              $size: {
                $setIntersection: ['$tags', tags.tags],
              },
            },
          },
        },
        {
          $sort: {
            matchingTags: -1,
          },
        },
      ])
      .limit(5)
      .toArray();
    return unies;
  })(input.arguments);
