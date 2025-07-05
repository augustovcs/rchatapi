using RChat.Models;

namespace RChat.Services;

public class ChatService
{

    private readonly List<Message> _messages = new();

    public void AddMessage(Message msg) => _messages.Add(msg);
    public IReadOnlyList<Message> GetMessages() => _messages;
    
}