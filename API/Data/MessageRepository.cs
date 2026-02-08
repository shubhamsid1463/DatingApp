using System;
using System.ComponentModel.DataAnnotations;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Migrations;

public class MessageRepository (AppDbContext context) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessageAsync(string id)
    {
        return await context.Messages.FindAsync(id);
    }

    public async Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams)
    {
        var query=context.Messages
        .OrderByDescending(x=>x.MessageSent)
        .AsQueryable();
        query=messageParams.Container switch
        {
            "Inbox"=>query.Where(x=>x.RecipientId==messageParams.MemberId && !x.RecipientDeleted),
            "Outbox"=>query.Where(x=>x.SenderId==messageParams.MemberId && !x.SenderDeleted),
            _=>query.Where(x=>x.RecipientId==messageParams.MemberId && !x.RecipientDeleted && x.DateRead==null)
        };
        var messageQuery=query.Select(MessageExtensions.AsDto());
        return await PaginationHelper.CreateAsync(messageQuery,messageParams.PageSize,messageParams.PageNumber);

    }

    public async  Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId)
    {
        await context.Messages
        .Where(x=>x.RecipientId==currentMemberId
        && x.SenderId==recipientId &&x.DateRead==null)
        .ExecuteUpdateAsync(setter=>setter.SetProperty(x=>x.DateRead,DateTime.UtcNow));
        
        return await context.Messages
        .Where(x=>(x.RecipientId==currentMemberId 
        && x.SenderId==recipientId && !x.RecipientDeleted)
        || (x.SenderId==currentMemberId&&x.RecipientId==recipientId && !x.SenderDeleted)) 
        .OrderBy(x=>x.MessageSent) 
        .Select(MessageExtensions.AsDto())
        .ToListAsync();  
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
