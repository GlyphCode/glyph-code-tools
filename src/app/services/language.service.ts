import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor() { }
   private static languageMap = new Map<string, ProgrammingLanguage>([
    // 编程语言
    ['.js', 'JavaScript'],
    ['.jsx', 'JavaScript'],
    ['.ts', 'TypeScript'],
    ['.tsx', 'TypeScript'],
    ['.java', 'Java'],
    ['.go', 'Go'],
    ['.py', 'Python'],
    ['.rb', 'Ruby'],
    ['.php', 'PHP'],
    ['.rs', 'Rust'],
    ['.cpp', 'C++'],
    ['.c', 'C++'],
    ['.cs', 'C#'],
    ['.swift', 'Swift'],
    ['.kt', 'Kotlin'],
    ['.dart', 'Dart'],
    
    // 标记语言
    ['.html', 'HTML'],
    ['.htm', 'HTML'],
    ['.xml', 'XML'],
    ['.md', 'Markdown'],
    
    // 样式表
    ['.css', 'CSS'],
    ['.scss', 'CSS'],
    ['.sass', 'CSS'],
    ['.less', 'CSS'],
    
    // 配置文件
    ['.json', 'JSON'],
    ['.yaml', 'YAML'],
    ['.yml', 'YAML'],
    ['.toml', 'YAML'],
    ['.ini', 'YAML'],
    
    // 脚本
    ['.sh', 'Shell'],
    ['.bash', 'Shell'],
    ['.ps1', 'Shell'],
    
    // 数据库
    ['.sql', 'SQL'],
  ]);
  
  // 特殊扩展名处理
  private static specialCases: Record<string, ProgrammingLanguage> = {
    'makefile': 'Shell',
    'dockerfile': 'Shell',
    '.gitignore': 'YAML',
    '.eslintrc': 'JSON',
    '.prettierrc': 'JSON',
  };
  
  static detect(filename: string): ProgrammingLanguage {
    const lowerName = filename.toLowerCase();
    
    // 先检查特殊文件名
    for (const [specialName, language] of Object.entries(this.specialCases)) {
      if (lowerName.includes(specialName)) {
        return language;
      }
    }
    
    // 提取扩展名
    const lastDotIndex = lowerName.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return 'Unknown';
    }
    
    const extension = lowerName.slice(lastDotIndex);
    return this.languageMap.get(extension) || 'Unknown';
  }
  
  // 获取所有支持的语言
  static getSupportedLanguages(): ProgrammingLanguage[] {
    return Array.from(new Set(this.languageMap.values()));
  }

}

type ProgrammingLanguage = 
  | 'JavaScript'
  | 'TypeScript'
  | 'Java'
  | 'Go'
  | 'Python'
  | 'C++'
  | 'C#'
  | 'PHP'
  | 'Ruby'
  | 'Rust'
  | 'CSS'
  | 'HTML'
  | 'JSON'
  | 'YAML'
  | 'XML'
  | 'Markdown'
  | 'Shell'
  | 'SQL'
  | 'Kotlin'
  | 'Swift'
  | 'Dart'
  | 'Unknown';