import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Skill } from '../types.js';
import { getSkillsDir } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

/**
 * Skills loader - loads skills from Markdown files
 */
export class SkillsLoader {
  private skillsDir: string;
  private skills: Map<string, Skill> = new Map();

  constructor(skillsDir?: string) {
    this.skillsDir = skillsDir || getSkillsDir();
    this.loadSkills();
  }

  /**
   * Load all skills from directory
   */
  private loadSkills(): void {
    if (!existsSync(this.skillsDir)) {
      logger.debug({ dir: this.skillsDir }, 'Skills directory does not exist');
      return;
    }

    try {
      const files = readdirSync(this.skillsDir);
      const skillFiles = files.filter((f) => f.endsWith('.md'));

      for (const file of skillFiles) {
        const skillPath = join(this.skillsDir, file);
        const skill = this.loadSkillFile(skillPath);
        if (skill) {
          this.skills.set(skill.name, skill);
        }
      }

      logger.info({ count: this.skills.size }, 'Skills loaded');
    } catch (error) {
      logger.error({ error, dir: this.skillsDir }, 'Failed to load skills');
    }
  }

  /**
   * Load a single skill file
   */
  private loadSkillFile(path: string): Skill | null {
    try {
      const content = readFileSync(path, 'utf-8');

      // Parse markdown: first heading is name, first paragraph is description
      const lines = content.split('\n');
      let name = '';
      let description = '';
      let inDescription = false;

      for (const line of lines) {
        if (line.startsWith('# ')) {
          name = line.substring(2).trim();
          inDescription = true;
        } else if (inDescription && line.trim() && !line.startsWith('#')) {
          description = line.trim();
          break;
        }
      }

      if (!name) {
        // Use filename as fallback
        name = path.split('/').pop()?.replace('.md', '') || 'unknown';
      }

      if (!description) {
        description = 'No description available';
      }

      return {
        name,
        description,
        content,
        path,
      };
    } catch (error) {
      logger.error({ error, path }, 'Failed to load skill file');
      return null;
    }
  }

  /**
   * Get all loaded skills
   */
  getSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get a specific skill by name
   */
  getSkill(name: string): Skill | undefined {
    return this.skills.get(name);
  }

  /**
   * Reload skills from directory
   */
  reload(): void {
    this.skills.clear();
    this.loadSkills();
  }

  /**
   * Get skill count
   */
  getSkillCount(): number {
    return this.skills.size;
  }
}
