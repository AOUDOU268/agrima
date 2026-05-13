package com.agrima.chat.controller;

import com.agrima.chat.dto.ConversationRequestDto;
import com.agrima.chat.dto.ConversationResponseDto;
import com.agrima.chat.dto.MessageRequestDto;
import com.agrima.chat.dto.MessageResponseDto;
import com.agrima.chat.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/conversations")
    public ResponseEntity<ConversationResponseDto> createConversation(@RequestBody ConversationRequestDto request) {
        ConversationResponseDto response = chatService.createConversation(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversations/consumer/{consumerId}")
    public ResponseEntity<List<ConversationResponseDto>> getConversationsByConsumer(@PathVariable Long consumerId) {
        return ResponseEntity.ok(chatService.getConversationsByConsumer(consumerId));
    }

    @GetMapping("/conversations/producer/{producerId}")
    public ResponseEntity<List<ConversationResponseDto>> getConversationsByProducer(@PathVariable Long producerId) {
        return ResponseEntity.ok(chatService.getConversationsByProducer(producerId));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ConversationResponseDto> getConversationById(@PathVariable Long id) {
        return chatService.getConversationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageResponseDto> sendMessage(@RequestBody MessageRequestDto request) {
        MessageResponseDto response = chatService.sendMessage(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageResponseDto>> getMessagesForConversation(@PathVariable Long conversationId) {
        return ResponseEntity.ok(chatService.getMessagesForConversation(conversationId));
    }
}
