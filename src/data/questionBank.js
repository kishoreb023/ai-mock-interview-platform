// Robust Question Bank for standard Tech Roles and Dynamic Difficulty Routing
export const QUESTION_BANK = {
  "frontend": [
    // EASY
    {
      id: "fe_easy_1",
      difficulty: "easy",
      category: "conceptual",
      topics: ["HTML", "CSS", "Layout"],
      question: "Explain the difference between absolute, relative, fixed, and sticky positioning in CSS.",
      sampleAnswer: "Relative positioning is relative to its normal position. Absolute is positioned relative to the nearest positioned ancestor. Fixed is relative to the viewport and stays during scroll. Sticky toggles between relative and fixed depending on scroll position.",
      keySkills: ["CSS", "Layouts", "Web Standards"],
      timeLimit: 60
    },
    {
      id: "fe_easy_2",
      difficulty: "easy",
      category: "technical",
      topics: ["React", "State"],
      question: "What is the difference between state and props in React?",
      sampleAnswer: "State is local, mutable data managed within the component itself. Props are immutable inputs passed down from parent components to child components.",
      keySkills: ["React", "State Management", "Component Architecture"],
      timeLimit: 60
    },
    {
      id: "fe_easy_3",
      difficulty: "easy",
      category: "behavioral",
      topics: ["Collaboration", "Agile"],
      question: "Describe a situation where you had a disagreement with a team member on a frontend technical design. How did you resolve it?",
      sampleAnswer: "Focus on active listening, listing pros/cons, prototyping options, looking at performance benchmarks, and aligning on team or user requirements over personal preference.",
      keySkills: ["Communication", "Conflict Resolution", "Collaboration"],
      timeLimit: 90
    },
    
    // MEDIUM
    {
      id: "fe_med_1",
      difficulty: "medium",
      category: "technical",
      topics: ["JavaScript", "Performance"],
      question: "Explain event delegation in JavaScript and why it is useful. How does event bubbling relate to it?",
      sampleAnswer: "Event delegation is a pattern of attaching a single event listener to a parent element rather than individual child elements. It relies on event bubbling, where events bubble up from child elements to parent elements, reducing memory footprint and handling dynamic elements.",
      keySkills: ["JavaScript", "DOM Architecture", "Performance Optimization"],
      timeLimit: 90
    },
    {
      id: "fe_med_2",
      difficulty: "medium",
      category: "technical",
      topics: ["React", "Performance"],
      question: "Explain how React reconciles the Virtual DOM. When and why would you use useMemo or useCallback hooks?",
      sampleAnswer: "Reconciliation is the diffing algorithm React uses to update the DOM. useMemo memoizes the computed value of a function, while useCallback memoizes the function reference itself, preventing unnecessary re-renders of child components.",
      keySkills: ["React Internals", "Optimization", "Hooks"],
      timeLimit: 90
    },
    {
      id: "fe_med_3",
      difficulty: "medium",
      category: "scenario",
      topics: ["Security", "Web Performance"],
      question: "Scenario: A dashboard application you built is lagging when displaying 10,000 active table rows with live charts. How would you diagnose and optimize this UI performance issue?",
      sampleAnswer: "I would use Chrome DevTools Performance tab to profile. Optimization techniques include: table virtualization/windowing (rendering only visible rows), pagination, debouncing chart updates, memoizing rows, and Web Workers for processing chart data.",
      keySkills: ["Problem Solving", "Web Performance", "Performance Diagnostics"],
      timeLimit: 120
    },

    // HARD
    {
      id: "fe_hard_1",
      difficulty: "hard",
      category: "technical",
      topics: ["Browser", "Optimization"],
      question: "Walk through the Critical Rendering Path. What exactly happens from the moment an HTML file is received to when pixels are painted on the screen, and how do you optimize it?",
      sampleAnswer: "1. Constructing DOM. 2. Constructing CSSOM. 3. Running Javascript (blocks DOM). 4. Creating Render Tree. 5. Layout (geometry). 6. Paint (colors). To optimize: minify assets, defer/async JS, inline critical CSS, optimize images, and avoid layout thrashing.",
      keySkills: ["Browser Internals", "Critical Rendering Path", "Core Web Vitals"],
      timeLimit: 120
    },
    {
      id: "fe_hard_2",
      difficulty: "hard",
      category: "scenario",
      topics: ["Micro-frontends", "Architecture"],
      question: "Scenario: You are designing a Micro-frontend architecture for a massive e-commerce company where 5 independent teams deploy separate sections. How do you handle cross-application state, shared UI dependencies, and asset versioning?",
      sampleAnswer: "Use Webpack Module Federation or import maps for shared dependencies. Maintain separate repository deploys. Communicate via a custom Event Bus or query parameters instead of monolithic shared state. Set up robust CI/CD and CDN caching policies.",
      keySkills: ["System Architecture", "Micro-frontends", "Webpack/Vite Config"],
      timeLimit: 120
    }
  ],

  "backend": [
    // EASY
    {
      id: "be_easy_1",
      difficulty: "easy",
      category: "conceptual",
      topics: ["HTTP", "APIs"],
      question: "What is the difference between GET, POST, PUT, and DELETE HTTP request methods, and what makes a method idempotent?",
      sampleAnswer: "GET retrieves data. POST creates data. PUT updates data entirely. DELETE removes data. An idempotent method (like GET, PUT, DELETE) produces the same system state regardless of how many identical requests are made.",
      keySkills: ["REST API", "HTTP Protocols", "API Design"],
      timeLimit: 60
    },
    {
      id: "be_easy_2",
      difficulty: "easy",
      category: "technical",
      topics: ["Databases"],
      question: "Explain the difference between SQL (relational) and NoSQL (non-relational) databases. When would you prefer one over the other?",
      sampleAnswer: "SQL is tabular, schema-strict, ACID compliant, ideal for complex joins (e.g., banking). NoSQL is document/key-value/graph based, dynamic schema, horizontally scalable, ideal for rapid prototyping, logs, and high-velocity unstructured data.",
      keySkills: ["Database Design", "Relational Models", "ACID Properties"],
      timeLimit: 60
    },
    {
      id: "be_easy_3",
      difficulty: "easy",
      category: "behavioral",
      topics: ["Deadlines", "Agile"],
      question: "Tell me about a time you noticed a major backend security bug or architectural flaw close to a launch date. What actions did you take?",
      sampleAnswer: "Assess severity, communicate clearly with the product owner/lead, propose a hotfix, collaborate to implement a secure solution, and establish regression testing to avoid future occurrences.",
      keySkills: ["Problem Solving", "Responsibility", "Risk Management"],
      timeLimit: 90
    },

    // MEDIUM
    {
      id: "be_med_1",
      difficulty: "medium",
      category: "technical",
      topics: ["Caching", "Redis"],
      question: "How do you implement caching in a backend application? Compare Cache-Aside, Write-Through, and Write-Behind caching strategies.",
      sampleAnswer: "Cache-Aside reads from cache first; if miss, reads database and populates cache. Write-Through writes to cache and database concurrently. Write-Behind writes to cache first and database asynchronously. Caching reduces database load and latency.",
      keySkills: ["Caching Architectures", "Redis/Memcached", "High Availability"],
      timeLimit: 90
    },
    {
      id: "be_med_2",
      difficulty: "medium",
      category: "technical",
      topics: ["Concurrency", "Scaling"],
      question: "Explain the difference between processes and threads. How does a single-threaded runtime like Node.js handle high concurrency compared to a multi-threaded server?",
      sampleAnswer: "A process is an isolated execution unit with its own memory. A thread is a lightweight execution path sharing process memory. Node.js uses a single-threaded Event Loop and non-blocking asynchronous I/O to handle thousands of concurrent requests without thread overhead, while multi-threaded servers spin up threads per connection.",
      keySkills: ["Concurrency", "Node.js Architecture", "Operating Systems"],
      timeLimit: 90
    },
    {
      id: "be_med_3",
      difficulty: "medium",
      category: "scenario",
      topics: ["Scaling", "Databases"],
      question: "Scenario: Your primary transactional SQL database CPU is spiking to 99% usage and blocking queries during peak hours. What are your immediate diagnostic steps and long-term remedies?",
      sampleAnswer: "Immediate: Identify slow-running queries using slow query logs or EXPLAIN commands, kill blocking processes, and temporarily scale database resources. Long-term: Optimize slow queries, add indexes, set up read-replicas, add a caching layer (Redis), or shard the database.",
      keySkills: ["Database Diagnostics", "Query Optimization", "Database Scaling"],
      timeLimit: 120
    },

    // HARD
    {
      id: "be_hard_1",
      difficulty: "hard",
      category: "conceptual",
      topics: ["Distributed Systems", "Consistency"],
      question: "Explain the CAP Theorem and how PACELC extends it. In a highly distributed database system, how would you design for eventual consistency vs strong consistency?",
      sampleAnswer: "CAP: Consistency, Availability, Partition Tolerance (choose 2). PACELC: If partition (P), trade off Availability (A) and Consistency (C); else (E), trade off Latency (L) and Consistency (C). Designing eventual consistency relies on vector clocks or conflict resolution (CRDTs), whereas strong consistency uses consensus protocols like Raft or Paxos.",
      keySkills: ["Distributed Systems", "Consensus Algorithms", "CAP/PACELC Theorem"],
      timeLimit: 120
    },
    {
      id: "be_hard_2",
      difficulty: "hard",
      category: "scenario",
      topics: ["Microservices", "Reliability"],
      question: "Scenario: You are building a payment microservice. If a user double-clicks the purchase button, how do you guarantee idempotency, prevent double-charging, and handle failures mid-transaction?",
      sampleAnswer: "Generate a unique Idempotency Key at the frontend and store it in Redis with lock. Use distributed transactions or Sagas with compensating actions for mid-transaction failures. Enforce database constraints and database-level locking.",
      keySkills: ["Idempotency", "Microservices Architecture", "Transaction Patterns"],
      timeLimit: 120
    }
  ],

  "fullstack": [
    // EASY
    {
      id: "fs_easy_1",
      difficulty: "easy",
      category: "conceptual",
      topics: ["Web Architecture", "APIs"],
      question: "Explain the full client-server lifecycle of an HTTP request from typing a URL in a browser to the page loading.",
      sampleAnswer: "1. DNS lookup resolves IP. 2. TCP handshake. 3. SSL/TLS handshake. 4. Browser sends HTTP request. 5. Server processes request (routes, database). 6. Server sends HTTP response. 7. Browser parses HTML/CSS/JS and renders.",
      keySkills: ["Web Protocols", "Networking", "Client-Server Basics"],
      timeLimit: 60
    },
    {
      id: "fs_easy_2",
      difficulty: "easy",
      category: "technical",
      topics: ["Auth", "Security"],
      question: "What is the difference between authentication and authorization? Give real-world examples of how they are implemented.",
      sampleAnswer: "Authentication is verifying who a user is (e.g., login credentials, MFA, OAuth). Authorization is verifying what they can do or access (e.g., role-based permissions like admin vs regular user).",
      keySkills: ["Web Security", "Auth0/JWT", "RBAC"],
      timeLimit: 60
    },
    {
      id: "fs_easy_3",
      difficulty: "easy",
      category: "behavioral",
      topics: ["Communication", "Agile"],
      question: "How do you explain complex technical architectural trade-offs (e.g., choosing a database) to non-technical business stakeholders?",
      sampleAnswer: "Avoid heavy jargon. Focus on business impacts: cost, reliability, development speed, and scalability. Use metaphors (e.g., building a house or highways) to illustrate system constraints and tradeoffs.",
      keySkills: ["Technical Communication", "Stakeholder Management", "Business Alignment"],
      timeLimit: 90
    },

    // MEDIUM
    {
      id: "fs_med_1",
      difficulty: "medium",
      category: "technical",
      topics: ["Security", "OWASP"],
      question: "What are SQL Injection, XSS (Cross-Site Scripting), and CSRF (Cross-Site Request Forgery)? How do you prevent each of them in a full-stack app?",
      sampleAnswer: "SQL Injection: executing malicious SQL commands (prevent via parameterized queries). XSS: injecting client-side scripts (prevent via input sanitization, escaping, Content Security Policy). CSRF: forcing authenticated requests (prevent via Anti-CSRF tokens, SameSite cookies).",
      keySkills: ["Web Security", "OWASP Top 10", "Full-Stack Security"],
      timeLimit: 90
    },
    {
      id: "fs_med_2",
      difficulty: "medium",
      category: "technical",
      topics: ["WebSockets", "Real-time"],
      question: "Compare WebSockets, Server-Sent Events (SSE), and Long Polling. In what scenario would you choose SSE over WebSockets?",
      sampleAnswer: "WebSockets support bi-directional full-duplex communication (ideal for chats/gaming). SSE supports mono-directional server-to-client streaming (ideal for dashboards, news feeds). Long Polling repeatedly polls server. Choose SSE for unidirectional notifications as it handles reconnects natively.",
      keySkills: ["Real-time Protocols", "Network Architecture", "API Design"],
      timeLimit: 90
    },
    {
      id: "fs_med_3",
      difficulty: "medium",
      category: "scenario",
      topics: ["Caching", "Database"],
      question: "Scenario: Your backend server and database are perfectly optimized, but users in Europe experience 500ms latency, while US users experience 50ms latency. How would you diagnose and fix this latency issue?",
      sampleAnswer: "The issue is physical distance / network latency. I would set up a CDN (Content Delivery Network) like Cloudflare for static assets, deploy backend instances in European regions, use multi-region database replication, and route traffic via GeoDNS.",
      keySkills: ["Global Architecture", "CDN Routing", "Latency Management"],
      timeLimit: 120
    },

    // HARD
    {
      id: "fs_hard_1",
      difficulty: "hard",
      category: "technical",
      topics: ["Database Transactions", "Concurrency"],
      question: "Explain transaction isolation levels in databases (Read Uncommitted, Read Committed, Repeatable Read, Serializable). What concurrency anomalies does each solve?",
      sampleAnswer: "Isolation levels manage concurrent transactions. 1. Read Uncommitted: suffers from Dirty Reads. 2. Read Committed: avoids Dirty Reads, suffers from Non-Repeatable Reads. 3. Repeatable Read: avoids Non-Repeatable, suffers from Phantom Reads. 4. Serializable: avoids all, but has highest performance cost due to extensive locking.",
      keySkills: ["Database Internals", "ACID Compliance", "Concurrency Control"],
      timeLimit: 120
    },
    {
      id: "fs_hard_2",
      difficulty: "hard",
      category: "scenario",
      topics: ["System Design", "Load Balancing"],
      question: "Scenario: You are designing a system to handle flash sales (e.g. 100,000 requests per second targeting only 100 items in inventory). How do you design this system to prevent database exhaustion, race conditions, and over-selling?",
      sampleAnswer: "Use rate limiting, API gateways, and distributed message queues (Kafka/RabbitMQ) to throttle load. Use Redis for atomic decrements (DECR) to pre-allocate inventory, and write orders to database asynchronously. Use optimistic/pessimistic locking.",
      keySkills: ["System Design", "Distributed Caching", "Rate Limiting"],
      timeLimit: 120
    }
  ],

  "datascience": [
    // EASY
    {
      id: "ds_easy_1",
      difficulty: "easy",
      category: "conceptual",
      topics: ["Machine Learning", "Metrics"],
      question: "What is the difference between Precision and Recall? In what real-world case would you prioritize recall over precision?",
      sampleAnswer: "Precision is True Positives divided by total predicted positives (accuracy of positive predictions). Recall is True Positives divided by total actual positives (capturing all positive instances). Prioritize recall in medical diagnostics (cancer detection) or spam filtering.",
      keySkills: ["Machine Learning Basics", "Evaluation Metrics", "Statistics"],
      timeLimit: 60
    },
    {
      id: "ds_easy_2",
      difficulty: "easy",
      category: "technical",
      topics: ["Python", "Pandas"],
      question: "What are some strategies for handling missing or null values in a dataset using Pandas, and what are their drawbacks?",
      sampleAnswer: "1. Drop rows/columns (drawback: lose data). 2. Impute with mean/median (drawback: reduces variance). 3. Forward/backward fill for time series. 4. Model-based imputation (drawback: computationally expensive).",
      keySkills: ["Data Preprocessing", "Pandas Library", "Feature Engineering"],
      timeLimit: 60
    },
    {
      id: "ds_easy_3",
      difficulty: "easy",
      category: "behavioral",
      topics: ["Stakeholders", "Data Bias"],
      question: "Describe how you would communicate the presence of severe data bias in a model to a product manager who is eager to deploy it immediately.",
      sampleAnswer: "Present the bias clearly with concrete impact analysis (e.g., poor accuracy on a demographic). Frame it as a business and brand risk, and provide a quick roadmap or options to mitigate it before release.",
      keySkills: ["Ethical AI", "Communication", "Data Literacy"],
      timeLimit: 90
    },

    // MEDIUM
    {
      id: "ds_med_1",
      difficulty: "medium",
      category: "technical",
      topics: ["Machine Learning", "Overfitting"],
      question: "Explain the Bias-Variance tradeoff. How do L1 (Lasso) and L2 (Ridge) regularization help prevent overfitting?",
      sampleAnswer: "Bias is error from simple assumptions; variance is error from sensitivity to noise. Tradeoff is finding the sweet spot. L1 adds absolute weight penalty, leading to sparse models (feature selection). L2 adds squared weight penalty, shrinking weights to near zero.",
      keySkills: ["Machine Learning Theory", "Regularization", "Bias-Variance Tradeoff"],
      timeLimit: 90
    },
    {
      id: "ds_med_2",
      difficulty: "medium",
      category: "technical",
      topics: ["Deep Learning", "LLMs"],
      question: "Explain the self-attention mechanism in Transformer models. What advantage does it have over RNNs or LSTMs?",
      sampleAnswer: "Self-attention computes dynamic weights representing how much each word in a sequence relates to every other word, regardless of distance. It enables parallel processing of sequences, solving the vanishing gradient and sequential processing bottlenecks of RNNs/LSTMs.",
      keySkills: ["Transformer Architecture", "Attention Mechanisms", "Deep Learning"],
      timeLimit: 90
    },
    {
      id: "ds_med_3",
      difficulty: "medium",
      category: "scenario",
      topics: ["Data Quality", "Feature Selection"],
      question: "Scenario: You are given an tabular dataset with 500 features but only 1,000 samples. How do you construct a pipeline to build a robust classifier and prevent the curse of dimensionality?",
      sampleAnswer: "I would: 1. Remove highly correlated features. 2. Apply dimensionality reduction (PCA or t-SNE) or feature selection (SelectKBest, tree-based importances). 3. Use L1 regularization. 4. Use simple robust models. 5. Perform rigorous cross-validation (K-Fold).",
      keySkills: ["Feature Reduction", "Curse of Dimensionality", "Pipeline Construction"],
      timeLimit: 120
    },

    // HARD
    {
      id: "ds_hard_1",
      difficulty: "hard",
      category: "conceptual",
      topics: ["Deep Learning", "Optimization"],
      question: "Walk through the mathematical mechanics of backpropagation. What is the vanishing/exploding gradient problem, and how do modern architectures combat it?",
      sampleAnswer: "Backpropagation uses the chain rule to compute gradients of the loss function with respect to weights, updating them via gradient descent. Vanishing/exploding gradients occur in deep networks as repeated matrix multiplications shrink or grow gradients. Combated via: ReLU/GELU activations, Batch Normalization, residual connections, and Xavier/He weight initialization.",
      keySkills: ["Deep Learning Theory", "Optimization Algorithms", "Gradient Mechanics"],
      timeLimit: 120
    },
    {
      id: "ds_hard_2",
      difficulty: "hard",
      category: "scenario",
      topics: ["LLM Operations", "Production"],
      question: "Scenario: You need to deploy an LLM-based Retrieval-Augmented Generation (RAG) system handling 1,000 user queries per minute. How do you design the vector index, manage retrieval latency, handle hallucination detection, and ensure model safety?",
      sampleAnswer: "Index: Use HNSW or IVF-PQ index in a vector DB (e.g. Pinecone/Milvus) for sub-millisecond similarity search. Latency: cache semantic matches. Hallucination: use guardrails, self-consistency checks, and context length optimization. Safety: apply moderation filters and toxicity scoring.",
      keySkills: ["RAG Architecture", "LLMOps", "Vector Databases"],
      timeLimit: 120
    }
  ]
};
