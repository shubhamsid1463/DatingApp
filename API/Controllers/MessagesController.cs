using System;
using System.Security.Cryptography.X509Certificates;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;
[Route("api/[controller]")]
public class MessagesController (IMessageRepository messageRepository,
IMemberRepository memberRepository) : BaseApiController
{
    [Route("createMessage")]
    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var sender=await memberRepository.GetMemberAsync(User.GetMemberId());

        var recipient=await memberRepository.GetMemberAsync(createMessageDto.RecipientId);
        if(recipient==null || sender==null||sender.Id==recipient.Id)
         return BadRequest("Problem sending message");
         var message=new Message
         {
            Recipient=recipient,
            SenderId=sender.Id,
            RecipientId=recipient.Id,
            Content=createMessageDto.Content
         };
            messageRepository.AddMessage(message);
            if(await messageRepository.SaveAllAsync())
            return Ok(message.ToDto());
            return BadRequest("Failed to send message");
    }
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessagesForMember([FromQuery] MessageParams messageParams)
    {
        messageParams.MemberId= User.GetMemberId();
        var messages=await messageRepository.GetMessagesForMember(messageParams);
        return Ok(messages);
    }
    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string recipientId)
    {
        var currentMemberId=User.GetMemberId();
        var messages=await messageRepository.GetMessageThread(currentMemberId,recipientId);
        return Ok(messages);
    }
    [HttpDelete("Delete/{Id}")]
    public async Task<ActionResult<bool>> DeleteMessage(string Id)
    {
        var currentMemberId=User.GetMemberId();
        var message=await messageRepository.GetMessageAsync(Id);
        if(message==null) return BadRequest("Failed to delete message");
        if(message.RecipientId!=currentMemberId && message.SenderId!=currentMemberId)
            return BadRequest("Failed to delete message");
        if(message.RecipientId==currentMemberId)
            message.RecipientDeleted=true;
        else
            message.SenderDeleted=true;
            if(message.RecipientDeleted && message.SenderDeleted)
                messageRepository.DeleteMessage(message);
        await messageRepository.SaveAllAsync();
        return Ok(true);
    }
}