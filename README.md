# 📚 AI-Powered Library Management System

An intelligent and scalable Library Management System (LMS) that leverages the power of AI and Large Language Models (LLMs) to enhance book search, user interactions, and administrative operations.

## 🚀 Features

- 🔍 **AI-Driven Book Search**: Uses Llama 3-8B for natural language understanding and semantic search.
- 🧠 **LLM Query Processing**: Understands user queries and translates them into meaningful system actions.
- 👥 **Role-Based Access Control (RBAC)**: Separate modules for students and admins with secure permissions.
- 🔁 **Book Borrow & Return**: Seamless issuing and returning system with real-time updates.
- 🛡️ **Secure & Scalable Architecture**: Built using modern web technologies ensuring performance and data security.

## 🛠️ Tech Stack

- **Frontend**: React.js (Shadcn UI)
- **Backend**: Node.js
- **Database**: MongoDB
- **AI & LLM**: Llama 3-8B, AI SDK
- **Other Tools**: LangChain, Tool Calling, RBAC

## 📌 Project Objectives

- Build an intelligent system that understands user intent via natural language.
- Improve the search and management capabilities of traditional LMS.
- Design a secure, modular, and production-ready full-stack application.

## 📊 Architecture Overview

```mermaid
graph TD
  User -->|Query| ReactApp
  ReactApp --> NodeJS
  NodeJS -->|Search Request| Llama3
  Llama3 -->|Processed Intent| NodeJS
  NodeJS -->|Query| MongoDB
  MongoDB --> NodeJS
  NodeJS --> ReactApp --> User
