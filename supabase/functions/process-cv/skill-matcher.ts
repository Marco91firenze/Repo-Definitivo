export interface SkillVariation {
  canonical: string;
  variations: string[];
  relatedSkills: string[];
}

const skillDatabase: SkillVariation[] = [
  {
    canonical: 'React',
    variations: ['react', 'reactjs', 'react.js', 'react js'],
    relatedSkills: ['JSX', 'Redux', 'React Hooks', 'React Native']
  },
  {
    canonical: 'JavaScript',
    variations: ['javascript', 'js', 'ecmascript', 'es6', 'es2015', 'es2020'],
    relatedSkills: ['TypeScript', 'Node.js', 'npm']
  },
  {
    canonical: 'TypeScript',
    variations: ['typescript', 'ts'],
    relatedSkills: ['JavaScript', 'Type Safety']
  },
  {
    canonical: 'Node.js',
    variations: ['nodejs', 'node', 'node js'],
    relatedSkills: ['Express', 'JavaScript', 'npm']
  },
  {
    canonical: 'Python',
    variations: ['python', 'python3', 'py'],
    relatedSkills: ['Django', 'Flask', 'FastAPI', 'pandas']
  },
  {
    canonical: 'AWS',
    variations: ['aws', 'amazon web services'],
    relatedSkills: ['EC2', 'S3', 'Lambda', 'Cloud Computing']
  },
  {
    canonical: 'Docker',
    variations: ['docker', 'containerization'],
    relatedSkills: ['Kubernetes', 'DevOps', 'Container Orchestration']
  },
  {
    canonical: 'Kubernetes',
    variations: ['kubernetes', 'k8s'],
    relatedSkills: ['Docker', 'Container Orchestration', 'DevOps']
  },
  {
    canonical: 'SQL',
    variations: ['sql', 'structured query language', 'mysql', 'postgresql', 'postgres'],
    relatedSkills: ['Database Design', 'Query Optimization']
  },
  {
    canonical: 'Git',
    variations: ['git', 'version control', 'github', 'gitlab'],
    relatedSkills: ['GitHub', 'GitLab', 'Version Control']
  },
  {
    canonical: 'REST API',
    variations: ['rest', 'restful', 'rest api', 'restful api'],
    relatedSkills: ['API Design', 'HTTP', 'JSON']
  },
  {
    canonical: 'GraphQL',
    variations: ['graphql', 'graph ql'],
    relatedSkills: ['API Design', 'Apollo']
  },
  {
    canonical: 'CI/CD',
    variations: ['ci/cd', 'cicd', 'continuous integration', 'continuous deployment'],
    relatedSkills: ['Jenkins', 'GitHub Actions', 'DevOps']
  },
  {
    canonical: 'Agile',
    variations: ['agile', 'scrum', 'kanban'],
    relatedSkills: ['Project Management', 'Scrum', 'Sprint Planning']
  },
];

export function normalizeSkill(skill: string): string {
  const normalized = skill.toLowerCase().trim();

  for (const entry of skillDatabase) {
    if (entry.variations.includes(normalized)) {
      return entry.canonical;
    }
  }

  return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
}

export function findSkillMatches(cvText: string, requiredSkills: string[]): Map<string, {
  found: boolean;
  variations: string[];
  relatedFound: string[];
  confidence: number;
}> {
  const results = new Map();
  const cvLower = cvText.toLowerCase();

  for (const requiredSkill of requiredSkills) {
    const canonical = normalizeSkill(requiredSkill);
    const entry = skillDatabase.find(e => e.canonical === canonical);

    const foundVariations: string[] = [];
    const relatedFound: string[] = [];

    if (entry) {
      for (const variation of entry.variations) {
        if (cvLower.includes(variation)) {
          foundVariations.push(variation);
        }
      }

      for (const related of entry.relatedSkills) {
        if (cvLower.includes(related.toLowerCase())) {
          relatedFound.push(related);
        }
      }
    } else {
      if (cvLower.includes(requiredSkill.toLowerCase())) {
        foundVariations.push(requiredSkill.toLowerCase());
      }
    }

    const found = foundVariations.length > 0;
    let confidence = 0;

    if (found) {
      confidence = 70;
      const mentionCount = foundVariations.reduce((count, variation) => {
        const regex = new RegExp(variation, 'gi');
        return count + (cvText.match(regex) || []).length;
      }, 0);

      if (mentionCount > 3) confidence = 90;
      else if (mentionCount > 1) confidence = 80;

      if (relatedFound.length > 0) {
        confidence = Math.min(100, confidence + 5);
      }
    } else if (relatedFound.length > 0) {
      confidence = 30;
    }

    results.set(canonical, {
      found,
      variations: foundVariations,
      relatedFound,
      confidence
    });
  }

  return results;
}

export function extractSkillEvidence(cvText: string, skill: string, maxLength: number = 150): string {
  const skillLower = skill.toLowerCase();
  const variations = skillDatabase.find(e => e.canonical === skill)?.variations || [skillLower];

  const sentences = cvText.split(/[.!?]+/);

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase();
    for (const variation of variations) {
      if (sentenceLower.includes(variation)) {
        const trimmed = sentence.trim();
        if (trimmed.length > maxLength) {
          return trimmed.substring(0, maxLength) + '...';
        }
        return trimmed;
      }
    }
  }

  return '';
}
