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
}
