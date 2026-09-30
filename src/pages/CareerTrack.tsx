import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Briefcase, CheckCircle2, ChevronRight, Target, Lightbulb, 
  GraduationCap, Building, Code, Compass, DollarSign, Brain, Bot, X, Sparkles, 
  TrendingUp, Award, Building2, HelpCircle, Check, Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RoleDetail {
  title: string;
  tagline: string;
  compensation: string;
  demand: string;
  experienceLevel: string;
  overview: string;
  keySkills: string[];
  responsibilities: string[];
  interviewQuestions: { q: string; tip: string }[];
  careerLadder: { stage: string; title: string; timeframe: string }[];
  topHiring: string[];
  certifications: string[];
}

interface SectorData {
  id: string;
  title: string;
  description: string;
  color: string;
  salaryBenchmark: string;
  roles: RoleDetail[];
  skills: { name: string; category: string; description: string }[];
}

const SECTOR_CATALOG: Record<string, SectorData> = {
  'placement-software': {
    id: 'placement-software',
    title: 'Placement (Software)',
    description: 'Design, develop, and maintain software systems. This path offers high growth, flexibility, global remote opportunities, and continuous technical innovation.',
    color: 'sky',
    salaryBenchmark: '₹8 LPA – ₹28 LPA ($85k – $150k)',
    roles: [
      {
        title: 'Software Engineer',
        tagline: 'Architect, develop, and deploy enterprise applications and scalable distributed services.',
        compensation: '₹8 LPA – ₹24 LPA ($85k – $140k)',
        demand: '96% (Very High Demand)',
        experienceLevel: 'Entry to Mid (0–3 Years)',
        overview: 'Software Engineers translate business specifications into robust, maintainable code. They participate in agile development cycles, build high-throughput APIs, optimize database queries, and contribute to system architecture.',
        keySkills: ['Data Structures & Algorithms', 'System Design', 'Python / Java / TypeScript', 'SQL & NoSQL Databases', 'Git & CI/CD Pipelines', 'Docker'],
        responsibilities: [
          'Design and implement microservices and customer-facing web applications.',
          'Conduct code reviews, write automated unit tests, and maintain CI/CD test suites.',
          'Debug complex production incidents using distributed tracing and logging.',
          'Collaborate closely with product managers and UX designers on technical feasibility.'
        ],
        interviewQuestions: [
          {
            q: 'How would you design a distributed URL shortening service like Bit.ly?',
            tip: 'Focus on estimation (QPS, storage), hashing algorithm (Base62 vs MD5), database schema, caching with Redis, and collision handling.'
          },
          {
            q: 'Explain the internal mechanics of a Hash Map in Java or Python and how collisions are resolved.',
            tip: 'Mention array of buckets, hash code computation, chaining via linked lists / Red-Black trees, and load factor resizing.'
          },
          {
            q: 'What is database indexing and when does adding an index hurt performance?',
            tip: 'Explain B-Tree/LSM trees. Indexes speed up SELECT lookups but degrade INSERT/UPDATE/DELETE throughput and consume additional storage.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Associate Software Engineer (L3)', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Software Engineer II (L4)', timeframe: '2–4 Years' },
          { stage: 'Stage 3', title: 'Senior Software Engineer (L5)', timeframe: '4–7 Years' },
          { stage: 'Stage 4', title: 'Staff / Principal Engineer (L6+)', timeframe: '7+ Years' }
        ],
        topHiring: ['Google', 'Amazon', 'Microsoft', 'Uber', 'Atlassian', 'Flipkart'],
        certifications: ['AWS Certified Developer Associate', 'Meta Backend Developer Professional Certificate', 'CKA: Certified Kubernetes Administrator']
      },
      {
        title: 'Data Analyst',
        tagline: 'Transform raw enterprise telemetry into actionable business intelligence and dashboards.',
        compensation: '₹6 LPA – ₹16 LPA ($70k – $115k)',
        demand: '91% (High Demand)',
        experienceLevel: 'Entry to Mid (0–2 Years)',
        overview: 'Data Analysts bridge business strategy and statistical data. They extract metrics from enterprise data warehouses, build automated reporting dashboards, conduct exploratory data analysis (EDA), and present key insights to executives.',
        keySkills: ['Advanced SQL', 'Python (Pandas, NumPy)', 'Tableau / Power BI', 'Statistical Hypothesis Testing', 'Excel / Financial Modeling'],
        responsibilities: [
          'Write optimized SQL queries across multi-terabyte data warehouses (Snowflake, BigQuery).',
          'Create intuitive executive dashboards to track core KPIs like churn, retention, and LTV.',
          'Perform exploratory data analysis to pinpoint user drop-offs and feature engagement.',
          'Collaborate with data engineers to validate telemetry schemas and ensure pipeline hygiene.'
        ],
        interviewQuestions: [
          {
            q: 'Write a SQL query to find the 3rd highest departmental salary using window functions.',
            tip: 'Use DENSE_RANK() or ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) in a Common Table Expression (CTE).'
          },
          {
            q: 'How would you measure the statistical significance of an A/B test with low sample sizes?',
            tip: 'Discuss sample size calculations (power analysis), t-test vs Mann-Whitney U test, and controlling for type I and type II errors.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Junior Data Analyst', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Senior Data Analyst', timeframe: '2–5 Years' },
          { stage: 'Stage 3', title: 'Lead Analytics Specialist', timeframe: '5–8 Years' },
          { stage: 'Stage 4', title: 'Head of Business Intelligence', timeframe: '8+ Years' }
        ],
        topHiring: ['McKinsey & Company', 'Deloitte', 'JPMorgan Chase', 'Swiggy', 'Target', 'Mu Sigma'],
        certifications: ['Google Data Analytics Professional Certificate', 'Microsoft Power BI Data Analyst (PL-300)', 'AWS Certified Data Analytics']
      },
      {
        title: 'AI/ML Engineer',
        tagline: 'Build, evaluate, and scale machine learning models, neural networks, and generative AI pipelines.',
        compensation: '₹10 LPA – ₹32 LPA ($100k – $175k)',
        demand: '98% (Exponential Growth)',
        experienceLevel: 'Entry to Senior (1–4 Years)',
        overview: 'AI/ML Engineers develop machine learning algorithms and neural network architectures. They fine-tune large language models, construct vector retrieval pipelines (RAG), and optimize model inference latency for production deployment.',
        keySkills: ['PyTorch / TensorFlow', 'Python', 'Vector DBs (Chroma/Pinecone)', 'LangChain / LlamaIndex', 'Model Fine-tuning & LoRA', 'MLOps & Docker'],
        responsibilities: [
          'Train, evaluate, and fine-tune deep learning models for classification and NLP tasks.',
          'Construct low-latency Retrieval-Augmented Generation (RAG) pipelines with semantic vector search.',
          'Deploy models using TensorRT, ONNX, and Triton inference servers.',
          'Monitor data drift and model hallucinations in production environments.'
        ],
        interviewQuestions: [
          {
            q: 'Explain the self-attention mechanism in Transformers and how Query, Key, and Value matrices interact.',
            tip: 'Detail Attention(Q,K,V) = softmax(QK^T / sqrt(d_k)) * V, explaining quadratic computational complexity.'
          },
          {
            q: 'How do you prevent overfitting in deep neural networks?',
            tip: 'Cover Dropout, L1/L2 regularization, early stopping, data augmentation, batch normalization, and cross-validation.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Associate Machine Learning Engineer', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Machine Learning Engineer', timeframe: '2–4 Years' },
          { stage: 'Stage 3', title: 'Senior AI Research Engineer', timeframe: '4–7 Years' },
          { stage: 'Stage 4', title: 'Principal Applied Scientist', timeframe: '7+ Years' }
        ],
        topHiring: ['OpenAI', 'NVIDIA', 'Anthropic', 'Google DeepMind', 'Adobe', 'Databricks'],
        certifications: ['DeepLearning.AI Deep Learning Specialization', 'AWS Certified Machine Learning Specialty']
      },
      {
        title: 'Cybersecurity Analyst',
        tagline: 'Defend enterprise infrastructure, perform penetration testing, and enforce zero-trust security.',
        compensation: '₹7 LPA – ₹20 LPA ($80k – $130k)',
        demand: '92% (High Demand)',
        experienceLevel: 'Entry to Mid (0–3 Years)',
        overview: 'Cybersecurity Analysts safeguard digital assets from threats. They configure Security Information and Event Management (SIEM) tools, inspect network packet traffic, run vulnerability assessments, and orchestrate incident response.',
        keySkills: ['Network Security & Wireshark', 'Linux System Administration', 'Burp Suite / Metasploit', 'SIEM (Splunk, Sentinel)', 'OWASP Top 10', 'Cryptography'],
        responsibilities: [
          'Monitor real-time network traffic and triage SIEM alerts for malicious intrusion patterns.',
          'Conduct vulnerability scans and authorized penetration testing on web applications.',
          'Maintain zero-trust access control policies and cryptographic key management.',
          'Author incident response post-mortems and enforce corporate security compliance.'
        ],
        interviewQuestions: [
          {
            q: 'Walk through how a SYN flood DDoS attack works and how SYN cookies mitigate it.',
            tip: 'Explain TCP 3-way handshake exhaustion and how stateless SYN cookies encode connection parameters into sequence numbers.'
          },
          {
            q: 'Explain Cross-Site Scripting (XSS) and methods to mitigate stored vs reflected variants.',
            tip: 'Cover input sanitization, Contextual output encoding, Content Security Policy (CSP), and HttpOnly cookie flags.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'SOC Analyst (Tier 1)', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Security Engineer / Pentester', timeframe: '2–5 Years' },
          { stage: 'Stage 3', title: 'Senior Information Security Architect', timeframe: '5–8 Years' },
          { stage: 'Stage 4', title: 'Chief Information Security Officer (CISO)', timeframe: '8+ Years' }
        ],
        topHiring: ['Palo Alto Networks', 'CrowdStrike', 'Cisco Systems', 'Cloudflare', 'EY Cybersecurity', 'Mandiant'],
        certifications: ['CompTIA Security+', 'CEH: Certified Ethical Hacker', 'OSCP: Offensive Security Certified Professional']
      },
      {
        title: 'Cloud Engineer',
        tagline: 'Design resilient multi-region cloud architectures, automate infrastructure, and ensure 99.99% uptime.',
        compensation: '₹8 LPA – ₹22 LPA ($90k – $145k)',
        demand: '95% (Very High Demand)',
        experienceLevel: 'Entry to Mid (0–3 Years)',
        overview: 'Cloud Engineers build, deploy, and manage distributed cloud systems. They write Infrastructure as Code (Terraform), manage Kubernetes clusters, configure virtual networks, and optimize operational spend.',
        keySkills: ['AWS / GCP / Azure', 'Terraform (IaC)', 'Kubernetes & Docker', 'Linux CLI & Bash', 'CI/CD Automation', 'Prometheus & Grafana'],
        responsibilities: [
          'Provision cloud resources across multi-region environments using declarative Terraform scripts.',
          'Manage container orchestration with Kubernetes, ensuring automatic scaling and zero-downtime rollouts.',
          'Configure VPC subnets, NAT gateways, security groups, and IAM role least-privilege policies.',
          'Audit and optimize cloud billing metrics and egress costs.'
        ],
        interviewQuestions: [
          {
            q: 'What is the difference between blue-green deployment and canary deployment in Kubernetes?',
            tip: 'Blue-green switches 100% traffic between identical environments; canary gradually routes a small percentage (e.g. 5%) of live traffic to test stability.'
          },
          {
            q: 'How does Terraform manage state and what happens if two developers apply changes simultaneously?',
            tip: 'Discuss terraform.tfstate, remote backends (S3 + DynamoDB locking), and state locking to prevent concurrency collisions.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Associate Cloud Engineer', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Cloud DevOps Engineer', timeframe: '2–4 Years' },
          { stage: 'Stage 3', title: 'Senior Cloud Solutions Architect', timeframe: '4–7 Years' },
          { stage: 'Stage 4', title: 'Principal Infrastructure Architect', timeframe: '7+ Years' }
        ],
        topHiring: ['Amazon Web Services', 'Microsoft Azure', 'Google Cloud', 'HashiCorp', 'Red Hat', 'Salesforce'],
        certifications: ['AWS Solutions Architect Associate', 'Google Cloud Associate Cloud Engineer', 'HashiCorp Certified: Terraform Associate']
      }
    ],
    skills: [
      { name: 'Data Structures & Algorithms', category: 'Core', description: 'Arrays, Trees, Graphs, Dynamic Programming for algorithmic efficiency.' },
      { name: 'System Design', category: 'Architecture', description: 'Scalability, microservices, load balancing, caching, and database sharding.' },
      { name: 'Web/App Development', category: 'Engineering', description: 'Full-stack engineering with modern React, TypeScript, Node.js, and REST APIs.' },
      { name: 'Databases & SQL', category: 'Storage', description: 'Relational data modeling, ACID transactions, index optimization, and NoSQL.' },
      { name: 'Cloud Basics & DevOps', category: 'Infrastructure', description: 'Docker containerization, CI/CD pipelines, and AWS/GCP cloud environments.' }
    ]
  },

  'placement-core': {
    id: 'placement-core',
    title: 'Placement (Core)',
    description: 'Apply fundamental engineering principles to design, simulate, and build physical systems, electronic hardware, robotics, and industrial machinery.',
    color: 'orange',
    salaryBenchmark: '₹6 LPA – ₹16 LPA ($70k – $120k)',
    roles: [
      {
        title: 'Mechanical Engineer',
        tagline: 'Design kinematic mechanisms, perform finite element simulations, and oversee manufacturing processes.',
        compensation: '₹6 LPA – ₹14 LPA ($68k – $110k)',
        demand: '88% (Steady Industrial Demand)',
        experienceLevel: 'Entry to Mid (0–3 Years)',
        overview: 'Mechanical Engineers develop physical components and assemblies from concept to mass production. They perform 3D CAD modeling, stress/thermal simulations (FEA/CFD), and collaborate with machining vendors.',
        keySkills: ['SolidWorks / CATIA', 'ANSYS FEA & CFD', 'GD&T (Geometric Dimensioning)', 'Thermodynamics & Heat Transfer', 'Material Selection'],
        responsibilities: [
          'Model precision mechanical assemblies and produce manufacturing-ready 2D engineering drawings.',
          'Execute FEA structural simulations to verify factor of safety and fatigue limits under dynamic loading.',
          'Coordinate Design for Manufacturability (DFM) reviews with CNC machining and injection molding shops.',
          'Conduct physical prototype testing and analyze failure modes.'
        ],
        interviewQuestions: [
          {
            q: 'Explain the significance of the Mohr circle for 2D plane stress and principal stresses.',
            tip: 'Illustrate how maximum shear stress and principal normal stresses are graphically determined from orthogonal stress components.'
          },
          {
            q: 'What is GD&T and why is True Position tolerance preferred over coordinate tolerancing?',
            tip: 'Explain that True Position provides a cylindrical tolerance zone, yielding 57% more permissible manufacturing area.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Graduate Engineer Trainee (GET)', timeframe: '0–1 Year' },
          { stage: 'Stage 2', title: 'Design Engineer (Mechanical)', timeframe: '1–4 Years' },
          { stage: 'Stage 3', title: 'Senior Mechanical Architect', timeframe: '4–7 Years' },
          { stage: 'Stage 4', title: 'Chief Mechanical Engineer', timeframe: '7+ Years' }
        ],
        topHiring: ['Larsen & Toubro', 'Tata Motors', 'General Electric', 'Boeing', 'Caterpillar', 'Bosch'],
        certifications: ['CSWA / CSWP: Certified SolidWorks Professional', 'Six Sigma Green Belt', 'ASME Mechanical Design Certificate']
      },
      {
        title: 'Electrical Engineer',
        tagline: 'Design power distribution networks, motor controllers, and printed circuit board (PCB) hardware.',
        compensation: '₹6.5 LPA – ₹15 LPA ($72k – $115k)',
        demand: '90% (Growing EV & Grid Demand)',
        experienceLevel: 'Entry to Mid (0–3 Years)',
        overview: 'Electrical Engineers design power electronics, embedded circuits, and electrical distribution panels. They simulate circuits with SPICE, route multi-layer PCBs, and program industrial motor drives.',
        keySkills: ['MATLAB / Simulink', 'Altium Designer / KiCad', 'Power Electronics & Motor Drives', 'Circuit Simulation (SPICE)', 'Microcontrollers (STM32/ESP32)'],
        responsibilities: [
          'Design DC-DC converters, inverters, and battery management systems (BMS) for clean mobility.',
          'Capture schematics and route high-speed analog/digital multi-layer PCBs meeting EMI/EMC compliance.',
          'Program embedded firmware for motor control and industrial sensors.',
          'Perform electrical load calculations, fault analysis, and protection relay coordination.'
        ],
        interviewQuestions: [
          {
            q: 'Design a buck converter: calculate duty cycle and inductor ripple current for 24V in and 5V out.',
            tip: 'Duty cycle D = Vout / Vin = 5/24 = 20.8%. Discuss switching frequency, continuous conduction mode (CCM), and inductor sizing.'
          },
          {
            q: 'Explain power factor in AC systems and methods used to correct lagging power factors.',
            tip: 'Active power vs apparent power (cos phi). Correct lagging inductive loads using capacitor banks or synchronous condensers.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Junior Electrical Engineer', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Hardware Design Engineer', timeframe: '2–5 Years' },
          { stage: 'Stage 3', title: 'Lead Power Electronics Engineer', timeframe: '5–8 Years' },
          { stage: 'Stage 4', title: 'Director of Electrical Engineering', timeframe: '8+ Years' }
        ],
        topHiring: ['Schneider Electric', 'ABB', 'Siemens', 'Texas Instruments', 'Tesla', 'BHEL'],
        certifications: ['Certified Power Systems Specialist', 'Altium PCB Designer Certification', 'IPC-A-610 Specialist']
      },
      {
        title: 'Civil Engineer',
        tagline: 'Plan, design, and supervise critical infrastructure: bridges, high-rises, transit, and water networks.',
        compensation: '₹5 LPA – ₹13 LPA ($65k – $105k)',
        demand: '86% (Consistent Infrastructure Demand)',
        experienceLevel: 'Entry to Mid (0–3 Years)',
        overview: 'Civil Engineers plan, design, and oversee public infrastructure projects. They analyze soil mechanics, compute structural loads in concrete and steel, and manage construction timelines and quality audits.',
        keySkills: ['STAAD.Pro / ETABS', 'AutoCAD Civil 3D', 'Structural Concrete & Steel Design', 'Soil Mechanics & Foundation', 'Primavera P6 / Project Scheduling'],
        responsibilities: [
          'Model structural frames under seismic, wind, and dead/live loads per national building codes.',
          'Supervise on-site concrete batching, reinforcement bar placement, and non-destructive testing.',
          'Review contractor procurement bids and maintain critical-path construction schedules.',
          'Conduct geotechnical soil investigations to determine safe bearing capacity for pile foundations.'
        ],
        interviewQuestions: [
          {
            q: 'Differentiate between Limit State Design and Working Stress Method.',
            tip: 'Limit State incorporates partial safety factors for loads and materials, evaluating both collapse and serviceability limits.'
          },
          {
            q: 'Explain the Slump Test for fresh concrete and what shear/collapse slumps signify.',
            tip: 'Measures workability. True slump indicates uniform consistency, while shear or collapse indicates harshness or excess water.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Graduate Site Engineer', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Structural Design Engineer', timeframe: '2–5 Years' },
          { stage: 'Stage 3', title: 'Senior Project Manager', timeframe: '5–8 Years' },
          { stage: 'Stage 4', title: 'Chief Infrastructure Consultant', timeframe: '8+ Years' }
        ],
        topHiring: ['L&T Construction', 'Jacobs Engineering', 'AECOM', 'Shapoorji Pallonji', 'Afcons Infrastructure'],
        certifications: ['Project Management Professional (PMP)', 'ACI Concrete Field Testing Technician', 'LEED Green Associate']
      },
      {
        title: 'Manufacturing Engineer',
        tagline: 'Optimize industrial assembly lines, eliminate production waste, and ensure Six Sigma quality.',
        compensation: '₹5.5 LPA – ₹13.5 LPA ($65k – $105k)',
        demand: '87% (High Manufacturing Growth)',
        experienceLevel: 'Entry to Mid (0–3 Years)',
        overview: 'Manufacturing Engineers bridge the gap between design prototypes and high-volume factory assembly. They design manufacturing fixtures, balance assembly lines, eliminate bottlenecks, and implement Lean Six Sigma methodologies.',
        keySkills: ['Lean Manufacturing & Kaizen', 'Six Sigma (DMAIC)', 'CNC Programming (G-code)', 'DFMA Principles', 'Statistical Process Control (SPC)'],
        responsibilities: [
          'Perform line balancing and time-motion studies to minimize cycle times and operator fatigue.',
          'Design ergonomic jigs and fixtures to error-proof (Poka-Yoke) manual assembly steps.',
          'Track Overall Equipment Effectiveness (OEE) metrics and root-cause machine downtime.',
          'Audit suppliers for ISO 9001 quality compliance and dimensional tolerances.'
        ],
        interviewQuestions: [
          {
            q: 'Define Overall Equipment Effectiveness (OEE) and explain its three core pillars.',
            tip: 'OEE = Availability * Performance * Quality. Detail how machine downtime, micro-stops, and scrap parts reduce overall percentage.'
          },
          {
            q: 'How does Poka-Yoke differ from standard statistical quality inspection?',
            tip: 'Poka-Yoke is proactive defect prevention via physical or sensor design mechanisms rather than reactive defect detection.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Operations Trainee', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Process / Manufacturing Engineer', timeframe: '2–4 Years' },
          { stage: 'Stage 3', title: 'Plant Operations Manager', timeframe: '4–7 Years' },
          { stage: 'Stage 4', title: 'VP of Global Manufacturing', timeframe: '7+ Years' }
        ],
        topHiring: ['Foxconn', 'Maruti Suzuki', 'Mahindra & Mahindra', 'Bosch', 'Samsung Electronics', 'Honeywell'],
        certifications: ['Six Sigma Green Belt (ASQ / IASSC)', 'Certified Manufacturing Engineer (CMfgE)', 'ISO 9001 Lead Auditor']
      },
      {
        title: 'Automation Specialist',
        tagline: 'Integrate robotics, programmable logic controllers (PLCs), and industrial SCADA networks.',
        compensation: '₹7 LPA – ₹16 LPA ($75k – $120k)',
        demand: '93% (Industry 4.0 Boom)',
        experienceLevel: 'Entry to Mid (0–3 Years)',
        overview: 'Automation Specialists program robots and controllers to automate assembly, packaging, and sorting lines. They write ladder logic, interface sensors via industrial fieldbuses (Profinet/Modbus), and create SCADA interfaces.',
        keySkills: ['PLC Programming (Siemens/Rockwell)', 'SCADA & HMI Design', 'Industrial Robotics (KUKA/ABB)', 'Industrial IoT & OPC-UA', 'Safety Circuitry (ISO 13849)'],
        responsibilities: [
          'Develop ladder logic and structured text routines for Siemens S7-1500 and Allen-Bradley PLCs.',
          'Program 6-axis robotic arms for automated pick-and-place, welding, and palletizing.',
          'Design operator touchscreens (HMI) displaying live alarm telemetry and trend diagnostics.',
          'Integrate vision inspection cameras with automated reject sorting mechanisms.'
        ],
        interviewQuestions: [
          {
            q: 'Explain the difference between Sinking (NPN) and Sourcing (PNP) digital sensor inputs on a PLC.',
            tip: 'PNP (sourcing) supplies 24V current to the PLC input; NPN (sinking) switches the signal line to 0V ground.'
          },
          {
            q: 'What is a safety interlock category and how is dual-channel safety wired?',
            tip: 'Covers Category 3/4 under ISO 13849: redundant contacts, pulsed testing to detect short circuits, and safety relays.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Controls / Automation Trainee', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Automation Systems Engineer', timeframe: '2–4 Years' },
          { stage: 'Stage 3', title: 'Senior Industrial Robotics Specialist', timeframe: '4–7 Years' },
          { stage: 'Stage 4', title: 'Chief Automation Architect', timeframe: '7+ Years' }
        ],
        topHiring: ['Rockwell Automation', 'ABB Robotics', 'Fanuc', 'Siemens Digital Industries', 'Emerson', 'Yokogawa'],
        certifications: ['Certified Automation Professional (CAP)', 'Siemens TIA Portal Certified Specialist', 'Rockwell Automation Logix5000 Certificate']
      }
    ],
    skills: [
      { name: 'CAD/CAM Modeling', category: 'Design', description: '3D geometric modeling, parametric design, and drafting standards.' },
      { name: 'Thermodynamics & Fluids', category: 'Physics', description: 'Energy conservation, heat transfer cycles, and fluid flow dynamics.' },
      { name: 'Circuit & Hardware Design', category: 'Electronics', description: 'Analog/digital schematics, PCB trace routing, and power management.' },
      { name: 'Structural & FEA Analysis', category: 'Simulation', description: 'Stress, strain, thermal, and dynamic vibration simulation.' },
      { name: 'Project & Shop Floor Management', category: 'Management', description: 'Bill of materials, scheduling, vendor coordination, and quality audits.' }
    ]
  },

  'higher-studies': {
    id: 'higher-studies',
    title: 'Higher Studies',
    description: 'Pursue advanced post-graduate degrees (MS, M.Tech, MBA, PhD) to specialize in deep technical niches, advance scientific research, or pivot into executive management.',
    color: 'indigo',
    salaryBenchmark: 'Fellowships ($35k–$50k/yr) / Post-Grad ₹20–45 LPA',
    roles: [
      {
        title: 'Research Assistant',
        tagline: 'Collaborate with university professors on funded research grants and scientific publications.',
        compensation: '₹35k – ₹65k/mo stipend + Full Tuition Waiver ($30k – $45k/yr fellowship)',
        demand: '89% (Academic & R&D Excellence)',
        experienceLevel: 'Graduate Entry (0–2 Years)',
        overview: 'Research Assistants work in university laboratories under faculty advisors. They conduct empirical experiments, analyze scientific datasets, write LaTeX manuscripts, and submit peer-reviewed conference papers.',
        keySkills: ['LaTeX & Academic Publishing', 'MATLAB / Python (SciPy)', 'Statistical Hypothesis Testing', 'Literature Review Synthesis', 'Grant Writing'],
        responsibilities: [
          'Design scientific experiments and benchmark experimental data against state-of-the-art baselines.',
          'Author research papers for publication in prestigious IEEE, ACM, or Nature conferences.',
          'Present experimental findings at national and international academic symposiums.',
          'Assist in mentoring undergraduate laboratory students and grading coursework.'
        ],
        interviewQuestions: [
          {
            q: 'Walk through the methodology, hypotheses, and experimental controls of your undergraduate capstone project.',
            tip: 'Clearly articulate problem statement, novelty of your approach, baseline comparisons, and error margins.'
          },
          {
            q: 'How do you handle conflicting results when experimental data contradicts existing literature?',
            tip: 'Discuss verifying measurement equipment calibration, identifying latent variables, and objectively documenting novel findings.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Graduate Research Assistant (GRA)', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Postdoctoral Research Fellow', timeframe: '2–4 Years' },
          { stage: 'Stage 3', title: 'Assistant Professor / Senior Scientist', timeframe: '4–8 Years' },
          { stage: 'Stage 4', title: 'Tenured Professor / Research Director', timeframe: '8+ Years' }
        ],
        topHiring: ['IISc Bangalore', 'IIT Bombay/Delhi/Madras', 'Stanford University', 'MIT CSAIL', 'Max Planck Institute', 'CMU'],
        certifications: ['Coursera Writing in the Sciences (Stanford)', 'GRE / GATE Top Percentile Credentials']
      },
      {
        title: 'Graduate Student (MS / M.Tech)',
        tagline: 'Deepen domain mastery in specialized engineering fields like Robotics, AI, Microelectronics, or Quantum Computing.',
        compensation: 'Jump to ₹18 LPA – ₹40 LPA ($110k – $160k) post-graduation',
        demand: '94% (Specialist Premium)',
        experienceLevel: 'Postgraduate (1–2 Years Program)',
        overview: 'Master of Science (MS) and M.Tech students pursue rigorous advanced coursework combined with a thesis or capstone. They gain deep mathematical and theoretical mastery to qualify for elite R&D engineering roles.',
        keySkills: ['Advanced Theoretical Mathematics', 'Domain-Specific Specialization', 'Technical Problem Solving', 'Scientific Computing', 'Academic Networking'],
        responsibilities: [
          'Complete graduate-level coursework in algorithms, computer architecture, and distributed systems.',
          'Develop an innovative master thesis project solving a novel engineering bottleneck.',
          'Engage with industry sponsors on real-world industrial capstone deliverables.',
          'Publish peer-reviewed findings in international research conferences.'
        ],
        interviewQuestions: [
          {
            q: 'Why did you choose this specific university program and how does our faculty research align with your career roadmap?',
            tip: 'Reference 2 specific professors, their recent lab publications, and how your undergraduate background prepares you to contribute.'
          },
          {
            q: 'Explain an advanced theoretical concept from your target specialization in simple terms.',
            tip: 'Focus on intuition, practical constraints, and mathematical formulation without unnecessary jargon.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Master Student Candidate', timeframe: '1–2 Years' },
          { stage: 'Stage 2', title: 'Core R&D Specialist Engineer', timeframe: '2–5 Years' },
          { stage: 'Stage 3', title: 'Principal Domain Scientist', timeframe: '5–8 Years' },
          { stage: 'Stage 4', title: 'Chief Technology Fellow', timeframe: '8+ Years' }
        ],
        topHiring: ['CMU', 'Stanford University', 'Georgia Tech', 'TU Munich', 'IIT Bombay', 'ETH Zurich'],
        certifications: ['GATE High Percentile Rank (99+)', 'GRE 325+ (Quant 167+)', 'TOEFL 105+ / IELTS 7.5+']
      },
      {
        title: 'Management Trainee (MBA / MEM)',
        tagline: 'Pivot from technical engineering to product management, management consulting, and executive leadership.',
        compensation: '₹18 LPA – ₹35 LPA ($115k – $160k)',
        demand: '91% (High Business Demand)',
        experienceLevel: 'Postgraduate / Early Career',
        overview: 'Management candidates bridge technological capabilities with business economics. They master financial modeling, marketing frameworks, supply chain optimization, and strategy case studies to lead business units.',
        keySkills: ['Financial Modeling & DCF', 'Case Interview Problem Solving', 'Product Strategy & Market Sizing', 'Executive Presentation', 'Data-Driven Decision Making'],
        responsibilities: [
          'Deconstruct complex business problems into structured MECE (Mutually Exclusive, Collectively Exhaustive) case frameworks.',
          'Build discounted cash flow (DCF) valuation models and strategic budget forecasts.',
          'Evaluate product-market fit and define go-to-market (GTM) launch roadmaps.',
          'Coordinate cross-functional teams spanning engineering, legal, sales, and design.'
        ],
        interviewQuestions: [
          {
            q: 'Estimate the annual market size for electric two-wheeler battery swapping stations in India.',
            tip: 'State assumptions clearly: population -> vehicle penetration -> daily commute distance -> swap frequency -> unit pricing.'
          },
          {
            q: 'A SaaS product is experiencing a 15% drop in month-3 customer retention. How do you diagnose and fix it?',
            tip: 'Break down into acquisition cohorts, onboarding activation friction, feature adoption telemetry, and customer feedback loops.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Management Trainee / Associate', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Senior Product / Strategy Manager', timeframe: '2–5 Years' },
          { stage: 'Stage 3', title: 'Director of Business Operations', timeframe: '5–8 Years' },
          { stage: 'Stage 4', title: 'Chief Executive Officer (CEO) / Managing Director', timeframe: '8+ Years' }
        ],
        topHiring: ['IIM Ahmedabad/Bangalore/Calcutta', 'ISB Hyderabad', 'Harvard Business School', 'INSEAD', 'McKinsey', 'Bain'],
        certifications: ['CAT 99+ Percentile', 'GMAT 720+', 'Reforge Product Strategy Certificate']
      },
      {
        title: 'PhD Candidate',
        tagline: 'Pioneer groundbreaking scientific breakthroughs, author doctoral dissertations, and advance human knowledge.',
        compensation: '₹45k – ₹80k/mo stipend + Full Grant Fellowship ($35k – $55k/yr)',
        demand: '85% (Elite Research Vanguard)',
        experienceLevel: 'Doctoral Track (3–5 Years)',
        overview: 'PhD candidates produce original, peer-reviewed scientific contributions. They identify open scientific questions, formulate novel theoretical frameworks, design repeatable experiments, and defend doctoral dissertations before academic boards.',
        keySkills: ['Original Hypothesis Formulation', 'Deep Domain Theory', 'Peer-Review Scholarly Writing', 'Conference Presentation', 'Mentorship & Teaching'],
        responsibilities: [
          'Formulate and prove mathematical theorems or novel engineering prototypes addressing unsolved problems.',
          'Write and submit first-author manuscripts to premier tier-1 conferences and journals.',
          'Serve as reviewer on peer-review program committees for international conferences.',
          'Collaborate on multi-million dollar defense, government, or corporate research grants.'
        ],
        interviewQuestions: [
          {
            q: 'What is the primary open research bottleneck in your domain, and what novel theoretical angle do you propose to explore?',
            tip: 'Demonstrate intimate familiarity with papers from the last 18 months, highlighting specific algorithmic or empirical limitations.'
          },
          {
            q: 'Describe a research experiment that produced negative results and how you adapted your working model.',
            tip: 'Show scientific rigor: avoid cherry-picking, analyze systematic error sources, and demonstrate resilience.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Doctoral Researcher', timeframe: '1–4 Years' },
          { stage: 'Stage 2', title: 'Postdoctoral Fellow', timeframe: '4–6 Years' },
          { stage: 'Stage 3', title: 'Tenure-Track Assistant Professor / Principal Scientist', timeframe: '6–10 Years' },
          { stage: 'Stage 4', title: 'Distinguished Scientist / Department Chair', timeframe: '10+ Years' }
        ],
        topHiring: ['Google Research', 'Microsoft Research (MSR)', 'Bell Labs', 'Max Planck Institute', 'IBM Research', 'MIT'],
        certifications: ['First-author peer-reviewed publications', 'National Science Foundation (NSF) / PMRF Fellowship']
      }
    ],
    skills: [
      { name: 'Research Methodology', category: 'Academic', description: 'Scientific hypothesis testing, experimental design, and reproducibility.' },
      { name: 'Academic & Technical Writing', category: 'Publishing', description: 'LaTeX formatting, literature synthesis, and peer-reviewed manuscript authoring.' },
      { name: 'Advanced Mathematics', category: 'Theory', description: 'Linear algebra, multivariate calculus, probability theory, and discrete math.' },
      { name: 'Domain Specialization', category: 'Core', description: 'Deep mastery in specialized sub-disciplines like AI, VLSI, or Mechanics.' },
      { name: 'Standardized Exam Protocols', category: 'Testing', description: 'Analytical writing, verbal reasoning, and quantitative problem solving (GATE/GRE).' }
    ]
  },

  'government-exams': {
    id: 'government-exams',
    title: 'Government Exams',
    description: 'Secure prestigious, highly stable leadership positions in the public sector, civil bureaucracy, engineering services, and state enterprises.',
    color: 'teal',
    salaryBenchmark: 'Level 10 Pay Matrix (₹56,100 basic + DA + HRA + Perks)',
    roles: [
      {
        title: 'IAS/IPS Officer',
        tagline: 'Lead district administration, formulate public policy, and enforce national law and development programs.',
        compensation: '7th Pay Commission Level 10 (₹56,100 basic + allowances, government residence & security)',
        demand: '99% (Apex Administrative Prestige)',
        experienceLevel: 'Gazetted Group A (Competitive Selection)',
        overview: 'Indian Administrative Service (IAS) and Indian Police Service (IPS) officers manage districts and governmental departments. They oversee welfare programs, execute emergency response protocols, enforce law and order, and draft state policies.',
        keySkills: ['Constitutional Law & Indian Polity', 'Ethics & Administrative Integrity', 'Crisis Management', 'Public Policy Analysis', 'Clear Written Articulation'],
        responsibilities: [
          'Administer district developmental schemes, rural welfare budgets, and land revenue systems.',
          'Maintain law, order, and public harmony during emergencies, natural disasters, and civil disputes.',
          'Coordinate multi-departmental government initiatives spanning health, education, and infrastructure.',
          'Hear and address citizen grievances through open public administrative forums.'
        ],
        interviewQuestions: [
          {
            q: 'As a District Magistrate, how would you resolve a contentious land acquisition standoff between local farmers and an industrial mega-corridor?',
            tip: 'Balance economic growth with farmer rehabilitation: transparent stakeholder consultations, fair market compensation, and CSR skill programs.'
          },
          {
            q: 'How does your background in engineering provide a distinct advantage in public governance?',
            tip: 'Highlight analytical problem solving, data-driven policymaking, project execution discipline, and digital e-governance implementation.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Sub-Divisional Magistrate (SDM)', timeframe: '0–3 Years' },
          { stage: 'Stage 2', title: 'District Magistrate / Collector (DM)', timeframe: '4–8 Years' },
          { stage: 'Stage 3', title: 'Joint Secretary / Secretary to Government', timeframe: '9–18 Years' },
          { stage: 'Stage 4', title: 'Cabinet Secretary / Chief Secretary', timeframe: '18+ Years' }
        ],
        topHiring: ['Government of India', 'State Administrative Cadres', 'Ministry of Home Affairs', 'NITI Aayog'],
        certifications: ['UPSC Civil Services Examination (CSE) Rank', 'LBSNAA Foundation Course Completion']
      },
      {
        title: 'IES Officer',
        tagline: 'Manage nationwide public infrastructure: Indian Railways, Central Engineering Services, and Defence Works.',
        compensation: 'Group A Gazetted Officer (Level 10 Pay Matrix + Official Quarters & Transport)',
        demand: '95% (Apex Engineering Leadership)',
        experienceLevel: 'Engineering Services Examination (UPSC)',
        overview: 'Indian Engineering Services (IES) officers lead the technical arm of the Indian Government. They oversee railway electrification, central public works (CPWD), telecommunications, and defense ordnance factories.',
        keySkills: ['Advanced Technical Engineering', 'Public Procurement & Tendering', 'Material Specifications & Safety', 'Project Contract Management', 'Public Sector Ethics'],
        responsibilities: [
          'Direct multi-billion rupee infrastructure tenders, vendor vetting, and contract approvals.',
          'Supervise technical maintenance and modernization of national railway signaling and power grids.',
          'Enforce strict structural safety standards and environmental clearance compliance.',
          'Manage hundreds of junior engineers and technical technicians across regional divisions.'
        ],
        interviewQuestions: [
          {
            q: 'Explain the safety failure modes of prestressed concrete sleepers under high-axle freight loads and your inspection protocol.',
            tip: 'Discuss fatigue cracks, dynamic ballast impact, non-destructive ultrasonic testing, and scheduled track replacement cycles.'
          },
          {
            q: 'What are the essential criteria for evaluating a public EPC (Engineering, Procurement, Construction) tender bid?',
            tip: 'Two-packet bidding system: technical eligibility (turnover, similar executed works) followed by lowest financial bid (L1).'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Assistant Executive Engineer (AEE)', timeframe: '0–3 Years' },
          { stage: 'Stage 2', title: 'Executive Engineer (EE)', timeframe: '3–8 Years' },
          { stage: 'Stage 3', title: 'Superintending Engineer (SE)', timeframe: '8–14 Years' },
          { stage: 'Stage 4', title: 'Chief Engineer / Member Railway Board', timeframe: '14+ Years' }
        ],
        topHiring: ['Indian Railways', 'Central Public Works Dept (CPWD)', 'Military Engineer Services (MES)', 'Central Water Commission'],
        certifications: ['UPSC Engineering Services Examination (ESE) Rank', 'National Academy of Indian Railways (NAIR) Training']
      },
      {
        title: 'PSU Engineer',
        tagline: 'Operate national heavy industries: oil refineries, power grids, aerospace, and defense research.',
        compensation: '₹12 LPA – ₹20 LPA CTC (Class-1 Executive Grade) + Medical + Subsidized Quarters',
        demand: '93% (High GATE Trajectory)',
        experienceLevel: 'Executive Trainee (via GATE)',
        overview: 'Public Sector Undertaking (PSU) Engineers execute mega-scale industrial operations across oil & gas, electricity generation, aerospace, and electronics. They maintain thermal plants, offshore drilling rigs, and satellite launch payloads.',
        keySkills: ['GATE Core Engineering Mastery', 'Industrial Plant Operations', 'HAZOP & Industrial Safety', 'SCADA & Instrumentation', 'Instrumentation Calibration'],
        responsibilities: [
          'Monitor real-time industrial processes, turbine temperatures, and refinery distillation units.',
          'Conduct Hazard and Operability (HAZOP) risk audits to prevent industrial plant disasters.',
          'Supervise plant shutdown maintenance cycles and emergency overhaul procedures.',
          'Implement green energy transitions including solar microgrids and green hydrogen initiatives.'
        ],
        interviewQuestions: [
          {
            q: 'Explain the working of safety relief valves (SRV) in high-pressure steam boilers and their set-pressure criteria.',
            tip: 'Discuss ASME Boiler and Pressure Vessel Code (Section I), overpressure margin, and blowdown percentage.'
          },
          {
            q: 'How does combined cycle power generation increase thermodynamic efficiency over conventional Rankine cycles?',
            tip: 'Gas turbine exhaust heat (Brayton cycle) generates steam for a secondary steam turbine (Rankine cycle), boosting efficiency to 60%+.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Executive Trainee (E-1)', timeframe: '0–1 Year' },
          { stage: 'Stage 2', title: 'Assistant Manager / Plant Engineer (E-2)', timeframe: '1–4 Years' },
          { stage: 'Stage 3', title: 'Chief Manager / Plant Head (E-5)', timeframe: '4–10 Years' },
          { stage: 'Stage 4', title: 'General Manager / Director of Operations', timeframe: '10+ Years' }
        ],
        topHiring: ['ONGC', 'IOCL', 'NTPC', 'BHEL', 'ISRO', 'DRDO', 'PowerGrid'],
        certifications: ['GATE Top 200 All India Rank', 'Certified Plant Maintenance Manager (CPMM)']
      },
      {
        title: 'State Service Officer',
        tagline: 'Oversee regional municipal corporations, public works, and state irrigation networks.',
        compensation: 'State Gazetted Class-1 / Class-2 (₹50k – ₹95k/mo + State Allowances)',
        demand: '90% (Steady State Stability)',
        experienceLevel: 'State Public Service Commission',
        overview: 'State Public Service Commission (State PSC) officers manage regional public infrastructure, municipal municipal water supplies, and rural irrigation channels, ensuring civic works meet state standards.',
        keySkills: ['State Public Works Department (PWD) Codes', 'Regional Water Resources Engineering', 'Building Bye-laws', 'Local Language Fluency', 'Vendor Billing Verification'],
        responsibilities: [
          'Review and approve municipal building plans and urban drainage layouts.',
          'Audit contractor road paving asphalt samples and verify compaction density test reports.',
          'Coordinate seasonal irrigation canal water discharge for regional agricultural command areas.',
          'Liaise with local elected panchayat and legislative representatives on community works.'
        ],
        interviewQuestions: [
          {
            q: 'How do you ensure contractor quality compliance on a rural road paving project without causing work halts?',
            tip: 'Tie milestone stage billing to independent laboratory third-party test reports; enforce contractual penalty clauses.'
          },
          {
            q: 'Discuss the key ground water depletion challenges in this state and immediate civil interventions.',
            tip: 'Cover rainwater harvesting mandates, check dams, artificial recharge borewells, and micro-irrigation subsidies.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Assistant Engineer (AE)', timeframe: '0–3 Years' },
          { stage: 'Stage 2', title: 'Assistant Executive Engineer (AEE)', timeframe: '3–7 Years' },
          { stage: 'Stage 3', title: 'Executive Engineer (EE)', timeframe: '7–12 Years' },
          { stage: 'Stage 4', title: 'Superintending Engineer / Chief Engineer', timeframe: '12+ Years' }
        ],
        topHiring: ['State Public Works Dept (PWD)', 'State Water Resources Board', 'Municipal Corporations', 'State Electricity Boards'],
        certifications: ['State PSC Engineering Exam Rank', 'State Technical Accreditation']
      }
    ],
    skills: [
      { name: 'General Aptitude & Reasoning', category: 'Screening', description: 'Quantitative mathematics, logical deductions, and data interpretation.' },
      { name: 'Technical Core Syllabus', category: 'Domain', description: 'Comprehensive mastery of engineering textbook theories and calculations.' },
      { name: 'Polity & Administrative Ethics', category: 'Governance', description: 'Constitutional frameworks, public administration, and ethical integrity.' },
      { name: 'Current Affairs & Geopolitics', category: 'Awareness', description: 'National economic policies, international treaties, and socio-economic updates.' },
      { name: 'Time & Exam Strategy', category: 'Strategy', description: 'Negative marking control, high-speed problem solving, and answer writing.' }
    ]
  },

  'entrepreneurship': {
    id: 'entrepreneurship',
    title: 'Entrepreneurship',
    description: 'Build your own venture from scratch, validate customer pain points, assemble visionary founding teams, raise capital, and create high-impact value.',
    color: 'amber',
    salaryBenchmark: 'Founder Equity (30%–80%) + Scalable Seed Capital',
    roles: [
      {
        title: 'Founder / CEO',
        tagline: 'Set company vision, secure venture financing, recruit founding talent, and steer product-market fit.',
        compensation: 'High Equity Stake (30%–80%) + Seed Stage Founder Stipend',
        demand: 'High Risk / Uncapped Return',
        experienceLevel: 'Founder Instinct (Day 0 to Infinite)',
        overview: 'Founders create companies to solve urgent market problems. They conduct customer discovery interviews, pitch venture capital partners, recruit exceptional engineers, and make high-stakes strategic bets with extreme resource efficiency.',
        keySkills: ['Customer Discovery & Validation', 'Venture Pitching & Fundraising', 'Unit Economics (CAC/LTV)', 'Recruiting & Culture Building', 'Resilience & Grit'],
        responsibilities: [
          'Interview 50+ potential customers to uncover deep pain points before writing code.',
          'Craft compelling investor pitch decks and negotiate term sheets with angel investors and VCs.',
          'Recruit and inspire world-class founding engineers and product designers.',
          'Drive daily sprint prioritization to achieve undeniable product-market fit.'
        ],
        interviewQuestions: [
          {
            q: 'Why are you uniquely positioned to solve this problem, and why will well-funded incumbents not easily replicate your solution?',
            tip: 'Highlight your proprietary insight ("earned secret"), technological moat, distribution leverage, or high switching costs.'
          },
          {
            q: 'What is your customer acquisition cost (CAC) and estimated lifetime value (LTV), and how do you achieve payback within 6 months?',
            tip: 'Walk through organic viral loops, conversion funnels, churn rate assumptions, and gross profit margins.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Solo Ideator / Hacker', timeframe: 'Month 0–6' },
          { stage: 'Stage 2', title: 'Pre-Seed / Seed Founder', timeframe: 'Year 1–2' },
          { stage: 'Stage 3', title: 'Series A/B Growth CEO', timeframe: 'Year 3–6' },
          { stage: 'Stage 4', title: 'Public / Acquired Company CEO', timeframe: 'Year 6+' }
        ],
        topHiring: ['Y Combinator', 'Techstars', 'Sequoia Surge', 'Antler', 'Peak XV', 'AngelList'],
        certifications: ['Y Combinator Startup School', 'Stanford Venture Studio Programs']
      },
      {
        title: 'CTO (Chief Technology Officer)',
        tagline: 'Architect the initial codebase, choose the technology stack, scale cloud infra, and lead engineering.',
        compensation: '15% – 35% Founding Equity + Competitive Startup Stipend',
        demand: '97% (Technical Co-Founder Gold Standard)',
        experienceLevel: 'Founding Technical Partner',
        overview: 'Founding CTOs write the first lines of code and build the minimum viable product (MVP). As the startup grows, they design scalable microservices, manage databases, set security protocols, and build the engineering org.',
        keySkills: ['Rapid Full-Stack Prototyping', 'System Architecture & Scalability', 'Cloud Infrastructure & DevOps', 'Technical Debt Management', 'Developer Hiring'],
        responsibilities: [
          'Build and ship the end-to-end working MVP within 4 to 8 weeks.',
          'Choose the core database and cloud hosting providers to balance speed, cost, and scale.',
          'Establish automated CI/CD testing pipelines and security monitoring.',
          'Interview, test, and mentor the first 10 engineering hires.'
        ],
        interviewQuestions: [
          {
            q: 'How do you balance shipping fast to validate hypotheses versus accumulating technical debt that might break scale later?',
            tip: 'Advocate modular architecture, clear interface contracts, automated testing for core billing/auth, and scheduled refactoring sprints.'
          },
          {
            q: 'How would you architect a database system starting from 1,000 users that can seamlessly scale to 1,000,000 concurrent requests without rewrite?',
            tip: 'Discuss PostgreSQL with read replicas, caching layers with Redis, connection pooling (PgBouncer), and eventual horizontal sharding.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Founding Engineer / Co-Founder', timeframe: 'Year 0–1' },
          { stage: 'Stage 2', title: 'VP of Engineering', timeframe: 'Year 2–4' },
          { stage: 'Stage 3', title: 'Chief Technology Officer (Scale-up)', timeframe: 'Year 4–7' },
          { stage: 'Stage 4', title: 'Enterprise CTO / Board Technical Advisor', timeframe: 'Year 7+' }
        ],
        topHiring: ['GitHub for Startups', 'AWS Activate Startups', 'Google for Startups Cloud', 'Y Combinator Startups'],
        certifications: ['AWS Solutions Architect Professional', 'Kubernetes Administrator Certification']
      },
      {
        title: 'Product Lead',
        tagline: 'Translate customer friction into elegant user stories, wireframes, feature matrices, and rapid iterations.',
        compensation: '₹12 LPA – ₹28 LPA + 1%–5% Early Startup Equity',
        demand: '92% (High Growth Demand)',
        experienceLevel: 'Early to Mid (1–3 Years)',
        overview: 'Product Leads connect the business vision with software implementation. They conduct user feedback sessions, build interactive Figma wireframes, draft comprehensive PRDs, and guide sprint engineering backlogs.',
        keySkills: ['Product Discovery & Wireframing', 'User Analytics (Mixpanel/Amplitude)', 'Sprint Backlog Management', 'Figma Prototyping', 'A/B Experimentation'],
        responsibilities: [
          'Deconstruct user interview insights into prioritized product requirement documents (PRDs).',
          'Map complete user journey flows and identify activation drop-off points.',
          'Prioritize weekly sprint tasks using RICE (Reach, Impact, Confidence, Effort) scoring.',
          'Run continuous customer onboarding sessions to observe live usability hurdles.'
        ],
        interviewQuestions: [
          {
            q: 'You have engineering capacity for only 1 major feature: an AI smart assistant or an automated payment integration. How do you decide?',
            tip: 'Evaluate business impact (direct revenue monetization vs speculative retention) and user feedback telemetry using RICE framework.'
          },
          {
            q: 'Define the North Star Metric for a B2B productivity app and explain what leading indicators drive it.',
            tip: 'Distinguish vanity metrics (downloads) from engagement (Weekly Active Users creating >3 docs/week) and retention cohorts.'
          }
        ],
        careerLadder: [
          { stage: 'Stage 1', title: 'Associate Product Manager (APM)', timeframe: '0–2 Years' },
          { stage: 'Stage 2', title: 'Product Manager', timeframe: '2–4 Years' },
          { stage: 'Stage 3', title: 'Head of Product', timeframe: '4–7 Years' },
          { stage: 'Stage 4', title: 'Chief Product Officer (CPO)', timeframe: '7+ Years' }
        ],
        topHiring: ['Stripe', 'Notion', 'Linear', 'Razorpay', 'CRED', 'Early YC Portfolio Startups'],
        certifications: ['Reforge Product Strategy', 'Google UX Design Professional Certificate']
      }
    ],
    skills: [
      { name: 'Customer Discovery', category: 'Validation', description: 'Uncovering validated market pain points and willingness-to-pay.' },
      { name: 'Rapid MVP Prototyping', category: 'Build', description: 'Building functional test products with high velocity.' },
      { name: 'Fundraising & Pitching', category: 'Finance', description: 'Term sheet mechanics, dilution, cap tables, and investor presentations.' },
      { name: 'Leadership & Team Building', category: 'Culture', description: 'Recruiting, aligning incentives, and leading high-pressure teams.' },
      { name: 'Unit Economics & Finance', category: 'Metrics', description: 'Customer Acquisition Cost (CAC), Lifetime Value (LTV), and burn rate.' }
    ]
  }
};

const SECTOR_TABS = [
  { id: 'placement-software', name: 'Placement (Software)', icon: Code },
  { id: 'placement-core', name: 'Placement (Core)', icon: Building },
  { id: 'higher-studies', name: 'Higher Studies', icon: GraduationCap },
  { id: 'government-exams', name: 'Government Exams', icon: Compass },
  { id: 'entrepreneurship', name: 'Entrepreneurship', icon: Lightbulb },
];

export default function CareerTrack() {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser, generateRoadmap } = useApp();

  // Selected role for deep dive dossier modal
  const [selectedRole, setSelectedRole] = useState<RoleDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'interview' | 'ladder'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Normalize trackId to match our catalog
  const resolveSector = (id?: string): SectorData => {
    const clean = (id || '').toLowerCase().trim();
    if (clean.includes('software') || clean.includes('code')) return SECTOR_CATALOG['placement-software'];
    if (clean.includes('core') || clean.includes('hardware') || clean.includes('mech') || clean.includes('elect') || clean.includes('civil')) return SECTOR_CATALOG['placement-core'];
    if (clean.includes('higher') || clean.includes('grad') || clean.includes('master') || clean.includes('phd') || clean.includes('studies')) return SECTOR_CATALOG['higher-studies'];
    if (clean.includes('gov') || clean.includes('civil-service') || clean.includes('upsc') || clean.includes('exam')) return SECTOR_CATALOG['government-exams'];
    if (clean.includes('entrep') || clean.includes('startup') || clean.includes('business')) return SECTOR_CATALOG['entrepreneurship'];
    return SECTOR_CATALOG['placement-software'];
  };

  const data = resolveSector(trackId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartTrack = () => {
    generateRoadmap(data.title);
    showToast(`Roadmap initiated for ${data.title}`);
    navigate('/roadmap');
  };

  const handleAddSkill = (skillName: string) => {
    if (!user) {
      showToast('Please sign in or initialize profile first.');
      return;
    }
    const currentSkills = user.skills || [];
    if (currentSkills.includes(skillName)) {
      showToast(`'${skillName}' is already in your profile.`);
      return;
    }
    const updated = [...currentSkills, skillName];
    updateUser({ skills: updated });
    showToast(`Added '${skillName}' to your profile protocols!`);
  };

  const handleAddAllSectorSkills = () => {
    if (!user) {
      showToast('Please sign in or initialize profile first.');
      return;
    }
    const currentSkills = user.skills || [];
    const newSkills = data.skills.map(s => s.name).filter(s => !currentSkills.includes(s));
    if (newSkills.length === 0) {
      showToast('All sector protocols are already synced with your profile!');
      return;
    }
    updateUser({ skills: [...currentSkills, ...newSkills] });
    showToast(`Imported ${newSkills.length} sector protocols into your profile!`);
  };

  const handleAddRoleSkills = (role: RoleDetail) => {
    if (!user) {
      showToast('Please sign in or initialize profile first.');
      return;
    }
    const currentSkills = user.skills || [];
    const toAdd = role.keySkills.filter(s => !currentSkills.includes(s));
    if (toAdd.length === 0) {
      showToast(`All skills for ${role.title} are already in your profile.`);
      return;
    }
    updateUser({ skills: [...currentSkills, ...toAdd] });
    showToast(`Added ${toAdd.length} required skills for ${role.title} to your profile!`);
  };

  const handleLaunchInterview = (roleTitle: string) => {
    navigate('/interview', {
      state: {
        role: roleTitle,
        sector: data.title,
        focus: 'Technical'
      }
    });
  };

  const handleAskAdvisor = (roleTitle: string) => {
    navigate('/advisor', {
      state: {
        prompt: `I am interested in pursuing a career as a ${roleTitle} within the ${data.title} sector. Can you analyze my current profile and create a targeted, step-by-step strategy for me to achieve this goal?`
      }
    });
  };

  const handleSetTargetRole = (roleTitle: string) => {
    generateRoadmap(roleTitle);
    updateUser({ careerPath: roleTitle });
    showToast(`Set target designation to ${roleTitle}! Roadmap updated.`);
    navigate('/roadmap');
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-app-text text-white px-5 py-3 rounded-lg shadow-2xl border border-app-accent/40 font-mono text-xs flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <Sparkles className="w-4 h-4 text-app-accent shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:text-app-muted">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation and Sector Switcher */}
      <nav className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button 
          onClick={() => navigate('/discover')}
          className="flex items-center gap-2 text-app-muted hover:text-app-text transition-colors font-mono text-[10px] tracking-widest uppercase w-fit"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Discover Archives
        </button>

        {/* Sector Quick Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {SECTOR_TABS.map((tab) => {
            const isActive = tab.name === data.title;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(`/career/${tab.id}`)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono tracking-wider uppercase transition-all whitespace-nowrap border ${
                  isActive 
                    ? 'bg-app-accent text-white border-app-accent shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                    : 'bg-app-panel text-app-muted border-app-border hover:border-app-accent/40 hover:text-app-text'
                }`}
              >
                <TabIcon className="w-3 h-3" />
                {tab.name.replace('Placement ', '')}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Hero Section: child div:nth-of-type(1) of outer max-w-5xl container */}
      <div className="rounded-lg p-8 md:p-12 mb-8 bg-app-panel border border-app-border relative overflow-hidden shadow-inner">
        <div className="absolute top-0 right-0 w-64 h-64 bg-app-accent/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-app-accent/30 text-[9px] font-mono tracking-widest uppercase bg-app-accent/10 text-app-accent shadow-sm">
              <Briefcase className="w-3 h-3" /> Trajectory Sector
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-app-border text-[9px] font-mono tracking-widest uppercase bg-app-bg text-app-muted">
              <DollarSign className="w-3 h-3 text-app-accent" /> {data.salaryBenchmark}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-widest text-app-text mb-4">{data.title}</h1>
          <p className="text-sm font-mono text-app-muted leading-relaxed mb-8">{data.description}</p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={handleStartTrack}
              className="px-6 py-3 bg-app-accent text-white hover:bg-emerald-600 font-bold text-[10px] tracking-widest uppercase rounded shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2"
            >
              Generate Sector Roadmap <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAskAdvisor(data.title)}
              className="px-5 py-3 bg-app-bg border border-app-border text-app-muted hover:text-app-text hover:border-app-accent/40 font-bold text-[10px] tracking-widest uppercase rounded transition-all flex items-center gap-2"
            >
              <Bot className="w-3.5 h-3.5 text-app-accent" /> Consult AI Advisor
            </button>
          </div>
        </div>
      </div>

      {/* Grid container: child div:nth-of-type(2) of outer max-w-5xl container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Target Designations column: child div:nth-of-type(1) of grid */}
        <div className="bg-app-panel rounded-lg p-8 border border-app-border shadow-inner">
          {/* Header: child div:nth-of-type(1) of Target Designations panel */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-app-accent/10 border border-app-accent/30 flex items-center justify-center text-app-accent">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-app-text">Target Designations</h2>
                <span className="text-[10px] font-mono text-app-muted">Click any role to open active dossier & interview</span>
              </div>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-app-bg border border-app-border text-app-muted uppercase">
              {data.roles.length} Roles
            </span>
          </div>

          {/* Roles list: child div:nth-of-type(2) of Target Designations panel */}
          <div className="space-y-3">
            {data.roles.map((role) => (
              /* Role button card: child div:nth-of-type(N) of roles list */
              <div 
                key={role.title}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedRole(role);
                  setActiveTab('overview');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedRole(role);
                    setActiveTab('overview');
                  }
                }}
                className={`flex items-center justify-between p-4 rounded bg-app-bg border transition-all cursor-pointer group text-left ${
                  selectedRole?.title === role.title 
                    ? 'border-app-accent shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-app-accent/5' 
                    : 'border-app-border hover:border-app-accent/40 hover:shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                }`}
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-app-text group-hover:text-app-accent transition-colors uppercase tracking-widest">
                      {role.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-app-panel border border-app-border text-app-muted group-hover:border-app-accent/30 group-hover:text-app-accent transition-colors">
                      {role.compensation.split('(')[0].trim()}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-app-muted line-clamp-1">
                    {role.tagline}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-block text-[9px] font-mono uppercase tracking-wider text-app-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    Inspect
                  </span>
                  <div className="w-7 h-7 rounded border border-app-border bg-app-panel group-hover:border-app-accent/50 group-hover:bg-app-accent/10 flex items-center justify-center transition-all">
                    <ChevronRight className="w-4 h-4 text-app-muted group-hover:text-app-accent transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-app-border flex items-center justify-between text-[10px] font-mono text-app-muted">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-app-accent" /> Real-time telemetry backed
            </span>
            <span className="text-app-accent">Select role to practice</span>
          </div>
        </div>

        {/* Required Skills column: child div:nth-of-type(2) of grid */}
        <div className="bg-app-panel rounded-lg p-8 border border-app-border shadow-inner flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-app-accent/10 border border-app-accent/30 flex items-center justify-center text-app-accent">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-app-text">Required Protocols</h2>
                  <span className="text-[10px] font-mono text-app-muted">Click any protocol to add to your user profile</span>
                </div>
              </div>
              <button
                onClick={handleAddAllSectorSkills}
                className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded border border-app-border hover:border-app-accent/40 bg-app-bg text-app-muted hover:text-app-text transition-colors flex items-center gap-1"
                title="Add all sector protocols to your profile"
              >
                <Plus className="w-3 h-3 text-app-accent" /> Sync All
              </button>
            </div>

            <div className="space-y-3">
              {data.skills.map((skill) => {
                const isAcquired = user?.skills?.some(s => s.toLowerCase() === skill.name.toLowerCase());
                return (
                  <div 
                    key={skill.name} 
                    onClick={() => handleAddSkill(skill.name)}
                    className={`flex items-start justify-between p-3.5 rounded bg-app-bg border transition-all cursor-pointer group ${
                      isAcquired 
                        ? 'border-app-accent/40 bg-app-accent/5' 
                        : 'border-app-border hover:border-app-accent/40 hover:bg-app-bg'
                    }`}
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isAcquired ? 'text-app-accent' : 'text-app-muted group-hover:text-app-accent'}`} />
                        <span className="font-mono text-xs font-bold text-app-text uppercase tracking-wider">{skill.name}</span>
                        <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-app-panel border border-app-border text-app-muted">
                          {skill.category}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-app-muted pl-5">{skill.description}</p>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {isAcquired ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-app-accent/10 border border-app-accent/30 text-[9px] font-mono text-app-accent uppercase tracking-wider">
                          <Check className="w-2.5 h-2.5" /> In Profile
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-app-panel border border-app-border group-hover:border-app-accent/40 text-[9px] font-mono text-app-muted group-hover:text-app-text uppercase tracking-wider transition-colors">
                          <Plus className="w-2.5 h-2.5 text-app-accent" /> Add
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 p-4 rounded border border-app-border bg-app-bg/50">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-app-text font-bold mb-1">Protocol Synchronization</h4>
            <p className="text-[10px] font-mono text-app-muted leading-relaxed">
              Protocols added here automatically appear in your Profile and feed into the AI diagnostic radar matrix.
            </p>
          </div>
        </div>

      </div>

      {/* Interactive Role Dossier Modal */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-app-panel border border-app-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-app-border bg-app-bg flex items-start justify-between relative">
              <div className="flex-1 pr-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-app-accent/10 border border-app-accent/30 text-app-accent text-[9px] font-mono tracking-widest uppercase">
                    {data.title}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-app-panel border border-app-border text-app-muted text-[9px] font-mono tracking-widest uppercase">
                    {selectedRole.experienceLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[9px] font-mono tracking-widest uppercase">
                    {selectedRole.demand}
                  </span>
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-widest text-app-text mb-1">
                  {selectedRole.title}
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-app-accent">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Compensation Benchmark: {selectedRole.compensation}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedRole(null)}
                className="w-8 h-8 rounded-lg bg-app-panel border border-app-border flex items-center justify-center text-app-muted hover:text-app-text hover:border-app-accent transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tab Bar */}
            <div className="flex items-center border-b border-app-border bg-app-panel px-6 gap-6 text-xs font-mono uppercase tracking-wider overflow-x-auto scrollbar-none">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`py-3 border-b-2 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'overview' 
                    ? 'border-app-accent text-app-accent' 
                    : 'border-transparent text-app-muted hover:text-app-text'
                }`}
              >
                Overview & Duty
              </button>
              <button 
                onClick={() => setActiveTab('skills')}
                className={`py-3 border-b-2 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'skills' 
                    ? 'border-app-accent text-app-accent' 
                    : 'border-transparent text-app-muted hover:text-app-text'
                }`}
              >
                Protocols & Skills ({selectedRole.keySkills.length})
              </button>
              <button 
                onClick={() => setActiveTab('interview')}
                className={`py-3 border-b-2 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'interview' 
                    ? 'border-app-accent text-app-accent' 
                    : 'border-transparent text-app-muted hover:text-app-text'
                }`}
              >
                Screening Questions ({selectedRole.interviewQuestions.length})
              </button>
              <button 
                onClick={() => setActiveTab('ladder')}
                className={`py-3 border-b-2 font-bold transition-all whitespace-nowrap ${
                  activeTab === 'ladder' 
                    ? 'border-app-accent text-app-accent' 
                    : 'border-transparent text-app-muted hover:text-app-text'
                }`}
              >
                Career Ladder
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm font-mono leading-relaxed">
              
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-app-text font-bold mb-2 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5 text-app-accent" /> Role Summary
                    </h3>
                    <p className="text-xs text-app-muted leading-relaxed bg-app-bg p-4 rounded border border-app-border">
                      {selectedRole.overview}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-app-text font-bold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-app-accent" /> Core Daily Responsibilities
                    </h3>
                    <div className="space-y-2.5">
                      {selectedRole.responsibilities.map((resp, i) => (
                        <div key={i} className="flex items-start gap-3 bg-app-bg p-3 rounded border border-app-border text-xs text-app-muted">
                          <CheckCircle2 className="w-3.5 h-3.5 text-app-accent shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-app-bg p-4 rounded border border-app-border">
                      <h4 className="text-[10px] uppercase tracking-widest text-app-text font-bold mb-2 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-app-accent" /> Top Hiring Organizations
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedRole.topHiring.map((co) => (
                          <span key={co} className="px-2 py-0.5 bg-app-panel border border-app-border text-[9px] text-app-muted rounded">
                            {co}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-app-bg p-4 rounded border border-app-border">
                      <h4 className="text-[10px] uppercase tracking-widest text-app-text font-bold mb-2 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-app-accent" /> Valued Credentials
                      </h4>
                      <div className="space-y-1">
                        {selectedRole.certifications.map((cert) => (
                          <div key={cert} className="text-[9px] text-app-muted flex items-center gap-1.5 truncate">
                            <span className="w-1.5 h-1.5 rounded-full bg-app-accent shrink-0"></span>
                            <span className="truncate">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Skills */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-app-text font-bold">Key Technical & Operational Skills</h3>
                      <p className="text-[10px] text-app-muted">Prerequisites evaluated in recruitment screenings</p>
                    </div>
                    <button
                      onClick={() => handleAddRoleSkills(selectedRole)}
                      className="px-3 py-1.5 bg-app-accent/10 border border-app-accent/30 text-app-accent hover:bg-app-accent hover:text-white rounded text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3 h-3" /> Import All to Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedRole.keySkills.map((skill) => {
                      const isAcquired = user?.skills?.some(s => s.toLowerCase() === skill.toLowerCase());
                      return (
                        <div key={skill} className="flex items-center justify-between p-3.5 rounded bg-app-bg border border-app-border">
                          <span className="text-xs font-mono text-app-text uppercase tracking-wider">{skill}</span>
                          {isAcquired ? (
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-app-accent/10 border border-app-accent/30 text-app-accent flex items-center gap-1">
                              <Check className="w-2.5 h-2.5" /> Added
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAddSkill(skill)}
                              className="text-[9px] font-mono px-2 py-0.5 rounded bg-app-panel border border-app-border hover:border-app-accent text-app-muted hover:text-app-text flex items-center gap-1 transition-colors"
                            >
                              <Plus className="w-2.5 h-2.5 text-app-accent" /> Add
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded bg-app-bg border border-app-border">
                    <h4 className="text-[10px] font-bold text-app-text uppercase tracking-widest mb-1">Recommended Learning Sequence</h4>
                    <p className="text-[10px] text-app-muted leading-relaxed">
                      Begin by acquiring foundational protocols, build 2 domain portfolio artifacts demonstrating end-to-end execution, and take the AI mock interview to test retention.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Screening Questions */}
              {activeTab === 'interview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-app-text font-bold">Standard Screening Inquiries</h3>
                      <p className="text-[10px] text-app-muted">Realistic technical and analytical questions asked by hiring teams</p>
                    </div>
                    <button
                      onClick={() => handleLaunchInterview(selectedRole.title)}
                      className="px-3 py-1.5 bg-app-accent text-white hover:bg-emerald-600 rounded text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    >
                      <Brain className="w-3.5 h-3.5" /> Launch Mock Interview
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedRole.interviewQuestions.map((item, idx) => {
                      const isExpanded = expandedQuestion === idx;
                      return (
                        <div key={idx} className="bg-app-bg border border-app-border rounded p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded bg-app-panel border border-app-border flex items-center justify-center text-[10px] font-bold text-app-accent shrink-0 mt-0.5">
                                Q{idx + 1}
                              </span>
                              <span className="text-xs font-bold text-app-text leading-snug">{item.q}</span>
                            </div>
                            <button
                              onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                              className="text-[9px] text-app-muted hover:text-app-text px-2 py-0.5 rounded border border-app-border shrink-0 flex items-center gap-1"
                            >
                              <HelpCircle className="w-3 h-3 text-app-accent" />
                              {isExpanded ? 'Hide Hint' : 'View Tip'}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="pl-7 pt-2 border-t border-app-border/60 text-[11px] text-app-accent bg-app-accent/5 p-3 rounded">
                              <span className="font-bold uppercase tracking-wider block mb-1">Formulation Strategy:</span>
                              {item.tip}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Career Ladder */}
              {activeTab === 'ladder' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-app-text font-bold">Progression Trajectory</h3>
                    <p className="text-[10px] text-app-muted">Typical milestone trajectory from entry-level to leadership</p>
                  </div>

                  <div className="relative border-l-2 border-app-border ml-3 pl-6 space-y-6 my-4">
                    {selectedRole.careerLadder.map((step, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-app-accent bg-app-bg flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-app-accent"></div>
                        </div>
                        <div className="bg-app-bg p-3.5 rounded border border-app-border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] uppercase tracking-widest text-app-accent font-bold">{step.stage}</span>
                            <span className="text-[9px] font-mono text-app-muted px-2 py-0.5 bg-app-panel rounded border border-app-border">{step.timeframe}</span>
                          </div>
                          <h4 className="text-xs font-bold text-app-text uppercase tracking-wider">{step.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Action Footer */}
            <div className="p-4 bg-app-bg border-t border-app-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[10px] font-mono text-app-muted hidden sm:block">
                Target Role: <span className="text-app-text font-bold">{selectedRole.title}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleAskAdvisor(selectedRole.title)}
                  className="px-3.5 py-2.5 rounded bg-app-panel border border-app-border hover:border-app-accent/40 text-app-muted hover:text-app-text text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Bot className="w-3.5 h-3.5 text-app-accent" /> Ask AI Advisor
                </button>
                <button
                  onClick={() => handleLaunchInterview(selectedRole.title)}
                  className="px-4 py-2.5 rounded bg-app-accent text-white hover:bg-emerald-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all"
                >
                  <Brain className="w-3.5 h-3.5" /> Practice Mock Interview
                </button>
                <button
                  onClick={() => handleSetTargetRole(selectedRole.title)}
                  className="px-4 py-2.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  Set as Target & Build Roadmap <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
