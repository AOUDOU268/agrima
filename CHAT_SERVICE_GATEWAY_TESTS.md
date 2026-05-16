# Chat Service Gateway Tests

These are Postman-style gateway tests for the chat service, routed through the API Gateway at `http://localhost:8080`.

> The chat service itself is configured to run on `http://127.0.0.1:8092`, and the gateway forwards requests for `/api/chat/**` to it.

## 1. Create Conversation

- Method: `POST`
- URL: `http://localhost:8080/api/chat/conversations`
- Headers:
  - `Content-Type: application/json`
- Body:
```json
{
  "consumerId": 1,
  "producerId": 2,
  "sujet": "Question produit"
}
```
- Expected: `200 OK`
- Notes:
  - `consumerId` and `producerId` must be existing user IDs.
  - `consumerId` represents the user in the consumer role, and `producerId` represents the user in the producer role.
  - The response should contain `conversationId`, `consumerId`, `producerId`, and `sujet`.

## 2. Get Conversations by Consumer

- Method: `GET`
- URL: `http://localhost:8080/api/chat/conversations/consumer/1`
- Expected: `200 OK`
- Notes: Returns a list of conversations where `consumerId` matches `1`.

## 3. Get Conversations by Producer

- Method: `GET`
- URL: `http://localhost:8080/api/chat/conversations/producer/2`
- Expected: `200 OK`
- Notes: Returns a list of conversations where `producerId` matches `2`.

## 4. Get Conversation by ID

- Method: `GET`
- URL: `http://localhost:8080/api/chat/conversations/{id}`
- Replace `{id}` with the `conversationId` returned from the create request.
- Expected: `200 OK` if found, otherwise `404 Not Found`.

## 5. Send Message

- Method: `POST`
- URL: `http://localhost:8080/api/chat/messages`
- Headers:
  - `Content-Type: application/json`
- Body:
```json
{
  "conversationId": 1,
  "senderId": 1,
  "body": "Bonjour, je souhaite plus de détails sur le produit."
}
```
- Expected: `200 OK`
- Notes: The response should contain the created message data.

## 6. Get Messages for Conversation

- Method: `GET`
- URL: `http://localhost:8080/api/chat/conversations/1/messages`
- Expected: `200 OK`
- Notes: Returns message history for the specified conversation.

## Gateway Validation Checklist

- [ ] API Gateway is running on `http://localhost:8080`
- [ ] Chat service is running on `http://127.0.0.1:8088`
- [ ] Gateway route exists for `/api/chat/**`
- [ ] Requests passing through the gateway return the same payload shape as the chat service
