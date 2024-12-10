# **Roadmap Generator**

A web-based application powered by AI to help developers generate personalized learning roadmaps based on their skills and preferences. This project demonstrates a full-stack implementation with a focus on modern technologies and best practices.

---

## **Table of Contents**

1. [Features](#features)  
2. [Demo](#demo)  
3. [Technologies Used](#technologies-used)  
4. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
5. [Usage](#usage)  
6. [Project Structure](#project-structure)  
7. [API Endpoints](#api-endpoints)  
8. [Contributing](#contributing)  
9. [Future Improvements](#future-improvements)  
10. [License](#license)  

---

## **Features**

- Interactive form to assess developer skills.  
- AI-powered roadmap generation tailored to user preferences.  
- Visual representation of the roadmap with dynamic node-link diagrams.  
- Responsive and modern UI/UX.  
- Integration with external learning platforms (planned).  

---

## **Demo**

Add a live link here once hosted (e.g., Vercel or Netlify).  

**Live Demo:** [Roadmap Generator](https://example.com)  

Include a gif or screenshot of the application showcasing the roadmap creation process.  

---

## **Technologies Used**

### **Front-End**
- Next.js (React Framework)
- TypeScript
- TailwindCSS  
- D3.js (for roadmap visualization)

### **Back-End**
- Node.js
- NestJS  
- MongoDB (Database)  
- Prisma (ORM)  

### **AI/External APIs**
- OpenAI API (for recommendations and roadmap generation)  

### **DevOps**
- Vercel (front-end hosting)  
- Render (back-end hosting)  
- GitHub Actions (CI/CD)  

---

## **Getting Started**

### **Prerequisites**

Ensure you have the following installed:
- Node.js (version 18.x or later)  
- npm or yarn  
- MongoDB (local instance or MongoDB Atlas)  

### **Installation**

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/roadmap-generator.git
    cd roadmap-generator
2. Install dependencies for the front-end:
    ```bash
    cd frontend
    npm install
3. Install dependencies for the back-end:
    ```bash
   cd ../backend
   npm install
4. Set up environment variables:
    - Create .env files in both frontend and backend directories.
    - Example variables for the backend:
    ```bash
    DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/mydatabase
    OPENAI_API_KEY=your_openai_api_key
5. Run MongoDB locally or connect to MongoDB Atlas.

### **Usage**

1. Start the back-end server:
    ```bash
    cd backend
    npm run start:dev
2. Start the front-end development server:
    ```bash
    cd ../frontend
    npm run dev
3. Open the app in your browser:
    http://localhost:3000

## **Project Structure**
### **Front-End**
    frontend/
    ├── components/       # Reusable React components
    ├── pages/            # Next.js routes
    ├── public/           # Static assets
    ├── styles/           # Global styles and Tailwind configuration
    ├── utils/            # Helper functions
    └── state/            # Zustand for global state management

### **Back-End**
    backend/
    ├── src/
    │   ├── controllers/  # API route controllers
    │   ├── services/     # Business logic
    │   ├── schemas/      # MongoDB schemas
    │   ├── dto/          # Data transfer objects
    │   └── main.ts       # Entry point
    └── test/             # Unit and integration tests

## **API Endpoints**
### **POST /api/generate-roadmap**

- Description: Generates a personalized roadmap based on user responses.
- Request Body:
    ```bash
    {
        "html": "beginner",
        "css": "intermediate",
        "javascript": "advanced"
    }
- Response: 
    ```bash
    {
        "nodes": [
            { "id": "HTML Basics", "level": "beginner" },
            { "id": "CSS Layouts", "level": "intermediate" }
        ],
        "links": [
            { "source": "HTML Basics", "target": "CSS Layouts" }
        ]
    }

## **Contributing**
Contributions are welcome!

1. Fork the repository.
2. Create a feature branch
    ```bash
    git checkout -b feature/new-feature
3. Commit your changes: 
    ```bash
    git commit -m "Add new feature"
4. Push to the branch:
    ```bash
    git push origin feature/new-feature
5. Submit yout pull request.

## **Future Improvements**
- Export roadmaps to PDF or PNG format.
- Add more dynamic AI suggestions using GPT models.
- Allow users to save and share their roadmaps.
- Support multiple languages.

## **License**
This project is licensed under the MIT License. See the LICENSE file for details.
