package com.agrima.chat.repository;

import com.agrima.chat.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByConsumerId(Long consumerId);
    List<Conversation> findByProducerId(Long producerId);
}
