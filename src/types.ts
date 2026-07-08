export interface SkillCategory {
  category: string;
  tags: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface Project {
  num: string;
  name: string;
  description: string;
  stack: string[];
}

export interface Certificate {
  icon: string;
  name: string;
  status: 'In Progress' | 'Completed';
}

export interface ContactItem {
  icon: string;
  label: string;
  value: string;
  href: string;
}

export interface DropdownItem {
  id: string;
  icon: string;
  label: string;
  type: 'link' | 'page';
  value: string;
}
