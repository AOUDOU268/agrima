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

    @GetMapping("/conversations/user/{userId}")
    public ResponseEntity<List<ConversationResponseDto>> getConversationsByUser(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(chatService.getConversationsByUser(userId));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ConversationResponseDto> getConversationById(@PathVariable("id") Long id) {
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
    public ResponseEntity<List<MessageResponseDto>> getMessagesForConversation(@PathVariable("conversationId") Long conversationId) {
        return ResponseEntity.ok(chatService.getMessagesForConversation(conversationId));
    }

    @PutMapping("/conversations/{id}")
    public ResponseEntity<ConversationResponseDto> updateConversation(@PathVariable("id") Long id, @RequestBody ConversationRequestDto request) {
        return ResponseEntity.ok(chatService.updateConversation(id, request));
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<Void> deleteConversation(@PathVariable("id") Long id) {
        chatService.deleteConversation(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/messages/{id}")
    public ResponseEntity<MessageResponseDto> updateMessage(@PathVariable("id") Long id, @RequestBody MessageRequestDto request) {
        return ResponseEntity.ok(chatService.updateMessage(id, request));
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<Void> deleteMessage(@PathVariable("id") Long id) {
        chatService.deleteMessage(id);
        return ResponseEntity.noContent().build();
    }
}
