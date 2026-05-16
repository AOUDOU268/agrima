package com.agrima.chat.repository;

import com.agrima.chat.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE c.participant1Id = :userId OR c.participant2Id = :userId")
    List<Conversation> findAllByUserId(@Param("userId") Long userId);

    List<Conversation> findByParticipant1Id(Long participant1Id);
    List<Conversation> findByParticipant2Id(Long participant2Id);
}
