"use client";

import './AIsidebarStyles.css'
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
import katex from 'katex';
import 'katex/dist/katex.min.css';

import React, { useState, useEffect, useRef } from 'react';
import {
    MessageCircle,
    Bot,
    X,
    Send,
    Loader2,
    BookOpen,
    HelpCircle,
    Zap,
    ChevronRight
} from 'lucide-react';

// Types
interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
    type?: 'question' | 'explanation' | 'error';
}

interface Concept {
    name: string;
    description: string;
}

const AISidebarSimple = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Xin chào! Tôi là trợ lý AI chuyên về Vật Lý 11 - Chương Dao Động. Hãy hỏi tôi bất cứ điều gì về dao động điều hòa, con lắc lò xo, năng lượng dao động,...",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            type: 'explanation'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'concepts'>('chat'); //| 'test'
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Hàm render text với LaTeX
    const renderWithLatex = (text: string) => {
        if (!text) return null;

        const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g);

        return (
            <>
                {parts.map((part, index) => {
                    if (!part) return null;

                    try {
                        // Block math: $$...$$
                        if (part.startsWith('$$') && part.endsWith('$$')) {
                            const math = part.slice(2, -2).trim();
                            const html = katex.renderToString(math, {
                                displayMode: true,
                                throwOnError: false
                            });
                            return (
                                <div
                                    key={index}
                                    className="my-3 overflow-x-auto"
                                    dangerouslySetInnerHTML={{ __html: html }}
                                />
                            );
                        }

                        // Inline math: $...$
                        if (part.startsWith('$') && part.endsWith('$')) {
                            const math = part.slice(1, -1).trim();
                            const html = katex.renderToString(math, {
                                displayMode: false,
                                throwOnError: false
                            });
                            return (
                                <span
                                    key={index}
                                    dangerouslySetInnerHTML={{ __html: html }}
                                />
                            );
                        }

                        // Normal text
                        return <span key={index}>{part}</span>;

                    } catch (error) {
                        console.error('LaTeX rendering error:', error);
                        return <span key={index} className="text-red-500">{part}</span>;
                    }
                })}
            </>
        );
    };

    // Các khái niệm vật lý dao động
    const physicsConcepts: Concept[] = [
        { name: "Dao động điều hòa", description: "Dao động có phương trình x = A cos(ωt + φ)" },
        { name: "Con lắc lò xo", description: "T = 2π√(m/k), W = ½kA²" },
        { name: "Con lắc đơn", description: "T = 2π√(l/g) với góc lệch nhỏ" },
        { name: "Năng lượng dao động", description: "W = ½kA² = ½mω²A², bảo toàn" },
        { name: "Chu kỳ và tần số", description: "T = 1/f, ω = 2πf" },
        { name: "Pha ban đầu", description: "φ xác định vị trí bắt đầu" },
        { name: "Dao động tắt dần", description: "Biên độ giảm dần do ma sát" },
        { name: "Dao động cưỡng bức", description: "Dao động dưới tác dụng ngoại lực" },
    ];


    // Câu hỏi mẫu
    const sampleQuestions = [
        "Dao động điều hòa là gì?",
        "Công thức tính chu kỳ con lắc lò xo?",
        "Năng lượng trong dao động có bảo toàn không?",
        "Giải thích pha ban đầu φ",
        "So sánh con lắc lò xo và con lắc đơn",
        "Tại sao con lắc đơn chỉ dao động điều hòa khi góc nhỏ?",
        "Cách viết phương trình dao động từ điều kiện ban đầu",
        "Tính năng lượng của con lắc lò xo có A=10cm, k=100N/m"
    ];


    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Gửi message đến API
    const sendToAPI = async (message: string) => {
        setIsLoading(true);

        // Thêm message của user
        const userMessage: Message = {
            id: messages.length + 1,
            text: message,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            type: 'question'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');

        try {
            // Cách 1: Dùng unified endpoint
            const response = await fetch('/api/ai/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage].map(m => ({
                        role: m.sender === 'user' ? 'user' : 'assistant',
                        content: m.text
                    }))
                })
            });

            const data = await response.json();

            if (data.success) {
                let aiResponse = '';

                // Xử lý theo type
                switch (data.type) {
                    case 'solve':
                        aiResponse = `**🔢 GIẢI BÀI TẬP**\n\n${data.solution}`;
                        break;
                    case 'explain':
                        aiResponse = `**📚 GIẢI THÍCH**\n\n${data.explanation}`;
                        break;
                    default:
                        aiResponse = data.response;
                }

                const aiMessage: Message = {
                    id: messages.length + 2,
                    text: aiResponse,
                    sender: 'ai',
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    type: 'explanation'
                };

                setMessages(prev => [...prev, aiMessage]);
            } else {
                throw new Error(data.error);
            }

        } catch (error: any) {
            // Fallback: thử từng endpoint
            await tryFallbackEndpoints(message);

        } finally {
            setIsLoading(false);
        }
    };

    // Fallback: thử từng endpoint nếu unified endpoint lỗi
    const tryFallbackEndpoints = async (message: string) => {
        try {
            // Thử solve trước
            const solveRes = await fetch('/api/ai/solve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ problem: message })
            });

            if (solveRes.ok) {
                const data = await solveRes.json();
                if (data.success) {
                    const aiMessage: Message = {
                        id: messages.length + 2,
                        text: `**🔢 GIẢI BÀI TẬP**\n\n${data.solution}`,
                        sender: 'ai',
                        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                        type: 'explanation'
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    return;
                }
            }

            // Thử explain
            const explainRes = await fetch('/api/ai/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ concept: message })
            });

            if (explainRes.ok) {
                const data = await explainRes.json();
                if (data.success) {
                    const aiMessage: Message = {
                        id: messages.length + 2,
                        text: `**📚 GIẢI THÍCH**\n\n${data.explanation}`,
                        sender: 'ai',
                        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                        type: 'explanation'
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    return;
                }
            }

            // Cuối cùng thử chat
            const chatRes = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: message }]
                })
            });

            if (chatRes.ok) {
                const data = await chatRes.json();
                const aiMessage: Message = {
                    id: messages.length + 2,
                    text: data.response || data.text || 'Không có phản hồi',
                    sender: 'ai',
                    timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    type: 'explanation'
                };
                setMessages(prev => [...prev, aiMessage]);
            }

        } catch (error) {
            console.error('All endpoints failed:', error);
        }
    };



    // Xử lý gửi message
    const handleSendMessage = () => {
        console.log(inputMessage)
        if (!inputMessage.trim() || isLoading) return;

        // Kiểm tra xem có phải khái niệm vật lý không
        const isPhysicsConcept = physicsConcepts.some(concept =>
            inputMessage.toLowerCase().includes(concept.name.toLowerCase())
        );

        // if (isPhysicsConcept) {
        //     sendToAPI(inputMessage, 'explain');
        // } else {
        //     sendToAPI(inputMessage, 'chat');
        // }
        sendToAPI(inputMessage)
    };

    // Xử lý câu hỏi mẫu
    const handleSampleQuestion = (question: string) => {
        setInputMessage(question);
    };

    // Xử lý click khái niệm
    const handleConceptClick = (conceptName: string) => {
        sendToAPI(conceptName);
    };


    // Render tab Chat
    const renderChatTab = () => (
        <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.sender === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                                : msg.type === 'error'
                                    ? 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 rounded-bl-none'
                                    : 'dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-bl-none'
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                {msg.sender === 'ai' && (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${msg.type === 'error' ? 'bg-red-200' : 'bg-gradient-to-r from-purple-400 to-pink-400'
                                        }`}>
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                )}
                                <span className="text-xs opacity-70">
                                    {msg.sender === 'ai' ? 'AI Tutor' : 'Bạn'} • {msg.timestamp}
                                </span>
                            </div>
                            <div className="text-sm whitespace-pre-wrap" >
                                {renderWithLatex(msg.text)}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                                <span className="text-sm text-gray-600">AI đang suy nghĩ...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-200 p-4">
                <div className="mb-3">
                    <div className="text-xs text-gray-500 mb-2">Câu hỏi nhanh:</div>
                    <div className="flex flex-wrap gap-2">
                        {sampleQuestions.slice(0, 4).map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSampleQuestion(q)}
                                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition text-gray-700"
                            >
                                {q.length > 30 ? q.substring(0, 30) + '...' : q}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Hỏi về dao động, công thức, bài tập..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white rounded-full"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full flex items-center justify-center transition disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                            <Send className="w-5 h-5 text-white" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );

    // Render tab Concepts
    const renderConceptsTab = () => (
        <div className="p-4">
            <div className="mb-6">
                <h3 className="dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <BookOpen className="dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 w-5 h-5 text-purple-600" />
                    Khái niệm Dao Động
                </h3>
                <p className="dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 text-sm text-gray-600 mb-4">
                    Click vào khái niệm để AI giải thích chi tiết
                </p>
            </div>

            <div className="space-y-3">
                {physicsConcepts.map((concept, index) => (
                    <button
                        key={index}
                        onClick={() => handleConceptClick(concept.name)}
                        className="w-full text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all hover:translate-x-1"
                        disabled={isLoading}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="font-semibold text-gray-800 mb-1">{concept.name}</div>
                                <div className="text-sm text-gray-600">{concept.description}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    // // Render tab Test
    // const renderTestTab = () => (
    //     <div className="p-4">
    //         <div className="mb-6">
    //             <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
    //                 <Zap className="w-5 h-5 text-yellow-600" />
    //                 Kiểm tra hệ thống
    //             </h3>
    //             {/* <p className="text-sm text-gray-600 mb-4">
    //                 Test API và kết nối AI
    //             </p> */}
    //         </div>

    //         <div className="space-y-4">
    //             <button
    //                 onClick={testAPIConnection}
    //                 disabled={isLoading}
    //                 className="w-full p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition flex items-center justify-center gap-3 disabled:opacity-50"
    //             >
    //                 <Zap className="w-5 h-5" />
    //                 <span className="font-semibold">Test API Connection</span>
    //             </button>

    //             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
    //                 <h4 className="font-medium text-blue-800 mb-2">📊 Thông tin API</h4>
    //                 <div className="space-y-2 text-sm">
    //                     <div className="flex justify-between">
    //                         <span className="text-gray-600">Endpoint:</span>
    //                         <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded">/api/ai/explain</code>
    //                     </div>
    //                     <div className="flex justify-between">
    //                         <span className="text-gray-600">Method:</span>
    //                         <span className="font-medium">POST</span>
    //                     </div>
    //                     <div className="flex justify-between">
    //                         <span className="text-gray-600">Body:</span>
    //                         <span className="font-mono text-xs">{`{concept: string, level: string}`}</span>
    //                     </div>
    //                 </div>
    //             </div>

    //             <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
    //                 <h4 className="font-medium text-gray-800 mb-2">💡 Gợi ý test</h4>
    //                 <ul className="space-y-2 text-sm text-gray-600">
    //                     {/* <li className="flex items-start gap-2">
    //                         <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
    //                         <span>Click "Test API Connection" để kiểm tra</span>
    //                     </li> */}
    //                     <li className="flex items-start gap-2">
    //                         <div className="dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
    //                         <span>Vào tab Chat để hỏi AI trực tiếp</span>
    //                     </li>
    //                     <li className="flex items-start gap-2">
    //                         <div className="dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
    //                         <span>Vào tab Concepts để học khái niệm</span>
    //                     </li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </div>
    // );

    return (
        <>
            {/* Floating button to open sidebar */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed right-6 bottom-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center group"
                aria-label="Mở trợ lý AI"
            >
                <MessageCircle className="w-7 h-7 text-white" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="absolute -bottom-10 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    Trợ lý Vật Lý
                </div>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot className="w-7 h-7" />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl">Physics AI Tutor</h1>
                                <p className="text-sm opacity-90">Vật Lý 11 • Dao Động</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition"
                            aria-label="Đóng sidebar"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'chat'
                                ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300'
                                : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat
                        </button>
                        <button
                            onClick={() => setActiveTab('concepts')}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'concepts'
                                ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300'
                                : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Khái niệm
                        </button>
                        {/* <button
                            onClick={() => setActiveTab('test')}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${activeTab === 'test'
                                ? 'bg-white dark:bg-gray-900 text-purple-600 dark:text-purple-300'
                                : 'bg-white/10 hover:bg-white/20'
                                }`}
                        >
                            <HelpCircle className="w-4 h-4" />
                            Test
                        </button> */}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col h-[calc(100vh-180px)]">
                    {activeTab === 'chat' && renderChatTab()}
                    {activeTab === 'concepts' && renderConceptsTab()}
                    {/* {activeTab === 'test' && renderTestTab()} */}
                </div>
            </div>
        </>
    );
};

export default AISidebarSimple;