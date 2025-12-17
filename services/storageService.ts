import { AppMode } from '../types';

const getDraftKey = (mode: AppMode) => `terraforge_draft_${mode}`;

interface DraftData {
  content: string;
  instruction: string;
  timestamp: number;
}

export const saveDraft = (mode: AppMode, content: string, instruction: string) => {
  if (mode === AppMode.HISTORY) return;
  
  const key = getDraftKey(mode);
  const data: DraftData = { 
    content, 
    instruction, 
    timestamp: Date.now() 
  };
  localStorage.setItem(key, JSON.stringify(data));
};

export const getDraft = (mode: AppMode): { content: string; instruction: string } => {
  const key = getDraftKey(mode);
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const data = JSON.parse(item) as DraftData;
      return { 
        content: data.content || '', 
        instruction: data.instruction || '' 
      };
    }
  } catch (e) {
    console.error("Error reading draft", e);
  }
  return { content: '', instruction: '' };
};
