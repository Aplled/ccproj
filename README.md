This is a translation tool. You type in some text and it translates it into another language and then translates it back, and shows you which words changed so you can see what got lost.

To run this you need Node.js installed on your computer first.

Then open a terminal in this folder and type this to download everything it needs:

npm install pnpm

pnpm install

You also need a Groq API key for the translating part. Make a file called .env.local in this folder and put your key in it like this:

GROQ_API_KEY=your_key_here

Then to actually run the program type:

pnpm run dev

After that open your web browser and go to http://localhost:3000 and it should be there.
