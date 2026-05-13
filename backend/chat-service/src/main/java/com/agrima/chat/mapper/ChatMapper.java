package com.agrima.chat.mapper;

import com.agrima.chat.dto.ConversationRequestDto;
import com.agrima.chat.dto.ConversationResponseDto;
import com.agrima.chat.dto.MessageRequestDto;
import com.agrima.chat.dto.MessageResponseDto;
import com.agrima.chat.model.Conversation;
import com.agrima.chat.model.Message;

import java.time.LocalDateTime;

public class ChatMapper {

    private ChatMapper() {
        // Utility class
    }

    public static Conversation toConversation(ConversationRequestDto dto) {
        Conversation conversation = new Conversation();
        conversation.setConsumerId(dto.getConsumerId());
        conversation.setProducerId(dto.getProducerId());
        conversation.setSujet(dto.getSujet());
        conversation.setCreatedAt(LocalDateTime.now());
        return conversation;
    }

    public static ConversationResponseDto toConversationResponse(Conversation conversation) {
        ConversationResponseDto dto = new ConversationResponseDto();
        dto.setId(conversation.getId());
        dto.setConsumerId(conversation.getConsumerId());
        dto.setProducerId(conversation.getProducerId());
        dto.setSujet(conversation.getSujet());
        dto.setCreatedAt(conversation.getCreatedAt());
        return dto;
    }

    public static Message toMessage(MessageRequestDto dto, Conversation conversation) {
        Message message = new Message();
        message.setConversation(conversation);
        message.setSenderId(dto.getSenderId());
        message.setContent(dto.getBody());
        message.setSentAt(LocalDateTime.now());
        return message;
    }

    public static MessageResponseDto toMessageResponse(Message message) {
        MessageResponseDto dto = new MessageResponseDto();
        dto.setId(message.getId());
        dto.setConversationId(message.getConversation().getId());
        dto.setSenderId(message.getSenderId());
        dto.setBody(message.getContent());
        dto.setCreatedAt(message.getSentAt());
        return dto;
    }
}
