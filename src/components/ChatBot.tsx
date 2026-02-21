import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface ChatMessage {
    type: 'user' | 'bot';
    text: string;
}

const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<ChatMessage[]>([
        { type: 'bot', text: 'Hello! I am the Akira Bank AI assistant. How can I help you today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat, isOpen]);

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = message;
        setMessage('');
        setChat((prev) => [...prev, { type: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();

            setChat((prev) => [
                ...prev,
                { type: 'bot', text: data.reply || "Sorry, I couldn't process that." },
            ]);
        } catch (error) {
            console.error('Failed to send message:', error);
            setChat((prev) => [
                ...prev,
                { type: 'bot', text: "An error occurred while connecting to the assistant. Please try again later." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="btn btn-primary rounded-circle shadow d-flex align-items-center justify-content-center p-3"
                        style={{ width: '60px', height: '60px' }}
                    >
                        <MessageCircle size={30} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div
                    className="position-fixed bottom-0 end-0 m-3 d-flex flex-column shadow bg-body rounded bg-white"
                    style={{ width: '350px', height: '500px', zIndex: 1050, border: '1px solid var(--bs-border-color)' }}
                >
                    {/* Header */}
                    <div className="bg-primary text-white p-3 d-flex justify-content-between align-items-center rounded-top">
                        <div className="d-flex align-items-center gap-2">
                            <Bot size={24} />
                            <h5 className="mb-0 fw-semibold">Akira Assist</h5>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="btn btn-link text-white p-0 border-0"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Warning Banner */}
                    <div className="bg-warning text-dark px-3 py-2" style={{ fontSize: '0.8rem' }}>
                        This assistant provides info about Akira Bank services only. It does not access personal account data.
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3" style={{ backgroundColor: '#f8f9fa' }}>
                        {chat.map((msg, index) => (
                            <div
                                key={index}
                                className={`d-flex flex-column ${msg.type === 'user' ? 'align-items-end' : 'align-items-start'}`}
                            >
                                <span className="small text-muted mb-1">{msg.type === 'user' ? 'You' : 'Bot'}</span>
                                <div
                                    className={`p-2 rounded-3 text-wrap text-break ${msg.type === 'user' ? 'bg-primary' : 'bg-white border'
                                        }`}
                                    style={{
                                        maxWidth: '85%',
                                        fontSize: '0.9rem',
                                        color: msg.type === 'user' ? '#ffffff' : '#000000'
                                    }}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="d-flex align-items-start flex-column">
                                <span className="small text-muted mb-1">Bot</span>
                                <div
                                    className="p-2 rounded-3 text-wrap text-break bg-white border"
                                    style={{ maxWidth: '85%', fontSize: '0.9rem', color: '#000000' }}
                                >
                                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-top bg-white rounded-bottom">
                        <form onSubmit={sendMessage} className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control text-dark"
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask about bank services..."
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="btn btn-primary d-flex align-items-center justify-content-center"
                                disabled={!message.trim() || isLoading}
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
