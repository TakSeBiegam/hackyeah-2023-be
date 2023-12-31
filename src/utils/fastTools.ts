import { orm } from './db/orm.js';
import { openai } from './finetuning.js';
import { ObjectId } from 'mongodb';

export type resp = {
  tags: string[];
  name: string;
};

export function canBeParsedToMyType(input: any): input is resp {
  // You can define your custom logic here to check if 'input' can be parsed to MyType
  // For example, you can check if 'input' has the expected properties and their types
  return (
    typeof input === 'object' &&
    'tags' in input &&
    typeof input.tags === 'object' &&
    'name' in input &&
    typeof input.name === 'string'
  );
}

export const createTags = async () => {
  const o = await orm();
  const p = `EDUKACJA TECHNICZNO - INFORMATYCZNA
  informatyka techniczna
  iżyniera metali
  inżynieria obliczeniowa
  inżyniera procesów przemysłowych
  iżyniera metali niezależnych
  inżyniera produkcji i jakości
  iżyniera procesów odlewniczych
  komputerowe wspomaganie procesów inżynierskich
  technologie przemysłu 4.0
  tworzenia i technologie motoryzacyjne
  informatyka i ikonometria
  zarządzanie
  zarządzanie i inżyniera produkcji
  informatyka społeczna
  kulturoznawstwo
  nowoczesne technologie w kryminastyce
  socjologia
  automatyka przemysłowa i robotyka
  iżynieria akustyczna
  inżyniera mechaniczna i materiałowa
  iżynieria mechatroniczna
  mechanika i budowa maszyn 
  mechatronic engineering`;
  const paths: string[] = p.trim().split('\n');

  for (let i = 0; i < paths.length; i++) {
    const tag = await o('Paths').collection.findOne({ name: paths[i].toLowerCase() });
    if (tag) {
      continue;
    }
    const chats = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `create for me from 50 to 70 tags dla kierunku studiów, dla kierunku "${paths[
            i
          ].toLowerCase()}" in json 
          {
          "name": String
          "tags": [String]
          }
           tags must be in english, and return me only json without additional text`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    if (chats.choices[0].message.content === null) {
      console.log(`dropped on ${paths[i].toLowerCase()}`);
      continue;
    }
    try {
      JSON.parse(chats.choices[0].message.content) as resp;
    } catch (error) {
      console.log(`parse dopped on ${chats.choices[0].message.content}`);
      continue;
    }
    console.log('updating database');
    const new_object_id = new ObjectId();
    await o('Paths').collection.updateOne(
      { name: paths[i].toLowerCase(), university: '65192c325f5751d084d54a9f' },
      {
        $set: {
          tags: (JSON.parse(chats.choices[0].message.content) as resp).tags,
        },
        $setOnInsert: {
          _id: String(new_object_id),
          name: paths[i].toLowerCase(),
          university: '65192c325f5751d084d54a9f',
        },
      },
      {
        upsert: true,
      },
    );
  }

  console.log('done');
  return true;
};

export const tagToLowerCase = async () => {
  const o = await orm();
  const paths = await o('Paths').collection.find({}).toArray();
  paths.forEach((path) => {
    const arrayOfTags = path.tags.map((tag) => tag.toLowerCase());
    o('Paths').collection.updateOne({ _id: path._id }, { $set: { tags: arrayOfTags } });
  });
  return true;
};
