#!/bin/bash

# Configuration
GATEWAY_URL="http://localhost:8080"
# In some environments, localhost might need to be 127.0.0.1
# GATEWAY_URL="http://127.0.0.1:8080"

echo "--------------------------------------------------"
echo "AGRIMA Chat Service Integration Test"
echo "--------------------------------------------------"

# 1. Create Users with different roles
echo "1. Creating users with different roles..."

# PRODUCTEUR
USER_PROD_ID=$(curl -s -X POST "$GATEWAY_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "prod@agrima.com",
    "nom": "Producteur",
    "prenom": "Jean",
    "role": "PRODUCTEUR",
    "statut": "Actif"
  }' | grep -o '"id":[0-9]*' | cut -d: -f2)

echo "Created PRODUCTEUR user with ID: $USER_PROD_ID"

# CONSOMMATEUR
USER_CONS_ID=$(curl -s -X POST "$GATEWAY_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "cons@agrima.com",
    "nom": "Consommateur",
    "prenom": "Marie",
    "role": "CONSOMMATEUR",
    "statut": "Actif"
  }' | grep -o '"id":[0-9]*' | cut -d: -f2)

echo "Created CONSOMMATEUR user with ID: $USER_CONS_ID"

# ADMIN
USER_ADMIN_ID=$(curl -s -X POST "$GATEWAY_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@agrima.com",
    "nom": "Admin",
    "prenom": "Paul",
    "role": "ADMIN",
    "statut": "Actif"
  }' | grep -o '"id":[0-9]*' | cut -d: -f2)

echo "Created ADMIN user with ID: $USER_ADMIN_ID"

# LIVREUR
USER_LIV_ID=$(curl -s -X POST "$GATEWAY_URL/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "liv@agrima.com",
    "nom": "Livreur",
    "prenom": "Pierre",
    "role": "LIVREUR",
    "statut": "Actif"
  }' | grep -o '"id":[0-9]*' | cut -d: -f2)

echo "Created LIVREUR user with ID: $USER_LIV_ID"

echo "--------------------------------------------------"

# 2. Create Conversations
echo "2. Creating conversations between different roles..."

# Conversation between Consommateur and Producteur
CONV_CONS_PROD_ID=$(curl -s -X POST "$GATEWAY_URL/api/chat/conversations" \
  -H "Content-Type: application/json" \
  -d "{
    \"participant1Id\": $USER_CONS_ID,
    \"participant2Id\": $USER_PROD_ID,
    \"sujet\": \"Demande de prix\"
  }" | grep -o '"id":[0-9]*' | cut -d: -f2)

echo "Created conversation (CONS <-> PROD) with ID: $CONV_CONS_PROD_ID"

# Conversation between Producteur and Livreur
CONV_PROD_LIV_ID=$(curl -s -X POST "$GATEWAY_URL/api/chat/conversations" \
  -H "Content-Type: application/json" \
  -d "{
    \"participant1Id\": $USER_PROD_ID,
    \"participant2Id\": $USER_LIV_ID,
    \"sujet\": \"Ramassage colis\"
  }" | grep -o '"id":[0-9]*' | cut -d: -f2)

echo "Created conversation (PROD <-> LIV) with ID: $CONV_PROD_LIV_ID"

# Conversation between Admin and Producteur
CONV_ADMIN_PROD_ID=$(curl -s -X POST "$GATEWAY_URL/api/chat/conversations" \
  -H "Content-Type: application/json" \
  -d "{
    \"participant1Id\": $USER_ADMIN_ID,
    \"participant2Id\": $USER_PROD_ID,
    \"sujet\": \"Vérification compte\"
  }" | grep -o '"id":[0-9]*' | cut -d: -f2)

echo "Created conversation (ADMIN <-> PROD) with ID: $CONV_ADMIN_PROD_ID"

echo "--------------------------------------------------"

# 3. Send Messages
echo "3. Sending messages..."

# Message from Consommateur to Producteur
curl -s -X POST "$GATEWAY_URL/api/chat/messages" \
  -H "Content-Type: application/json" \
  -d "{
    \"conversationId\": $CONV_CONS_PROD_ID,
    \"senderId\": $USER_CONS_ID,
    \"body\": \"Bonjour, quel est le prix des pommes ?\"
  }" > /dev/null
echo "Message sent from CONS to PROD"

# Message from Producteur to Consommateur
curl -s -X POST "$GATEWAY_URL/api/chat/messages" \
  -H "Content-Type: application/json" \
  -d "{
    \"conversationId\": $CONV_CONS_PROD_ID,
    \"senderId\": $USER_PROD_ID,
    \"body\": \"Bonjour Marie, c'est 2€ le kilo.\"
  }" > /dev/null
echo "Message sent from PROD to CONS"

# Message from Admin to Producteur
curl -s -X POST "$GATEWAY_URL/api/chat/messages" \
  -H "Content-Type: application/json" \
  -d "{
    \"conversationId\": $CONV_ADMIN_PROD_ID,
    \"senderId\": $USER_ADMIN_ID,
    \"body\": \"Veuillez uploader votre attestation SIRET.\"
  }" > /dev/null
echo "Message sent from ADMIN to PROD"

echo "--------------------------------------------------"

# 4. Verification
echo "4. Verifying conversations for users..."

echo "Conversations for Producteur ($USER_PROD_ID):"
curl -s -X GET "$GATEWAY_URL/api/chat/conversations/user/$USER_PROD_ID"
echo -e "\n"

echo "Messages for CONS <-> PROD conversation ($CONV_CONS_PROD_ID):"
curl -s -X GET "$GATEWAY_URL/api/chat/conversations/$CONV_CONS_PROD_ID/messages"
echo -e "\n"

echo "--------------------------------------------------"
echo "Test completed."
