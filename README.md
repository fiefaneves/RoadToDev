# **Roadmap Generator**

This project is a byproduct of our course through "Desenvolvimento de Software", where we were supposed to create a real life application using
 some form of AI.RoadToDev is a simple way of understanding what you will need to learn to achieve a certain goal in the developers scenary.
 Based on your answer to the sign up form, wich indicates your level os expertise and and areas of interest,the openai api will, (while in this MVP version) 
 create a text form road map indicating the areas the user needs to focus, and later on, the application will give a more interactive and reactive response
 regarding the road map it self.A web-based application powered by AI to help developers generate personalized learning roadmaps based on their 
 skills and preferences. This project demonstrates a full-stack implementation with a focus on modern technologies and best practices.

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

- Interactive form to asses developer skills.  
- AI-powered roadmap generation tailored to user preferences.  
- Text representation of the roadmap with dynamic node-link diagrams.  
//- Responsive and modern UI/UX.  
//- Integration with external learning platforms (planned).  

---

## **Demo**

Add a live link here once hosted (e.g., Vercel or Netlify).  

**Live Demo:** [Roadmap Generator](https://example.com)
![alt text](capturas-do-sistema/image.png)


![alt text](capturas-do-sistema/image-2.png)

print do texto do road
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
- Express  
- //MongoDB (Database)  
- //Prisma (ORM)  

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
- //MongoDB (local instance or MongoDB Atlas)  

### **Installation**

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/roadmap-generator.git
    cd roadmap-generator
2. Install dependencies for the front-end:
    ```bash
    cd frontend
    npm install next react react-dom

3. Install dependencies for the back-end:
    ```bash
   cd ../backend
   npm install
4. Set up environment variables:
    - Create .env files in both frontend and backend directories.
    - Example variables for the backend:
    ```bash
    //DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/mydatabase
    OPENAI_API_KEY=your_openai_api_key
//5. Run MongoDB locally or connect to MongoDB Atlas.

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
    │── .next/                  #next modules
    │── node_modules/           #nodejs modules
    │── public/                 
    │── src/                    
        │──app/
        │  │── signUP/
        │  │   └──page/        #forms
        │  │── homepage/       #home page info
        │  └── layout/         #layout configuration
        │── Components/
        │   └── button/         #sign up button layout
        │── lib/
        │   └── utils/
        └── styles/
            └─ globals/         #global css for application styling
        

                            
### **Back-End**
    backend/
    ├── src/
    │   ├── controllers/  # API route controllers
    │   ├── services/     # Business logic
    │   ├── schemas/      # MongoDB schemas
    │   ├── dto/          # Data transfer objects
    │   └── main.ts       # Entry point
    └── test/             # Unit and integration tests

    backend/
    │── node_modules/           #nodejs modules
    │── src/                    
        │── config/
        │   └──open-ai/         #open ai configuration 
        │── controllers/
        │     └── generative/   #description of generate function, wich takes the user input and outputs the roadmap in the text form
        │── routes/
        │   └──usersRoutes/     #uses generate function and creates a route between the forms input and the AI to  




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
5. Submit your pull request.

## **Future Improvements**
- Export roadmaps to PDF or PNG format.
- Add more dynamic AI suggestions using GPT models.
- Allow users to save and share their roadmaps.
- Support multiple languages.

## **License**
This project is licensed under the MIT License. See the LICENSE file for details.
