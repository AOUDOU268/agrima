package com.agrima.chat.dto;

public class ConversationRequestDto {
    private Long participant1Id;
    private Long participant2Id;
    private String sujet;

    public ConversationRequestDto() {}

    public Long getParticipant1Id() {
        return participant1Id;
    }

    public void setParticipant1Id(Long participant1Id) {
        this.participant1Id = participant1Id;
    }

    public Long getParticipant2Id() {
        return participant2Id;
    }

    public void setParticipant2Id(Long participant2Id) {
        this.participant2Id = participant2Id;
    }

    public String getSujet() {
        return sujet;
    }

    public void setSujet(String sujet) {
        this.sujet = sujet;
    }
}
