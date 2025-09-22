import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const baseSystemMessages = [
  'You are a content generation assistant. You are given a text and asked to generate more content based on it.',
  'The content should be relevant to the input text you are provided with.',
  'The content should be engaging.',
  'DO NOT give more than one reply.',
  'Do not ask questions.',
  'Do not include markdown or code.',
  `When listing bullet points, DO NOT use hyphens, asterisks, or any other quotation marks.
Place each bullet point on a new line without adding extra spaces between them.
For example, list them as follows:
Apples
Oranges
Bananas
Grapes
Not like this:
Apples

Oranges

Bananas

Grapes`,
  'The response SHOULD NOT have more than 500 characters.',
];

export async function POST(req: Request) {
  const { title, type, content } = await req.json();

  if (!title || !type) {
    return NextResponse.json(
      { message: 'Title or type is missing.' },
      { status: 400 }
    );
  }

  let prompt = '';

  if (title === 'default') {
    switch (type.toLowerCase()) {
      case 'description':
        prompt = `Add on the following description: "${content}". A maximum of 5 sentences and 550 characters.`;
        break;
      case 'mission':
        prompt = `Add on the following mission: "${content}". A maximum of 5 sentences and 550 characters.`;
        break;
      case 'vission':
        prompt = `Add on the following vision: "${content}". A maximum of 5 sentences and 550 characters.`;
        break;
      case 'futureplan':
        prompt = `Add on the following future plan: "${content}". A maximum of 5 sentences and 550 characters.`;
        break;
      default:
        return NextResponse.json(
          { message: 'Invalid type provided.' },
          { status: 400 }
        );
    }
  } else {
    switch (type.toLowerCase()) {
      case 'title':
        prompt = `Modify the following job title to make it more precise but make sure not to change the meaning: ${title}. Give only one suggestion.`;
        break;
      case 'description':
        prompt = content
          ? `Improve the following job description: "${content}". Don't include responsibilities, requirements, or qualifications. A maximum of 5 sentences  and 550 characters.`
          : `Write a job description based on the following job title: ${title}. Don't include responsibilities, requirements, or qualifications. A maximum of 5 sentences and 550 characters.`;
        break;
      case 'requirements':
        prompt = content
          ? `Improve the following requirements: "${content} and make it into bullet points". Don't use hyphens or asterix in front of each bullet point. Place each bullet point on a new line without adding extra spaces between them.
 Don't include any  A maximum of 5 requirements is enough and 550 characters.`
          : `List the key requirements for the following job title in bullet points: ${title}. Don't use hyphens or asterix in front of each bullet point. Place each bullet point on a new line without adding extra spaces between them.
 A maximum of 5 requirements is enough.`;
        break;
      case 'responsibilities':
        prompt = content
          ? `Improve the following responsibilities: "${content} and make it into bullet points". Don't use hyphens or asterix in front of each bullet point. Place each bullet point on a new line without adding extra spaces between them.
 A maximum of 5 responsibilities is enough.`
          : `List the key responsibilities for the following job title in bullet points: ${title}. Don't use hyphens or asterix in front of each bullet point. Place each bullet point on a new line without adding extra spaces between them.
 A maximum of 5 responsibilities is enough.`;
        break;
      case 'idealcandidate':
        prompt = content
          ? `Improve the following description of the ideal candidate: "${content} and make it into bullet points". Don't use hyphens or asterix in front of each bullet point. Place each bullet point on a new line without adding extra spaces between them.
 A maximum of 5 points is enough.`
          : `Describe the ideal candidate for the following job title in bullet points: ${title}. Don't use hyphens or asterix in front of each bullet point. Place each bullet point on a new line without adding extra spaces between them.
 A maximum of 5 points is enough.`;
        break;
      default:
        return NextResponse.json(
          { message: 'Invalid type provided.' },
          { status: 400 }
        );
    }
  }

  const systemMessages = baseSystemMessages.join(' ');

  const messages: any[] = [
    {
      role: 'system',
      content: systemMessages,
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
    });

    const aiResponse = completion.choices[0].message?.content?.trim() || '';
    return NextResponse.json({ aiResponse });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
}
