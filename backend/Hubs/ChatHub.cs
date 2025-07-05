using Microsoft.AspNetCore.SignalR;
using RChat.Models;
using RChat.Services;

namespace RChat.Hubs;

public class ChatHub : Hub
{
    private readonly ChatService _chatService;

    public ChatHub(ChatService chatService)
    {
        _chatService = chatService;
    }

    public async Task SendMessage(string user, string message, string room)
    {
        var msg = new Message { User = user, Text = message };
        _chatService.AddMessage(msg);
        await Clients.Group(room).SendAsync("ReceiveMessage", user, message, room, Guid.NewGuid().ToString());

    }

    public async Task JoinRoom(string room, string user)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, room);
        await Clients.Group(room).SendAsync("UserJoined", user, room);

    }

    public async Task LeaveRoom(string room)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, room);
    }
}