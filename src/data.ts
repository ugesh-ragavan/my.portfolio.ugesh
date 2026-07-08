import { SkillCategory, Experience, Project, Certificate, ContactItem, DropdownItem } from './types';

export const portfolioData = {
  name: "Ugesh Ragavan",
  eyebrow: "Data Engineer · GenAI Enthusiast · Coimbatore, India",
  role: "Data Engineer & Cloud Architect",
  subRole: "// AZURE · DATABRICKS · PYSPARK · DELTA LAKE",
  aboutText: "3 years building cloud-native data pipelines at Cognizant, migrating legacy ETL to Azure. Passionate about the intersection of data engineering and GenAI — turning raw data into intelligence.",
  taglines: [
    'building pipelines',
    'moving data at scale',
    'crafting delta lakes',
    'orchestrating with ADF',
    'shaping data strategies'
  ],
  stats: [
    { num: "3+", label: "Years Exp" },
    { num: "25+", label: "ETL Migrations" },
    { num: "10+", label: "ADF Pipelines" },
    { num: "9.02", label: "CGPA" }
  ],
  skills: [
    {
      category: "Azure Cloud",
      tags: ["Azure Data Factory", "ADLS Gen2", "Databricks", "Azure SQL", "Jobs/Pipelines"]
    },
    {
      category: "Programming",
      tags: ["Python", "PySpark", "Spark SQL"]
    },
    {
      category: "Big Data",
      tags: ["Apache Spark", "Delta Lake", "Apache Airflow", "Hadoop / CDP"]
    },
    {
      category: "DevOps & BI",
      tags: ["Git", "CI/CD", "Power BI", "JIRA"]
    }
  ] as SkillCategory[],
  experience: [
    {
      role: "Data Engineer — Associate",
      company: "Cognizant Technology Solutions",
      period: "Jul 2022 — Present",
      bullets: [
        "Migrated 10+ Informatica PowerCenter mappings to Azure Databricks using PySpark and Spark SQL — improved pipeline performance and eliminated on-premise infrastructure dependency.",
        "Migrated 25+ SSIS-based ETL workflows to Azure Databricks using PySpark, ADF and ADLS Gen2, enabling cloud-native scalability and automated incremental loads.",
        "Built and maintained ADF pipelines for orchestration, scheduling, and error handling across all migrated workloads.",
        "Developed PySpark transformation jobs on Databricks with Delta Lake storage for structured and semi-structured data at scale.",
        "Modelled bronze / silver / gold data layers in ADLS Gen2; validated schema mappings and business rules for data quality.",
        "Delivered analytics-ready datasets and Power BI reports for data scientists and business analysts."
      ]
    },
    {
      role: "Junior Developer — Intern",
      company: "The Reciprocal Solutions",
      period: "2021 — 2022",
      bullets: [
        "Developed internal web application modules; created wireframes and site maps for a full website revamp."
      ]
    }
  ] as Experience[],
  projects: [
    {
      num: "01",
      name: "ADF + ADLS Gen2 End-to-End Pipeline",
      description: "Designed a complete ingest-transform-serve pipeline: raw data ingested into ADLS Gen2 via ADF, transformed in Azure SQL, and loaded to a reporting layer.",
      stack: ["ADF", "ADLS Gen2", "Azure SQL"]
    },
    {
      num: "02",
      name: "PySpark Transformation Pipeline on Databricks",
      description: "Built a batch pipeline to ingest, clean, and transform large-scale retail sales data on Azure Databricks, persisted in Delta Lake for downstream analytics.",
      stack: ["PySpark", "Databricks", "Delta Lake", "Spark SQL"]
    }
  ] as Project[],
  education: {
    gpa: "9.02",
    degree: "B.E. Computer Science & Engineering",
    institution: "Anna University, Tamil Nadu",
    year: "Graduated 2021"
  },
  certificates: [
    {
      icon: "☁",
      name: "Microsoft Certified: Azure Data Engineer Associate (DP-203)",
      status: "In Progress"
    },
    {
      icon: "⚡",
      name: "Databricks Basics for Data Engineering — Udemy",
      status: "Completed"
    },
    {
      icon: "🐍",
      name: "PySpark Fundamentals — Udemy",
      status: "Completed"
    }
  ] as Certificate[],
  contact: [
    {
      icon: "✉",
      label: "Email",
      value: "ugesh.be@gmail.com",
      href: "mailto:ugesh.be@gmail.com"
    },
    {
      icon: "in",
      label: "LinkedIn",
      value: "linkedin.com/in/ugeshr",
      href: "https://linkedin.com/in/ugeshr"
    },
    {
      icon: "📞",
      label: "Phone",
      value: "+91 9003999302",
      href: "tel:9003999302"
    },
    {
      icon: "📍",
      label: "Location",
      value: "Coimbatore, India",
      href: "#"
    }
  ] as ContactItem[],
  dropdownItems: [
    {
      id: "linkedin",
      icon: "in",
      label: "Ugesh's LinkedIn",
      type: "link",
      value: "https://linkedin.com/in/ugeshr"
    },
    {
      id: "instagram",
      icon: "📷",
      label: "Ugesh's Instagram",
      type: "link",
      value: "https://instagram.com/im.ugesh"
    },
    {
      id: "creative",
      icon: "✦",
      label: "Ugesh as a Creative",
      type: "link",
      value: "https://ugesh-ragavan.github.io/my.portfolio.ugesh/Ugeek/index-Work.html"
    },
    {
      id: "engineer",
      icon: "⚙",
      label: "Ugesh as a Data Engineer",
      type: "page",
      value: "portfolio"
    }
  ] as DropdownItem[]
};
