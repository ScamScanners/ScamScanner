// Chat.tsx
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="mx-auto flex flex-col justify-center items-center w-full max-w-md py-24">
      <div className="lg:ml-96 flex flex-col w-full max-w-md space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="lg:ml-96 whitespace-pre-wrap text-center">
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="w-full">
        <input
          className="lg:ml-96 w-full rounded border border-gray-300 p-2 shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
