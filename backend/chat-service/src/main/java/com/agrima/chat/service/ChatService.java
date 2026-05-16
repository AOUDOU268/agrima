package com.agrima.chat.service;

import com.agrima.chat.client.UserClient;
import com.agrima.chat.dto.ConversationRequestDto;
import com.agrima.chat.dto.ConversationResponseDto;
import com.agrima.chat.dto.MessageRequestDto;
import com.agrima.chat.dto.MessageResponseDto;
import com.agrima.chat.mapper.ChatMapper;
import com.agrima.chat.model.Conversation;
import com.agrima.chat.model.Message;
import com.agrima.chat.repository.ConversationRepository;
import com.agrima.chat.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserClient userClient;

    public ChatService(ConversationRepository conversationRepository, MessageRepository messageRepository, UserClient userClient) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userClient = userClient;
    }

    @Transactional
    public ConversationResponseDto createConversation(ConversationRequestDto request) {
        // Validate that both users exist in user-service
        if (!userClient.userExists(request.getParticipant1Id())) {
            throw new IllegalArgumentException("User with ID " + request.getParticipant1Id() + " does not exist");
        }
        if (!userClient.userExists(request.getParticipant2Id())) {
            throw new IllegalArgumentException("User with ID " + request.getParticipant2Id() + " does not exist");
        }
        
        Conversation conversation = ChatMapper.toConversation(request);
        Conversation saved = conversationRepository.save(conversation);
        return ChatMapper.toConversationResponse(saved);
    }

    public List<ConversationResponseDto> getConversationsByUser(Long userId) {
        return conversationRepository.findAllByUserId(userId).stream()
                .map(ChatMapper::toConversationResponse)
                .collect(Collectors.toList());
    }

    public Optional<ConversationResponseDto> getConversationById(Long id) {
        return conversationRepository.findById(id).map(ChatMapper::toConversationResponse);
    }

    @Transactional
    public MessageResponseDto sendMessage(MessageRequestDto request) {
        Conversation conversation = conversationRepository.findById(request.getConversationId())
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));
        Message message = ChatMapper.toMessage(request, conversation);
        Message saved = messageRepository.save(message);
        return ChatMapper.toMessageResponse(saved);
    }

    public List<MessageResponseDto> getMessagesForConversation(Long conversationId) {
        return messageRepository.findByConversationIdOrderBySentAtAsc(conversationId).stream()
                .map(ChatMapper::toMessageResponse)
                .collect(Collectors.toList());
    }
}
