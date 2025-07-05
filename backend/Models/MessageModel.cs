

namespace RChat.Models;

public class Message
{
    public string User { get; set; }
    public string Text { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;
}